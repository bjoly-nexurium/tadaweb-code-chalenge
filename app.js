var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//DB Requirements
var mongoose = require('mongoose');
var CityModel = require('./models/city.js');

//Routes Requirements
var routes = require('./routes/index');
var cityRoutes = require('./routes/city');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));


// connect to the db
var MONGO_DB;
var FIG_DB = process.env.DB_1_PORT;
if (FIG_DB) {
    MONGO_DB = FIG_DB.replace("tcp", "mongodb") + "/codechallenge";
} else {
    MONGO_DB = process.env.MONGO_URL;
}
mongoose.connect(MONGO_DB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/bower_components')));

/*
 * Router
 */

app.use('/', routes);
app.use('/api', cityRoutes)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
