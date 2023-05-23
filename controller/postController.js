// PostController a User
const ErrorHandler = require("../utils/errorHandler");
const catchAssyncError = require("../middleware/catchAssyncError");
const PostSchema = require("../models/PostSchema");

exports.CreatePost = catchAssyncError(async (req, res, next) => {
  // console.log(`🚀 ~ post:`);
  const { imagesArray, title, taggedPeople, hashTags } = req.body;
  if (imagesArray || title || taggedPeople || hashTags || req.params.id) {
    const post = await PostSchema.create({
      userId: req.params.id,
      image: imagesArray,
      title: title,
      hashTag: hashTags,
      taggedPeople: taggedPeople,
    }).then((v) => {
      v.views.addToSet(req.params.id);
      v.save().then((v) => {
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

// Post a User

exports.Post = catchAssyncError(async (req, res, next) => {
  let posts = await PostSchema.find()
    .populate(["userId", "comments.userId"])
    .sort({ createdAt: -1 })
    .skip(req.query.page * 2)
    .limit(2);
  if (req.params.id) {
    num = Number(req.query.page) + 1;
    console.log(`🚀 ~ num:`, req.query.page);
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

exports.LikePost = catchAssyncError(async (req, res, next) => {
  const { postId, response } = req.body;
  let post = await PostSchema.findByIdAndUpdate(postId);
  if (response === "like") {
    if (post.likes.includes(req.params.id)) {
    } else {
      post.likes.addToSet(req.params.id);
      post.save();
    }
  } else {
    if (post.likes.includes(req.params.id)) {
      const index = post.likes.indexOf(req.params.id);
      if (index > -1) {
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

exports.ViewPost = catchAssyncError(async (req, res, next) => {
  // console.log(req.body);
  const { postId } = req.body;
  let post = await PostSchema.findByIdAndUpdate(postId);
  // console.log(`🚀 ~ post:`, post.views.includes(req.params.id));
  if (post.likes.includes(req.params.id)) {
  } else {
    post.views.addToSet(req.params.id);
    post.save();
  }

  res.status(200).json({
    success: true,
    post,
  });
});
exports.AddComment = catchAssyncError(async (req, res, next) => {
  // console.log(req.body);
  const { msg, userId } = req.body;
  let post = await PostSchema.findByIdAndUpdate(req.params.id);
  post.comments.push({
    comment: msg,
    userId: userId,
  });
  post.save();
  await post.populate(["comments.userId"]);
  // console.log(`🚀 ~ post:`, post);

  res.status(200).json({
    success: true,
    comment: post.comments,
  });
});
