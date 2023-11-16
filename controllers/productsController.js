// productsController.js

const con = require("../database/database.js");

exports.getProducts = (req, res) => {
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
};

exports.getProductsByID = (req, res) => {
  con.query(
    "SELECT ProductName, Description, StockQuantity, Price, ImagePath FROM products WHERE productid = ?",
    [req.params.id],
    function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    }
  );
};

exports.getTotalProducts = (req, res) => {
  console.log("Menghitung total produk... " + req.params.search);

  const search = req.params.search;
  var query = "SELECT COUNT(*) AS TotalProducts FROM products";

  if (search) {
    query += " WHERE ProductName LIKE '%" + search + "%'";
  }

  con.query(query, function (
    err,
    result,
    fields
  ) {
    if (err) throw err;
    res.json(result);
  });
};
 
exports.getProductByPage = (req, res) => {
  console.log("Mengambil produk per halaman...");
  const page = req.params.page;
  const limit = req.params.limit;
  const search = req.params.search;
  const offset = (page - 1) * limit;
  var query = "SELECT * FROM products";


  if (search) {
    query += " WHERE ProductName LIKE '%" + search + "%'";
  }
  
  query += " LIMIT " + limit + " OFFSET " + offset;
  console.log(query);

  con.query(query, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
  
}; 