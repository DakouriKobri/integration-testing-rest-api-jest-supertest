// Express app for cats

// NPM Packages
const express = require('express');

// Project Imports
const catRouter = require('./cats/cat.routes');
const errorHandler = require('./utils/errorHandler');

const app = express();

app.use(express.json());

app.use('/cats', catRouter);

app.use(errorHandler);

module.exports = app;
