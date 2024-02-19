// Project Imports
const db = require('../db');

async function findAll() {
  const queryText = 'SELECT id, name FROM cats';
  const cats = await db.query(queryText);
  return cats.rows;
}

async function findById(id) {
  const queryText = `SELECT id, name FROM cats WHERE id = $1`;
  const cats = await db.query(queryText, [id]);
  return cats.rows[0];
}

module.exports = { findAll, findById };
