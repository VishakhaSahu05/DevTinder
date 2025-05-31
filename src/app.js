const express = require("express");

const app = express();

app.get("/user",(req , res , next)=>{
  //console.log("Hello Server");
  //res.send("abc");
  next();
});
app.get("/user",(req , res , next)=>{
    //res.send("hello");
    next();
  
});
app.get("/user",(req , res , next)=>{
    
    res.send("hello2");
    next();
  
});
app.get("/user",(req , res , next)=>{
    //res.send("hello");
    next();
  
});





app.listen(5000 ,()=>{
  console.log("Server called successfully");
});


