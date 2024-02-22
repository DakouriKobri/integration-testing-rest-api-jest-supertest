process.env.NODE_ENV = 'test';

// Project Imports
const catHelper = require('./__utils__/cat_helpers');

let cat;

beforeEach(async () => {
  let result = await catHelper.insertOneCatInDb();
  cat = result.rows[0];
});

//  GET /cats - returns `{cats: [cat, ...]}`

describe('GET /cats - Get all cats', () => {
  it('returns statusCode 200', async () => {
    const response = await catHelper.getCats();
    const actual = response.status;

    expect(actual).toBe(catHelper.statusCode200);
  });

  it('return 1 as length ', async () => {
    const expected = 1;

    const response = await catHelper.getCats();
    const { cats } = response.body;

    expect(cats).toHaveLength(expected);
  });

  it('returns `cat`', async () => {
    const expected = cat;

    const response = await catHelper.getCats();
    const { cats } = response.body;
    const actual = cats[0];

    expect(actual).toEqual(expected);
  });
});

// GET / cats / [id] - return data about one cat: `{cat: cat}`

describe('GET /cats/:id - Get a cat', () => {
  it('returns status code 200 given a cat id', async () => {
    const response = await catHelper.getSingleCat(cat.id);
    const actual = response.status;

    expect(actual).toBe(catHelper.statusCode200);
  });

  it('returns cat given cat id', async () => {
    const expected = cat;

    const response = await catHelper.getSingleCat(cat.id);
    const actual = response.body.cat;

    expect(actual).toEqual(expected);
  });

  it('asserts cat is of type object given cat id', async () => {
    const expected = 'object';

    const response = await catHelper.getSingleCat(cat.id);
    const actual = typeof response.body.cat;

    expect(actual).toBe(expected);
  });

  it('returns status code 404 when no cat is found given cat id', async () => {
    const response = await catHelper.getSingleCat(catHelper.inexistentCatId);
    const actual = response.status;

    expect(actual).toEqual(catHelper.statusCode404);
  });

  it("returns message 'Not found' when no cat is found given cat id", async () => {
    const response = await catHelper.getSingleCat(catHelper.inexistentCatId);
    const actual = response.body.error.message;

    expect(actual).toEqual(catHelper.notFound);
  });
});

// POST /cats - create cat from data; return `{cat: cat}`

describe('POST /cats - Create a cat object', () => {
  it('returns status code 201 when successful', async () => {
    const expected = 201;

    const response = await catHelper.addNewCat();
    const actual = response.status;

    expect(actual).toBe(expected);
  });

  it('returns cat in a json format when successful', async () => {
    const expected = 'application/json';

    const response = await catHelper.addNewCat();
    const actual = response.headers['content-type'];

    expect(actual).toContain(expected);
  });

  it('returns the created cat object when successful', async () => {
    const expectedCatKeys = ['id', 'name'];
    const expectedName = catHelper.validCat.name;

    const response = await catHelper.addNewCat();
    const createdCat = response.body.cat;

    const actualCatKeys = Object.keys(createdCat);
    const actualCatName = createdCat.name;

    expect(actualCatKeys).toEqual(expectedCatKeys);
    expect(actualCatName).toBe(expectedName);
  });

  it('returns status code 400 when invalid data is provided', async () => {
    const response = await catHelper.addNewCat(catHelper.invalidCat);
    const actual = response.status;

    expect(actual).toBe(catHelper.statusCode400);
  });

  it('returns message "Name must be a string." when invalid `name` is provided', async () => {
    const expected = 'Name must be a string.';

    const response = await catHelper.addNewCat(catHelper.invalidCat);
    const actual = response.body.error.message;

    expect(actual).toBe(expected);
  });
});

// PATCH /cats/[id] - update cat; return `{cat: cat}`

describe('PATCH /cats/:id - Update a cat', () => {
  it('returns updated cat object when update is successful', async () => {
    const expected = {
      id: cat.id,
      ...catHelper.updateData,
    };
    const response = await catHelper.updateCat(cat.id);
    const actual = response.body.cat;

    expect(actual).toEqual(expected);
  });

  it('returns status 404 if the cat cannot be found', async () => {
    const response = await catHelper.updateCat(catHelper.inexistentCatId);
    const actual = response.status;

    expect(actual).toBe(catHelper.statusCode404);
  });

  it('returns message "Not Found" if the cat cannot be found', async () => {
    const expected = 'Not Found';

    const response = await catHelper.updateCat(catHelper.inexistentCatId);
    const actual = response.body.error.message;

    expect(actual).toBe(expected);
  });

  it('returns status code 400 if invalid name is provided', async () => {
    const response = await catHelper.updateCat(cat.id, catHelper.invalidCat);
    const actual = response.status;

    expect(actual).toBe(catHelper.statusCode400);
  });

  it('returns message "Name must be a string." if invalid name is provided', async () => {
    const expected = 'Name must be a string.';

    const response = await catHelper.updateCat(cat.id, catHelper.invalidCat);
    const actual = response.body.error.message;

    expect(actual).toEqual(expected);
  });
});

// DELETE /cats/[id] - delete cat, return `{message: "Cat deleted"}`

describe('DELETE /cats/:id - Delete a cat', () => {
  it('returns status code 200 on successful deletion of a given cat', async () => {
    const response = await catHelper.deleteCat(cat.id);
    const actual = response.status;

    expect(actual).toBe(catHelper.statusCode200);
  });

  it('returns id of deleted cat on its successful deletion', async () => {
    const expected = cat.id;

    const response = await catHelper.deleteCat(cat.id);
    const actual = response.body.id;

    expect(actual).toBe(expected);
  });

  it('returns `{message: "Cat deleted"}` on successful deletion', async () => {
    const expected = 'Cat deleted';

    const response = await catHelper.deleteCat(cat.id);
    const actual = response.body.message;

    expect(actual).toEqual(expected);
  });

  it('returns status code 404 if cat to delete does not exist', async () => {
    const response = await catHelper.deleteCat(catHelper.inexistentCatId);
    const actual = response.status;

    expect(actual).toBe(catHelper.statusCode404);
  });

  it('returns message "Not found" if cat to delete does not exist', async () => {
    const response = await catHelper.deleteCat(catHelper.inexistentCatId);
    const actual = response.body.error.message;

    expect(actual).toBe(catHelper.notFound);
  });
});

afterEach(async () => {
  // Delete any data create by test
  await catHelper.delateAnyCatInDb();
});

afterAll(async () => {
  // Close the connection
  await catHelper.closeConnection();
});
