const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

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
    console.log(loggedInuser);

    Object.keys(req.body).forEach((key) => {
      loggedInuser[key] = req.body[key];
    });

   loggedInuser.save();
    res.send("edit successfull");
  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});

module.exports = profileRouter;
