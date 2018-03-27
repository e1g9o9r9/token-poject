const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');
const dateFormat = require('dateformat');

const MessageModel = mongoose.Schema({
    //who send the message
    username: {
        type: String
    },
    msg: {
        type: String
    },
    created: {
        type: String,
        required: true
    }
});

const Msg = module.exports = mongoose.model('message',MessageModel);

module.exports.getMessageById = function(id, callback){
    const query = {_id: id};
    Msg.findOne(query, callback);
};

module.exports.getMessagesByUserName = function(username, callback){
    const query = {username: username};
    Msg.find(query, callback);
};

module.exports.addMessage = function(newMsg, callback){
    newMsg.save(callback);
};

