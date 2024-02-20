// NPM Packages
const express = require('express');

// Project Imports
const catController = require('./cat.controller');

const catRouter = express.Router();

catRouter.get('/', catController.getAllCats);

catRouter.get('/:id', catController.getCatById);

catRouter.post('/', catController.createCat);

module.exports = catRouter;
