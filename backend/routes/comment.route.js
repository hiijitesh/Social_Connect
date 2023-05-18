const express = require('express');
const {
	commentOnPost,
	deleteComment,
} = require('../controllers/comment.controller');

const { isAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

router
	.route('/post/comment/:id')
	.put(isAuthenticated, commentOnPost)
	.delete(isAuthenticated, deleteComment);

module.exports = router;
