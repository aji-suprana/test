const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const router = require('./routes');
const expressValidator = require('express-validator');

require('./app/services/schedule');

// import env variables

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// models setup
require('./app/models');

// global setup
global.paginate = require('./app/services/pagination').paginate;
global.getUniqueId = require('./app/services/unique-id').uniqueId;
global._ = require('lodash');
global.countPurchase = require('./app/services/count-purchase').count;

// parsing setup
app.use(logger('dev'));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(expressValidator());

// passport setup
require('./app/passports/facebook')(passport);
require('./app/passports/facebookbuyer')(passport);
require('./app/passports/jsonwebtoken')(passport);

//Prevent CORS ERROR
app.use(cors());

//use helmet
app.use(helmet());

//router
router(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
