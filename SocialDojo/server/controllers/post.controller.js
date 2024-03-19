const Post = require('../models/post.model.js');
const User = require('../models/user.model.js');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/uploads");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage }).single("file");

module.exports.createPost = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json(err);
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      file: req.file ? req.file.filename : "",
    });

    newPost
      .save()
      .then((newPost) => {
        res.json({ newPost });
        console.log(newPost);
      })
      .catch((err) => res.status(400).json(err));
  });
};

module.exports.updatePost = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json(err);
    }

    const updatedFields = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    };

    if (req.file) {
      updatedFields.file = req.file.filename;
    }

    Post.findOneAndUpdate({ _id: req.params.id }, updatedFields, {
      new: true,
      runValidators: true,
    })
      .then((updatedPost) => {
        console.log(updatedPost);
        res.json({ updatedPost });
      })
      .catch((err) => res.status(400).json(err));
  });
};
module.exports.findAllPosts = (req, res) => {
  Post.find()
    .then((allPosts) => {
      console.log(allPosts);
      res.json({ allPosts });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.findOnePost = (req, res) => {
  Post.findOne({ postId: req.params.id })
    .then((Post) => {
      console.log(Post);
      res.json({ Post });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.findUserAndFriendsPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('friends.userId');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const friendIds = user.friends.map(friend => friend.userId);
    const userPosts = await Post.find({ author: userId }).populate('author');
    const friendsPosts = await Post.find({ author: { $in: friendIds } }).populate('author');
    const allPosts = [...userPosts, ...friendsPosts];

    res.json({ userPosts, allPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.addStar = (req, res) => {
  const postId = req.params.postId;
  Post.findByIdAndUpdate(
    postId,
    { $inc: { stars: 1 } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found." });
      }
      res.json({
        message: "Star added to post successfully.",
        post: updatedPost,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    });
};

module.exports.removeStar = (req, res) => {
  const postId = req.params.postId;
  Post.findByIdAndUpdate(
    postId,
    { $inc: { stars: -1 } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found." });
      }
      res.json({
        message: "Star removed from post successfully.",
        post: updatedPost,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    });
};

module.exports.addComment = (req, res) => {
  const postId = req.params.id;
  const newComment = {
    content: req.body.content,
    author: req.body.author,
    pfp: req.body.pfp,
    authorName: req.body.authorName,
  };

  Post.findById(postId)
    .then(post => {
      post.comments.push(newComment);
      return post.save();
    })
    .then(updatedPost => {
      res.json({
        message: "Comment added successfully.",
        post: updatedPost,
      });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.deleteComment = async (req, res) => {
  const { commentId, id } = req.params;
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          comments: { _id: commentId },
        },
      },
      { new: true, runValidators: true }
    );
    res.json({
      message: "Comment deleted successfully.",
      post: updatedPost,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.addStarToComment = (req, res) => {
  const commentId = req.params.commentId;

  Post.findOneAndUpdate(
    { "comments._id": commentId },
    { $inc: { "comments.$.stars": 1 } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({ message: "Comment not found." });
      }
      res.json({
        message: "Star added to comment successfully.",
        post: updatedPost,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    });
};

module.exports.removeStarFromComment = (req, res) => {
  const commentId = req.params.commentId;
  Post.findOneAndUpdate(
    { "comments._id": commentId },
    { $inc: { "comments.$.stars": -1 } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({ message: "Comment not found." });
      }
      res.json({
        message: "Star removed from comment successfully.",
        post: updatedPost,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    });
};

module.exports.deletePost = (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then((Done) => {
      console.log(Done);
      res.json({ message: "Post deleted successfully." });
    })
    .catch((err) => console.log(err));
};
