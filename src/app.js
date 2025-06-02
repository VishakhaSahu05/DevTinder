
const express = require("express");
const app = express();


app.get("/admin/getAllData",(req , res)=>{
    throw new Error("dhwshjb");
//res.send("All Data Sent");
  
});
app.use("/" ,(err, req , res , next)=>{
if(err){
    res.status(500).send("Something went wrong!");
}
});
app.listen(5000 ,()=>{
  console.log("Server called successfully");
});


