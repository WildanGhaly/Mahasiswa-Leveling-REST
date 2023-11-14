// userRoutes.js

const express = require("express");
const router = express.Router();
const { checkToken } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/check-status", checkToken, userController.checkStatus);

// Menggunakan middleware untuk memeriksa token pada '/user/data'
router.get("/data", checkToken, userController.getUserData);

module.exports = router;
