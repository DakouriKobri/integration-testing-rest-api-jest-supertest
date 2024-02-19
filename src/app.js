// Express app for cats

// NPM Packages
const express = require('express');

const app = express();

app.get('/cats', async (req, res) => {
  return res.status(200).end();
});

module.exports = app;
