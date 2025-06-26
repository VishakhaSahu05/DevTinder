const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User", //refrence to the userCollection
      required : true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
    },

    status: {
      type: String,
      enum: {
        values: ["ignore", "accepted", "rejected", "interested"],
        message: "{VALUE} is incorrect  status type",
      },
    },
  },
  {
    timestamps: true,
  }
);
connectionRequestSchema.index({fromUserId:1 , toUserId:1});
connectionRequestSchema.pre("save" , function(next){
    const connectionRequest = this;
    //check if the  fromUserId is  same as userId
    if(
      connectionRequest.fromUserId &&
      connectionRequest.toUserId &&
      connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request  to yourself");
    }
    next();
});

const connectionRequest = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequest;
