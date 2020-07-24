module.exports = {
  development: {
    username: 'development',
    password: process.env.DB_PASSWORD_DEVELOPMENT,
    database: process.env.DB_DATABASE_DEVELOPMENT,
    host: process.env.DB_HOST_DEVELOPMENT,
    dialect: 'mysql',
  },
  staging: {
    username:'staging',
    password: process.env.DB_PASSWORD_STAGING,
    database: process.env.DB_DATABASE_STAGING,
    host: process.env.DB_DATABASE_STAGING,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: 'production',
    password: process.env.DB_PASSWORD_PRODUCTION,
    database: process.env.DB_DATABASE_PRODUCTION,
    host: process.env.DB_HOST_PRODUCTION,
    dialect: 'mysql',
  },
};
