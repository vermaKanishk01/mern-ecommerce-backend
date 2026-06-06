const express = require("express");
const { addToCart, getCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/protect");

const cartRouter = express.Router();

cartRouter.post("/add", protect, addToCart);
cartRouter.get("/", protect, getCart);
cartRouter.put("/update", protect, updateCartItem);
cartRouter.delete("/remove", protect, removeFromCart);
cartRouter.delete("/clear", protect, clearCart);

module.exports = cartRouter;