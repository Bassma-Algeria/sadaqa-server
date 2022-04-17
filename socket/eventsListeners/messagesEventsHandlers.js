const {
  createMessageNotification,
} = require("../../controllers/notifications/messagesNotifications");
const db = require("../../db");
const {
  getConnectedSocketsIdsOfTargetUser,
  emitSocketEventToTargetUser,
} = require("../../utils/socket/usersHelpers");
const {
  NEW_MESSAGE,
  MAKE_MESSAGES_READ,
  IS_TYPING,
  STOP_TYPING,
} = require("../eventsNames");

const sendMessage = async (socket, io, message) => {
  const notificationId = await createMessageNotification(
    message.receiver_id,
    message.message_id
  );
  const newMessageNotification = await getMessageNotification(notificationId);

  emitSocketEventToTargetUser(io, socket, message.receiver_id, NEW_MESSAGE, {
    message,
    newMessageNotification,
  });
};

const getMessageNotification = async (notificationId) => {
  try {
    const query = `
      SELECT n.notification_id, m.sender_id, sender.first_name, sender.gender, sender.association_name, link AS notification_pic, m.content AS message_content, n.notification_type, n.read, n.created_at
      FROM notifications AS n

      INNER JOIN messages_notifications AS m_n
      ON m_n.notification_id = n.notification_id

      INNER JOIN messages AS m
      ON m.message_id = m_n.message_id

      INNER JOIN users AS sender
      ON sender.user_id = m.sender_id

      INNER JOIN user_photos AS u_p
      ON sender.user_id = u_p.user_id

      WHERE n.notification_id = $1
    `;
    const values = [notificationId];

    const {
      rows: [messagesNotifications],
    } = await db.query(query, values);

    return messagesNotifications;
  } catch (error) {
    await client.query("ROLLBACK");

    handleDbError(error, res);
  }
};

const makeMessagesRead = (socket, io, chatParticipantId) => {
  const targetSocketsIds = getConnectedSocketsIdsOfTargetUser(
    io,
    chatParticipantId
  );

  for (const socketId of targetSocketsIds) {
    socket.to(socketId).emit(MAKE_MESSAGES_READ, chatParticipantId);
  }
};

const userStartTyping = (socket, io, { senderId, receiverId }) => {
  const targetSocketsIds = getConnectedSocketsIdsOfTargetUser(io, receiverId);

  for (const socketId of targetSocketsIds) {
    socket.to(socketId).emit(IS_TYPING, senderId);
  }
};

const userStopTyping = (socket, io, { senderId, receiverId }) => {
  const targetSocketsIds = getConnectedSocketsIdsOfTargetUser(io, receiverId);

  for (const socketId of targetSocketsIds) {
    socket.to(socketId).emit(STOP_TYPING, senderId);
  }
};

module.exports = {
  sendMessage,
  makeMessagesRead,
  userStartTyping,
  userStopTyping,
};
