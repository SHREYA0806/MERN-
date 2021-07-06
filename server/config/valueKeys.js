// module.exports = {
//     MONGOURI: "mongodb+srv://Shreya_Tiwari:YiUkSBcJ47iqoALB@cluster0.rgqw5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
//     JWT_SECRET_KEY: "hihdnjdnfjnjdjfjd"
// }

if(process.env.NODE_ENV == 'production'){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}