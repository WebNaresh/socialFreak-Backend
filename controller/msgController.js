// sendMessage a User
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");
const Message = require("../models/messageSchema");
const jwtMaker = require("../utils/jwtMaker");

exports.sendMessage = catchAssyncError(async (req, res, next) => {
  const { message, sender, reciever } = req.body;
  let messages = await Message.find({ sender: [sender, reciever] })
    .populate(["sender", "reciever"])
    .sort({ createdAt: -1 })
    .limit(1);

  if (messages[0].sender._id.toString() === sender) {
    let arrayPush = await Message.findOne({ _id: messages[0]._id });
    arrayPush.message = [...arrayPush.message, ...message];
    arrayPush.save();
    res.status(201).json({ msg: "old", success: arrayPush });
  } else {
    let newMessage = await Message.create({
      msg: "new",
      sender,
      message,
      reciever,
    });
    res.status(201).json({ msg: "new", success: newMessage });
  }
});
// getMessage a User

exports.getMessage = catchAssyncError(async (req, res, next) => {
  const { sender, reciever } = req.body;
  let messages = await Message.find({ sender: [sender, reciever] })
    .populate(["sender", "reciever"])
    .sort({ createdAt: -1 })
    .limit(10);
  messages.reverse();

  res.status(201).json({ count: messages.length, success: true, messages });
});
