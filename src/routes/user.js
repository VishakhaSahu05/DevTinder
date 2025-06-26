const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "LastName",
      "about",
      "photoUrl",
      "skills",
    ]);
    return res.json({
      message: "Data fetched",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

const USER_SAFE_DATA = ["firstName", "LastName", "photoUrl", "age", "gender"];

userRouter.get("/request/connection", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser._id, status: "accepted" },
        { toUserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ data });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  console.log("/feed");
  try {
    const loggedInUser = req.user;
    console.log(req.user);
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50?50:limit;

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({data:user});
  } catch (err) {
    res.status(404).send("Error : " + err.message);
  }
});

module.exports = userRouter;
