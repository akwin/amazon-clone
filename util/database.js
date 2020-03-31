const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_schema',
    password: 'akAmol4eva!!'
});

module.exports = pool.promise();