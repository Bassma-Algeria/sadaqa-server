const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getProfilePic } = require("../../utils/users/getUserProfilePic");
const {
  getSocialAccounts,
} = require("../../utils/users/getUserSocialAccounts");

// return all the post related data for the single post page
const getPost = async (req, res) => {
  const { postId } = req.params;

  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const postInfo = await getPostInfo(postId, client, res);
    const postPhotos = await getPostPhotos(postId, client, res);
    const publisher = await getPublisher(postInfo.user_id, client, res);

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: {
        postInfo,
        postPhotos,
        publisher,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const getPostInfo = async (postId, client, res) => {
  try {
    const query = `
        SELECT post_id, title, description, active, wilaya, commun, likes_count, created_at, type, category, ccp, ccp_key, rib, user_id, thumbnail_link
        FROM posts
        INNER JOIN post_types 
        ON posts.type_id = post_types.type_id
        WHERE post_id = $1
        `;
    const values = [postId];

    const {
      rows: [postInfo],
      rowCount,
    } = await client.query(query, values);

    if (rowCount === 0) {
      return res.status(404).json({ success: false, error: "post not found" });
    }

    return postInfo;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getPostPhotos = async (postId, client, res) => {
  try {
    const query = `
      SELECT link 
      FROM post_photos 
      WHERE post_id = $1
    `;
    const values = [postId];

    const { rows: postPhotos } = await client.query(query, values);

    return postPhotos;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getPublisher = async (userId, client, res) => {
  const userInfo = await getPublisherInfo(userId, client, res);
  const userProfilePic = await getProfilePic(userId, client, res);
  const userSocialLinks = await getSocialAccounts(userId, client, res);

  return { userInfo, userProfilePic, userSocialLinks };
};

const getPublisherInfo = async (userId, client, res) => {
  try {
    const query = `
      SELECT user_id, first_name, last_name, gender, association_name, phone_num, wilaya, commun
      FROM users
      WHERE user_id = $1
    `;
    const values = [userId];

    const {
      rows: [publisherInfo],
    } = await client.query(query, values);

    return publisherInfo;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { getPost };
