const express = require("express");
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getPostOfFollowing,
  updateCaption,
} = require("../controllers/post.controller");

const { isAuthenticated } = require("../middlewares/auth.middleware");
const { getUserPosts } = require("../controllers/post.controller");
const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);
router.route("/posts").get(isAuthenticated, getPostOfFollowing);
router
  .route("/post/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .put(isAuthenticated, updateCaption)
  .delete(isAuthenticated, deletePost);
router.route("/user-post/:id").get(isAuthenticated, getUserPosts);

module.exports = router;
