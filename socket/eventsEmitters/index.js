const { SET_ONLINE_USERS, NEW_CONNECTION } = require("../eventsNames");
const { getAllConnectedSockets } = require("../../utils/socket/usersHelpers");

const initialEventsEmitters = (socket, io) => {
  socket.emit(SET_ONLINE_USERS, getOnlineUsersEmitterHandler(io));

  socket.broadcast.emit(NEW_CONNECTION, socket.userId);
};

const getOnlineUsersEmitterHandler = (io) => {
  let onlineUsers = [];

  for (let [id, socket] of getAllConnectedSockets(io)) {
    onlineUsers.push(socket.userId);
  }

  onlineUsers = removeDuplicatesFromArray(onlineUsers);

  return onlineUsers;
};

const removeDuplicatesFromArray = (array) => {
  return array.filter((element, index) => array.indexOf(element) === index);
};

module.exports = { initialEventsEmitters };
