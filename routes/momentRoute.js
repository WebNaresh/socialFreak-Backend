const express = require("express");
const {
  CreateMoment,
  getAllMoments,
} = require("../controller/ModmentController");
const router = express.Router();
router.route("/createMoment/:id").post(CreateMoment);
router.route("/getMoments").post(getAllMoments);
module.exports = router;
