const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/valueKeys");
const requireLogin = require("../middleware/requireLogin");

router.get("/", (req, res) => {
    res.send("Hello World");
})


router.post("/signup", (req, res) => {
    const { name, email, password, profilepic } = req.body;

    if (!email || !password || !name) {
        res.status(422).json({ error: "Enter all the details" })
    }

    User.findOne({ email: email }).then((savedUser => {

        if (savedUser) {
            return res.status(422).json({ error: "Email id already exist" })
        }
        bcrypt.hash(password, 12).then(hashedpassword => {
            const user = new User({
                email, password: hashedpassword, name, profilepic
            })

            user.save().then(user => {
                res.json({ message: "Your Account is created" })
            }).catch(err => {
                console.log(err);
            })
        });


    })).catch(err => {
        console.log(err);
    })
    // res.json({message:"Your Account is created"})
    //     console.log(req.body.name);
})

router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({ error: "Enter all the details" })
    }
    User.findOne({ email: email }).then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email or password" })
        }
        bcrypt.compare(password, savedUser.password).then(doMatch => {
            if (doMatch) {
                // res.json({message:"Successfully signed in"})
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET_KEY);
                const {_id,name,email,followers,following,profilepic} = savedUser
                res.json({ token, user:{
                    _id,name,email,followers,following,profilepic
                } });
            } else {
                res.status(422).json({ error: "Invalid email or password" })
            }
        }).catch(err => {
            console.log(err);
        })
    })
})

router.get("/protected", requireLogin, (req, res) => {
    res.send("Hello User")
})

module.exports = router