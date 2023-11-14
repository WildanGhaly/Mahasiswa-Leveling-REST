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
