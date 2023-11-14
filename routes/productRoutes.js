const express = require("express");
const routes = express.Router();
const con = require("../database/database.js");

routes.get("/", (req, res) => {
    con.query("SELECT * FROM products", function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  });

module.exports = routes;
  