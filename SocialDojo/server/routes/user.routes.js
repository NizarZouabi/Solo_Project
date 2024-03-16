const UserController = require("../controllers/user.controller");
const { authenticate } = require("../config/jwt.config");

module.exports = (app) => {
  app.post("/register", UserController.register);
  app.post("/login", UserController.login);
  app.post("/logout", UserController.logout);
  app.get("/user/:userId", authenticate, UserController.getuser);
  app.get("/user/:userId/find", UserController.getusers);
  app.patch("/user/:userId/pfp/upload", UserController.uploadProfilePicture);
  app.patch("/user/:userId/banner/upload", UserController.uploadBanner);
  app.patch("/user/:userId/friend/:friendId", authenticate, UserController.addFriend);
  app.patch("/user/:userId/friend/:friendId/remove", authenticate, UserController.removeFriend);
};
