const User = require('../models/User.model');
const Post = require('../models/Post.model');
const cloudinary = require('cloudinary');

exports.followUser = async (req, res) => {
	try {
		const userToFollow = await User.findById(req.params.id);
		const loggedInUser = await User.findById(req.user._id);

		if (!userToFollow) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		if (loggedInUser.following.includes(userToFollow._id)) {
			const indexfollowing = loggedInUser.following.indexOf(
				userToFollow._id
			);
			const indexfollowers = userToFollow.followers.indexOf(
				loggedInUser._id
			);

			loggedInUser.following.splice(indexfollowing, 1);
			userToFollow.followers.splice(indexfollowers, 1);

			await loggedInUser.save();
			await userToFollow.save();

			res.status(200).json({
				success: true,
				message: 'User Unfollowed',
			});
		} else {
			loggedInUser.following.push(userToFollow._id);
			userToFollow.followers.push(loggedInUser._id);

			await loggedInUser.save();
			await userToFollow.save();

			res.status(200).json({
				success: true,
				message: 'User followed',
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		const { name, email, avatar } = req.body;

		if (name) {
			user.name = name;
		}
		if (email) {
			user.email = email;
		}

		if (avatar) {
			await cloudinary.v2.uploader.destroy(user.avatar.public_id);

			const myCloud = await cloudinary.v2.uploader.upload(avatar, {
				folder: 'avatars',
			});
			user.avatar.public_id = myCloud.public_id;
			user.avatar.url = myCloud.secure_url;
		}

		await user.save();

		res.status(200).json({
			success: true,
			message: 'Profile Updated',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deleteMyProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		const posts = user.posts;
		const followers = user.followers;
		const following = user.following;
		const userId = user._id;

		// Removing Avatar from cloudinary
		await cloudinary.v2.uploader.destroy(user.avatar.public_id);

		await user.remove();

		// Logout user after deleting profile

		res.cookie('token', null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		});

		// Delete all posts of the user
		for (let i = 0; i < posts.length; i++) {
			const post = await Post.findById(posts[i]);
			await cloudinary.v2.uploader.destroy(post.image.public_id);
			await post.remove();
		}

		// Removing User from Followers Following
		for (let i = 0; i < followers.length; i++) {
			const follower = await User.findById(followers[i]);

			const index = follower.following.indexOf(userId);
			follower.following.splice(index, 1);
			await follower.save();
		}

		// Removing User from Following's Followers
		for (let i = 0; i < following.length; i++) {
			const follows = await User.findById(following[i]);

			const index = follows.followers.indexOf(userId);
			follows.followers.splice(index, 1);
			await follows.save();
		}

		// removing all comments of the user from all posts
		const allPosts = await Post.find();

		for (let i = 0; i < allPosts.length; i++) {
			const post = await Post.findById(allPosts[i]._id);

			for (let j = 0; j < post.comments.length; j++) {
				if (post.comments[j].user === userId) {
					post.comments.splice(j, 1);
				}
			}
			await post.save();
		}

		// removing all likes of the user from all posts
		for (let i = 0; i < allPosts.length; i++) {
			const post = await Post.findById(allPosts[i]._id);

			for (let j = 0; j < post.likes.length; j++) {
				if (post.likes[j] === userId) {
					post.likes.splice(j, 1);
				}
			}
			await post.save();
		}

		res.status(200).json({
			success: true,
			message: 'Profile Deleted',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.myProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate(
			'posts followers following'
		);

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate(
			'posts followers following'
		);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find({
			name: { $regex: req.query.name, $options: 'i' },
		});

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
