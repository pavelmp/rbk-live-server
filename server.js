const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { printTime, bodyParser } = require('./middleware.js');
const { SECRET_KEY } = require('./secret.js');
const { HTTP_CREATED, HTTP_UNAUTHORIZED } = require('./constants.js');

const app = express();
const port = 3000;

var database = {places:{"RBK": [{location: 'Mecca Mall'}], 
                        "RBK2": [{location: 'City Mall'}]}, 
                users: {}};

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
    return res.status(HTTP_UNAUTHORIZED).send('Please sign in');
};

//Middleware
app.use(printTime);
app.use(bodyParser);

app.get('/', function(req, res) {
    res.send('Hello World!');
});

//Returns all places from the database
app.get('/places', authenticate, function(req, res) {
    const user = req.body.user;
    return res.send(database.places[user]);
});

//Add new place to the database
app.post('/places', authenticate, function(req, res) {
    const place = req.body;
    database.places.push(place);
    return res.send(place);
});

//Create new user in the database
app.post('/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    database.users[username] = hashedPassword;
    return res.status(HTTP_CREATED).send('Sign up successful');
});

//Sign in user
app.post('/signin', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    //Check if user exists in the database
    if(!database.users[username]){
        return res.status(HTTP_UNAUTHORIZED).send('Please sign up');
    }
    //Compare with stored password
    const existingPassword = database.users[username];
    bcrypt.compare(password, existingPassword, function(err, isMatching){
        if(isMatching){
            //Create a token and send to client
            const token = jwt.sign({user: username}, SECRET_KEY, {expiresIn: 10});
            return res.send({token: token});
        } else {
            return res.status(HTTP_UNAUTHORIZED).send('Wrong password');
        }
    });
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});