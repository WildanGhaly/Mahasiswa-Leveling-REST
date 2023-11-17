// moneyRoutes.js

const express = require("express");
const router = express.Router();
const { checkToken } = require("../middleware/authMiddleware");
const moneyController = require("../controllers/moneyController");

router.get("/", checkToken, moneyController.getMoney);
router.patch("/", checkToken, moneyController.convertMoney);

module.exports = router;