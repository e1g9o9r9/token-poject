const express = require('express');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const api = require('./api');
const app = express();
const port = process.env.PORT || 3200;

require('./middleware/appMiddleware')(app);
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

mongoose.Promise = global.Promise;
mongoose.connect(config.database);
mongoose.connection.on('connected', function(){
    console.log('Connected to database ', config.database);
});
mongoose.connection.on('error', function(err){
    console.log('DATABASE AN ERROR ', config.database);
});

//To get server data
app.use('/api', api);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res){
//     res.send("Invalid Endpoint");
// });

//The rest urls that dont relates to server data
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(port, function(){
    console.log("Server started on port " + port);
});



