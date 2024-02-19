// Server for cats

// NPM Packages
require('dotenv').config();

// Project Imports
const app = require('./app');

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
