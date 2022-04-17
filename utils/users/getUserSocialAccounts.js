const { handleDbError } = require("../db/dbErrorHandler");

const getSocialAccounts = async (userId, client, res) => {
  try {
    const query = `
      SELECT link, platform
      FROM social_links
      WHERE user_id = $1
    `;
    const values = [userId];

    const { rows } = await client.query(query, values);
    return rows;
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { getSocialAccounts };
