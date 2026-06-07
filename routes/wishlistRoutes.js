const express = require("express");
const { protect } = require("../middleware/protect");
const { addToWishlist, removeFromWishlist, getWishlist, clearWishlist } = require("../controllers/wishlistController");

const wishlistRouter = express.Router();

wishlistRouter.post("/", protect, addToWishlist);
wishlistRouter.get("/", protect, getWishlist);
wishlistRouter.patch("/:productId", protect, removeFromWishlist);
wishlistRouter.delete("/", protect, clearWishlist);

module.exports = wishlistRouter;