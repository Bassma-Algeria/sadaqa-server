const {
  DISCONNECT,
  SEND_MESSAGE,
  MAKE_MESSAGES_READ,
  IS_TYPING,
  STOP_TYPING,
  DELETE_MESSAGE_NOTIFICATION,
  CREATE_MESSAGE_NOTIFICATION,
  NEW_LIKE,
  NEW_POST,
} = require("../eventsNames");
const { userDisconnect } = require("./usersEventsHandlers");
const {
  sendMessage,
  makeMessagesRead,
  userStartTyping,
  userStopTyping,
} = require("./messagesEventsHandlers");
const {
  removeMessageNotification,
  createMessageNotification,
} = require("../../controllers/notifications/messagesNotifications");
const {
  newLikeNotification,
  newPostNotification,
} = require("./postsEventsHandlers");

const registerSocketEventsListeners = (socket, io) => {
  console.log("socket connected", socket.id, socket.userId);

  socket.on(DISCONNECT, () => userDisconnect(socket, io));

  socket.on(SEND_MESSAGE, (message) => sendMessage(socket, io, message));

  socket.on(MAKE_MESSAGES_READ, (chatParticipantId) =>
    makeMessagesRead(socket, io, chatParticipantId)
  );

  socket.on(IS_TYPING, (targetUsers) =>
    userStartTyping(socket, io, targetUsers)
  );

  socket.on(STOP_TYPING, (targetUsers) =>
    userStopTyping(socket, io, targetUsers)
  );

  socket.on(DELETE_MESSAGE_NOTIFICATION, (messageId) =>
    removeMessageNotification(messageId)
  );

  socket.on(NEW_LIKE, ({ postId, likeId }) =>
    newLikeNotification(socket, io, postId, likeId)
  );

  socket.on(NEW_POST, (postId) => newPostNotification(socket, io, postId));
};

module.exports = { registerSocketEventsListeners };
