const { handleDbError } = require("../db/dbErrorHandler");

// check if the user given already had an profile image or not and return his id if exist
const isUserHasProfileImg = async (userId, client, res) => {
  try {
    const query = `
      SELECT g_drive_photo_id, link 
      FROM user_photos
      WHERE user_id = $1 
    `;

    const values = [userId];

    const {
      rows: [profilePic],
    } = await client.query(query, values);

    if (profilePic.link !== null) {
      return { isExist: true, imageId: profilePic.g_drive_photo_id };
    }

    return { isExist: false };
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = {
  isUserHasProfileImg,
};
