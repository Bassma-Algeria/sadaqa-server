const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");

const getUsersIds = async (req, res) => {
  try {
    const query = `
      SELECT user_id 
      FROM users
    `;
    const values = [];

    const { rows } = await db.query(query, values);

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { getUsersIds };
