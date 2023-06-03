const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Message = new mongoose.Schema(
  {
    message: [{ type: String }],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Enter Your from"],
      ref: "User",
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please Enter Your reciever"],
      ref: "User",
    },
    time: {
      type: Date,
      default: Date.now(),
    },
    sticker:{
      type:String
    }
  },
  { timestamps: true }
);
// Message.pre("save", async function (next) {
//     var dt = new Date();
//     var hours = dt.getHours(); // gives the value in 24 hours format
//     var AmOrPm = hours >= 12 ? 'pm' : 'am';
//     hours = hours % 12 || 12;
//     var minutes = dt.getMinutes();
//     var finalTime = +hours + ':' + minutes + ' ' + AmOrPm;
//     this.time = `${finalTime}`;
// });
Message.pre("insertMany", async function (next, docs) {});

module.exports = mongoose.model("Message", Message);
