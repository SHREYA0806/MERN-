const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    
    followers: [{
        type:ObjectId,
        ref:"User"
    }],

    following: [{
        type:ObjectId,
        ref:"User"
    }],

    profilepic:[{
        type:String,
        default:"https://res.cloudinary.com/shreyacloud/image/upload/v1625400027/download_wjmh2p.jpg"
    }]

})

module.exports = mongoose.model("User",userSchema);