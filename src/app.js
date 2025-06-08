const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      throw new Error("Invalid credentials");
    } else {
      //create JWT token
      const token = await user.getJWT();
      console.log(token);

      //Add cookie to the token and send the respose back to the user
      res.cookie("token", token ,{
        expires:new Date(Date.now()+8*3600000),
      });

      res.send("login Successfully");
    }
  } catch (err) {
    res.status(404).send("Error : " + err.message);
  }
});
app.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    //validation of data
    validateSignupData(req);
    const { firstName, LastName, emailId, password, age, gender, photoUrl } =
      req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      LastName,
      emailId,
      age,
      gender,
      photoUrl,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving  the user" + err.message);
  }
});

app.post("/sendConnectionRequest" , userAuth, async(req , res)=>{
 const user = req.user;
 console.log("sending connection request");
 res.send(user.firstName + "sent the connection request");

});
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(5000, () => {
      console.log("Server called successfully listening on port 5000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected", err);
  });
