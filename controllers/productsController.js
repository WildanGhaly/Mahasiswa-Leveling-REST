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
  const filter = req.params.filter;
  var query = "SELECT COUNT(*) AS TotalProducts FROM products";
  var queryParams = [];

  if (search) {
    query += " WHERE ProductName LIKE ?";
    queryParams.push('%' + search + '%');
  }

  if (search && filter) {
    query += " AND ";
  }

  if (!search && filter) {
    query += " WHERE ";
  }

  if (filter) {
    if (filter == "Available") {
      query += " stockquantity > 0 ";
    }
    else if (filter == "Not Available") {
      query += " stockquantity = 0 ";
    }
    else {
      query += " stockquantity >= 0 ";
    } 
  }

  con.query(query, queryParams, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
};

exports.getProductByPage = (req, res) => {
  console.log("Mengambil produk per halaman...");
  const page = parseInt(req.params.page, 10);
  const limit = parseInt(req.params.limit, 10);
  const search = req.params.search;
  const filter = req.params.filter;
  const offset = Math.max(0, (page - 1) * limit);
  var query = "SELECT * FROM products";
  var queryParams = [];

  if (search) {
    query += " WHERE ProductName LIKE ?";
    queryParams.push('%' + search + '%');
  }

  if (search && filter) {
    query += " AND ";
  } else if (!search && filter) {
    query += " WHERE ";
  }

  if (filter) {
    if (filter === "Available") {
      query += " stockquantity > 0 ";
    } else if (filter === "Not Available") {
      query += " stockquantity = 0 ";
    } else {
      query += " stockquantity >= 0 ";
    }
  }
  
  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  console.log(query);

  con.query(query, queryParams, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
};
