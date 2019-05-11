const express = require('express');
const { printTime, bodyParser } = require('./middleware.js');
const app = express();
const port = 3000;

//Middleware
app.use(printTime);
app.use(bodyParser);

var database = {places:[]};

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

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});