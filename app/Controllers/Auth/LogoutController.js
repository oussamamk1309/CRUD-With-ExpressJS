const { response } = require('express');
const express = require('express');
var passwordHash = require('password-hash');
const User = require('../../Models/User');

var session = require('express-session');
var cookieParser = require('cookie-parser');

exports.logout = function(req, res){
    res.send("Logged out!")
    //res.redirect('/signin');
}
