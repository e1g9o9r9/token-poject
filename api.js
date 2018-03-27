var router = require('express').Router();

//router.use('/action', require('./Api/Action/ActionRoutes'));
router.use('/user', require('./api/user/userController'));
router.use('/message', require('./api/messages/messageController'));
module.exports = router;