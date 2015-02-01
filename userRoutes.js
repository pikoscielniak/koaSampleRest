var parse = require('co-body');
var users = require('./repository').users;

module.exports.addUser = function * addUser() {
    var userFromRequest = yield parse(this);

    if (!userFromRequest.name) {
        this.throw(400, 'name required');
    }

    var user = yield users.insert(userFromRequest);
    this.body = user;
    this.set('Location', '/user/' + user._id);
    this.status = 200;
};

module.exports.getUser = function * getUser(id) {
    var user = yield users.findById(id);

    this.body = user;
    this.status = 200;
};

module.exports.updateUser = function * updateUser(id) {
    var userFromRequest = yield parse(this);

    yield users.updateById(id, userFromRequest);

    this.set('location', '/user/' + id);
    this.status = 204;
};

module.exports.deleteUser = function * deleteUser(id) {
    yield users.remove({_id: id});
    this.status = 200;
};
