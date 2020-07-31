require('./env')
require('./app-extension');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require("path");
const routes = require('./routes');
const { notFound, errorStack } = require('./app/middlewares/errorHandlers');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//require('./app/models');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(helmet());

global.paginate = require('./app/services/pagination').paginate;

routes(app);

app.use(notFound);
app.use(errorStack);

module.exports = app;
