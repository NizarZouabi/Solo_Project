const PostController = require("../controllers/post.controller");
const { authenticate } = require("../config/jwt.config");
module.exports = (app) => {
    app.get("/posts", PostController.findAllPosts);
    app.post("/posts/new", PostController.createPost);
    app.get("/posts/:id", PostController.findOnePost);
    app.put("/posts/:id/update", PostController.updatePost);
    app.delete("/posts/:id", PostController.deletePost);
    app.get("/posts/user/:userId", authenticate, PostController.findUserPosts);
}