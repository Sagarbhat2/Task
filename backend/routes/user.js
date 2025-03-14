const mongoose=require("mongoose");
const { unique } = require("next/dist/build/utils");

mongoose.connect("mongodb://127.0.0.1:27017/Taska");


const userSchema=mongoose.Schema({
    name:{
        type:String  
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }
});

module.exports=mongoose.model("User",userSchema)