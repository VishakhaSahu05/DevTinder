const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());


app.patch("/user/:userId" , async(req,res)=>{
   const userId = req.params?.userId;
   const data = req.body;
   try{
    const  AllowedUpdate = ["photourl" , "about" , "password" , "age" , "gender" , "skills" , "firstName" , "LastName"];
    const  isUpdatedAllowed = Object.keys(data).every((k)=>
    AllowedUpdate.includes(k)
  );
  if(!isUpdatedAllowed){
    throw new Error ("Update not Allowed");
  }
  if(data.skills.length>5){
    throw new Error("Skills cannot be more than 5");
  }
    const user = await User.findByIdAndUpdate( userId,data, 
      {returnDocument :'before',
       runValidators : true,
   });
    console.log(user);
    res.send("Data updated Successfully");
   }
   catch(err){
    res.status(404).send("Update failed : " + err.message);
   }
});


app.delete("/user" , async (req, res)=>{
  const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete({_id:userId});
    res.send("User deleted Successfully");
  }
  catch(err){
    res.status(404).send("Something went wrong");
  }
});


app.get("/feed",async(req,res)=>{
try{
  const users = await User.find({});
  res.send(users);
}
catch(err){
   res.status(404).send("Something went wrong");
}
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving  the user" + err.message);
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
