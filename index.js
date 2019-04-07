var fs = require("fs")
var express = require("express")
var mongoose = require("mongoose")
var moment = require("moment")
var steem = require("steem")
var User = require("./schema.js")

var dbConnectinon = mongoose.connect("mongodb://127.0.0.1:2010/DB", { useNewUrlParser: true })

function addToBlacklist(username, reason, callback){
    User.find({username : username}, (err, res) => {
        if (res.length == 0){
            steem.api.getAccounts([username], function(errSTEEM, result) {
                if (result.length && !errSTEEM){
                        var toSave = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username : username,
                            reason: reason,
                            startDate : moment.utc()
                        })
                        toSave.save().then(() => {
                            callback(`Added ${username} to the blacklist.`)
                        })
                    } else {
                        callback(`User ${username} doesn't exist. Are you using steem usernames?`)
                }
            }) 
        } else {
            callback(`User ${username} already blacklisted.`)
        }
    })
}

function writeToTxtFile() {
    User.find({}, (err, res) => {
        var users = []
        for (i in res){
            var person = res[i].username.toLowerCase()
            users.push(person)
        }
        users.sort()
        var s = ``
        for (i in users){
            s = s + `${users[i]}\n`
        }
        fs.writeFile("blacklist.txt", s, function(err) {})
    })
}

setInterval( () => {
    writeToTxtFile()
},1000 * 60 * 15 )