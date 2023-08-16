const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')


router.get('/allpost', requireLogin, (req , res)=>{
    Post.find()
    .populate("postedBy" , "_id name")
    .populate("comments.postedBy" , "_id name")
    .then(posts=>{
        res.status(200).json({posts})
    })
    .catch(err=>{console.log(err)})
})

router.get('/getsubpost', requireLogin, (req , res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy" , "_id name")
    .populate("comments.postedBy" , "_id name")
    .then(posts=>{
        res.status(200).json({posts})
    })
    .catch(err=>{console.log(err)})
})


router.post('/createpost' , requireLogin , (req , res)=>{
    const {title , body , pic} = req.body
    if(!title || !body , !pic){
        return res.status(422).json({error: "Please add all the fields"})
    }
    
    req.user.password = undefined
    const post = new Post({
         title,
         body,
         photo: pic,
         postedBy: req.user
    })

    post.save().then(result=>{
        res.status(200).json({post: result})
    })
    .catch(err=>{console.log(err)})
    
})

router.get('/mypost' , requireLogin , (req , res)=>{
    Post.find({postedBy: req.user._id})
    .populate("postedBy" , "_id name")
    .then(mypost=>{
        res.status(200).json({mypost})
    })
    .catch(err=>{console.log(err)})
})

router.put('/like' , requireLogin , (req , res)=>{
    Post.findByIdAndUpdate(req.body.postId , {
        $push:{likes:req.user._id}
    },{new:true})
    .populate("postedBy" , "_id name")
    .populate("comments.postedBy" , "_id name")
    .then(result=>{
        return res.status(200).json(result)
    }).catch(err=>{console.log(err)})
})


router.put('/unlike' , requireLogin , (req , res)=>{
    Post.findByIdAndUpdate(req.body.postId , {
        $pull:{likes:req.user._id}
    },{new:true})
    .populate("postedBy" , "_id name")
    .populate("comments.postedBy" , "_id name")
    .then(result=>{
        return res.status(200).json(result)
    }).catch(err=>{console.log(err)})
})

router.put('/comment' , requireLogin , (req , res)=>{
    const comment = {
        text: req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId , {
        $push:{comments:comment}
    },{new:true})
    .populate("comments.postedBy" , "_id name")
    .populate("postedBy" , "_id name")
    .then(result=>{
        return res.status(200).json(result)
    }).catch(err=>{console.log(err)})
})

router.delete('/deletepost/:postId' , requireLogin , (req , res)=>{
    Post.findByIdAndRemove({_id: req.params.postId})
    .populate("postedBy" , "_id")
    .then(post=>{
        return res.status(200).json(post)
    }).catch(err=>{console.log(err)})
})






module.exports = router