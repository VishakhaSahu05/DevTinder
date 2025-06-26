const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "gender", "age"];

// ✅ Get all accepted connections
requestRouter.get("/request/connections", userAuth, async (req, res) => {
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

    const data = connectionRequests.map((row) =>
      row.fromUserId._id.toString() === loggedUser._id.toString()
        ? row.toUserId
        : row.fromUserId
    );

    res.json({ data });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ✅ Send a connection request (interested / ignored)
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId.trim();
    const status = req.params.status.trim();

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type: " + status });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingConnectionRequest) {
      return res.status(409).json({ message: "Connection already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: `${req.user.firstName} ${status} in ${toUser.firstName}`,
      data,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ✅ Review a connection request (accept / reject)
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const { status, requestId } = req.params;
    const cleanRequestId = requestId.trim();

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: cleanRequestId,
      toUserId: loggedUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    return res.status(200).json({
      message: "Status updated successfully",
      data,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
