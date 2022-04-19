const { getAllConnectedSockets } = require("../../utils/socket/usersHelpers");
const { USER_DECONNECT } = require("../eventsNames");

const userDisconnect = (deconnectedSocket, io) => {
  const connectedSockets = getAllConnectedSockets(io);

  if (
    userStillConnectedWithAnotherDevice(deconnectedSocket, connectedSockets)
  ) {
    return;
  }

  io.emit(USER_DECONNECT, deconnectedSocket.userId);
};

const userStillConnectedWithAnotherDevice = (
  deconnectedSocket,
  connectedSockets
) => {
  for (const [id, socket] of connectedSockets) {
    if (socket.userId === deconnectedSocket.userId) {
      return true;
    }
  }

  return false;
};

module.exports = { userDisconnect };
