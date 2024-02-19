process.env.NODE_ENV = 'test';

// NPM Packages
const request = require('supertest');

// Project Imports
const app = require('../src/app');
const db = require('../src/db');

const api = request(app);

let cat;

beforeEach(async () => {
  let result = await db.query(
    `INSERT INTO
       cats (name) VALUES ('beans')
       RETURNING id, name
    `
  );

  cat = result.rows[0];
});

function getCats() {
  return api.get('/cats');
}

//  GET /cats - returns `{cats: [cat, ...]}`
describe('GET /cats', () => {
  it('returns statusCode 200', async () => {
    const expected = 200;

    const response = await getCats();
    const actual = response.statusCode;

    expect(actual).toBe(expected);
  });

  it('return 1 as length ', async () => {
    const expected = 1;

    const response = await getCats();
    const { cats } = response.body;

    expect(cats).toHaveLength(expected);
  });

  it('returns `cat`', async () => {
    const expected = cat;

    const response = await getCats();
    const { cats } = response.body;
    const actual = cats[0];

    expect(actual).toEqual(expected);
  });
});

describe('GET /cats/:id', () => {
  it('returns status code 200 given a cat id', async () => {
    await api.get(`/cats/${cat.id}`).expect(200);
  });

  it('returns cat given cat id', async () => {
    const expected = cat;

    const response = await api.get(`/cats/${cat.id}`);
    const actual = response.body.cat;

    expect(actual).toEqual(expected);
  });

  it('asserts cat is of type object given cat id', async () => {
    const expected = 'object';

    const response = await api.get(`/cats/${cat.id}`);
    const actual = typeof response.body.cat;

    expect(actual).toBe(expected);
  });
});

afterEach(async () => {
  // Delete any data create by test
  await db.query('DELETE FROM cats');
});

afterAll(async () => {
  // Close de connection
  await db.end();
});
