const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, size, color } = req.body;

    // Check product
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists (same product + size + color)
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity,
        size,
        color,
      });
    }

    await cart.save();

    res.status(200).json({ success: true, message: "Item added to cart", data: cart, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name images price stock"
    );

    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [], totalItems: 0, totalPrice: 0 }, });
    }

    res.status(200).json({ success: true, data: cart, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// UPDATE QUANTITY
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer", });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found", });
    }

    // Find item in cart
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Product not found in cart", });
    }

    // Get latest product data
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product no longer exists", });
    }

    if (!product.isActive) {
      return res.status(400).json({ success: false, message: "Product is currently unavailable", });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} item(s) available in stock`, });
    }

    // Update quantity
    item.quantity = quantity;

    await cart.save();

    return res.status(200).json({ success: true, message: "Cart updated successfully", data: cart, });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, });
  }
};


// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required", });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found", });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ success: false, message: "Product not found in cart", });
    }

    await cart.save();

    return res.status(200).json({ success: true, message: "Item removed from cart successfully", data: cart, });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, });
  }
};


// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found", });
    }

    if (cart.items.length === 0) {
      return res.status(200).json({ success: true, message: "Cart is already empty", data: cart, });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({success: true,message: "Cart cleared successfully",data: cart, });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}