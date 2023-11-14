// authController.js

const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { generateAccessToken } = require("../middleware/tokenMiddleware.js");
const con = require("../database/database.js");

const {
  addRefreshToken,
  isValidRefreshToken,
} = require("../middleware/tokenMiddleware.js");

const router = express.Router();
router.use(cookieParser());

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("Logging in... ", username, password);
  con.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        const user = { name: username };
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        addRefreshToken(refreshToken);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.json({ user: user });
      } else {
        res.sendStatus(401);
      }
    }
  );
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  console.log("Registering... ", username, password);
  con.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    function (err, result, fields) {
      if (err) throw err;
      const user = { name: username };
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      addRefreshToken(refreshToken);
      res.cookie("test", "hello world", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.json({ user: user });
    }
  );
});

module.exports = router;
