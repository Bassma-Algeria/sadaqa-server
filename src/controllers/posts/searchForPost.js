const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");

/**
 * find and return all the active posts that has a title or description match the search phrase
 * using the text search query
 */
const searchForPosts = async (req, res) => {
  let { searchPhrase } = req.params;

  // to make the seach phrase accesptable to tsquery of postgres
  searchPhrase = searchPhrase.trim().replace(/  | /g, " <-> ");

  const tsquery = `to_tsquery('${searchPhrase}')`;

  try {
    const query = `
      SELECT post_id, title, description, wilaya, commun, likes_count, created_at, type, category, user_id, thumbnail_link
      FROM posts 
      INNER JOIN post_types 
      ON posts.type_id = post_types.type_id
      WHERE active = $1 
        AND (title_tokens @@ ${tsquery} OR description_tokens @@ ${tsquery})
      ORDER BY created_at DESC
    `;

    const values = [true];

    const { rows, rowCount } = await db.query(query, values);

    if (rowCount === 0) {
      return res.status(404).json({ success: true, data: "No post found" });
    }

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { searchForPosts };
