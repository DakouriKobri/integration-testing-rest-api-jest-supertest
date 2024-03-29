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

async function createCat(req, res, next) {
  const { name } = req.body;

  const isString = typeof name === 'string' && /^\d+$/.test(name) === false;

  try {
    if (!isString) {
      let invalidInputError = new Error('Name must be a string.');
      invalidInputError.status = 400;
      throw invalidInputError;
    }

    const cat = await catService.create({ name });
    return res.status(201).json({ cat });
  } catch (error) {
    next(error);
  }
}

async function updateCat(req, res, next) {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const existingCat = await catService.findById(id);
    if (!existingCat) {
      let notFoundError = new Error('Not Found');
      notFoundError.status = 404;
      throw notFoundError;
    }

    const isString = typeof name === 'string' && /^\d+$/.test(name) === false;
    if (!isString) {
      invalidInputError = new Error('Name must be a string.');
      invalidInputError.status = 400;
      throw invalidInputError;
    }

    const cat = await catService.update(id, { name });
    return res.status(200).json({ cat });
  } catch (error) {
    next(error);
  }
}

async function deleteCat(req, res, next) {
  const { id } = req.params;

  try {
    const catToDelete = await catService.findById(id);
    if (!catToDelete) {
      let notFoundError = new Error('Not found');
      notFoundError.status = 404;
      throw notFoundError;
    }

    const deletedCatId = await catService.remove(id);
    return res.status(200).json({ id: deletedCatId, message: 'Cat deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { createCat, deleteCat, getAllCats, getCatById, updateCat };
