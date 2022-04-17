const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const makePostInactive = async (req, res) => {
  const userId = getAuthUserId(req.headers);
  const { postId } = req.params;

  try {
    const query = `
      UPDATE posts
      SET active = $1
      WHERE post_id = $2 AND user_id = $3
      RETURNING user_id
    `;
    const values = [false, postId, userId];

    const { rowCount } = await db.query(query, values);

    if (rowCount === 0) {
      return res.status(401).json({
        success: false,
        data: `action unauthorize !, you're not the owner of the post`,
      });
    }
    return res
      .status(200)
      .json({ success: true, data: `Post with id ${postId} is inative` });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { makePostInactive };
