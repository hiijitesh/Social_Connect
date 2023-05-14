const express = require('express')
const {
	createPost,
	likeAndUnlikePost,
	deletePost,
	getPostOfFollowing,
	updateCaption,
} = require('../controllers/post.controllerjs')

const { isAuthenticated } = require('../middlewares/auth.middleware')
const { getUserPosts } = require('../controllers/post.controller')

const router = express.Router()

router.route('/post/upload').post(isAuthenticated, createPost)

router
	.route('/post/:id')
	.get(isAuthenticated, likeAndUnlikePost)
	.put(isAuthenticated, updateCaption)
	.delete(isAuthenticated, deletePost)

router.route('/userposts/:id').get(isAuthenticated, getUserPosts)

router.route('/posts').get(isAuthenticated, getPostOfFollowing)

module.exports = router
