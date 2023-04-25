// testController a User
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");
const User = require("../models/userSchema");
const sendToken = require("../utils/sendToken");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

exports.test = catchAssyncError(async (req, res, next) => {
  res.status(200).json({ message: "Route is  working " });
  // const {  } = req.body
});

exports.register = catchAssyncError(async (req, res, next) => {
  const { userName, userEmail, profilePicture } = req.body;
  const existed = await User.find({ userEmail }).populate("friends");

  if (existed.length === 1) {
    console.log(`🚀 ~ existed.length:`, existed.length);
    existed[0].password = null;
    const array = [...existed[0].friends, existed[0]._id];
    let userSuggstion = await User.find({ _id: { $nin: array } });
    existed[0].userSuggestion = userSuggstion;
    existed[0].save();
    return sendToken(existed[0], res, 201);
  } else {
    const user = await User.create({
      userName,
      userEmail,
      profilePicture,
    });
    const array = [...existed[0].friends, existed[0]._id];
    let userSuggstion = await User.find({ _id: { $nin: array } });
    user.userSuggestion = userSuggstion;
    user.save();
    sendToken(user, res, 200);
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
  let user = await User.findById({ _id: req.params.id });

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
  let user = await User.findById({ _id: req.params.id });
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
  const id = req.params.id;
  let users = await User.findOne({ _id: id })
    .select(["friends"])
    .populate("friends");

  res.status(200).json({
    success: true,
    users,
  });
});
// ADD Freiend of User

exports.addFreind = catchAssyncError(async (req, res, next) => {
  const id = req.params.id;
  const { addableId } = req.body;
  let user = await User.findOne({ _id: id });
  if (user.friends.includes(addableId) === false) {
    if (addableId !== undefined) {
      user.friends.push(addableId);
      user.userSuggestion = user.userSuggestion.filter(
        (ele) => ele === addableId
      );

      user.save();
    }
  }
  await user.populate("friends");

  res.status(200).json({
    success: true,
    user,
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

// delete user
// get a user
// follow user
// unfollow user
