const db = require("../../db/index");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { isPostExist } = require("../../utils/posts/isPostExist");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const likeUnlikePost = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const { postId } = req.params;
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    await isPostExist(postId, client, res);

    const postLiked = await isPostLiked(currentUserId, postId, client, res);

    let likeId;
    if (postLiked) {
      await unlikePost(currentUserId, postId, client, res);
    } else {
      likeId = await likePost(currentUserId, postId, client, res);
    }
    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: { likeId: likeId || null },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const isPostLiked = async (userId, postId, client, res) => {
  try {
    const query = `
      SELECT like_id
      FROM likes
      WHERE user_id = $1 AND post_id = $2
    `;
    const values = [userId, postId];

    const { rowCount } = await client.query(query, values);

    if (rowCount === 0) return false;
    else return true;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const likePost = async (userId, postId, client, res) => {
  try {
    const newLikeId = await addLikeToLikesTableAndReturnLikeId(
      userId,
      postId,
      client,
      res
    );
    await increaseDecreaseLikesCount("increase", postId, client, res);

    return newLikeId;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const addLikeToLikesTableAndReturnLikeId = async (
  userId,
  postId,
  client,
  res
) => {
  try {
    const query = `
      INSERT INTO likes (user_id, post_id)
      VALUES ($1, $2)
      RETURNING like_id
    `;
    const values = [userId, postId];

    const {
      rows: [result],
    } = await client.query(query, values);

    return result.like_id;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const unlikePost = async (userId, postId, client, res) => {
  try {
    await removeLikeFromLikesTableAndReturnLikeId(userId, postId, client, res);
    await increaseDecreaseLikesCount("decrease", postId, client, res);
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const removeLikeFromLikesTableAndReturnLikeId = async (
  userId,
  postId,
  client,
  res
) => {
  try {
    const query = `
      DELETE FROM likes 
      WHERE user_id = $1 AND post_id = $2

    `;
    const values = [userId, postId];

    await client.query(query, values);
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const increaseDecreaseLikesCount = async (action, postId, client, res) => {
  try {
    const operator = action === "increase" ? "+" : "-";

    const query = getIncreaseDecreaseLikesCountQuery(operator);
    const values = [postId];

    await client.query(query, values);
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getIncreaseDecreaseLikesCountQuery = (operator) => {
  return `
    WITH 
      get_post_likes_count AS (
        SELECT likes_count 
        FROM posts
        WHERE post_id = $1
      )
      UPDATE posts
      SET likes_count = (
        SELECT likes_count ${operator} 1
        FROM get_post_likes_count
      )  
      WHERE post_id = $1
  `;
};

module.exports = { likeUnlikePost };
