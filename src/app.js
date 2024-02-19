// Express app for cats

// NPM Packages
const express = require('express');

// Project Imports
const catRouter = require('./cats/cat.routes');

const app = express();

app.use(catRouter);

module.exports = app;
