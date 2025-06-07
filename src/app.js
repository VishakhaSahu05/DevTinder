const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");

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

app.post("/login" , async (req , res)=>{
try{
const {emailId , password} = req.body;
const user = await User.findOne({emailId:emailId});
if(!user){
  throw new Error("Invalid credentials");
}
const validPassword = await bcrypt.compare(password , user.password);
if(!validPassword){
  throw new Error("Invalid credentials");
}else{
  res.send("login Successfully");
}

}
catch(err){
  res.status(404).send("Error : " +err.message);
}

});
app.post("/signup", async (req, res) => {
  console.log(req.body);
  

  try {

     //validation of data
       validateSignupData(req);
       const {firstName , LastName ,emailId ,password , age , gender , photoUrl} = req.body;



     //Encrypt the password 
       const passwordHash = await bcrypt.hash(password , 10);
       console.log(passwordHash);

       const user = new User({
        firstName,
        LastName,
        emailId,
        age,
        gender,
        photoUrl,
        password : passwordHash,

       });



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
