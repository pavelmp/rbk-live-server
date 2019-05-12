let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let placeSchema = new Schema({
    location: {type: String, required: true},
    distance: {type: Number, required: false}
});

let userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

module.exports.Place = mongoose.model('Place', placeSchema);
module.exports.User = mongoose.model('User', userSchema);