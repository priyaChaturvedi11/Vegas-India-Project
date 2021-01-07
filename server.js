import express from 'express';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import expressSession from 'express-session';
var MongoStore = require('connect-mongo')(expressSession);
import accountRoutes from './routes/account.js';
import bookingRoutes from './routes/bookings.js';
import usersRoutes from './routes/users.js';
var app = express();
var port = 30000;

var dbName = 'physiotherapy';
var connectionString = 'mongodb://localhost:27017/' + dbName;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(expressSession({
    secret: '128013A7-5B9F-4CC0-BD9E-4480B2D3EFE9',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://localhost/physiotherapy',
        ttl: 20 * 24 * 60 * 60 // = 20 days.
    })
}));

app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api', [accountRoutes, bookingRoutes, usersRoutes]);

var server = app.listen(port, function () {
    console.log('Express server listening on port ' + server.address().port);
});