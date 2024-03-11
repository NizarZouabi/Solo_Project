const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const key = process.env.KEY;

module.exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: { email: "User already registered." } });
    }
    const user = await User.create(req.body);
    const userToken = jwt.sign({ id: user._id, role: user.role }, key);
    res
      .cookie("userToken", userToken, { httpOnly: true })
      .json({ msg: "Registration complete!", user: user });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json(err);
    }
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
  User.find({})
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Users not found" });
      }
      const usersData = users.map((user) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }));
      res.json({ users: usersData });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.getuser = (req, res) => {
  const userId = req.params.id;
  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
      res.json({ user: userData });
    })
    .catch((err) => res.status(400).json(err));
};
