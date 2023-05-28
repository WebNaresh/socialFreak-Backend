const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Moment = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Enter Your from"],
      ref: "User",
    },
    Message: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
    },
    Video: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Moment", Moment);
