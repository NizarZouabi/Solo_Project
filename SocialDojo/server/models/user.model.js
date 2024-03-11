const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: {
        validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email.",
      },
    },
    birthdate: {
      type: Date,
      required: [true, "Birthdate is required."],
      validate: {
        validator: (val) => {
          const today = new Date();
          const sixTeenYears = new Date(
            today.getFullYear() - 16,
            today.getMonth(),
            today.getDate()
          );
          return val < sixTeenYears;
        },
        message: "You must be at least 16 years old to register.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be 8 characters or longer."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePic: {
      type: String,
      default:
        "https://i.pinimg.com/564x/56/8f/a2/568fa2f17d494f297e609eb5e9404c8d.jpg",
    },
    coverPic: {
      type: String,
      default:
        "https://lh3.googleusercontent.com/proxy/s4pfKQ4cBN8oMSV-2rcbUZX3_FpiBsgLzbc5lyMR2gKn9z6CQ6HWDzFXt4ZTBXMM4DVz-9LLUY7DXDe2SqfERTdVPiCy2FTHrL8",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required."],
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    sharedPosts: [
      {
        postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

User.virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

User.pre("validate", function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Password must match confirm password.");
  }
  next();
});

User.pre("save", function (next) {
  bcrypt
    .hash(this.password, 10)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch((err) => {
      next(err);
    });
});

const UserSchema = mongoose.model("UserSchema", User);
module.exports = UserSchema;
