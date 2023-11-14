const express = require("express");
const router = express.Router();
const con = require("../database/database.js");
const { checkToken } = require("../middleware/authMiddleware");

router.post("/", checkToken, (req, res) => {
    if (!req.isTokenValid) {
      return res.json({ isLoggedIn: false, username: null });
    }
  
    const query = "UPDATE users SET points = points + ? WHERE username = ?";
  
    con.query(
      query,
      [req.body.amount, req.username],
      function (err, result, fields) {
        if (err) throw err;
        res.json({ success: true });
      }
    );
});

module.exports = router;