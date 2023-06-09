const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: isEmail } = require("validator/lib/isEmail");
const Moment = require("./momentSchema");

const User = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please Enter Your name"],
      maxLength: [30, "name cannot exceed 30 characters"],
      minLength: [4, "name should have more than 4 characters"],
      unique: true,
    },
    nickName: {
      type: String,
      // required: [true, "Please Enter Your nickName"],
    },
    userEmail: {
      type: String,
      required: [true, "Please Enter E-mail"],
      validate: [isEmail, "Please fill a valid email address"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    backgroundPicture: {
      type: String,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: {
      type: String,
      max: 50,
    },
    relationShip: {
      type: String,
      default: "Single",
    },
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    descriptionHighLight: {
      type: Array,
      default: ["Friend", "Influncer", "Learner"],
    },
    collegeName: {
      type: String,
      default: "",
    },
    hobby: {
      type: String,
      default: "Social Media Surfing",
    },
    birthDate: {
      type: Date,
      default: Date.now(),
    },
    taggedPeople: {
      type: Array,
      default: [],
    },
    hashTags: {
      type: Array,
      default: ["Friend", "Influncer", "Learner"],
    },
    memories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Moment" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    userSuggestion: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// User.pre("save", async function (next) {
//   console.log(!this.isModified("password"));
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });
User.pre("save", async function (next) {
  const user = this;

  // Remove memories that are not found
  const validMemories = await Promise.all(
    user.memories.map(async (memoryId) => {
      const memory = await Moment.findOne({ _id: memoryId });
      return memory;
    })
  );

  user.memories = validMemories.filter((memory) => memory !== null);
  next();
});
User.methods.getJWTToken = function () {
  console.log(this._id);
  return jwt.sign({ user: this._id }, process.env.jWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
User.statics.getUserData = async function (id) {
  try {
    const userData = await this.findOne({ _id: id }).populate([
      { path: "post", populate: { path: "userId", model: "User" } },
      { path: "friends", model: "User" },
      { path: "followers", model: "User" },
      {
        path: "following",
        model: "User",
        populate: { path: "memories", model: "Moment" },
      },
      { path: "memories", model: "Moment" },
    ]);
    // for (const followedUser of this.following) {
    //   // Populate the memories array for each followed user
    //   await followedUser.populate("memories").execPopulate();
    // }
    return userData;
  } catch (error) {
    // Handle any errors that occurred during the database query
    console.error(error);
    return null;
  }
};
User.statics.getUserWithEmail = async function (email) {
  try {
    const userData = await this.findOne({ userEmail: email }).populate([
      { path: "post", populate: { path: "userId", model: "User" } },
      { path: "friends", model: "User" },
      { path: "followers", model: "User" },
      { path: "following", model: "User" },
    ]);

    return userData;
  } catch (error) {
    // Handle any errors that occurred during the database query
    console.error(error);
    return null;
  }
};
module.exports = mongoose.model("User", User);
