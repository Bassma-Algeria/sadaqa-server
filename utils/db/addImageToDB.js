const { handleDbError } = require("./dbErrorHandler");

// store the image given in the post_photos table
const addImagePostToDB = async (imageId, postId, client, res) => {
  const imageLink = `https://drive.google.com/uc?export=view&id=${imageId}`;

  try {
    const query = `
      INSERT INTO post_photos (g_drive_photo_id, post_id, link)
      VALUES ($1, $2, $3)
    `;
    const values = [imageId, postId, imageLink];

    await client.query(query, values);
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = {
  addImagePostToDB,
};
