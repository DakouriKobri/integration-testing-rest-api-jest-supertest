# Testing CRUD Operations on a RESTfull API

## Tech used

- Node.js
- Jest
- Supertest
- PostgreSQL
- pg

## Routes

| HTTP Verb | Route     | Response         |
| --------- | --------- | ---------------- |
| GET       | /cats     | Display all cats |
| GET       | /cats/:id | Display a cat    |
| POST      | /cats     | Create a cat     |
| PATCH     | /cats/:id | Update a cat     |
| DELETE    | /cats/:id | Delete a cat     |

## Installation

After cloning the repository, cd into the project directory, run [npm](https://docs.npmjs.com/cli/v6/commands/npm-install) as follows to install any dependencies:

```bash
  npm install
```

Add your own credentials for your PostgreSQL test database (cats-test) in the config.js file.

```bash
  createdb cats-test
  psql cats-test < data.sql
```

Run the query in the data.sql file clicking on the `Run on active connection` icon at the top ro create your table.

## Run Tests

Run the tests with the following command

```bash
  npm test
```

## Reference & Credit

[Springboard](https://curric.rithmschool.com/springboard/lectures/express-jest-testing/)
