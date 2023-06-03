// CreateMoment a User
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");
const Moment = require("../models/momentSchema");

exports.CreateMoment = catchAssyncError(async (req, res, next) => {
  const { Message, images, localDate } = req.body;

  // Create an empty array to store the saved moments
  const savedMoments = [];

  // Create and save a Moment instance for each image
  for (const Image of images) {
    try {
      const moment = new Moment({
        userId: req.params.id, // Set the appropriate user ID
        Message,
        Image,
        localDate,
      });

      // Save the moment
      const savedMoment = await (await moment.save()).populate("userId");

      // Add the saved moment to the array
      savedMoments.push(savedMoment);

      console.log("Moment saved successfully");
    } catch (error) {
      console.error("Error saving moment:", error);
    }
  }

  // Send the response with status 201 and the saved moments
  res.status(201).json({ moments: savedMoments });
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
