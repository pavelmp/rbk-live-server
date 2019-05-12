let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let placeSchema = new Schema({
    location: {type: String, required: true},
    distance: {type: Number, required: false},
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
});

// placeSchema.virtual('location_and_distance').get(function() {
//     return `${this.location} (${this.distance})`;
// })

let userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

module.exports.Place = mongoose.model('Place', placeSchema);
module.exports.User = mongoose.model('User', userSchema);