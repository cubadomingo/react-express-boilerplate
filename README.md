# react_express_boilerplate
An opinionated boilerplate for creating a react application with an express API.

## Getting Started

Install dependencies

`$ yarn install`

### Setting up a database

This boilerplate uses PostgreSQL for the database. You must create a test and development databases. In your terminal:

`$ psql`

Once logged in to the postgres interactive terminal:

`CREATE DATABASE react_express_boilerplate_development;`

`CREATE DATABASE react_express_boilerplate_test;`

Feel free to change the database name to anything, as long as you update the 
package name in the `package.json` file, as the database name is set 
dynamically to the package name:

```
 test: {
    connection: `postgres://localhost/${process.env.npm_package_name}_test`,
    ...
  },
  development: {
    connection:
      `postgres://localhost/${process.env.npm_package_name}_development`,
    ...
  },
```

### Create a New Migration

`$ yarn make migration_name`

migrations are created in the `src/server/db/migrations`

### Running Migrations

To run the latest migrations (default environment is development):

`$ yarn latest`

To run in test or production:

`$ NODE_ENV=test yarn latest`

`$ NODE_ENV=production yarn latest`

### Rollback Migraitons

`$ yarn rollback`

### Create a New Seed File

`$ yarn seed:make seed_name`

seed files are created in the `src/server/db/seeds/${environment}` folders

### Run Seeds

`$ yarn seed:run`

## Testing

`$ yarn test:client` and `$ yarn test:server`

Place tests in `test/client` or `test/server` folders

## Building 

`$ yarn build:client` and `$ yarn build:server`

Builds are created in `build/server` and `build/client` folders.

### Server

To start the server:

`$ yarn start`

React Dev Server: `http://localhost:8080`

Express API Server: `http://localhost:3000/api/v1`

## Server Utilities

**verifyToken(token)** = provide token as argument. Place before route you want protected.
```
router.use(verifyToken);

router.post('/', function(req, res, next) {
    ...
  }
);
```

**allowedParams(whitelist)** = provide array as argument of whitelisted params. Pass function as argument in router.
```
const whitelist = [name, description]
router.post('/', allowedParams(whitelist), function(req, res, next) {
  ...
});
```

**requiredParams(params)** = provide array as argument of required params. Pass function as argument in router.
```
const params = [name, description]
router.post('/', requiredParams(params), function(req, res, next) {
  ...
});
```

**confirmPassword** = check password and confirm_password params equality. Pass as argument in router.

```
const params = [name, description]
router.post('/', confirmPassword, function(req, res, next) {
  ...
});
```

An example of all util functions. allowedParams, requiredParams, confirmPassword are passed together in an array as the second argument.

```
const whitelist = ['username', 'password', 'password_confirmation', 'email'];

router.use(verifyToken);

router.post('/', [
    allowedParams(whitelist),
    requiredParams(['username','password','password_confirmation','email']),
    confirmPassword,
  ], function(req, res, next) {
    ...
  }
);
```