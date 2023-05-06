// sendMessage a User
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");
const Message = require("../models/messageSchema");
const jwtMaker = require("../utils/jwtMaker");
const { getPost } = require("./postSocket");
const PostSchema = require("../models/PostSchema");
let value = require("../server");
global.onlineUsers = new Map();
setInterval(() => {
  console.log(global.onlineUsers);
}, 5000);

exports.AddUser = async (socket, userId, io) => {
  onlineUsers.set(userId, [socket.id]);
  io.to(onlineUsers.get(userId)[0]).emit(
    "get-peerId",
    onlineUsers.get(userId)[0]
  );

  return global.onlineUsers;
};
exports.AddPeerToUser = async (peerId, userId) => {
  if (onlineUsers.get(userId)[1] === undefined) {
    onlineUsers.get(userId).push(peerId);
  } else {
    onlineUsers.get(userId)[1] = peerId;
  }

  return global.onlineUsers;
};

exports.RemoveUser = async (id) => {
  onlineUsers.forEach((element, key) => {
    console.log(`🚀 ~ element, key:`, element, key);
    console.log(`🚀 ~ element.includes(id):`, element.includes(id));
    if (element.includes(id)) {
      onlineUsers.delete(key);
    }
  });
  return global.onlineUsers;
};

exports.getPosts = async (skip, userId, socket, io) => {
  let posts = await PostSchema.find()
    .populate(["userId", "comments.userId"])
    .sort({ createdAt: -1 })
    .skip(skip * 2)
    .limit(2);
  io.to(onlineUsers.get(userId)[0]).emit("take-posts", posts);
};
exports.sendMessage = async (data, io) => {
  const { message, reciever } = data;
  let sender = data.sender._id;
  let messages = await Message.find({ sender: [sender, reciever] })
    .populate(["sender", "reciever"])
    .sort({ createdAt: -1 })
    .limit(1);

  if (messages[0].sender._id.toString() === sender) {
    let arrayPush = await Message.findOne({ _id: messages[0]._id });
    arrayPush.message = [...arrayPush.message, ...message];
    arrayPush.save();
    arrayPush.populate(["sender", "reciever"]).then((doc) => {
      io.to(onlineUsers.get(reciever)).emit("get-msg", data);
    });
  } else {
    let newMessage = await Message.create({
      msg: "new",
      sender,
      message,
      reciever,
    }).then((document) =>
      document.populate(["sender", "reciever"]).then((doc) => {
        io.to(onlineUsers.get(reciever)).emit("get-msg", data);
      })
    );
  }
};

exports.endCall = async (io, id) => {
  console.log(`🚀 ~ id:`, id);
  io.to(onlineUsers.get(id)[0]).emit("redirect", "call is ended");
};
exports.setCallerId = async (io, data) => {
  console.log(`🚀 ~ io, data:`, data);
  io.to(onlineUsers.get(data.to)[0]).emit("setCallerId", data.from);
};
