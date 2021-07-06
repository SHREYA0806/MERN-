const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require("./config/valueKeys")
const PORT = process.env.PORT  || 5000;



mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


mongoose.connection.on('connected', () => {
    console.log("We are connected to server i.e mongoDB");
})
mongoose.connection.on('error', () => {
    console.log("We are not connected to server i.e mongoDB");
})

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require('./routes/authen.js'));
app.use(require('./routes/post.js'));
app.use(require('./routes/user.js'));

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () => {
    console.log("Server is runing at ", PORT);
})
