const { registerSocketEventsListeners } = require("./eventsListeners");
const { initialEventsEmitters } = require("./eventsEmitters");
const { CONNECTION } = require("./eventsNames");

const socketHandler = (io) => {
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("invalid user_id"));
    }

    socket.userId = userId;
    next();
  });

  io.on(CONNECTION, (socket) => {
    registerSocketEventsListeners(socket, io);
    initialEventsEmitters(socket, io);
  });
};

module.exports = socketHandler;
