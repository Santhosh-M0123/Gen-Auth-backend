const knex = require('knex');

//configuration of the pg sql
const dbConfig = {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      database: 'gen-auth',
      password: 'root',
    //   ssl: config['DB_SSL'] ? { rejectUnauthorized: false } : false,
    },pool: {
        min: 2,
        max: 10,
    }
}

//db instance used to connect with the database
const genAuthDb = knex(dbConfig);


module.exports = genAuthDb;

