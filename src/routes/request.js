const express = require('express');
const  {userAuth}  = require('../middlewares/auth');
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.get('/connection' , userAuth, async (req , res)=>{
 const user = req.user;
 console.log("sending connection request");
 res.send(user.firstName + "sent the connection request");

});


module.exports = requestRouter;