const { handleDbError } = require("../db/dbErrorHandler");

const isUserAccountActive = async (userId, client, res) => {
  try {
    const query = `
      SELECT active 
      FROM users
      WHERE user_id = $1
    `;
    const values = [userId];

    const {
      rows: [result],
    } = await client.query(query, values);

    return result.active;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { isUserAccountActive };
