const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')


router.get('/protected' , (req , res) => {
      res.send("Hello world")
})

router.post('/signup' , (req , res) => {
     const {name , email , password , pic} = req.body
     if(!name || !email || !password){
        return res.status(422).json({error : "Please fill require fields"})
     }
     User.findOne({email:email})
     .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error: "User already exist with that email"})
        }
        bcrypt.hash(password , 10)
        .then((hashPassword)=>{
            const user  = new User({
                name,
                email,
                password: hashPassword,
                pic
           })
   
           user.save()
           .then(user=>{res.status(200).json({message:"saved successfully"})})
           .catch(error=>{console.log(error)})
           })
        })
        
     .catch(error=>{console.log(error)})
     })



router.post('/signin' , (req , res)=>{
    const {email , password} = req.body
    if(!email || !password){
         return res.status(422).json({error: "please add email or password"})
    }

    User.findOne({email: email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password , savedUser.password)
        .then((match)=>{
            if(match){
                const token = jwt.sign({_id: savedUser._id} , JWT_SECRET)
                const {_id , name , email , followers , following , pic} = savedUser
                return res.status(200).json({user:{_id , name , email , followers , following , pic} , token})
            }
            return res.status(422).json({error: "Invalid email or password"})
        })
        .catch(error=>{console.log(error)})
    })
   
})



module.exports = router