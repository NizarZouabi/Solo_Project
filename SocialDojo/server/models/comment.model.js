const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required."],
      minlength: [1],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true],
    },
    stars: {
      type: Number,
      default: 0,
    },
    replies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
    }
  },
  { timestamps: true }
);

const CommentSchema = mongoose.model("CommentSchema", Comment);
module.exports = CommentSchema;