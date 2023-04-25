const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Moment = new mongoose.Schema(
  {
    coverPhoto: {
      type: String,
      required: [true, "Please Enter Your CoverPhoto"],
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Enter Your from"],
      ref: "User",
    },
    momentId: {
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Moment", Moment);
