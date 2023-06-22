const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./userSchema");
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
      default: "",
      required: true,
    },
    localDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

Moment.pre("remove", async function (next) {
  const memory = this;

  // Retrieve the user ID from the memory
  const userId = memory.userId;

  // Find the user who created the memory
  const user = await User.findOne({ _id: userId });

  // Remove the memory ID from the user's memories array
  if (user) {
    user.memories.pull(memory._id);
    await user.save();
  }

  next();
});
module.exports = mongoose.model("Moment", Moment);
