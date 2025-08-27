const express = require("express"); 
const {Chat} = require("../models/chat");
const {userAuth} = require("../middlewares/auth");
const chatRouter = express.Router();
const mongoose = require("mongoose");
chatRouter.get("/:targetUserId" , userAuth , async (req, res) => {
    const targetUserId =  new mongoose.Types.ObjectId(req.params.targetUserId.trim());
    const userId = req.user._id

    try{
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }  ,

        }).populate({
            path : "messages.senderId",
            select : "firstName LastName",
        });
        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages : [],
            });
            await chat.save();
        }
        res.json(chat);

    }catch(err){
        console.error(err);

    }
});
module.exports = chatRouter;