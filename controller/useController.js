// testController a User
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");
const User = require("../models/userSchema");
const sendToken = require("../utils/sendToken");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { Map } = require("../socketController/postSocket");
const io = require("../server");
const { getIo, broadcastMessage } = require("../socket");
// const io = require("../server");

exports.test = catchAssyncError(async (req, res, next) => {
  res.status(200).json({ message: "Route is  working " });
  // const {  } = req.body
});

exports.register = catchAssyncError(async (req, res, next) => {
  const { userName, userEmail, profilePicture } = req.body;
  const existed = await User.getUserWithEmail(userEmail);

  if (existed) {
    const array = [
      ...existed.friends,
      existed._id,
      ...existed.following,
      ...existed.followers,
    ];
    let userSuggstion = await User.find({ _id: { $nin: array } }).limit(10);
    existed.userSuggestion = userSuggstion;

    existed.save().then((doc) => {
      return sendToken(doc, res, 201);
    });
  } else {
    const user = await User.create({
      userName,
      userEmail,
      profilePicture,
    });
    const array = [...user.friends, user._id];
    let userSuggstion = await User.find({ _id: { $nin: array } });
    user.userSuggestion = userSuggstion;

    user.save().then((doc) => {
      let io = getIo();
      io.emit("newUser", existed);
      return sendToken(doc, res, 201);
    });
  }
});
exports.getUserWithId = catchAssyncError(async (req, res, next) => {
  const { id } = req.body;
  const existed = await User.getUserData(id);

  if (existed) {
    const array = [
      ...existed.friends,
      existed._id,
      ...existed.following,
      ...existed.followers,
    ];
    let userSuggstion = await User.find({ _id: { $nin: array } }).limit(10);
    console.log(`🚀 ~ userSuggstion:`, userSuggstion);
    existed.userSuggestion = userSuggstion;

    // existed.save().then(
    // (existed) => {
    return sendToken(existed, res, 201);
    // }
    // );
  } else {
    res.status(400).json({
      success: false,
    });
  }
});
// getAllUser a User

exports.getAllUser = catchAssyncError(async (req, res, next) => {
  const { userId } = req.body;
  let users = await User.find({ _id: { $ne: userId } });

  res.status(200).json({
    success: true,
    users,
  });
});
exports.getUserSuggestion = catchAssyncError(async (req, res, next) => {
  let givenUser = await User.findOne({ _id: req.params.id });
  const array = [...givenUser.friends, givenUser._id];
  let users = await User.find({ _id: { $nin: array } });

  res.status(200).json({
    success: true,
    users,
  });
});

// update user
exports.profileCard = catchAssyncError(async (req, res, next) => {
  const { userName, hightlight, profileLink, backgroundLink } = req.body;
  let user = await User.getUserData(req.params.id);

  if (user) {
    if (userName || hightlight || profileLink || backgroundLink) {
      user.userName = userName;
      user.descriptionHighLight = hightlight;
      user.profilePicture = profileLink;
      user.backgroundPicture = backgroundLink;
      user.save();
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      res.status(200).json({
        success: false,
        user,
      });
    }
  }
});
exports.profileInfo = catchAssyncError(async (req, res, next) => {
  const {
    location,
    nickName,
    collegeName,
    relationShip,
    hobby,
    birthDate,
    taggedPeople,
    hashTags,
  } = req.body;
  let user = await User.getUserData(req.params.id);
  const birthdate = new Date(birthDate);

  if (user) {
    if (
      collegeName ||
      location ||
      nickName ||
      hobby ||
      taggedPeople ||
      relationShip ||
      hashTags ||
      birthdate
    ) {
      user.collegeName = collegeName;
      user.location = location;
      user.relationShip = relationShip;
      user.nickName = nickName;
      user.hobby = hobby;
      user.birthDate = birthdate;
      user.taggedPeople = taggedPeople;
      user.hashTags = hashTags;
      user.save();
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      res.status(200).json({
        success: false,
        user,
      });
    }
  }
});

// getFreiend of User

exports.getFreind = catchAssyncError(async (req, res, next) => {
  let users = await User.getUserData(req.params.id);

  res.status(200).json({
    success: true,
    users,
  });
});

exports.addFreind = catchAssyncError(async (req, res, next) => {
  const id = req.params.id;
  const { addableId } = req.body;
  // let user = await this.sendRequest(addableId, id);
  let newMap = Map(addableId);
  io.io.to(newMap).emit("request", id);
  res.status(200).json({
    success: true,
    io,
  });
});

// getFreiend of User

exports.deleteFreind = catchAssyncError(async (req, res, next) => {
  const id = req.params.id;
  const { deletableId } = req.body;
  let user = await User.findOne({ _id: id });
  if (user.friends.includes(deletableId) === true) {
    if (deletableId !== null) {
      user.friends.splice(user.friends.indexOf(deletableId), 1);
      user.save();
    }
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// accept Request

exports.acceptRequest = catchAssyncError(async (req, res, next) => {
  const id = req.params.id;
  const { addableId } = req.body;

  let user = await User.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        following: addableId,
        userSuggestion: addableId,
      },
      $addToSet: {
        followers: addableId,
      },
    },
    {
      returnOriginal: false,
    }
  );
  let otherUser = await User.findOneAndUpdate(
    { _id: addableId },
    {
      $pull: { following: user._id, userSuggestion: user._id },
      $addToSet: { followers: user._id },
    },
    {
      returnOriginal: false,
    }
  );

  res.status(200).json({
    success: true,
    user,
  });
});
// accept Request
