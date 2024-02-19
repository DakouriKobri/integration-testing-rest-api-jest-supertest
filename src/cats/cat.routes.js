// NPM Packages
const express = require('express');

// Project Imports
const catController = require('./cat.controller');

const catRouter = express.Router();

catRouter.get('/cats', catController.getAllCats);

catRouter.get('/cats/:id', catController.getCatById);

catRouter.post('/cats', catController.createCat);

module.exports = catRouter;
