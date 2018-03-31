const router = require('express').Router();

const User = require('./userModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');
const dateFormat = require('dateformat');

router.post('/register', function(req, res, next){
    const date = dateFormat(new Date());
    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        created: date,
        modified: date,
        permission: "user"
    });
    User.addUserOrChangePassword(newUser, function(err, user){
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
                        permission: user.permission,
                        created: user.created,
                        modified: user.modified
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
    var user;
    if(req.user.permission == "admin"){
        user = req.body;
    } else {
        user = req.user;
    }
    User.getUserByUserName(user.username, function (err, deletedUser) {
        if(err) throw err;
        if(!deletedUser){
            return res.json({success: false, msg: 'User not found'});
        }
        else {
            deletedUser.remove(function (err, removed) {
                if (err) {
                    res.json({
                        success: false, msg: "Failed to delete user"
                    });
                }
                else {
                    res.json({
                        success: true, msg: "User has been deleted", user: removed
                    })
                }
            });
        }
    });
});

router.post('/update', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    User.getUserByUserName(req.user.username, function(err, updatedUser){
        if(err) throw err;
        if(!updatedUser){
            return res.json({success: false, msg: 'User not found'});
        }
        updatedUser.name = req.body.name;
        updatedUser.username = req.body.username;
        updatedUser.email = req.body.email;
        updatedUser.modified = dateFormat(new Date());
        updatedUser.save(updatedUser, function(err, user){
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

router.post('/changePassword', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    User.getUserByUserName(req.user.username, function(err, updatedUser){
        if(err) throw err;
        if(!updatedUser){
            return res.json({success: false, msg: 'User not found'});
        }
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        User.comparePassword(oldPassword, updatedUser.password, function(err, isMatch){
            if(err) throw err;
            updatedUser.password = newPassword;
            if(isMatch){
                User.addUserOrChangePassword(updatedUser, function(err, user){
                    if(err){
                        res.json({
                            success: false, msg: "Failed to change password"
                        });
                    }
                    else{
                        res.json({
                            success: true, msg: "The password has been changed"
                        })
                    }
                });
            }
            else {
                res.json({success: false, msg: 'Wrong password'});
            }
        })
    });
});

router.get('/getAllUsers', passport.authenticate('jwt', {session: false}) ,function(req, res, next){
    if(req.user.permission === "admin"){
        User.find({})
            .then(function (users)
            {
                res.json({
                    success: true, msg: "Users were sent", users: users
                });

            }, function (err) {
                next(err)
            });
    } else{
        res.json({
            success: false, msg: "You do not have a permission"
        })
    }
});


router.get('/:username', passport.authenticate('jwt', {session: false}), function(req, res, next){
    if(req.user.permission === "admin"){
        User.getUserByUserName(req.params.username, function (err, expectedUser){
            if(err) throw err;
            if(!expectedUser){
                res.json({success: false, msg: 'User not found'});
            }
            else{
                res.json({
                    success: true, user: expectedUser
                });
            }
        });
    }
    else {
        res.json({
            success: true, msg: 'You do not have a permission'
        });
    }
} );

module.exports = router;