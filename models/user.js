const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
     name:{
        type: String,
        required: true
     },
     email:{
        type: String,
        required: true
     },
     password:{
        type: String,
        required: true
     },
     pic:{
      type: String,
      default: "https://t4.ftcdn.net/jpg/00/97/00/09/360_F_97000908_wwH2goIihwrMoeV9QF3BW6HtpsVFaNVM.jpg"
     },
     followers:[{type: ObjectId , ref:"User"}],
     following:[{type: ObjectId , ref:"User"}]
})

mongoose.model("User" , userSchema)