const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { deleteImgFromDrive } = require("../../utils/driveAndGmail/driveFunctions");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const deletePost = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const { postId } = req.params;
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const isCurrentUserOwnThisPost = isAuthUserOwnerOfPost(currentUserId, postId, client, res);
    if (!isCurrentUserOwnThisPost) {
      return res.status(401).json({
        success: false,
        data: `action unauthorize !, you're not the owner of the post`,
      });
    }

    await deletePostPicsFromDrive(postId, client, res);
    await deletePostFromDb(postId, currentUserId, client, res);

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: `Post with id ${postId} is deleted successfully`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const isAuthUserOwnerOfPost = async (currentUserId, postId, client, res) => {
  try {
    const query = `
      SELECT FROM posts
      WHERE post_id = $1 AND user_id = $2
    `;
    const values = [postId, currentUserId];

    const { rowCount } = await client.query(query, values);

    if (rowCount === 0) return false;
    else return true;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const deletePostPicsFromDrive = async (postId, client, res) => {
  try {
    const picsDriveIds = await getPicsDriveIds(postId, client, res);

    for (let i = 0; i < picsDriveIds.length; i++) {
      await deleteImgFromDrive(picsDriveIds[i]);
    }
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getPicsDriveIds = async (postId, client, res) => {
  try {
    const query = `
      SELECT g_drive_photo_id
      FROM post_photos

      WHERE post_id = $1
    `;
    const values = [postId];

    const { rows } = await client.query(query, values);

    const driveIds = rows.length > 0 ? rows.map((row) => row.g_drive_photo_id) : rows;

    return driveIds;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const deletePostFromDb = async (postId, currentUserId, client, res) => {
  try {
    const query = `
      DELETE FROM posts
      WHERE post_id = $1 AND user_id = $2
    `;
    const values = [postId, currentUserId];

    await client.query(query, values);
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { deletePost };
