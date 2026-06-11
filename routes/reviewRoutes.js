const express = require("express");
const { addReview, getProductReviews, deleteReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/protect");

const reviewRouter = express.Router();

reviewRouter.post("/", protect, addReview);
reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.delete("/:id", protect, deleteReview);

module.exports = reviewRouter;