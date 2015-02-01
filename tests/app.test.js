var app = require('../app');
var request = require('supertest').agent(app.listen());
var co = require('co');

describe("Simple User Http Crud API", function () {

    var a_user;
    //var userLocation;

    function removeAll(done) {
        co(function * () {
            yield app.users.remove({});
        }).then(done, done);
    }

    beforeEach(function (done) {
        a_user = {name: 'Marcus', age: 42, height: 1.96};
        removeAll(done);
    });

    it("adds new users", function (done) {
        request
            .post('/user')
            .send(a_user)
            .expect('Location', /^\/user\/[0-9a-fA-F]{24}$/)
            .expect(200, done);
        //.end(function (err, res) {
        //    if (err) return done(err);
        //    userLocation = res.headers.location;
        //    done()
        //});
    });

    it("fails with validation error for users without name", function (done) {
        delete a_user.name;

        request
            .post('/user')
            .send(a_user)
            .expect('name required')
            .expect(400, done);
    });

    it("get existing user by id", function (done) {

        co(function *() {

            var insertedUser = yield  app.users.insert(a_user);
            var url = '/user/' + insertedUser._id;
            request
                .get(url)
                .set('Accept', 'application/json')
                .expect('Content-type', /json/)
                .expect(/Marcus/)
                .expect(/1.96/)
                .expect(200, done);
        });

        //request
        //    .get(userLocation)
        //    .set('Accept', 'application/json')
        //    .expect('Content-type', /json/)
        //    .expect(/Marcus/)
        //    .expect(/1.96/)
        //    .expect(200, done);

    });

    it("updates an existing user", function (done) {
        co(function *() {

            var insertedUser = yield  app.users.insert(a_user);
            var url = '/user/' + insertedUser._id;

            request
                .put(url)
                .send({name: 'Older Marcus', age: 43, height: 1.94})
                .expect('location', url)
                .expect(204, done);
        });
    });


    it("deletes an existing user", function (done) {
        co(function *() {

            var insertedUser = yield  app.users.insert(a_user);
            var url = '/user/' + insertedUser._id;

            request
                .del(url)
                .expect(200, done);
        });
    });
});