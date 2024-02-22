// NPM Packages
const request = require('supertest');

// Project Imports
const app = require('../../src/app');
const db = require('../../src/db');

const api = request(app);

// Constants
const validCat = { name: 'Ezra' };
const updateData = { name: 'Troll' };
const invalidCat = { name: 111 };
const inexistentCatId = 8787897;
const statusCode200 = 200;
const statusCode400 = 400;
const statusCode404 = 404;
const notFound = 'Not found';

// Functions

async function insertOneCatInDb() {
  return await db.query(
    `INSERT INTO
       cats (name) VALUES ('beans')
       RETURNING id, name
    `
  );
}

async function delateAnyCatInDb() {
  return await db.query('DELETE FROM cats');
}

async function closeConnection() {
  return await db.end();
}

function getCats() {
  return api.get('/cats');
}

function getSingleCat(id) {
  return api.get(`/cats/${id}`);
}

function addNewCat(newCat = validCat) {
  return api.post('/cats').send(newCat);
}

function updateCat(id, update = updateData) {
  return api.patch(`/cats/${id}`).send(update);
}

function deleteCat(id) {
  return api.delete(`/cats/${id}`);
}

module.exports = {
  validCat,
  updateData,
  invalidCat,
  inexistentCatId,
  statusCode200,
  statusCode400,
  statusCode404,
  notFound,
  insertOneCatInDb,
  delateAnyCatInDb,
  closeConnection,
  getCats,
  getSingleCat,
  addNewCat,
  updateCat,
  deleteCat,
};
