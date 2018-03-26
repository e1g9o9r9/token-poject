const router = require('express').Router();

const User = require('./userModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

router.post('/register', function(req, res, next){
    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        permission: "user"
    });
    User.addOrUpdateUser(newUser, function(err, user){
        if(err){
            res.json({
                success: false, msg: "Failed to register user"
            });
        }
        else{
            res.json({
                success: true, msg: "User registered"
            })
        }
    });
});

router.post('/authenticate', function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUserName(username, function(err, user){
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({_id: user._id}, config.secret, {
                    expiresIn: 60*24*10 // ten days
                });
                res.json({
                    success: true,
                    token: 'Bearer '+ token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        permission: user.permission
                    }

                });
            }
            else {
               return res.json({success: false, msg: 'Wrong password'});
            }
        })
    })
});
//
router.get('/profile', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    res.json({user: req.user});
});

router.post('/delete', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    //res.json({user: req.user});
    User.getUserByUserName(req.user.username, function(err, deletedUser){
        console.log(deletedUser);
        deletedUser.remove(function (err, removed) {
            if(err){
                next(err);
            }
            else{
                res.json(removed);
            }
        });
    });
});

router.post('/update', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    User.getUserByUserName(req.user.username, function(err, updatedUser){
        console.log("req");
        console.log(req.body.username);
        updatedUser._id = req.user._id;
        updatedUser.name = req.body.name;
        updatedUser.username = req.body.username;
        updatedUser.password = req.body.password;
        updatedUser.permission = req.user.permission;
        updatedUser.email = req.body.email;
        User.addOrUpdateUser(updatedUser, function(err, user){
            if(err){
                res.json({
                    success: false, msg: "Failed to update user"
                });
            }
            else{
                res.json({
                    success: true, msg: "User updated"
                })
            }
        });
    });
});

router.get('/getAllUsers', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    if(req.user.permission === "admin"){
        User.find({})
            .then(function (users)
            {
                res.json(users);

            }, function (err) {
                next(err)
            });
    } else{
        res.json({
            success: false, msg: "You do not have a permission"
        })
    }
});

    // router.get('/validate', function(req, res, next){
//     res.send('VALIDATE');
// });

module.exports = router;