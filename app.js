var koa = require('koa');
var app = module.exports = koa();

var route = require('koa-route');
var userRoute = require('./userRoutes');

app.use(route.post('/user', userRoute.addUser));
app.use(route.get('/user/:id', userRoute.getUser));
app.use(route.put('/user/:id', userRoute.updateUser));
app.use(route.del('/user/:id', userRoute.deleteUser));

app.listen(3000);
console.log('The app is listening. Port 3000');

