const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { route, post } = require("./authen");
const Post = mongoose.model("Post")

router.get('/allpost',requireLogin, (req, res) => {

    Post.find()
        .populate("postedby", "_id name")
        .populate("coments.postedby","_id name")
        .then(posts => {
            res.json(posts)
        }).catch(err => {
            console.log(err)
        })
})

router.get('/getfollowingpost',requireLogin, (req, res) => {
    //if postedby in following

    Post.find({postedby:{$in:req.user.following}})
        .populate("postedby", "_id name")
        .populate("coments.postedby","_id name")
        .then(posts => {
            res.json(posts)
        }).catch(err => {
            console.log(err)
        })
})

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body,pic } = req.body;

    if (!title || !body ||!pic)  {
        res.status(422).json({ error: "Enter all the fields" })
    }
    req.user.password = undefined;
    console.log(req.user)
    const post = new Post({
        title,
        body,
        postedby:req.user,
        photo:pic
    })

    post.save().then(result => {
        res.json({ post: result })
    }).catch(err => {
        console.log(err);
    })

})

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedby: req.user._id })
        .populate("postedby", "_id name")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("coments.postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("coments.postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/coment',requireLogin,(req,res)=>{
    const coment ={
        text:req.body.text,
        postedby: req.user
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{coments:coment}
    },{
        new:true
    })
    .populate("coments.postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
        .populate("postedby","_id")
        .exec((err,post)=>{
            if(err||!post){
                return res.status(422).json({error:err})
            }
            

            if(post.postedby._id.toString() === req.user._id.toString()){
                post.remove()
                .then(result=>{res.json(result)})
                .catch(err=>{console.log(err)})
            }
        })
})


module.exports = router