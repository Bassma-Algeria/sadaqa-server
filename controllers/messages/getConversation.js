const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");
const { getProfilePic } = require("../../utils/users/getUserProfilePic");

const getConversation = async (req, res) => {
  const { chatParticipantId } = req.params;

  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    const chatParticiantInfo = await getChatParticiantInfo(
      chatParticipantId,
      client,
      res
    );
    chatParticiantInfo.chatParticipantProfilePic = await getProfilePic(
      chatParticipantId,
      client,
      res
    );

    const messages = await getMessages(client, req, res);

    await client.query("COMMIT");
    return res.status(200).json({
      success: true,
      data: {
        chatParticiantInfo,
        messages,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const getChatParticiantInfo = async (chatParticipantId, client, res) => {
  try {
    const query = `
      SELECT user_id, first_name, last_name, association_name, gender
      FROM users
      WHERE user_id = $1
    `;
    const values = [chatParticipantId];

    const {
      rows: [chatParticiantInfo],
      rowCount,
    } = await client.query(query, values);
    if (rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "chat participant not found" });
    }

    return chatParticiantInfo;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getOldMessages = async (req, res) => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const messages = await getMessages(client, req, res);

    await client.query("COMMIT");
    return res.status(200).json({
      success: true,
      data: {
        messages,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const getMessages = async (client, req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const { chatParticipantId } = req.params;
  const { numOfChunk, numOfMessagesPerChunk } = req.query;
  const offset = numOfMessagesPerChunk * (numOfChunk - 1);

  try {
    const query = `
      SELECT content, sender_id, receiver_id, read, created_at
      FROM messages

      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)

      ORDER BY created_at DESC
      LIMIT ${numOfMessagesPerChunk} OFFSET ${offset}
    `;
    const values = [currentUserId, chatParticipantId];

    const { rows: messages } = await client.query(query, values);

    return messages;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { getConversation, getOldMessages };
