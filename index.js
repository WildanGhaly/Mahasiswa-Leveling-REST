require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

let con = null;

const app = express();


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.get('/connect', function (req, res) {
  con =  mysql.createConnection(mysqlConfig);
  con.connect(function(err) {
    if (err) throw err;
    res.send('connected')
  });
})

app.get('/challenge', function (req, res) {
  con.query('SELECT * FROM challenge', function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
})


app.listen(8080)

console.log("listening on port 8080")

