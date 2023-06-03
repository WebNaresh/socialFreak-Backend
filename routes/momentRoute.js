const express = require("express");
const { CreateMoment } = require("../controller/ModmentController");
const router = express.Router();
router.route("/createMoment").post(CreateMoment);
module.exports = router;
