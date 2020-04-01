const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'node_schema', 'root', 'akAmol4eva!!', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;