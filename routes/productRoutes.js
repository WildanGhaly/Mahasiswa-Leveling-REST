// productRoutes.js

const express = require("express");
const routes = express.Router();
const productsController = require("../controllers/productsController");

routes.get("/", productsController.getProducts);
routes.get("/count", productsController.getTotalProducts);
routes.get("/:id", productsController.getProductsByID);

module.exports = routes;
