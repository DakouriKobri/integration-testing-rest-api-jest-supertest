// Express app for cats

// NPM Packages
const express = require('express');

// Project Imports
const db = require('./db');

const app = express();

app.get('/cats', async (req, res) => {
  const cats = await db.query('SELECT id, name FROM cats');
  return res.status(200).json({ cats: cats.rows });
});

module.exports = app;
