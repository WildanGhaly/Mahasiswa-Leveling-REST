const express = require('express');
const router = express.Router();
const { checkToken } = require("../middleware/authMiddleware");
const con = require("../database/database.js");

router.get("/check-status", checkToken, (req, res) => {
    if (!req.isTokenValid) {
      return res.json({ isLoggedIn: false, username: null });
    }
  
    return res.json({ isLoggedIn: true, username: req.username });
  });
  
  // Menggunakan middleware untuk memeriksa token pada '/user/data'
router.get("/data", checkToken, (req, res) => {
    if (!req.isTokenValid) {
      return res.json({ isLoggedIn: false, username: null });
    }
  
    console.log("Mengambil data pengguna...", req.username);
  
    con.query(
      "SELECT name, email, points FROM users WHERE username = ?",
      [req.username],
      function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
          res.json({
            username: req.username,
            name: result[0].name,
            email: result[0].email,
            points: result[0].points,
          });
        } else {
          res.sendStatus(401);
        }
      }
    );
  });

module.exports = router;