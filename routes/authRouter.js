const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//Signup Route -Post-
authRouter.post("/signup", (req, res, next) => {
    //check if the user exists
    User.findOne({username: req.body.username}, (err, user) => {
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

module.exports = authRouter;
