// productsController.js

const con = require("../database/database.js");

exports.getProducts = (req, res) => {
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
};
