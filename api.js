var router = require('express').Router();

//router.use('/action', require('./Api/Action/ActionRoutes'));
router.use('/user', require('./api/user/userController'));
module.exports = router;