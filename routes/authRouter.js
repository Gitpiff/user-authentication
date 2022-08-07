const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//Signup Route -Post-
authRouter.post("/signup", (req, res, next) => {
    //check if the user exists, add toLowerCase() to avoid case errors
    User.findOne({username: req.body.username.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500);
            return next(err);
        }
        //if the username already exists
        if(user){
            res.status(403);
            return next(new Error("That username is already taken"))
        }
        //if the username does nos exist, then we can create a new one
        const newUser = new User(req.body);
        newUser.save((err, savedUser) => {
            if(err){
                res.status(500);
                return next(err);
            }
            //send back user info and a token
            //token takes a payload that it has to be in the form of an object -toObject()-, and a signature -SECRET-
            const token = jwt.sign(savedUser.toObject(), process.env.SECRET);
            //return the newly created token and the savedUser
            return res.status(201).send({token, user: savedUser});
        })
    })
});


//Login
authRouter.post("/login", (req, res, next) => {
    //make sure they exist, add toLowerCase() to avoid case errors
    User.findOne({username: req.body.username.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500);
            return next(err);
        }
        //if the user does not exist
        if(!user){
            res.status(403);
            return next(new Error("Username or password are incorrect"))
        }
        //if the password does not match
        if(req.body.password !== user.password){
            res.status(403)
            return next(new Error("Username or password are incorrect"))
        }
        //if they exist and password matches, send back the token and user
        //token takes a payload that it has to be in the form of an object -toObject()-, and a signature -SECRET-
        const token = jwt.sign(user.toObject(), process.env.SECRET)
        return res.status(200).send({token, user})
    })
});

module.exports = authRouter;
