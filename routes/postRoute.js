const express = require("express");
const {
  CreatePost,
  Post,
  LikePost,
  ViewPost,
  AddComment,
} = require("../controller/postController");

const router = express.Router();
router.route("/newPost/:id").post(CreatePost);
router.route("/allPost/:id").post(Post);
router.route("/likePost/:id").post(LikePost);
router.route("/ViewPost/:id").post(ViewPost);
router.route("/CommentPost/:id").post(AddComment);

module.exports = router;
