/*
    Module dependecies.
*/
var express = require('express');
var app = require('express')();
var server  = require('http').createServer(app);
var path = require('path')
var router = require('./router.js')
var config  = require('./config').values;
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
 
var session = require('express-session');
let sessionOptions = {
  secret: '2C44-4D44-WppQ38S',
  cookie: {
    maxAge:269999999999
  },
  saveUninitialized: true,
  resave:true
};

app.use(fileUpload());
app.use( express.static( "public" ) );
app.use("/company_logo", express.static(path.join(__dirname, 'company_logo')));
app.use("/lectures", express.static(path.join(__dirname, 'lectures')));
app.use("/profile_picture", express.static(path.join(__dirname, 'profile_picture')));
app.use("/advertisements", express.static(path.join(__dirname, 'advertisements')));

app.use(session(sessionOptions));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

server.listen(config.port);

router.setup(app);

console.log("Express server listening on port %d", 
config.port);