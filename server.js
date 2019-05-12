const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Bluebird = require("bluebird");
const { printTime, bodyParser, authenticate } = require('./middleware.js');
const { SECRET_KEY } = require('./secret.js');
const { HTTP_CREATED, HTTP_UNAUTHORIZED } = require('./constants.js');
const database = require('./database/db');

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
            const token = jwt.sign({user: username}, SECRET_KEY, {expiresIn: 4000});
            return res.send({token: token});
        } else {
            return res.status(HTTP_UNAUTHORIZED).send('Wrong password');
        }
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