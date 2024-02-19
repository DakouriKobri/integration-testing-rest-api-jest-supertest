// Project Imports
const db = require('../db');

async function findAll() {
  const queryText = 'SELECT id, name FROM cats';
  const cats = await db.query(queryText);
  return cats.rows;
}

module.exports = { findAll };
