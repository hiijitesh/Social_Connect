const express = require('express');
const {
	followUser,
	updateProfile,
	deleteMyProfile,
	myProfile,
	getUserProfile,
	getAllUsers,
	getMyPosts,
} = require('../controllers/user.controller');

const { isAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/follow/:id').get(isAuthenticated, followUser);

router.route('/update/profile').put(isAuthenticated, updateProfile);

router.route('/delete/me').delete(isAuthenticated, deleteMyProfile);
router.route('/me').get(isAuthenticated, myProfile);

router.route('/my/posts').get(isAuthenticated, getMyPosts);

router.route('/user/:id').get(isAuthenticated, getUserProfile);

router.route('/users').get(isAuthenticated, getAllUsers);

module.exports = router;
