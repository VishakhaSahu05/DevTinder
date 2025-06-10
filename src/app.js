const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");


const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json());
app.use(cookieParser());

console.log("authRouter typeof:", typeof authRouter);       // should be 'function'
console.log("profileRouter typeof:", typeof profileRouter); // should be 'function'
console.log("requestRouter typeof:", typeof requestRouter); // should be 'function'

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
