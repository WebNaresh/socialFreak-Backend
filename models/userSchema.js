const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: isEmail } = require("validator/lib/isEmail");

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
    post: {
      type: Array,
      default: [],
    },
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
    memories: {
      type: Array,
      default: [],
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    userSuggestion: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

User.pre("save", async function (next) {
  console.log(!this.isModified("password"));
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
User.methods.getJWTToken = function () {
  console.log(this._id);
  return jwt.sign({ user: this._id }, process.env.jWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", User);
