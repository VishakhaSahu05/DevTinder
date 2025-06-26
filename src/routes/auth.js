const express = require("express");
const authRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validateSignupData } = require("../utils/validation");

authRouter.post("/login", async (req, res) => {
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
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          id: user._id,
          firstName: user.firstName,
          LastName: user.LastName,
          emailId: user.emailId,
          age: user.age,
          gender: user.gender,
          photoUrl: user.photoUrl,
          about: user.about,
          skill: user.skills,
        },
      });
    }
  } catch (err) {
    res.status(404).send("Error : " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
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

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 360000),
    });
    res.status(200).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        LastName: user.LastName,
        emailId: user.emailId,
        age: user.age,
        gender: user.gender,
        photoUrl: user.photoUrl,
        about: user.about,
        skill: user.skills,
      },
    });
  } catch (err) {
    res.status(400).send("Error saving  the user" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("LogOut Successfully");
});

module.exports = authRouter;
