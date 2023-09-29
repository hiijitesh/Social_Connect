const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Using Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Importing Routes
const post = require("./routes/post.route");
const user = require("./routes/user.route");
const auth = require("./routes/auth.route");
const comment = require("./routes/comment.route");
const password = require("./routes/password.route");

// const { post, user, auth, comment, password } = require("./routes")

// Using Routes
app.use("/api", post);
app.use("/api", user);
app.use("/api", auth);
app.use("/api", comment);
app.use("/api", password);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

module.exports = app;
