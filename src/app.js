const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");

app.post("/signup" , async(req , res)=>{
  const user = new User({
    firstName : "Vivan",
    LastName  : "vatsal",
    emailId   : "vatsalvivan756@gmail.com",
    password  : "vivan@123",
    age : 21,
    gender : "male",
    
  });
  try{
    await user.save();
      res.send("User Added Successfully!");
  }
  catch(err){
    res.status(400).send("Error saving  the user" +err.message);

  }

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
