const express = require("express");
const authenticateUser = require("../middlewares/auth");

const {
    createProduct,
    getAllMusicProducts,
    getProductsById,
    setCart,
    getCartProducts,
} = require("../controllers/Product");

const productRouter = express.Router();

productRouter
  .route("/api")
  .post(authenticateUser,createProduct)

productRouter.route("/getAllMusicProducts").get(getAllMusicProducts);
productRouter.route("/").get(getProductsById);
productRouter.route("/:id/cart/:user").put(setCart);
productRouter.route("/getCart/:user").get(getCartProducts);

module.exports = productRouter;