const express = require('express');

const printTime = function(req, res, next){
    console.log(`Request ${req.method} received for ${req.url} at ${(new Date()).toLocaleTimeString()}`);
    next();
};

const bodyParser = express.json();

const authenticate = function(req, res, next){
    const token = req.headers['x-access-token']; //Username encoded in token
    if(!token){
        return res.status(HTTP_UNAUTHORIZED).send('Please sign in');
    }
    jwt.verify(token, SECRET_KEY, function(err, decodedToken){
        //If err, token invalid
        if(err){
            return res.status(HTTP_UNAUTHORIZED).send('Please sign in');
        }
        //Check if user exists in the database
        const user = decodedToken.user;
        if(database.users[user]){
            req.body.user = user;
            return next();
        }
    });
    res.status(HTTP_UNAUTHORIZED).send('Please sign in');
};

exports.printTime = printTime;
exports.bodyParser = bodyParser;
exports.authenticate = authenticate;

