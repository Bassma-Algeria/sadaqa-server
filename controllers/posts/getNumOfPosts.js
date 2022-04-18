const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getFilterAdsDBCondition } = require("../../utils/posts/getFilterCondition");

const getNumOfPosts = async (req, res) => {
  const filters = req.query;

  const queryCondition = getFilterAdsDBCondition(filters);

  try {
    const query = `
      SELECT post_id
      FROM posts

      INNER JOIN post_types
      ON post_types.type_id = posts.type_id

      ${queryCondition}
    `;
    const values = [];

    const { rowCount: totalNumOfPosts } = await db.query(query, values);

    return res.status(200).json({ success: true, data: { totalNumOfPosts } });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { getNumOfPosts };
