const express = require("express");
const {
  test,
  register,
  getAllUser,
  profileCard,
  profileInfo,
  getFreind,
  addFreind,
  deleteFreind,
  getUserSuggestion,
  acceptRequest,getUserWithId
} = require("../controller/useController");

const router = express.Router();
router.route("/test").get(test);
router.route("/register").post(register);
router.route("/getUserWithId").post(getUserWithId);
router.route("/getAllUser").post(getAllUser);
router.route("/getAllUser").post(getAllUser);
router.route("/updateUser/:id").put(profileCard);
router.route("/getUserSuggestion/:id").post(getUserSuggestion);
router.route("/getFriend/:id").post(getFreind);
router.route("/addFriend/:id").post(addFreind);
router.route("/acceptRequest/:id").post(acceptRequest);
router.route("/deleteFriend/:id").post(deleteFreind);
router.route("/updateUserCard/:id").put(profileInfo);

module.exports = router;
