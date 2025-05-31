const express = require("express");

const app = express();

app.get("/user" ,(req , res)=>{
  res.send("server is working");
});
app.post("/user" , (req,res)=>{
  res.send("data is posted successfully!");
});
app.delete("/user" ,(req , res)=>{
    res.send("deleted successfully!");
});
app.use("/user" ,(req ,res)=>{
    res.send("hello , hello , hello");
});


app.listen(3000 ,()=>{
  console.log("Server called successfully");
});


