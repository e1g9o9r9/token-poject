const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    permission: {
        type: String
    },
    created: {
        type: String
    },
    modified: {
        type: String
    }
});

const User = module.exports = mongoose.model('users',UserSchema);

module.exports.getUserById = function(id, callback){
    const query = {_id: id};
    User.findOne(query, callback);
};

module.exports.getUserByUserName = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
};

module.exports.hashPassword = function (user) {
    bcrypt.genSalt(10, function(err, salt){
        console.log(newUser.password);
        bcrypt.hash(newUser.password, salt,  function(err, hash){
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.addUserOrChangePassword = function(newUser, callback){
     bcrypt.genSalt(10, function(err, salt){
         console.log(newUser.password);
         bcrypt.hash(newUser.password, salt,  function(err, hash){
             if(err) throw err;
             newUser.password = hash;
             newUser.save(callback);
         });
     });
};


module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    })
};