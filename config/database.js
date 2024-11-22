const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'Admin123', {
  host: 'proyecto-postgres-server.postgres.database.azure.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;

