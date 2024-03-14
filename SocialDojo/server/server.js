const express = require("express");
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

app.listen(port, () => {
  console.log(`>>> Server running on Port: ${port}`);
});
