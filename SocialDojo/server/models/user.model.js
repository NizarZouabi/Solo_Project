const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      minlength: [3, "First name must be at least 3 characters long."],
      maxlength: [46, "First name must be at most 46 characters long."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      minlength: [3, "Last name must be at least 3 characters long."],
      maxlength: [46, "Last name must be at most 46 characters long."],
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
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be 8 characters or longer."],
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePic: {
      type: String,
      default: null,
    },
    coverPic: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: [true, "Gender is required."],
    },
    pendingRequests: [{
      sender: {
        firstName: {
          type: String,
          required: true
        },
        lastName: {
          type: String,
          required: true
        },
        profilePic: {
          type: String
        }
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }],
    friends: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        firstName: {
          type: String,
          required: true
        },
        lastName: {
          type: String,
          required: true
        },
        profilePic: {
          type: String
        }
      }
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
    chats: [
      {
        withUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        messages: [
          {
            senderId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              required: true
            },
            content: {
              type: String,
              required: true
            },
            timestamp: {
              type: Date,
              default: Date.now
            }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);




userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
