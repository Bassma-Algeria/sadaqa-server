const { handleDbError } = require("../db/dbErrorHandler");

const getProfilePic = async (userId, client, res) => {
  try {
    const query = `
      SELECT link 
      FROM user_photos
      WHERE user_id = $1
    `;
    const values = [userId];

    const {
      rows: [profilePic],
    } = await client.query(query, values);

    return profilePic;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { getProfilePic };
