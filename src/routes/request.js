const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.get(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId.trim();
      const status = req.params.status.trim();

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status type " + status });
      }
      //if there is any existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(404).json({message : "User not found"});
      }
      if (existingConnectionRequest) {
        return res.status(404).send({ message: "Connection Already Exists" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + status + "in" + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(404).send("Error" + err.message);
    }
  }
);

module.exports = requestRouter;
