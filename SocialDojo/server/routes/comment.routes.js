const CommentController = require("../controllers/comment.controller");

module.exports = (app) => {
    app.get("/comments", CommentController.findAllComments);
    app.post("/comments/new", CommentController.createComment);
    app.get("/comments/:id", CommentController.findOneComment);
    app.put("/comments/:id/update", CommentController.updateComment);
    app.delete("/comments/:id", CommentController.deleteComment);
}