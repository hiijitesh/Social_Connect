const Post = require("../models/Post.model");
const User = require("../models/User.model");
const cloudinary = require("cloudinary");

// New Post
exports.createPost = async (req, res) => {
    try {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "posts",
        });
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            owner: req.user._id,
        };

        const post = await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.unshift(post._id);

        await user.save();
        res.status(201).json({
            success: true,
            message: "Post created",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await cloudinary.v2.uploader.destroy(post.image.public_id);

        await post.remove();

        const user = await User.findById(req.user._id);

        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Post deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Like & Unlike the Post
exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // if the post is already liked, unlike it
        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);

            // slice will delete that enrty starting form index to 1
            post.likes.splice(index, 1);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Unliked",
            });
        }

        // Like the post
        else {
            post.likes.push(req.user._id);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Liked",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getPostOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: {
                $in: user.following,
            },
        }).populate("owner likes comments.user");

        res.status(200).json({
            success: true,
            posts: posts.reverse(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        post.caption = req.body.caption;
        await post.save();
        res.status(200).json({
            success: true,
            message: "Post updated",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const posts = [];

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate(
                "likes comments.user owner"
            );
            posts.push(post);
        }

        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const posts = [];

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate(
                "likes comments.user owner"
            );
            posts.push(post);
        }

        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
