const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

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