const { handleDbError } = require("../db/dbErrorHandler");

const getUserRoleId = async (userId, client, res) => {
  try {
    const query = `
      SELECT role_id 
      FROM users
      WHERE user_id = $1
    `;
    const values = [userId];

    const {
      rows: [result],
    } = await client.query(query, values);

    return result.role_id;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { getUserRoleId };
