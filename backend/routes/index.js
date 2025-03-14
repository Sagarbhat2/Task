const express=require("express")
const app=express()
const mongoose = require("mongoose");
const userModel = require("./user");
const agentModel = require("./agents");
const Taskmodel=require("./task")
const bcrypt = require("bcrypt");
const cors=require("cors")
const jwt=require("jsonwebtoken")
const upload = require("./multer");
const xlsx = require("xlsx");
const fs = require("fs");
const uploadRoutes = require("./multer"); 
app.use("/", uploadRoutes);


const dotenv=require("dotenv")
dotenv.config();


app.use(express.json());  
app.use(cors({ origin: "http://localhost:3000", credentials: true })); 


app.get("/",function(req,res){
    res.send("hello sagar")
})



app.post("/register",async function(req,res){
    let {name,email,password}=req.body;
    let userdata=new userModel({name,email})
    const hashedPassword = await bcrypt.hash(password, 10);
    userdata.password = hashedPassword;
    await userdata.save();
    // res.status(500).json({message:"regestered sucessfull"})
    let token=jwt.sign({userid:userdata._id},process.env.JWT_SECRET,{expiresIn:"1h"})
    res.json({ token, message: "Register successful!" });
});




app.post("/login",async function(req,res){
    try{
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(!user){
        return res.status(401).json({message:"user not found"})
    }
    const matchpass=await bcrypt.compare(password,user.password);
    if(!matchpass){
        return res.status(401).json({message:"password worng"})
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    let token=jwt.sign({userid:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
    res.json({ token, message: "Login successful!" });
} catch (error) {
  console.error("Login Error:", error);
  res.status(500).json({ message: "Server error" });
}
});



app.post("/agent",async function(req,res){
    const {name,email,mobile,password}=req.body;
    if(!name || !email || !mobile ||!password ){
        return res.status(401).json({message:"All fileds should be entered"})
    }
    let findagent=await agentModel.findOne({email});
    if(findagent){
        return res.status(401).json({message:"The Agent already exits"})
    }
    const agent=new agentModel({name,email,mobile});
    const hashedPassword = await bcrypt.hash(password, 10);
    agent.password = hashedPassword;
    await agent.save();
    res.status(200).json({message:"Agent stored sucessfully"})


});



app.get("/tasks", async (req, res) => {
    try {
      const tasks = await Taskmodel.find().populate("assignedAgent", "name email");
      
      console.log(" Retrieved Tasks:", tasks);
      
      res.status(200).json(tasks);
    } catch (error) {
      console.error(" Error Fetching Tasks:", error);
      res.status(500).json({ message: "Error fetching tasks" });
    }
  });




//   app.get("/tasks", async (req, res) => {
//     try {
//       const tasks = await agentModel.find().populate("agentId", "name email");
//       res.status(200).json(tasks);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching tasks" });
//     }
//   });
  



app.listen(5000)