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

function getSingleCat(id) {
  return api.get(`/cats/${id}`);
}

//  GET /cats - returns `{cats: [cat, ...]}`

describe('GET /cats', () => {
  it('returns statusCode 200', async () => {
    const expected = 200;

    const response = await getCats();
    const actual = response.status;

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

// GET / cats / [id] - return data about one cat: `{cat: cat}`

describe('GET /cats/:id', () => {
  it('returns status code 200 given a cat id', async () => {
    await getSingleCat(cat.id).expect(200);
  });

  it('returns cat given cat id', async () => {
    const expected = cat;

    const response = await getSingleCat(cat.id);
    const actual = response.body.cat;

    expect(actual).toEqual(expected);
  });

  it('asserts cat is of type object given cat id', async () => {
    const expected = 'object';

    const response = await getSingleCat(cat.id);
    const actual = typeof response.body.cat;

    expect(actual).toBe(expected);
  });

  it('returns status code 404 when no cat is found given cat id', async () => {
    const expected = 404;

    const response = await getSingleCat(1000);
    const actual = response.status;

    expect(actual).toEqual(expected);
  });

  it("returns message 'Not found' when no cat is found given cat id", async () => {
    const expected = 'Not found';

    const response = await getSingleCat(1000);
    const actual = response.body.error.message;

    expect(actual).toEqual(expected);
  });
});

afterEach(async () => {
  // Delete any data create by test
  await db.query('DELETE FROM cats');
});

// POST /cats - create cat from data; return `{cat: cat}`

describe('POST /cats - create a cat object', () => {
  it('returns status code 201 when successful', async () => {
    const expected = 201;

    const newCat = { name: 'Ezra' };
    await api.post('/cats').send(newCat).expect(expected);
  });

  it('returns cat in a json format when successful', async () => {
    const expected = /application\/json/;

    const newCat = { name: 'Ezra' };
    await api.post('/cats').send(newCat).expect('Content-Type', expected);
  });

  it('returns the created cat object when successful', async () => {
    const newCat = { name: 'Ezra' };

    const expectedCatKeys = ['id', 'name'];
    const expectedName = newCat.name;

    const response = await api.post('/cats').send(newCat);
    const createdCat = response.body.cat;

    const actualCatKeys = Object.keys(createdCat);
    const actualCatName = createdCat.name;

    expect(actualCatKeys).toEqual(expectedCatKeys);
    expect(actualCatName).toBe(expectedName);
  });
});

afterAll(async () => {
  // Close de connection
  await db.end();
});
