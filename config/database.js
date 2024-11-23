const { Sequelize } = require('sequelize');

class Database {
  constructor() {
    if (!Database.instance) {
      this.connection = new Sequelize('postgres', 'postgres', 'Admin123', {
        host: 'proyecto-postgres-server.postgres.database.azure.com',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });
      Database.instance = this;
    }
    return Database.instance;
  }

  getConnection() {
    return this.connection;
  }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
