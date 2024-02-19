// Express app for cats

// NPM Packages
const express = require('express');

// Project Imports
const catRouter = require('./cats/cat.routes');
const errorHandler = require('./utils/errorHandler');

const app = express();

app.use(catRouter);

app.use(errorHandler);

module.exports = app;
