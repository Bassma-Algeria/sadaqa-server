const { handleDbError } = require("../db/dbErrorHandler");

async function getUserPreferences(userId, client, res) {
  try {
    const query = `
      SELECT language, display_mode 
      FROM users_preferences
      WHERE user_id = $1
    `;
    const values = [userId];

    const {
      rows: [result],
    } = await client.query(query, values);

    return {
      language: result ? result.language : null,
      displayMode: result ? result.display_mode : null,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
}

module.exports = { getUserPreferences };
