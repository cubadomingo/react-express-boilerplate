module.exports = {
  test: {
    client: 'pg',
    connection: `postgres://localhost/${process.env.npm_package_name}_test`,
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/test'
    }
  },
  development: {
    client: 'pg',
    connection: `postgres://localhost/${process.env.npm_package_name}_development`,
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/development'
    }
  },
  production: {
    client: 'pg',
    connection: {
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: `${process.env.npm_package_name}_production`,
    },
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/production'
    }
  }
};
