const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");
const {
  removeMessageNotification,
} = require("../notifications/messagesNotifications");

const makeMessagesRead = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const { chatParticipantId } = req.params;
  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    const targetMessagesIds = await makeMessagesReadAndReturnTheirIds(
      chatParticipantId,
      currentUserId,
      client,
      res
    );
    for (const { message_id } of targetMessagesIds) {
      await removeMessageNotification(message_id);
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: `messages with user ${chatParticipantId} make read successfully`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError;
  } finally {
    client.release();
  }
};

const makeMessagesReadAndReturnTheirIds = async (
  senderId,
  receiverId,
  client,
  res
) => {
  try {
    const query = `
      UPDATE messages
      SET read = true
      WHERE sender_id = $1 AND receiver_id = $2
      RETURNING message_id
    `;
    const values = [senderId, receiverId];

    const { rows } = await client.query(query, values);

    return rows;
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { makeMessagesRead };
