const db = require("../../db");

const createLikeNotification = async (currentUserId, receiverId, likeId) => {
  try {
    if (receiverId === currentUserId) {
      return;
    }

    const query = `
      WITH insert_into_notifications AS (
        INSERT INTO notifications (notification_type, receiver_id)
        VALUES ($1, $2)
        RETURNING notification_id
      )
      INSERT INTO likes_notifications (notification_id, like_id)
      select notification_id, $3 from insert_into_notifications

      RETURNING notification_id
    `;
    const values = ["like", receiverId, likeId];

    const {
      rows: [restult],
    } = await db.query(query, values);

    return restult.notification_id;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createLikeNotification };
