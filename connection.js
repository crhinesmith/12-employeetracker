const mysql = require('mysql2')
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Blueaces745287*',
      database: 'company_db'
    },
    console.log(`Connected to the books_db database.`)
  );

module.exports = db;