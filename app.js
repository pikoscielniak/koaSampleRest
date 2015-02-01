var koa = require('koa');
var app = module.exports = koa();

var route = require('koa-route');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk(process.env.DB_CONNECTION);
var users = wrap(db.get('users'));

module.exports.users = users;

app.use(route.post('/user', addUser));
app.use(route.get('/user/:id', getUser));
app.use(route.put('/user/:id', updateUser));
app.use(route.del('/user/:id', deleteUser));

function * addUser() {
    var userFromRequest = yield parse(this);

    if (!userFromRequest.name) {
        this.throw(400, 'name required');
    }

    var user = yield users.insert(userFromRequest);
    this.body = user;
    this.set('Location', '/user/' + user._id);
    this.status = 200;
}

function * getUser(id) {
    var user = yield users.findById(id);

    this.body = user;
    this.status = 200;

}

function * updateUser(id) {
    var userFromRequest = yield parse(this);

    yield users.updateById(id, userFromRequest);

    this.set('location', '/user/' + id);
    this.status = 204;

}

function * deleteUser(id) {
    yield users.remove({_id: id});
    this.status = 200;
}

app.listen(3000);
console.log('The app is listening. Port 3000');

