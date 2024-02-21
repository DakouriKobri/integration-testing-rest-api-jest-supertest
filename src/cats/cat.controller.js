// Project Imports
const catService = require('./cat.service');

async function getAllCats(req, res) {
  const cats = await catService.findAll();
  return res.status(200).json({ cats });
}

async function getCatById(req, res, next) {
  const id = req.params.id;

  try {
    const cat = await catService.findById(id);
    if (!cat) {
      let notFoundError = new Error('Not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    return res.status(200).json({ cat });
  } catch (error) {
    next(error);
  }
}

async function createCat(req, res) {
  const { name } = req.body;
  const cat = await catService.create({ name });
  return res.status(201).json({ cat });
}

module.exports = { createCat, getAllCats, getCatById };
