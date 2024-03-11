const Comment = require("../models/comment.model");

module.exports.createComment = (req, res) => {
  Comment.create(req.body)
    .then((createdComment) => {
      console.log(createdComment);
      res.json(createdComment);
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.findAllComments = (req, res) => {
  Comment.find()
    .then((allComments) => {
      console.log(allComments);
      res.json({ allComments });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.findOneComment = (req, res) => {
  Comment.findOne({ _id: req.params.id })
    .then((Comment) => {
      console.log(Comment);
      res.json({ Comment });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.updateComment = (req, res) => {
  Comment.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedComment) => {
      console.log(updatedComment);
      res.json({ updatedComment });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.deleteComment = (req, res) => {
  Comment.deleteOne({ _id: req.params.id })
    .then((Done) => {
      console.log(Done);
      res.json({ message: "Comment deleted successfully." });
    })
    .catch((err) => console.log(err));
};
