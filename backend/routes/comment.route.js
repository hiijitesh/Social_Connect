const express = require("express");

// const {
// 	commentOnPost,
// 	deleteComment,
// } = require("../controllers/comment.controller")

const commentController = require("../controllers/comment.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const router = express.Router();

router.put(
  "/post/comment/:id",
  isAuthenticated,
  commentController.commentOnPost
);
router.delete(
  "/post/comment/:id",
  isAuthenticated,
  commentController.deleteComment
);

// router
// 	.route("/post/comment/:id")
// 	.put(isAuthenticated, commentOnPost)
// 	.delete(isAuthenticated, deleteComment)

module.exports = router;
