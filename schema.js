var mongoose = require('mongoose');

var blacklistedUser = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : String,
    reason: String,
    startDate : String
})


module.exports = mongoose.model("BlacklistedUser", blacklistedUser)