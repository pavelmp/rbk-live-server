// module.exports = {places:{"RBK": [{location: 'Mecca Mall'}], 
//                         "RBK2": [{location: 'City Mall'}]}, 
//                   users: {}};

const { DATABASE_URL } = require('../secret.js');
const mongoose = require('mongoose');
mongoose.connect(DATABASE_URL, { useNewUrlParser: true }).then(connection => {
    console.log('Connected');
}).catch(function(err){
    console.log(err);
});
