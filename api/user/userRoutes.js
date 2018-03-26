var router = require('express').Router();
const controller = require('./userController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//router.get('/profile', require('./userController').me);
// router.post('/authenticate', controller.authenticate);
// router.post('/register',controller.register);
// router.post('/delete',passport.authenticate('jwt', {session: false}),controller.delete);
// router.post('/update', passport.authenticate('jwt', {session: false}), controller.update);
// router.get('/getAllUsers', passport.authenticate('jwt', {session: false}), controller.getAllUsers);





module.exports = router;