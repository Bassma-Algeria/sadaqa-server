const db = require("../../db");
const { handleDbError } = require("../db/dbErrorHandler");

const getUserPasswordHash = async (userId, res) => {
  try {
    const query = `
      SELECT password
      FROM users
      WHERE user_id = $1
    `;
    const values = [userId];

    const {
      rows: [result],
    } = await db.query(query, values);

    return result.password;
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { getUserPasswordHash };
