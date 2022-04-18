const db = require("../../db/index");
const bcrypt = require("bcrypt");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");
const {
  validateGeneralEditedInfo,
  validateEditedCredentials,
} = require("../../utils/users/validations");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const {
  uploadImageAndShareIt,
  deleteImgFromDrive,
} = require("../../utils/driveAndGmail/driveFunctions");
const { isUserHasProfileImg } = require("../../utils/users/isUserHas");
const {
  encriptPasswordAndReturnTheHash,
} = require("../../utils/users/encriptPassword");
const {
  USERS_PICS_FILE_ID,
} = require("../../utils/driveAndGmail/driveFilesIds");

const editGeneralInfo = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const socialAccounts = JSON.parse(req.body.socialAccounts);
  const client = await db.getClient();
  const errors = await validateGeneralEditedInfo({
    ...req.body,
    socialAccounts,
    profilePic: req.file,
    userId: currentUserId,
    client,
    res,
  });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const profilePic = req.file;
  let newProfilePicLink = null;

  try {
    await client.query("BEGIN");

    await editProfileInfo(currentUserId, req, client, res);
    await editSocialAccounts(currentUserId, socialAccounts, client, res);
    if (profilePic) {
      newProfilePicLink = await editProfileImage(
        currentUserId,
        profilePic,
        client,
        res
      );
    } else {
      await deleteProfilePicIfExist(currentUserId, client, res);
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: { link: newProfilePicLink },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const editProfileInfo = async (userId, req, client, res) => {
  let {
    associationName,
    firstName,
    lastName,
    username,
    birthday,
    gender,
    wilaya,
    commun,
    phoneNum,
  } = req.body;

  wilaya = wilaya.replace(/\d|-/g, "").trim();
  commun = commun.toLowerCase();
  gender = gender.toLowerCase();
  birthday = !associationName ? birthday : null;

  try {
    const query = `
      UPDATE users
      SET association_name = $1, first_name = $2, last_name=$3, username=TRIM($4), birthday=$5, gender=$6, wilaya=$7, commun=$8,  phone_num=$9
      
      WHERE user_id = $10
    `;
    const values = [
      associationName,
      firstName,
      lastName,
      username,
      birthday,
      gender,
      wilaya,
      commun,
      phoneNum,
      userId,
    ];

    await client.query(query, values);
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const editSocialAccounts = async (userId, socialAccounts, client, res) => {
  if (socialAccounts.length > 0) {
    socialAccounts.map(async (socialAccount) => {
      try {
        const { platform, link } = socialAccount;

        const query = `
            UPDATE social_links 
            SET link = $1
            WHERE user_id = $2 AND platform = $3
          `;
        const values = [link, userId, platform];

        await client.query(query, values);
      } catch (error) {
        await client.query("ROLLBACK");
        handleDbError(error, res);
      }
    });
  }
};

const editProfileImage = async (userId, profilePic, client, res) => {
  const imageId = await uploadImageAndShareIt(profilePic, USERS_PICS_FILE_ID);
  const newProfilePicLink = await deleteOldImageFromDriveAndUpdateProfilePic(
    userId,
    imageId,
    client,
    res
  );

  return newProfilePicLink;
};

const deleteOldImageFromDriveAndUpdateProfilePic = async (
  userId,
  newImageId,
  client,
  res
) => {
  const imageLink = `https://drive.google.com/uc?export=view&id=${newImageId}`;

  try {
    const { isExist, imageId: oldImgId } = await isUserHasProfileImg(
      userId,
      client,
      res
    );

    if (isExist) {
      // remove the old image from google drive
      await deleteImgFromDrive(oldImgId);
    }

    const query = `
      UPDATE user_photos
      SET g_drive_photo_id = $1, link = $2
      WHERE user_id = $3
    `;
    const values = [newImageId, imageLink, userId];

    await client.query(query, values);

    return imageLink;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const deleteProfilePicIfExist = async (userId, client, res) => {
  const { isExist, imageId: drivePicId } = await isUserHasProfileImg(
    userId,
    client,
    res
  );

  if (isExist) {
    await deleteProfilePicFromDb(userId, client, res);
    await deleteImgFromDrive(drivePicId);
  }
};

const deleteProfilePicFromDb = async (userId, client, res) => {
  try {
    const query = `
      UPDATE user_photos
      SET link = null
      WHERE user_id = $1
    `;
    const values = [userId];

    await client.query(query, values);
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

// change the credentials of the user (email & password)
const editCredentials = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const errors = await validateEditedCredentials({
    ...req.body,
    userId: currentUserId,
    res,
  });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  let { email, newPassword } = req.body;
  try {
    newPassword = await encriptPasswordAndReturnTheHash(newPassword, res);
    await updateCredentials(email, newPassword, currentUserId, res);

    return res.status(200).json({
      success: true,
      data: `update credentials of user ${currentUserId} completed successfully`,
    });
  } catch (error) {
    handleDbError(error, res);
  }
};

const updateCredentials = async (email, password, userId, res) => {
  try {
    const query = `
        UPDATE users
        SET email = $1, password = $2
        WHERE user_id = $3
      `;
    const values = [email, password, userId];

    await db.query(query, values);
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { editGeneralInfo, editCredentials };
