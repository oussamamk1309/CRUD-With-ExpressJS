const { response } = require('express');
const express = require('express');
var passwordHash = require('password-hash');
const User = require('../../Models/User');

var session = require('express-session');
var cookieParser = require('cookie-parser');

exports.signupForm = function(req, res){
    res.render('auth/signup');
}

exports.signup = function(req, res) {
    var user = req.body;
    var resultExec = verifyForm(user);
    if(resultExec == true){
        var hashedPassword = passwordHash.generate(user.password);
        var isHashed = passwordHash.verify(user.password, hashedPassword);
        User.findOne({ email: user.email }, function(err, userRes){
            if(userRes){
                var resulrAcc = verifyAcc(user);
                res.render('auth/signup', resulrAcc);
            }else{
                var newUser = new User({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    password: hashedPassword,
                    status: "ACTIVE",
                    usertype: "USER",
                    created_at: Date.now(),
                    updated_at: null,
                    deleted_at: null
                });
                newUser.save(function(err, User){
                    if(err){
                        res.send('Error, please try later');
                    }else{

                        res.redirect('/signup');
                    }
                });
            }
        }).lean();
    }else{
        res.render('auth/signup', resultExec);
    }
}

function verifyForm(user){
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if((user.firstname.length < 3) || (user.firstname.length > 25)){
        return {
            data: user,
            error: true,
            message: "Firstname is invalid, (3-25 characters)!",
            ftname_error: true
        }
    }else if((user.lastname.length < 3) || (user.lastname.length > 25)){
        return {
            data: user,
            error: true,
            message: "Lastname is invalid, (3-25 characters)!",
            ltname_error: true
        }
    }else if(emailRegexp.test(user.email) == false){
        return {
            data: user,
            error: true,
            message: "Email is invalid!",
            email_error: true
        }
    }else if((user.password.length < 8) || (user.password.length > 25)){
        return {
            data: user,
            error: true,
            message: "Password is invalid, (8-25 characters)!",
            pwd_error: true
        }
    }else if(user.password != user.c_password ){
        return {
            data: user,
            error: true,
            message: "Passwords are not the same!",
            cpwd_error: true
        }
    }else{
        return true;
    }
}
function verifyAcc(user){
    return {
        data: user,
        error: true,
        message: "There is an account with this email!",
        email_error: true
    };
}