const express = require("express");
const {
  CreatePost,
  Post,
  LikePost,
  ViewPost,
  AddComment,
  deletePostById,
} = require("../controller/postController");

const router = express.Router();
router.route("/newPost/:id").post(CreatePost);
router.route("/allPost/:id").post(Post);
router.route("/likePost/:id").post(LikePost);
router.route("/ViewPost/:id").post(ViewPost);
router.route("/CommentPost/:id").post(AddComment);
router.route("/deletePost/:id").post(deletePostById);

module.exports = router;
