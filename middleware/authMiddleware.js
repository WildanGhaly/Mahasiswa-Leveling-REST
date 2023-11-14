const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("./tokenMiddleware.js");

exports.checkToken = (req, res, next) => {
  const refreshTokens = req.cookies.refreshToken;
  const accessTokens = req.cookies.accessToken;

  var isTokenValid = false;
  var username = null;

  if (accessTokens) {
    jwt.verify(accessTokens, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (!err) {
        isTokenValid = true;
        username = user.name;
      }
    });
  }

  if (!isTokenValid && refreshTokens) {
    jwt.verify(refreshTokens, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (!err) {
        const accessToken = generateAccessToken({ name: user.name });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        isTokenValid = true;
        username = user.name;
      }
    });
  }

  req.isTokenValid = isTokenValid;
  req.username = username;
  next();
};
