const db = require("../../db/index");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getProfilePic } = require("../../utils/users/getUserProfilePic");
const {
  getSocialAccounts,
} = require("../../utils/users/getUserSocialAccounts");

const getUser = async (req, res) => {
  const { userId } = req.params;

  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const userInfo = await getUserInfo(userId, client, res);
    if (Object.keys(userInfo).length === 0) {
      return res.status(404).json({ success: false, error: "user not found" });
    }

    const profilePic = await getProfilePic(userId, client, res);
    const socialLinks = await getSocialAccounts(userId, client, res);
    const posts = await getUserPosts(userId, client, res);

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: { userInfo, profilePic, socialLinks, posts },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const getUserInfo = async (userId, client, res) => {
  try {
    const query = `
      SELECT user_id, username, association_name, first_name, last_name, role, wilaya, commun, phone_num, gender
      FROM users 
 
      INNER JOIN user_roles 
      ON users.role_id = user_roles.role_id 

      WHERE user_id = $1
    `;
    const values = [userId];

    const { rows } = await client.query(query, values);

    return rows[0];
  } catch (error) {
    handleDbError(error, res);
  }
};

const getUserPosts = async (userId, client, res) => {
  try {
    const query = `
      SELECT post_id, title, description, wilaya, active, likes_count, created_at, type, user_id, thumbnail_link
      FROM posts 

      INNER JOIN post_types 
      ON posts.type_id = post_types.type_id 

      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const values = [userId];

    const { rows } = await client.query(query, values);

    return rows;
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { getUser };
