const db = require("../../db/index");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

// this function add the share to shares table and increase shares count in the target post
const sharePost = async (req, res) => {
  const { postId } = req.params;
  const userId = getAuthUserId(req.headers);

  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    await addShareToSharesTable(userId, postId, client, res);
    await increasePostSharesCount(postId, client, res);

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: `successful share action on post ${postId}`,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const addShareToSharesTable = async (userId, postId, client, res) => {
  try {
    const query = `
      INSERT INTO shares (user_id, post_id)
      VALUES ($1, $2)
    `;
    const values = [userId, postId];

    await client.query(query, values);
  } catch (error) {
    handleDbError(error, res);
  }
};

const increasePostSharesCount = async (postId, client, res) => {
  try {
    const query = `
      WITH 
        get_post_shares_count AS (
          SELECT shares_count 
          FROM posts
          WHERE post_id = $1
        )
        UPDATE posts
        SET shares_count = (
          SELECT shares_count + 1
          FROM get_post_shares_count
        )  
        WHERE post_id = $1
    `;
    const values = [postId];

    await client.query(query, values);
  } catch (error) {
    handleDbError(error, res);
  }
};
module.exports = { sharePost };
