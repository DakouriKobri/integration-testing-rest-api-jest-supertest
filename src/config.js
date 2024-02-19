// NPM Packages
require('dotenv').config();

CATS_TEST_DB = process.env.CATS_TEST_DATABASE;
DB_TEST_PORT = process.env.DB_TEST_PORT;
UID_TEST = process.env.UID_TEST;
PASSWORD_TEST = process.env.PASSWORD_TEST;

let DB_URI;

if (process.env.NODE_ENV === 'test') {
  DB_URI = `postgresql://${UID_TEST}:${PASSWORD_TEST}@localhost:${DB_TEST_PORT}/${CATS_TEST_DB}`;
} else {
  DB_URI = 'postgresql:///cats';
}

module.exports = { DB_URI };
