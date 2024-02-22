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

async function create(data) {
  const queryText = `INSERT INTO cats(name) VALUES($1) RETURNING id, name`;
  const cats = await db.query(queryText, [data.name]);
  return cats.rows[0];
}

async function update(id, data) {
  const queryText = `UPDATE cats SET name = $1 WHERE id = $2 RETURNING id, name`;
  const cats = await db.query(queryText, [data.name, id]);
  return cats.rows[0];
}

async function remove(id) {
  const queryText = `DELETE FROM cats WHERE id = $1 RETURNING id`;
  const cats = await db.query(queryText, [id]);
  return cats.rows[0].id;
}

module.exports = { create, remove, findAll, findById, update };
