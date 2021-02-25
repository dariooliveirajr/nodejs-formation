var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: '1234',
        database: 'knexjs'
    }   
});

module.exports = knex;