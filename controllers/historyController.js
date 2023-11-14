// historyController.js

const con = require("../database/database.js");

exports.getHistory = (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  const query = `
    SELECT h.history_id as HistoryID, h.quantity as HistoryQuantity,
           p.productname as HistoryProductName, h.timestamp as HistoryDate,
           p.imagepath as HistoryImagePath
    FROM users u
    JOIN history h ON u.id = h.user_id
    JOIN products p ON p.productid = h.product_id
    WHERE username = ?`;

  con.query(query, [req.username], function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
};
