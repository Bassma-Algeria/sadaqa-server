const db = require("../../db/index");
const {
  getFilterAdsDBCondition,
} = require("../../utils/posts/getFilterCondition");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const getPostsIds = async (req, res) => {
  try {
    const query = `
      SELECT post_id 
      FROM posts
    `;
    const values = [];

    const { rows } = await db.query(query, values);

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    handleDbError(error, res);
  }
};

const getPosts = async (req, res) => {
  // filters = { adType, category, userId, wilaya, numOfPage, numOfAdsPerPage }
  const filters = req.query;
  const offset = filters.numOfAdsPerPage * (filters.numOfPage - 1); // ads to skip

  if (offset !== 0 && !offset) {
    return res.status(400).json({
      success: false,
      error: "should provide numOfPage and numOfAdsPerPage in the query",
    });
  }

  const queryCondition = getFilterAdsDBCondition(filters);

  try {
    const query = `
      SELECT post_id, title, type, description, active, thumbnail_link, wilaya, likes_count, shares_count, created_at
      FROM posts

      INNER JOIN post_types
      ON post_types.type_id = posts.type_id

      ${queryCondition}

      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const values = [filters.numOfAdsPerPage, offset];

    const { rows } = await db.query(query, values);

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = {
  getPostsIds,
  getPosts,
};
