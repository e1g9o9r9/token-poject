const router = require('express').Router();

const Msg = require('./messageModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');
const dateFormat = require('dateformat');

router.post('/addMsg', passport.authenticate('jwt', {session: false}) , function(req, res, next){
    var newMsg = new Msg({
        username: req.user.username,
        msg: req.body.msg,
        created: dateFormat(new Date())
    });
    Msg.addMessage(newMsg, function(err, user){
        if(err){
            res.json({
                success: false, msg: "Failed to add a message"
            });
        }
        else{
            res.json({
                success: true, msg: "The message has been added"
            })
        }
    });
});

//get all messages of spesific user
router.get('/getUserMsg', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    Msg.getMessagesByUserName(req.user.username, function (err, messages) {
        if(messages == undefined){
            res.json({
                success: false, msg: "Messages have not been found"
            });
        } else{
            res.json({
                success: true, messages: messages
            })
        }
    });
});
//delete all messages of a user
router.get('/deleteAll', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    var arrayOfMessagesId = [];
    Msg.getMessagesByUserName(req.user.username, function (err, messages) {
        if(messages == undefined){
            res.json({
                success: false, msg: "Messages have not been found"
            });
        } else{
            for(i in messages){
                messages[i].remove(function (err, removed) {
                    if (err) {
                        res.json({
                            success: false, msg: "Failed to delete message"
                        });
                        return false;
                    }
                });
            }
            res.json({
                success: true, msg: "All messages were deleted"
            })
            console.log(arrayOfMessagesId);
        }
    });
});


router.post('/deleteOneMsg', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    Msg.getMessageById(req.body._id, function (err, deletedMessage) {
        if(deletedMessage == null){
            res.json({
                success: false, msg: "Message has not been found"
            });
        }
        else {
            deletedMessage.remove(function (err, removed) {
                if (err) {
                    res.json({
                        success: false, msg: "Failed to delete message"
                    });
                }
                else {
                    res.json({
                        success: true, msg: "Message has been deleted"
                    })
                }
            });
        }
    });
});
//
// router.post('/update', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
//     User.getUserByUserName(req.user.username, function(err, updatedUser){
//         updatedUser._id = req.user._id;
//         updatedUser.name = req.body.name;
//         updatedUser.username = req.body.username;
//         updatedUser.password = req.body.password;
//         updatedUser.permission = req.user.permission;
//         updatedUser.email = req.body.email;
//         User.addOrUpdateUser(updatedUser, function(err, user){
//             if(err){
//                 res.json({
//                     success: false, msg: "Failed to update user"
//                 });
//             }
//             else{
//                 res.json({
//                     success: true, msg: "User updated"
//                 })
//             }
//         });
//     });
// });
//
// router.get('/getAllUsers', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
//     if(req.user.permission === "admin"){
//         User.find({})
//             .then(function (users)
//             {
//                 res.json({
//                     success: true, msg: "Users were sent", users: users
//                 });
//
//             }, function (err) {
//                 next(err)
//             });
//     } else{
//         res.json({
//             success: false, msg: "You do not have a permission"
//         })
//     }
// });

// router.get('/validate', function(req, res, next){
//     res.send('VALIDATE');
// });

module.exports = router;