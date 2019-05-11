const express = require('express');

const printTime = function(req, res, next){
    console.log(`Request ${req.method} received for ${req.url} at ${(new Date()).toLocaleTimeString()}`);
    next();
};

const bodyParser = express.json();

exports.printTime = printTime;
exports.bodyParser = bodyParser;

