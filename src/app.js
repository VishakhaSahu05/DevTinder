const express = require("express");

const app = express();

app.get("/",(req,res)=>{
    res.send("  Namaste from dashboard");
});
app.get("/test",(req,res)=>{
    res.send("Hello from server");
});
app.get("/hello" ,(req ,res)=>{
    res.send("hello , hello , hello");
})

app.listen(3000 ,()=>{
  console.log("Server called successfully");
});


