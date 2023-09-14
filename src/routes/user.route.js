const express = require("express");
const {
  followUser,
  updateProfile,
  deleteMyProfile,
  myProfile,
  getUserProfile,
  getAllUsers,
} = require("../controllers/user.controller");

const router = express.Router();
const { getMyPosts } = require("../controllers/post.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.route("/follow/:id").get(isAuthenticated, followUser);
router.route("/update/profile").put(isAuthenticated, updateProfile);
router.route("/delete/me").delete(isAuthenticated, deleteMyProfile);
router.route("/me").get(isAuthenticated, myProfile);
router.route("/my/posts").get(isAuthenticated, getMyPosts);
router.route("/user/:id").get(isAuthenticated, getUserProfile);
router.route("/users").get(isAuthenticated, getAllUsers);

module.exports = router;
