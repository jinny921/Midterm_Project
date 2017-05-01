'use strict';

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';

require('dotenv').config();
const bodyParser  = require('body-parser');
const express     = require('express');
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const knexLogger  = require('knex-logger');
const morgan      = require('morgan');
const orderRoutes = require('./routes/orders');
const sass        = require('node-sass-middleware');

const app         = express();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
// The :status token will be colored red for server error codes, yellow for client error codes, 
// cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded',
}));
app.use(express.static('public'));

// Mount all resource routes
app.use('/orders', orderRoutes(knex));

// user goto Home page request get '/'
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/thankyou', (req, res) => {
  res.render('thankyou');
});

// resturant page
app.get('/restaurant', (req, res) => {
  res.render('restaurant');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Pseudo login page
app.get('/restaurant_login', (req, res) => {
  res.render('restaurant_login');
});
