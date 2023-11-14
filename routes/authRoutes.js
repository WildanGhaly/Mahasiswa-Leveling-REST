const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);
router.post("/token", authController.generateAccessTokenFromRefreshToken);

module.exports = router;
