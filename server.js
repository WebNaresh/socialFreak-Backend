const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const {
  AddUser,
  getPosts,
  RemoveUser,
  sendMessage,
  AddPeerToUser,
  callUser,
  callAccept,
  endCall,
  setCallerId,
} = require("./socketController/postSocket");
// Handling Uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting down the server due to Uncaught Exception`);
//   process.exit(1);
// });
// Config
dotenv.config();
// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

const users = [{}];
// socket io connection
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connect", (socket) => {
  socket.emit("me", socket.id);
  socket.on("add-user", (userId) => {
    AddUser(socket, userId, io).then((map) => {
      io.emit("users", JSON.stringify(Array.from(map)));
    });
  });
  socket.on("disconnect", function () {
    RemoveUser(socket.id).then((map) => {
      io.emit("users", JSON.stringify(Array.from(map)));
    });
  });
  socket.on("get-post", (skip, userId) => {
    getPosts(skip, userId, socket, io);
  });
  socket.on("peer", (peerId, userId) => {
    console.log(`🚀 ~ peerId, userId:`, peerId, userId);
    AddPeerToUser(peerId, userId).then((map) => {
      io.emit("users", JSON.stringify(Array.from(map)));
    });
  });
  socket.on("send-Message", (data) => {
    sendMessage(data, io);
  });
  socket.on("callUser", (data) => {
    console.log(data);
    callUser(io, data);
  });
  socket.on("callEnded", (id) => {
    endCall(io, id);
  });

  socket.on("callerId", (data) => {
    setCallerId(io, data);
  });
});

// Unhandled Promise Rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting down the server due to Unhandled Promise Rejection`);
//   server.close(() => {
//     process.exit(1);
//   });
// });

exports.io = io;
