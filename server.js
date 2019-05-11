const express = require('express');
const bcrypt = require('bcrypt');
const { printTime, bodyParser } = require('./middleware.js');
const { HTTP_CREATED, HTTP_UNAUTHORIZED } = require('./constants.js');

const app = express();
const port = 3000;

//Middleware
app.use(printTime);
app.use(bodyParser);


app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/places', function(req, res) {
    res.send(database.places);
});

app.post('/places', function(req, res) {
    const place = req.body;
    database.places.push(place);
    res.send(place);
});

var database = {places:[], 
    users: {}};


app.post('/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    database.users[username] = hashedPassword;
    res.status(HTTP_CREATED).send('Sign up successful');
});

app.post('/signin', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    //Check if user exists in the database
    if(!database.users[username]){
        res.status(HTTP_UNAUTHORIZED).send('Please sign up');
    }
    //Compare with stored password
    const existingPassword = database.users[username];
    bcrypt.compare(password, existingPassword, function(err, isMatching){
        if(isMatching){
            res.send('Sign in successful');
        } else {
            res.status(HTTP_UNAUTHORIZED).send('Wrong password');
        }
    });
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});