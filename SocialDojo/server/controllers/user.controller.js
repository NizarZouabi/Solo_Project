const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const key = process.env.KEY;
const multer = require("multer");
const path = require("path");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage, fileFilter: imageFilter  }).single("file");

exports.uploadProfilePicture = (req, res) => {
  const userId = req.params.userId;
  upload(req, res, (err) => {
    if (err) {
      if (err.message === "Only images are allowed") {
        return res.status(400).json({ error: "Only images are allowed" });
      }
      return res.status(400).json({ error: "Invalid file upload" });
    }

    User.findByIdAndUpdate(
      userId,
      { profilePic: req.file.filename },
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json({
          message: "Profile picture uploaded successfully",
          updatedUser,
        });
      })
      .catch((err) => res.status(400).json(err));
  });
};

exports.uploadBanner = (req, res) => {
  const userId = req.params.userId;
  upload(req, res, (err) => {
      if (err) {
        if (err.message === "Only images are allowed") {
          return res.status(400).json({ error: "Only images are allowed" });
        }
        return res.status(400).json({ error: "Invalid file upload" });
      }

      User.findByIdAndUpdate(
        userId,
        { coverPic: req.file.filename },
        { new: true }
      )
        .then((updatedUser) => {
          res
            .status(200)
            .json({ message: "Banner uploaded successfully", updatedUser });
        })
        .catch((err) => res.status(400).json(err));
    });
};

module.exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword, ...userData } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ errors: { confirmPassword: "Passwords do not match." } });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: { email: "User already registered." } });
    }
    const user = await User.create({ email, password, ...userData });
    const userToken = jwt.sign({ id: user._id, role: user.role }, key);
    res.cookie("userToken", userToken, { httpOnly: true })
      .json({ msg: "Registration complete!", user: user });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json(err);
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ error: { email: "Email is required, Please enter the email." } });
  }
  if (!password) {
    return res.status(400).json({
      error: { password: "Password is required, Please enter the password." },
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user === null) {
    return res
      .status(400)
      .json({ error: { email: "This email doesn't exist." } });
  }
  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword) {
    return res.status(400).json({ error: { password: "Wrong password." } });
  }
  const userToken = jwt.sign({ id: user._id }, key, { expiresIn: "1h" });
  res.cookie("userToken", userToken, { httpOnly: true }).json({
    msg: "successfully logged in!",
    user: {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
};

module.exports.logout = (req, res) => {
  res.clearCookie("userToken");
  res.sendStatus(200);
};

module.exports.getusers = (req, res) => {
  const userId = req.params.userId;

  User.find({ _id: { $ne: userId } })
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Users not found" });
      }
      const usersData = users.map((user) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        coverPic: user.coverPic,
        profilePic: user.profilePic,
        role: user.role,
      }));
      res.json({ users: usersData });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.getuser = (req, res) => {
  const userId = req.params.userId;
  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        coverPic: user.coverPic,
        profilePic: user.profilePic,
        role: user.role,
        pendingRequests: user.pendingRequests,
      };
      res.json({ user: userData });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.sendFriendRequest = async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const [user, friend] = await Promise.all([
      User.findById(userId).select('firstName lastName profilePic'),
      User.findById(friendId)
    ]);
    console.log(user, friend);
    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found." });
    }
    if (friend.pendingRequests.some(request => request.senderId.equals(userId))) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const senderInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      profilePic: user.profilePic
    };
    friend.pendingRequests.push({
      senderId: user._id,
      sender: {
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic
      }
    });
    await friend.save();
    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.cancelFriendRequest = async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found." });
    }

    friend.pendingRequests = friend.pendingRequests.filter(request => !request.senderId.equals(userId));
    await friend.save();
    res.status(200).json({ message: "Friend request canceled successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.addFriend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId),
    ]);
    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found." });
    }

    user.pendingRequests = user.pendingRequests.filter(id => id !== friendId);
    user.friends.push(friendId);
    friend.friends.push(userId);
    await Promise.all([user.save(), friend.save()]);
    res.status(200).json({ message: "Friend added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.removeFriend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ message: "Friend not found in user's friends list." });
    }
    user.friends = user.friends.filter(
      (friend) => friend.toString() !== friendId
    );
    await user.save();

    res
      .status(200)
      .json({ message: "Friend removed successfully.", user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};