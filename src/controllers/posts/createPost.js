const db = require("../../db/index");
const { addImagePostToDB } = require("../../utils/db/addImageToDB");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");
const {
  uploadImageAndShareIt,
  removeImageFromLocal,
} = require("../../utils/driveAndGmail/driveFunctions");
const { validatePostCreationInputs } = require("../../utils/users/validations");
const { getUserRoleId } = require("../../utils/users/getUserRoleId");
const { POSTS_PICS_FILE_ID } = require("../../utils/driveAndGmail/driveFilesIds");
const { isUserAccountActive } = require("../../utils/users/isUserAccountActive");

const FAMILY_IN_NEED_ID = 3;
const CALL_FOR_HELP_ID = 4;
const ASSOCIATION_ROLE_ID = 2;

const createPost = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const errors = validatePostCreationInputs({
    ...req.body,
    postPhotos: req.files,
  });

  if (Object.keys(errors).length > 0) {
    req.files?.map((image) => removeImageFromLocal(image));
    return res.status(400).json({ success: false, errors });
  }

  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const isAuthorize = await isUserAuhtorizeToPostThisType(
      Number(req.body.typeId),
      currentUserId,
      client,
      res
    );
    if (!isAuthorize) {
      return res.status(501).json({
        success: false,
        message:
          "No authorized ! (you account is not active yet, OR you're a normal user try to post a family_in_need type or a call_for_help type)",
      });
    }

    const postId = await addPostToDbAndReturnHisId({
      userId: currentUserId,
      ...req.body,
      client,
      res,
    });

    await uploadImagesAndSetPostThumbnail(req.files, postId, client, res);

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: { postId },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const isUserAuhtorizeToPostThisType = async (typeId, userId, client, res) => {
  const userRoleId = await getUserRoleId(userId, client, res);
  const isActive = await isUserAccountActive(userId, client, res);
  if (userNotAuthorize(typeId, userRoleId, isActive)) {
    return false;
  }

  return true;
};

const userNotAuthorize = (typeId, roleId, active) => {
  return (
    ((typeId === FAMILY_IN_NEED_ID || typeId === CALL_FOR_HELP_ID) &&
      roleId !== ASSOCIATION_ROLE_ID) ||
    !active
  );
};

const addPostToDbAndReturnHisId = async ({
  userId,
  title,
  description,
  wilaya,
  commun,
  typeId,
  category,
  ccp,
  ccpKey,
  rib,
  client,
  res,
}) => {
  try {
    const query = `
      INSERT INTO posts (
        user_id,
        title,
        title_tokens,
        description,
        description_tokens,
        wilaya,
        commun,
        type_id,
        category,
        ccp,
        ccp_key,
        rib
      )
      VALUES ($1, $2,to_tsvector($2), $3,to_tsvector($3), $4, $5, $6, $7, $8, $9, $10)
      RETURNING post_id
    `;
    const values = [
      userId,
      title,
      description,
      wilaya.replace(/\d|-/g, "").trim(),
      commun.toLowerCase(),
      Number(typeId),
      category,
      ccp,
      ccpKey,
      rib,
    ];

    const {
      rows: [result],
    } = await client.query(query, values);

    return result.post_id;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const uploadImagesAndSetPostThumbnail = async (images, postId, client, res) => {
  for (let i = 0; i < images.length; i++) {
    const imageId = await uploadImageAndShareIt(images[i], POSTS_PICS_FILE_ID);
    await addImagePostToDB(imageId, postId, client, res);

    if (i === 0) {
      const postThumbnailLink = `https://drive.google.com/uc?export=view&id=${imageId}`;

      await client.query(
        `
          UPDATE posts
          SET thumbnail_link = $1
          WHERE post_id = $2
        `,
        [postThumbnailLink, postId]
      );
    }
  }
};
module.exports = { createPost };
