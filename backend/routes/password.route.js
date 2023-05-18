const express = require('express');
const {
	updatePassword,
	forgotPassword,
	resetPassword,
} = require('../controllers/password.controller');

const { isAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/update/password').put(isAuthenticated, updatePassword);

router.route('/forgot/password').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

module.exports = router;
