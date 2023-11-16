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
  console.log("Menghitung total produk...");
  con.query("SELECT COUNT(*) AS TotalProducts FROM products", function (
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
  const offset = (page - 1) * limit;
  con.query(
    "SELECT * FROM products LIMIT " + limit + " OFFSET " + offset,
    function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    }
  );
  
}; 