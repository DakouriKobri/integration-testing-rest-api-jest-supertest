// NPM Packages
const express = require('express');

// Project Imports
const catController = require('./cat.controller');

const catRouter = express.Router();

catRouter.get('/cats', catController.getAllCats);

module.exports = catRouter;
