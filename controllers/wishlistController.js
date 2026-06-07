const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productModel");

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found", });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId],
      });

      return res.status(201).json({ success: true, message: "Product added to wishlist", data: wishlist, });
    }

    // Check if already exists
    const exists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      return res.status(400).json({ success: false, message: "Product already in wishlist", });
    }

    // Add product
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ success: true, message: "Product added to wishlist", data: wishlist, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found", });
    }

    const index = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not in wishlist", });
    }

    // Remove product
    wishlist.products.splice(index, 1);
    await wishlist.save();

    res.status(200).json({ success: true, message: "Product removed from wishlist", data: wishlist, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET WISHLIST
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("products");

    res.status(200).json({ success: true, data: wishlist || { products: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CLEAR WISHLIST (OPTIONAL BUT USEFUL)
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found", });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({ success: true, message: "Wishlist cleared", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
}