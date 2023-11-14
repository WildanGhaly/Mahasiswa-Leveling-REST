const express = require("express");
const router = express.Router();
const { checkToken } = require("../middleware/authMiddleware");
const historyController = require("../controllers/historyController");

router.get("/", checkToken, historyController.getHistory);

module.exports = router;
