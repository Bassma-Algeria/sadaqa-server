const getAllConnectedSockets = (io) => io.of("/").sockets;

const getConnectedSocketsIdsOfTargetUser = (io, userId) => {
  const socketsConnected = getAllConnectedSockets(io);

  const targetSocketsIds = [];

  for (const [id, socket] of socketsConnected) {
    if (socket.userId === userId) {
      targetSocketsIds.push(id);
    }
  }

  return targetSocketsIds;
};

const emitSocketEventToTargetUser = (io, socket, userId, event, dataToSend) => {
  const targetSocketsIds = getConnectedSocketsIdsOfTargetUser(io, userId);

  for (const socketId of targetSocketsIds) {
    socket.to(socketId).emit(event, dataToSend);
  }
};

module.exports = {
  getAllConnectedSockets,
  getConnectedSocketsIdsOfTargetUser,
  emitSocketEventToTargetUser,
};
