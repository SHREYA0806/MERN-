const { text } = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true

    },
    coments:[
        {
            text:String,
            postedby:{
                type:ObjectId,
                ref:"User"
            }
        }
    ],
        
    likes:[{
        type:ObjectId,
        ref:"User"
        }
    ],
    postedby: {
        type: ObjectId,
        ref: "User"
    }//id of user who uploaded the post
})

mongoose.model("Post", postSchema)