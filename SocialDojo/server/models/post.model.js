const mongoose = require("mongoose");
const User = require('../models/user.model');

const postSchema = new mongoose.Schema(
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
        authorName: {
          type: String,
          required: true,
        },
        pfp :{
          type: String,
          required: true,
        },
        stars: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    stars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sharedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
