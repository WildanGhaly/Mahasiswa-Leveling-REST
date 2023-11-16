// merchantController.js

const con = require("../database/database.js");

exports.getMerchants = (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  const query = `
    SELECT p.productid AS MerchantID, up.quantity AS MerchantQuantity,
           p.productname AS MerchantName, p.imagepath AS MerchantImagePath
    FROM users u
    JOIN user_product up ON u.id = up.user_id
    JOIN products p ON up.product_id = p.productid
    WHERE u.username = ?`;

  con.query(query, [req.username], function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
};

exports.getTotalMerchants = (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  const search = req.params.search;
  var query = "SELECT COUNT(*) AS TotalMerchants FROM users u JOIN user_product up ON u.id = up.user_id JOIN products p ON p.productid = up.product_id WHERE u.username = ?";

  if (search) {
    query += " AND p.productname LIKE '%" + search + "%'";
  }

  console.log(query);

  con.query(query, [req.username], function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });

};

exports.getMerchantByPage = (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  const page    = req.params.page;
  const limit   = req.params.limit;
  const search  = req.params.search;
  const filter  = req.params.filter;
  const offset  = (page - 1) * limit;

  var query = `SELECT p.productid AS MerchantID, up.quantity AS MerchantQuantity, p.productname AS MerchantName, p.imagepath AS MerchantImagePath
               FROM users u
               JOIN user_product up ON u.id = up.user_id
               JOIN products p ON up.product_id = p.productid
               WHERE u.username = ?`;

  if (search) {
    query += " AND p.productname LIKE '%" + search + "%'";
  }

  if (filter) {
    if (filter == "Sort Asc") {
      query += " ORDER BY p.productname ASC";
    }
    else if (filter == "Sort Desc") {
      query += " ORDER BY p.productname DESC";
    }
  }

  query += " LIMIT " + limit + " OFFSET " + offset;

  con.query(query, [req.username], function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
}