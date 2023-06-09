// sendMessage a User
const catchAssyncError = require("../middleware/catchAssyncError");
const Message = require("../models/messageSchema");
const PostSchema = require("../models/PostSchema");
const User = require("../models/userSchema");
const { getIo } = require("../socket");
global.onlineUsers = new Map();
setInterval(() => {
  console.log(global.onlineUsers);
}, 5000);
exports.AddUser = async (socket, userId) => {
  let io = getIo();
  onlineUsers.set(userId, [socket.id]);
  // io.to(onlineUsers.get(userId)[0]).emit(
  //   "get-peerId",
  //   onlineUsers.get(userId)[0]
  // );
  emitEventToUser(io, "get-peerId", userId, "sendId");

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
    if (element.includes(id)) {
      onlineUsers.delete(key);
    }
  });
  return global.onlineUsers;
};

// exports.getPosts = async (skip, userId, socket, io) => {
//   let posts = await PostSchema.find()
//     .populate(["userId", "comments.userId"])
//     .sort({ createdAt: -1 })
//     .skip(skip * 2)
//     .limit(2);
//   io.to(onlineUsers.get(userId)[0]).emit("take-posts", posts);
// };
exports.sendMessage = async (data, io) => {
  const { message, reciever } = data;
  let sender = data.sender._id;
  let messages = await Message.find({ sender: [sender, reciever] })
    .populate(["sender", "reciever"])
    .sort({ createdAt: -1 })
    .limit(1);

  if (messages[0]?.sender._id.toString() === sender) {
    let arrayPush = await Message.findOne({ _id: messages[0]._id });
    arrayPush.message = [...arrayPush.message, ...message];
    arrayPush.save();
    arrayPush.populate(["sender", "reciever"]).then((doc) => {
      emitEventToUser(io, "get-msg", reciever, data);
      // io.to(onlineUsers.get(reciever)).emit("get-msg", data);
    });
  } else {
    let newMessage = await Message.create({
      msg: "new",
      sender,
      message,
      reciever,
    }).then((document) =>
      document.populate(["sender", "reciever"]).then((doc) => {
        emitEventToUser(io, "get-msg", reciever, data);
        // io.to(onlineUsers.get(reciever)).emit("get-msg", data);
      })
    );
  }
};

exports.sendRequest = async (addableId, id, io) => {
  let user = await User.findByIdAndUpdate(
    { _id: id },
    {
      $addToSet: { following: addableId },
      $pull: {
        userSuggestion: addableId,
      },
    },
    {
      returnOriginal: false,
    }
  );
  if (addableId !== undefined) {
    user.userSuggestion = user.userSuggestion.filter(
      (ele) => ele === addableId
    );
    let otherUser = await User.findOneAndUpdate(
      { _id: addableId },
      { $addToSet: { followers: user._id } },
      {
        returnOriginal: false,
      }
    );
  }
  // const newUser = onlineUsers.get(addableId)[0];
  // if (newUser) {
  //   io.to(newUser).emit("request", user);
  // } else {
  //   // Handle the case where "user" is not present in the map
  //   console.log("User not found in the map");
  //   // You can choose to emit a different event or take any other necessary action here
  // }
  emitEventToUser(io, "request", addableId, user);
};
exports.acceptRequest = async (addableId, id, io) => {
  let user = await User.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        userSuggestion: addableId,
      },
      $addToSet: {
        followers: addableId,
        following: addableId,
      },
    },
    {
      returnOriginal: false,
    }
  );
  let otherUser = await User.findOneAndUpdate(
    { _id: addableId },
    {
      $pull: { userSuggestion: user._id },
      $addToSet: { followers: user._id },
    },
    {
      returnOriginal: false,
    }
  );
  // const newUser = onlineUsers.get(addableId)[0];
  // if (newUser) {
  // io.to(newUser).emit("followBack", user);

  // } else {
  //   // Handle the case where "user" is not present in the map
  //   console.log("User not found in the map");
  //   // You can choose to emit a different event or take any other necessary action here
  // }
  emitEventToUser(io, "followBack", addableId, user);
};
function emitEventToUser(io, eventName, addableId, data) {
  const user = onlineUsers.get(addableId)?.[0];
  if (user) {
    if (data === "sendId") {
      io.to(user).emit(eventName, user);
    }
    io.to(user).emit(eventName, data);
  } else {
    console.log("User not found in the map");
    // Handle the case where user is not present in the map
  }
}
