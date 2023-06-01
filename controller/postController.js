// PostController for User

// Import required modules and models
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");
const PostSchema = require("../models/PostSchema");
const User = require("../models/userSchema");

// Create a new post
exports.CreatePost = catchAssyncError(async (req, res, next) => {
  const { imagesArray, title, taggedPeople, hashTags } = req.body;

  // Check if required fields are provided
  if (imagesArray || title || taggedPeople || hashTags || req.params.id) {
    await PostSchema.create({
      userId: req.params.id,
      image: imagesArray,
      title: title,
      hashTag: hashTags,
      taggedPeople: taggedPeople,
    }).then(async (v) => {
      // Add the post ID to the user's post array
      let user = await User.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { post: v._id } },
        { new: true }
      );

      // Add the user ID to the post's views array
      v.views.addToSet(req.params.id);
      v.save().then((v) => {
        // Populate the userId field with user details
        v.populate("userId").then((e) =>
          res.status(200).json({
            success: true,
            post: e,
          })
        );
      });
    });
  } else {
    res.status(201).json({
      success: false,
    });
  }
});

// Get posts for a user
exports.Post = catchAssyncError(async (req, res, next) => {
  // Retrieve posts with user and comments populated, sorted by createdAt in descending order
  let posts = await PostSchema.find()
    .populate(["userId", "comments.userId"])
    .sort({ createdAt: -1 })
    .skip(req.query.page * 2)
    .limit(2);

  if (req.params.id) {
    num = Number(req.query.page) + 1;
    res.status(200).json({
      postsCount: posts.length,
      success: true,
      posts,
      num,
    });
  } else {
    res.status(200).json({
      success: true,
      posts: [],
    });
  }
});

// Like or Unlike a post
exports.LikePost = catchAssyncError(async (req, res, next) => {
  const { postId, response } = req.body;

  // Find the post by ID
  let post = await PostSchema.findByIdAndUpdate(postId);

  if (response === "like") {
    // Check if the user has already liked the post
    if (post.likes.includes(req.params.id)) {
    } else {
      // Add the user ID to the post's likes array
      post.likes.addToSet(req.params.id);
      post.save();
    }
  } else {
    // Check if the user has already liked the post
    if (post.likes.includes(req.params.id)) {
      const index = post.likes.indexOf(req.params.id);
      if (index > -1) {
        // Remove the user ID from the post's likes array
        post.likes.splice(index, 1);
      }

      post.save();
    } else {
    }
  }

  res.status(200).json({
    success: true,
    post,
    response,
  });
});

// View a post
exports.ViewPost = catchAssyncError(async (req, res, next) => {
  const { postId } = req.body;

  // Find the post by ID
  let post = await PostSchema.findByIdAndUpdate(postId);

  // Check if the user has already liked the post
  if (post.likes.includes(req.params.id)) {
  } else {
    // Add the user ID to the post's views array
    post.views.addToSet(req.params.id);
    post.save();
  }

  res.status(200).json({
    success: true,
    post,
  });
});

// Add a comment to a post
exports.AddComment = catchAssyncError(async (req, res, next) => {
  const { msg, userId } = req.body;

  // Find the post by ID
  let post = await PostSchema.findByIdAndUpdate(req.params.id);
  console.log(`🚀 ~ post:`, post);

  // Add the comment to the post's comments array
  post.comments.push({
    comment: msg,
    userId: userId,
  });

  // Save the updated post
  post.save();

  // Populate the userId field in the comments array
  await post.populate(["comments.userId"]);

  res.status(200).json({
    success: true,
    comment: post.comments,
  });
});

// Delete a post by ID
exports.deletePostById = catchAssyncError(async (req, res, next) => {
  const postId = req.params.id;

  // Find the post and retrieve the associated userId
  const post = await PostSchema.findById(postId);
  const userId = post.userId;

  // Delete the post
  await PostSchema.findByIdAndDelete(postId);

  // Remove the post ID from the user's post array
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { post: postId } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});
