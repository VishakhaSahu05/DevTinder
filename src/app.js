const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());


app.post("/signup" , async(req , res)=>{
  console.log(req.body);
  const user = new User(req.body);


  try{
    await user.save();
      res.send("User Added Successfully!");
  }
  catch(err){
    console.log("Error saving  the user" +err.message)
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
