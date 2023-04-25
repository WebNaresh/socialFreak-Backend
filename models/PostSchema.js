const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Comment = new mongoose.Schema(
  {
    comment: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Enter Your userId"],
      ref: "User",
    },
  },
  { timestamps: true }
);
const Post = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Enter Your userId"],
      ref: "User",
    },
    image: {
      type: Array,
      required: [true, "Please Enter Image"],
    },
    title: {
      type: String,
      required: [true, "Please Enter Title"],
    },
    likes: {
      type: Array,
      default: [],
    },
    views: {
      type: Array,
      default: [],
    },
    hashTag: {
      type: Array,
      default: [],
    },
    taggedPeople: {
      type: Array,
      default: [],
    },
    comments: [Comment],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", Post);
