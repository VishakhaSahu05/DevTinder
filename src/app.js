const express = require("express");

const app = express();

app.
get("/ab?c",(req , res)=>{
  //console.log(req.params);
  res.send("abc");
});




app.listen(5000 ,()=>{
  console.log("Server called successfully");
});


