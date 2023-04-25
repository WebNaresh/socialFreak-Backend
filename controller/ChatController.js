// SendMessage a User
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");

exports.SendMessage = catchAssyncError(async (req, res, next) => {
  const { messages } = req.body;
});
