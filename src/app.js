const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes/routes');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use(routes);

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

module.exports = app;

