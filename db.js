// Database setup for cats

// NPM Packages
const { Client } = require('pg');

// Project Imports
const { DB_URI } = require('./config');

let client = new Client({
  connectionString: DB_URI,
});

client.connect();

module.exports = client;
