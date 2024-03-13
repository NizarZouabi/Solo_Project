const Post = require("../models/post.model");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});
        
const upload = multer({ storage: storage }).single('file');

module.exports.createPost = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json(err);
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      file: req.file ? req.file.originalname : "",
    });

    newPost.save().then((newPost) => {
        res.json({ newPost });
        console.log(newPost);
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
}

module.exports.findOnePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
      .then((Post) => {
        console.log(Post);
        res.json({ Post });
      })
      .catch((err) => res.status(400).json(err));
}

module.exports.findUserPosts = (req, res) => {
  const userId = req.params.userId;
  Post.find({ author: userId })
    .then((userPosts) => {
      console.log(userPosts);
      res.json({ userPosts });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.updatePost = (req, res) => {
    Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((updatedPost) => {
        console.log(updatedPost);
        res.json({ updatedPost });
      })
      .catch((err) => res.status(400).json(err));
}

module.exports.deletePost = (req, res) => {
    Post.deleteOne({ _id: req.params.id })
        .then((Done) => {
            console.log(Done);
            res.json({ message: "Post deleted successfully." });
        })
        .catch((err) => console.log(err))
}