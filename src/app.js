// index.js
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const http = require("http");
require("dotenv").config();
var cors = require('cors');


const server = http.createServer(app);


const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
});
require("./utils/socket")(io);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/payment" , paymentRouter);

// Root route
app.get("/", (req, res) => {
  res.send("DevTinder Backend is running");
});

// Connect DB and start server
connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(process.env.PORT || 5000, "0.0.0.0", () =>
      console.log("Server running on port", process.env.PORT || 5000)
    );
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
