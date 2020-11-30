const { response } = require('express');
const express = require('express');
var passwordHash = require('password-hash');
const User = require('../../Models/User');

var session = require('express-session');
var cookieParser = require('cookie-parser');

const config = require("./../../../config/auth.config");

var jwt = require("jsonwebtoken");

exports.signinForm = function(req, res){
    res.render('auth/signin');
}

exports.signin = function(req, res) {
    var user = req.body;
    var resultExec = verifyForm(user);
    if(resultExec == true){
        User.findOne({ email: user.email }, function(err, userRes){
            if(userRes){
                resultVerif = verifyPassword(user, user.password, userRes.password);
                if(resultVerif == true){
                    
                    jwt.sign({user}, config.secret, { expiresIn: 60 },(err, token) => {
                        if(err) { console.log(err) }    
                         res.redirect('/dashboard');
                    });  
                    res.send("All is correct!");

                }else{
                    res.render('auth/signin', resultVerif);
                }
            }else{
                resultRes = verifyEmail(user);
                res.render('auth/signin', resultRes);
            }
        }).lean();
    }else{
        res.render('auth/signin', resultExec);
    }
}

function verifyForm(user){
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if(emailRegexp.test(user.email) == false){
        return {
            data: user,
            error: true,
            message: "Email is invalid!",
            email_error: true
        };
    }else if((user.password.length < 8) || (user.password.length > 25)){
        return {
            data: user,
            error: true,
            message: "Password is invalid, (8-25 characters)!",
            pwd_error: true
        };
    }else{
        return true;
    }
}
function verifyEmail(user){
    return {
        data: user,
        error: true,
        message: "There is no account with this email!",
        email_error: true
    };
}
function verifyPassword(user, pwd, o_pwd){
    if(passwordHash.verify(pwd, o_pwd) == true){
        return true;
    }else{
        return {
            data: user,
            error: true,
            message: "Password is incorrect!",
            pwd_error: true
        };
    }
}
