// topupRoutes.js

const express = require("express");
const router = express.Router();
const { checkToken } = require("../middleware/authMiddleware");
const pointsController = require("../controllers/topupController");

router.post("/", checkToken, pointsController.updatePoints);

module.exports = router;
