// userController.js

const con = require("../database/database.js");

exports.checkStatus = (req, res) => {

  console.log("Mengecek status pengguna...", req.username);

  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  return res.json({ isLoggedIn: true, username: req.username });
};

exports.getUserData = (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  console.log("Mengambil data pengguna...", req.username);

  con.query(
    "SELECT name, email FROM users WHERE username = ?",
    [req.username],
    function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        res.json({
          username: req.username,
          name: result[0].name,
          email: result[0].email,
        });
      } else {
        res.sendStatus(401);
      }
    }
  );
};
