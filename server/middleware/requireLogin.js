const jwt = require("jsonwebtoken")
const { JWT_SECRET_KEY } = require("../config/valueKeys");
const moongose = require('mongoose')

const user = moongose.model("User");
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ 'error': "You must be logged in" });
    }

    const token = authorization.replace("Bearer", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ 'error': "You must be logged in" });
        }
        const { _id } = payload
        user.findById(_id).then(userdata => {
            req.user = userdata;
            next()
        })

    });
}