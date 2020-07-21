const debug = require('./app/services/debug');

debug.logHeader('Running App Extension');

const passport = require('passport');
require('./app/passports/jwt')(passport);
require('./app/passports/local')(passport);
