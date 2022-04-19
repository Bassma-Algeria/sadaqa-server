const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");
const { getProfilePic } = require("../../utils/users/getUserProfilePic");
const {
  getSocialAccounts,
} = require("../../utils/users/getUserSocialAccounts");

const getAuthUser = async (req, res) => {
  const authUserId = getAuthUserId(req.headers);

  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const userInfo = await getUserInfo(authUserId, client, res);
    const profilePic = await getProfilePic(authUserId, client, res);
    const socialAccounts = await getSocialAccounts(authUserId, client, res);
    const numOfUnreadNotifications = await getNumOfUnreadNotifications(
      authUserId,
      client,
      res
    );
    const likes = await getLikes(authUserId, client, res);
    const numOfUnreadMessages = await getNumOfUnreadMessages(
      authUserId,
      client,
      res
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: {
        userInfo,
        profilePic,
        socialAccounts,
        numOfUnreadNotifications,
        likes,
        numOfUnreadMessages,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    return handleDbError(error, res);
  } finally {
    client.release();
  }
};

async function getUserInfo(userId, client, res) {
  try {
    const query = `
      SELECT user_id, username, association_name, first_name, last_name, birthday, role, wilaya, commun, phone_num, email, gender, active
      FROM users 

      INNER JOIN user_roles 
      ON users.role_id = user_roles.role_id
      
      WHERE user_id = $1
    `;
    const values = [userId];

    const {
      rows: [userInfo],
    } = await client.query(query, values);

    return userInfo;
  } catch (error) {
    await client.query("ROLLBACK");

    return handleDbError(error, res);
  }
}

async function getNumOfUnreadNotifications(userId, client, res) {
  try {
    const query = `
      SELECT notification_id
      FROM notifications

      WHERE receiver_id = $1 AND read = false
    `;
    const values = [userId];
    const { rowCount: numOfUnreadNotifications } = await client.query(
      query,
      values
    );

    return numOfUnreadNotifications;
  } catch (error) {
    return handleDbError(error, res);
  }
}

async function getLikes(userId, client, res) {
  try {
    const query = `
      SELECT post_id
      FROM likes 
      WHERE user_id = $1
    `;
    const values = [userId];
    const { rows: likes } = await client.query(query, values);

    return likes;
  } catch (error) {
    await client.query("ROLLBACK");

    return handleDbError(error, res);
  }
}

async function getNumOfUnreadMessages(userId, client, res) {
  try {
    const query = `
      SELECT message_id
      FROM messages
      WHERE receiver_id = $1  AND read = false
    `;
    const values = [userId];

    const { rowCount } = await client.query(query, values);

    return rowCount;
  } catch (error) {
    handleDbError(error, res);
  }
}

const getNewNumOfUnreadMessages = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    const numOfUnreadMessages = await getNumOfUnreadMessages(
      currentUserId,
      client,
      res
    );

    await client.query("COMMIT");

    return res.status(200).json({ success: true, data: numOfUnreadMessages });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

module.exports = { getAuthUser, getNewNumOfUnreadMessages };
