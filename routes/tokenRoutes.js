const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isValidRefreshToken, generateAccessToken, deleteRefreshToken } = require("../middleware/tokenMiddleware.js");

router.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (isValidRefreshToken(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ name: user.name });
      res.json({ accessToken: accessToken });
    });
});
  
  // Endpoint to logout
router.delete("/logout", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    deleteRefreshToken(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.sendStatus(204);
});

module.exports = router;