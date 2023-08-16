const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User")


router.get('/user/:id' , requireLogin ,(req , res)=>{
     
     const userid = req.params.id.replace(":" , "")
     const objectId = new mongoose.Types.ObjectId(userid);

      User.findById(objectId)
     .select("-password")
     .then(user=>{
         Post.find({postedBy:objectId})
         .populate("postedBy","_id name")
         .then(posts=>{
              res.json({user , posts})
         }).catch(err=>{
            return res.status(422).json({error: err})
         })
     }).catch(err=>{
        return res.status(404).json({error:err})
     })
})

router.put('/follow' , requireLogin, (req , res)=>{
     User.findByIdAndUpdate(req.body.followId , {
        $push:{followers:req.user._id}
     },{
      new:true
     })
   .then(result=>{ 
       User.findByIdAndUpdate(req.user._id , {
          $push:{following:req.body.followId}
       },{new:true}).select("-password")
       .then(result=>{
         res.json(result)
       }).catch(err=>{
          return res.status(422).json({error: err})
       })
      }).catch(err=>{
         return res.status(422).json({error:err})
      })
   })

router.put('/unfollow' , requireLogin, (req , res)=>{
   User.findByIdAndUpdate(req.body.unfollowId , {
      $pull:{followers:req.user._id}
   },{
    new:true
 })
 .then(result=>{ 
   User.findByIdAndUpdate(req.user._id , {
      $pull:{following:req.body.unfollowId}
   },{new:true}).select("-password")
   .then(result=>{
     res.json(result)
   }).catch(err=>{
      return res.status(422).json({error: err})
   })
  }).catch(err=>{
     return res.status(422).json({error:err})
  })
})

router.put('/updatepic' , requireLogin , (req , res)=>{
    User.findByIdAndUpdate(req.user._id , {$set: {pic: req.body.pic}} , {new:true})
    .select("-password")
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
      return res.status(422).json({error:err})
    })
})

module.exports = router