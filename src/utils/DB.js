const knex = require('knex');

const { databaseConfig } = require('../../config');

const DB = knex(databaseConfig);

module.exports = DB;
