const socketIo = require("socket.io");

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  // Additional socket.io configuration and event handlers can be added here

  return io;
};

module.exports = {
  initSocket,
  getIo: () => io,
};
