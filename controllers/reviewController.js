const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// ADD REVIEW
const addReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found", });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: "You already reviewed this product", });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, message: "Review added", data: review, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found", });
    }

    // Only owner or admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized", });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Review deleted", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET PRODUCT REVIEWS
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReview,
  deleteReview,
  getProductReviews
}