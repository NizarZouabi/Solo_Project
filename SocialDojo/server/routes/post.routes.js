const PostController = require("../controllers/post.controller");
const { authenticate } = require("../config/jwt.config");
module.exports = (app) => {
    app.get("/posts", authenticate, PostController.findAllPosts);
    app.post("/posts/new", authenticate, PostController.createPost);
    app.get("/posts/:id", authenticate, PostController.findOnePost);
    app.patch("/posts/:id/update", authenticate, PostController.updatePost);
    app.delete("/posts/:id", authenticate, PostController.deletePost);
    app.get("/posts/user/:userId/all", authenticate, PostController.findUserAndFriendsPosts);
    app.patch("/posts/:id/comment", authenticate, PostController.addComment);
    app.delete("/posts/:id/remove/comment/:commentId", authenticate ,PostController.deleteComment);
    app.patch("/posts/user/:userId/add/star/:id", PostController.addStar);
    app.patch("/posts/user/:userId/remove/star/:id", PostController.removeStar);
    app.patch("/posts/user/:id/:userId/add/star/comment/:commentId", PostController.addStarToComment);
    app.patch("/posts/user/:id/:userId/remove/star/comment/:commentId", PostController.removeStarFromComment);
}