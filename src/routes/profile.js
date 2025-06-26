const express = require("express");
const profileRouter = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData , validatePassword} = require("../utils/validation");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInuser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInuser[key] = req.body[key];
    });

    await loggedInuser.save();

    res.send({
      message: "Edit successful",
      data: loggedInuser, // return updated user
    });
  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});


profileRouter.patch("/forgotPassword", userAuth, async (req, res) => {
  try {
    if (!validatePassword(req)) {
      throw new Error("Please enter strong Password");
    }
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    await User.findByIdAndUpdate(req.user._id, { password: passwordHash });
    res.status(200).send("Password updated successfully");
  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});

module.exports = profileRouter;
