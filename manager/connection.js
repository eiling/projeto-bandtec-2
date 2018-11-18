'use strict';

const Sequelize = require('sequelize');

module.exports = new Sequelize('DanteSQL', 'bergantines', 'Bec14032012', {
  dialect: 'mssql',
  host: 'dantesql.database.windows.net',
  port: 1433,
  dialectOptions: {
    encrypt: true
    }
  });