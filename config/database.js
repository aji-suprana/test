module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEVELOPMENT,
    password: process.env.DB_PASSWORD_DEVELOPMENT,
    database: process.env.DB_DATABASE_DEVELOPMENT,
    host: process.env.DB_HOST_DEVELOPMENT,
    dialect: 'mysql',
  },
  staging: {
    username: process.env.DB_USERNAME_STAGING,
    password: process.env.DB_PASSWORD_STAGING,
    database: process.env.DB_DATABASE_STAGING,
    host: process.env.DB_DATABASE_STAGING,
    dialect: 'mysql',
  },
  local: {
    username: process.env.DB_USERNAME_STAGING,
    password: process.env.DB_PASSWORD_STAGING,
    database: process.env.DB_DATABASE_STAGING,
    host: process.env.DB_DATABASE_STAGING,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME_PRODUCTION,
    password: process.env.DB_PASSWORD_PRODUCTION,
    database: process.env.DB_DATABASE_PRODUCTION,
    host: process.env.DB_HOST_PRODUCTION,
    dialect: 'mysql',
  },
};
