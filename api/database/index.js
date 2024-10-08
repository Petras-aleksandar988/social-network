import mysql from 'mysql2'

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
  });

  const promisePool = pool.promise();

  export default promisePool;

