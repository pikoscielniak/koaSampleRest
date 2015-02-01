var monk = require('monk');
var wrap = require('co-monk');
var db = monk(process.env.DB_CONNECTION);
var users = wrap(db.get('users'));

module.exports.users = users;
