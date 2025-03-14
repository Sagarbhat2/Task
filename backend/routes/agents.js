const mongoose=require("mongoose")
const { unique } = require("next/dist/build/utils")


const AgentSchema=mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    mobile: { 
        type: String, 
        required: true, 
        unique:true,
      },
    password:{
        type:String
    },
});

module.exports=mongoose.model("Agent",AgentSchema);