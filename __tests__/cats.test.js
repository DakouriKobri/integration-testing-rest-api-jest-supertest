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

const validCat = { name: 'Ezra' };

function addNewCat(newCat = validCat) {
  return api.post('/cats').send(newCat);
}

const updateData = { name: 'Troll' };

function updateCat(id = cat.id, update = updateData) {
  return api.patch(`/cats/${id}`).send(update);
}

//  GET /cats - returns `{cats: [cat, ...]}`

describe('GET /cats - Get all cats', () => {
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

describe('GET /cats/:id - Get a cat', () => {
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

// POST /cats - create cat from data; return `{cat: cat}`

describe('POST /cats - Create a cat object', () => {
  it('returns status code 201 when successful', async () => {
    const expected = 201;

    await addNewCat().expect(expected);
  });

  it('returns cat in a json format when successful', async () => {
    const expected = /application\/json/;

    await addNewCat().expect('Content-Type', expected);
  });

  it('returns the created cat object when successful', async () => {
    const expectedCatKeys = ['id', 'name'];
    const expectedName = validCat.name;

    const response = await addNewCat();
    const createdCat = response.body.cat;

    const actualCatKeys = Object.keys(createdCat);
    const actualCatName = createdCat.name;

    expect(actualCatKeys).toEqual(expectedCatKeys);
    expect(actualCatName).toBe(expectedName);
  });

  const invalidCat = { name: 111 };

  it('returns status code 400 when invalid data is provided', async () => {
    const expected = 400;

    await addNewCat(invalidCat).expect(expected);
  });

  it('returns message "Name must be a string." when invalid `name` is provided', async () => {
    const expected = 'Name must be a string.';

    const response = await addNewCat(invalidCat);
    const actual = response.body.error.message;

    expect(actual).toBe(expected);
  });
});

// PATCH /cats/[id] - update cat; return `{cat: cat}`

describe('PATCH /cats/:id - Update a cat', () => {
  it('returns updated cat object when update is successful', async () => {
    const expected = {
      id: cat.id,
      name: 'Troll',
    };
    const response = await updateCat();
    const actual = response.body.cat;

    expect(actual).toEqual(expected);
  });

  it('returns status 404 if the cat cannot be found', async () => {
    const expected = 404;

    await updateCat('8787897').expect(expected);
  });

  it('returns message "Not Found" if the cat cannot be found', async () => {
    const expected = 'Not Found';

    const response = await updateCat('8787897');
    const actual = response.body.error.message;

    expect(actual).toBe(expected);
  });

  const invalidCat = { name: 111 };

  it('returns status code 400 if invalid name is provided', async () => {
    const expected = 400;

    await updateCat(cat.id, invalidCat).expect(expected);
  });

  it('returns message "Name must be a string." if invalid name is provided', async () => {
    const expected = 'Name must be a string.';

    const response = await updateCat(cat.id, invalidCat);
    const actual = response.body.error.message;

    expect(actual).toEqual(expected);
  });
});

// DELETE /cats/[id] - delete cat, return `{message: "Cat deleted"}`

describe('DELETE /cats/:id - Delete a cat', () => {
  it('returns status code 200 on successful deletion of a given cat', async () => {
    const expected = 200;

    await api.delete(`/cats/${cat.id}`).expect(expected);
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
