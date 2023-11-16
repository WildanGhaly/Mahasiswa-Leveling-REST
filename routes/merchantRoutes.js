// merchantRoutes.js

const express = require("express");
const routes = express.Router();
const { checkToken } = require("../middleware/authMiddleware");
const merchantController = require("../controllers/merchantController");

routes.get("/page/:page/limit/:limit/search/:search/filter/:filter", checkToken, merchantController.getMerchantByPage);
routes.get("/page/:page/limit/:limit/search/:search", checkToken, merchantController.getMerchantByPage);
routes.get("/page/:page/limit/:limit/filter/:filter", checkToken, merchantController.getMerchantByPage);
routes.get("/page/:page/limit/:limit", checkToken, merchantController.getMerchantByPage);

routes.get("/", checkToken, merchantController.getMerchants);

routes.get("/count", checkToken, merchantController.getTotalMerchants);
routes.get("/count/search/:search", checkToken, merchantController.getTotalMerchants);
routes.get("/count/filter/:filter", checkToken, merchantController.getTotalMerchants);
routes.get("/count/search/:search/filter/:filter", checkToken, merchantController.getTotalMerchants);

module.exports = routes;
