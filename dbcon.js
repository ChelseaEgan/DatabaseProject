var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_eganch',
  password: '5018',
  database: 'cs340_eganch'
});

module.exports.pool = pool;
