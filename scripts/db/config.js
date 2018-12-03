// we need this for es6 features:
require('babel-core/register');

const { db: { dialect } } = require('../../src/config');

const sequelizeCliConfig = {
  [process.env.NODE_ENV]: {
    url: process.env.DATABASE_URL,
    dialect,
  },
};

module.exports = sequelizeCliConfig;
