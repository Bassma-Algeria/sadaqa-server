const db = require("../../db");

const createMessageNotification = async (receiverId, messageId) => {
  try {
    const query = `
      WITH insert_into_notifications AS (
        INSERT INTO notifications (notification_type, receiver_id)
        VALUES ($1, $2)
        RETURNING notification_id
      )
      INSERT INTO messages_notifications (notification_id, message_id)
      select notification_id, $3 from insert_into_notifications

      RETURNING messages_notifications.notification_id
    `;

    const values = ["message", receiverId, messageId];

    const {
      rows: [result],
    } = await db.query(query, values);

    return result.notification_id;
  } catch (error) {
    console.log(error);
  }
};

const removeMessageNotification = async (messageId) => {
  try {
    const query = `
      DELETE FROM messages_notifications
      WHERE message_id = $1
    `;
    const values = [messageId];

    await db.query(query, values);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createMessageNotification, removeMessageNotification };
