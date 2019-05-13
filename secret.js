//You need to set these variable in the terminal where you start the server like this:
//To set a SECRET_KEY variable for example, type "export SECRET_KEY=somestring" in terminal

module.exports.SECRET_KEY = process.env.SECRET_KEY;
module.exports.DATABASE_URL = process.env.DATABASE_URL;

