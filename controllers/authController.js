// authController.js

const jwt = require("jsonwebtoken");
const con = require("../database/database.js");
const { generateAccessToken, deleteRefreshToken } = require("../middleware/tokenMiddleware.js");
const { addRefreshToken } = require("../middleware/tokenMiddleware.js");
const util = require("util");
const { checkCode } = require("../templates/soap_template");
const axios = require('axios');
const { parseString } = require('xml2js');

exports.login = (req, res) => {
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
};

exports.register = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const code = req.body.code;

  
  con.query("SELECT IFNULL(MAX(id), 0) + 1 AS next_user_id FROM users", function (err, result, fields) {
    if (err) throw err;
    const userId = result[0].next_user_id;
    const xml = util.format(checkCode.template, code, userId);
    axios.post(checkCode.url, xml, {
      headers: checkCode.headers
    })
    .then(response => {
      const { data } = response;
  
      parseString(data, (err, result) => {
        if (err) {
          console.error('Error parsing SOAP response:', err);
          throw err;
         
        }
        const returnValue = result['S:Envelope']['S:Body'][0]['ns2:checkCodeResponse'][0]['return'][0];
        if (returnValue === '1') {
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
              res.json({ user: user, success: true});
            }
          );
        } else {
          res.json({ success: false, message: "Invalid code" });
        }
      })
    });

  });

  // console.log("Registering... ", username, password);
  // con.query(
  //   "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
  //   [username, email, password],
  //   function (err, result, fields) {
  //     if (err) throw err;
  //     const user = { name: username };
  //     const accessToken = generateAccessToken(user);
  //     const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  //     addRefreshToken(refreshToken);
  //     res.cookie("test", "hello world", {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "none",
  //     });
  //     res.cookie("accessToken", accessToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "none",
  //     });
  //     res.cookie("refreshToken", refreshToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "none",
  //     });
  //     res.json({ user: user });
  //   }
  // );
};

exports.generateAccessTokenFromRefreshToken = (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (isValidRefreshToken(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ name: user.name });
      res.json({ accessToken: accessToken });
    });
  };
  
exports.logout = (req, res) => {
    console.log("Logging out...");
    const refreshToken = req.cookies.refreshToken;
    deleteRefreshToken(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.sendStatus(204);
};