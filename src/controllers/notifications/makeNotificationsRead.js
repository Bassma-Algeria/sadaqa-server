const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const makeNotificationsRead = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);

  try {
    const query = `
      UPDATE notifications
      SET read = true
      WHERE receiver_id = $1
    `;
    const values = [currentUserId];

    await db.query(query, values);

    return res
      .status(200)
      .json({ success: false, data: "notification make read successfully" });
  } catch (error) {
    handleDbError(error, res);
  }
};

const makeNotificationRead = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const { notificationId } = req.params;

  try {
    const query = `
      UPDATE notifications
      SET read = true
      WHERE receiver_id = $1 AND notification_id = $2
    `;
    const values = [currentUserId, notificationId];

    await db.query(query, values);

    return res
      .status(200)
      .json({ success: false, data: "notification make read successfully" });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { makeNotificationsRead, makeNotificationRead };
