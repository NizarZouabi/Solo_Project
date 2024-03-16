const PostController = require("../controllers/post.controller");
const { authenticate } = require("../config/jwt.config");
module.exports = (app) => {
    app.get("/posts", PostController.findAllPosts);
    app.post("/posts/new", PostController.createPost);
    app.get("/posts/:id", PostController.findOnePost);
    app.patch("/posts/:id/update", PostController.updatePost);
    app.delete("/posts/:id", PostController.deletePost);
    app.get("/posts/user/:userId", authenticate, PostController.findUserPosts);
    app.patch("/posts/:id/comment", PostController.addComment);
    app.delete("/posts/:id/remove/comment/:commentId", PostController.deleteComment);
    app.patch("/posts/user/:userId/addstar", PostController.addStar);
    app.patch("/posts/user/:userId/remove/poststar/:postId", PostController.removeStar);
    app.patch("/posts/user/:userId/addstar/:commentId", PostController.addStarToComment);
    app.patch("/posts/user/:userId/remove/commentstar/:commentId", PostController.removeStarFromComment);
}