// CreateMoment a User
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");
const Moment = require("../models/momentSchema");
const User = require("../models/userSchema");

exports.CreateMoment = catchAssyncError(async (req, res, next) => {
  const { Message, images, localDate } = req.body;
  const moment = new Moment({
    userId: req.params.id,
    Message,
    Image: images,
    localDate,
  });

  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    if (user) {
      // User found, push moment ID into the user's memories array
      user.memories.push(moment._id);
      console.log(`🚀 ~  user.memories:`, user.memories);
      // Save the moment
      await moment.save();
      console.log("New Moment created");

      // Save the user
      let newUser = await user.save();
      console.log(`🚀 ~ newUser:`, newUser);
      console.log("Moment ID added to user's memories array");

      console.log("Moment(s) saved successfully");
      res.status(201).json({ moment, user });
    } else {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error saving Moment(s):", error);
    res.status(500).json({ error: "Error saving Moment(s)" });
  }
});

exports.getAllMoments = async (req, res, next) => {
  try {
    const moments = await Moment.find().limit(20).populate("userId");
    console.log(`🚀 ~ moments:`, moments.length);

    res.json({ moments });
  } catch (error) {
    console.error("Error retrieving moments:", error);
    res.status(500).json({ error: "Failed to retrieve moments" });
  }
};
