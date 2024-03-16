const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      minlength: [3, "Title must be at least 3 characters long."],
      maxlength: [50, "Title must be at most 50 characters long."],
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      minlength: [3, "Content must be at least 3 characters long."],
    },
    author: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    file: {
      type: String,
      default: null,
    },
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        stars: {
          type: Number,
          default: 0,
        },
      },
    ],
    stars: {
      type: Number,
      default: 0,
    },
    sharedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const PostSchema = mongoose.model("PostSchema", Post);
module.exports = PostSchema;
