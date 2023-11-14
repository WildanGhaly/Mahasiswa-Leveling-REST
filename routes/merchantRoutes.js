// merchantRoutes.js

const express = require("express");
const routes = express.Router();
const { checkToken } = require("../middleware/authMiddleware");
const merchantController = require("../controllers/merchantController");

routes.get("/", checkToken, merchantController.getMerchants);

module.exports = routes;
