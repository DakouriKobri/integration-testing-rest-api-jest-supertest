// Project Imports
const catService = require('./cat.service');

async function getAllCats(req, res) {
  const cats = await catService.findAll();
  return res.status(200).json({ cats });
}

async function getCatById(req, res) {
  const id = req.params.id;

  const cat = await catService.findById(id);
  if (!cat) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json({ cat });
}

module.exports = { getAllCats, getCatById };
