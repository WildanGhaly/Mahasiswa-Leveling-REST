// auth.js
require('dotenv').config();

const jwt = require('jsonwebtoken');
let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}

function addRefreshToken(token) {
  refreshTokens.push(token);
}

function isValidRefreshToken(token) {
  return refreshTokens.includes(token);
}

function deleteRefreshToken(refreshToken) {
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
}


module.exports = { 
    generateAccessToken, 
    authenticateToken,
    addRefreshToken,
    isValidRefreshToken,
    deleteRefreshToken,
};
