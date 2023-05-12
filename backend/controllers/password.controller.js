const User = require('../models/User.model');
const { sendEmail } = require('../middlewares/sendEmail');
const crypto = require('crypto');

exports.updatePassword = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select('+password');

		const { oldPassword, newPassword } = req.body;

		if (!oldPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: 'Please provide old and new password',
			});
		}

		const isMatch = await user.matchPassword(oldPassword);
		if (!isMatch) {
			return res.status(400).json({
				success: false,
				message: 'Incorrect Old password',
			});
		}

		user.password = newPassword;
		await user.save();

		res.status(200).json({
			success: true,
			message: 'Password Updated',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.forgotPassword = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		const resetPasswordToken = user.getResetPasswordToken();

		await user.save();

		const resetUrl = `${req.protocol}://${req.get(
			'host'
		)}/password/reset/${resetPasswordToken}`;

		const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

		try {
			await sendEmail({
				email: user.email,
				subject: 'Reset Password',
				message,
			});

			res.status(200).json({
				success: true,
				message: `Email sent to ${user.email}`,
			});
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			await user.save();

			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const resetPasswordToken = crypto
			.createHash('sha256')
			.update(req.params.token)
			.digest('hex');

		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Token is invalid or has expired',
			});
		}

		user.password = req.body.password;

		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();

		res.status(200).json({
			success: true,
			message: 'Password Updated',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
