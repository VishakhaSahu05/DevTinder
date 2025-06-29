const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();



const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); 
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

// ✅ Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

// ✅ Root route to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("🚀 DevTinder Backend is running!");
});

// ✅ DB connect and start server
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT,'0.0.0.0', () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
