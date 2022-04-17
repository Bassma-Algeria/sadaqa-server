const { getProfilePic } = require("../users/getUserProfilePic");

const getContact = async (contactId, currentUserId, client, res) => {
  try {
    const contactInfo = await getContactInfo(contactId, client, res);
    const contactProfilePic = await getProfilePic(contactId, client, res);
    const latestMessage = await getLatestMessage(
      contactId,
      currentUserId,
      client,
      res
    );

    return {
      ...contactInfo,
      contactProfilePic,
      latestMessage,
    };
  } catch (error) {
    handleDbError(error, res);
  }
};

const getContactInfo = async (contactId, client, res) => {
  try {
    const query = `
      SELECT user_id, first_name, last_name, association_name, gender
      FROM users
      WHERE user_id = $1
    `;
    const values = [contactId];

    const {
      rows: [contactInfo],
    } = await client.query(query, values);

    return contactInfo;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getLatestMessage = async (contactId, currentUserId, client, res) => {
  try {
    const query = `
      SELECT content, read, created_at, sender_id
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at DESC
      LIMIT 1 
    `;
    const values = [currentUserId, contactId];

    const {
      rows: [latestMessage],
    } = await client.query(query, values);

    return latestMessage;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { getContact };
