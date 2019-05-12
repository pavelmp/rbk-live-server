const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Bluebird = require("bluebird");
const mongoose = require('mongoose');
const { printTime, bodyParser, authenticate } = require('./middleware.js');
const { SECRET_KEY, DATABASE_URL } = require('./secret.js');
const { HTTP_CREATED, HTTP_UNAUTHORIZED, HTTP_BAD_REQUEST, HTTP_SERVER_ERROR } = require('./constants.js');
const { Place, User } = require('./database/models.js');

//Database connection
mongoose.connect(DATABASE_URL).then(connection => {
    console.log('Connected');
}).catch(function(err){
    console.log(err);
});

const app = express();
const port = 3000;

//Middleware
app.use(printTime);
app.use(bodyParser);

app.get('/', function(req, res) {
    res.send('Hello World!');
});

//Returns all places from the database
app.get('/places', authenticate, function(req, res) {
    const user = req.body.user; //Added by authenticate function 
    Place.find({user_id: user._id}).then(function(places){
        return res.send(places);
    }).catch(function(err){
        return res.status(HTTP_SERVER_ERROR).send('Server Error');
    })
});

//Add new place to the database
app.post('/places', authenticate, function(req, res) {
    const place = {location: req.body.location, distance: req.body.distance};
    const user = req.body.user;
    Place.create({location: place.location, distance: place.distance, user_id: user._id})
         .then(function(place){
            return res.send({location: place.location});
         })
         .catch(function(err){
            return res.status(HTTP_SERVER_ERROR).send(err.message);
        })
});

//Create new user in the database
app.post('/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    User.create({username: username, password: hashedPassword}).then(function(){
        return res.status(HTTP_CREATED).send('Sign up successful');
    }).catch(function(err){
        if(err.code === 11000){
            return res.status(HTTP_BAD_REQUEST).send('This username is already taken');
        }
        return res.status(HTTP_SERVER_ERROR).send('Server Error');
    });
});

//Sign in user
app.post('/signin', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    //Check if user exists in the database
    User.findOne({username: username}).then(function(user){
        if(!user){
            return res.status(HTTP_UNAUTHORIZED).send('Please sign up'); 
        }
        //Compare with stored password
        const existingHashedPassword = user.password;
        bcrypt.compare(password, existingHashedPassword).then(function(isMatching){
            if(isMatching){
                //Create a token and send to client
                const token = jwt.sign({username: user.username}, SECRET_KEY, {expiresIn: 4000});
                return res.send({token: token});
            } else {
                return res.status(HTTP_UNAUTHORIZED).send('Wrong password');
            }
        });
    });
    
});

function completedWork(value){
    console.log(`I am done! I worked really hard for ${value} seconds`);
};

function doSomething(type, seconds){
    return new Bluebird(function(resolve, reject) {
        let count = 0;
        console.log(`I am ${type} hard`);
        setTimeout(function(){
            count += seconds;
            reject(count);
        }, 1000 * seconds);
    });
};

app.get('/random', function(req, res){
    doSomething('coding', 3).then(count => {
        completedWork(count);
        res.send('Done')
    }).catch(count =>{
        completedWork(count);
        res.send('Done in catch')
    })
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});