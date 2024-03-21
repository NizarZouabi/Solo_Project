const express = require("express");
const { Server } = require("socket.io");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const cors = require("cors");
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
require("./config/mongoose.config");
const port = process.env.PORT;

const UserRoutes = require("./routes/user.routes");
UserRoutes(app);

const PostRoutes = require("./routes/post.routes");
PostRoutes(app);

const httpServer = app.listen(port, () => {
  console.log(`>>> Server running on Port: ${port}`);
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
})

const usersToSockets = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("userId", (userId) => {
    usersToSockets[userId] = socket.id;
  });

  socket.on("message", (message) => {
    const { senderId, receiverId, content } = message;
    const receiverSocketId = usersToSockets[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", { senderId, content });
    } else {
      console.log("Receiver not online");
    }
  });
});