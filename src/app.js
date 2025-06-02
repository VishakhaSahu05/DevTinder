
const express = require("express");
const app = express();


const {adminAuth , userAuth} = require("./middleware/auth");

app.use("/admin" , adminAuth);


app.get("/admin/getAllData",(req , res , next)=>{
    res.send("All Data Sent");
  
});
app.post("/user/login",(req , res)=>{
    res.send("Uset Data Sent");
  
});
app.get("/user/info", userAuth,(req , res)=>{
    res.send("All Data is OK");
  
});
app.get("/admin/deleteUser",(req , res)=>{
    res.send("Deleted a user");
});
app.listen(5000 ,()=>{
  console.log("Server called successfully");
});


