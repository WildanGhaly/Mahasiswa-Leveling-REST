// buyProductRoutes.js

const express = require("express");
const router = express.Router();
const { checkToken } = require("../middleware/authMiddleware");
const buyProductController = require("../controllers/buyProductController");

router.post("/", checkToken, buyProductController.buyProduct);

module.exports = router; 