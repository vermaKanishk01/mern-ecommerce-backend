const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");


// CREATE ORDER (FROM CART)
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty", });
    }

    let orderItems = [];

    // Validate cart items
    for (let item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product not available`, });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}`, });
      }

      // Push fresh data (NOT from cart blindly)
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price, // latest price
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, message: "Order placed successfully", data: order, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// BUY NOW (Single Product)
const buyNow = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, size, color, shippingAddress, paymentMethod } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    const order = await Order.create({
      user: userId,
      orderItems: [
        {
          product: product._id,
          name: product.name,
          image: product?.images?.[0] || "",
          price: product.price,
          quantity,
          size,
          color,
        },
      ],
      shippingAddress,
      paymentMethod,
    });

    // reduce stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({ success: true, message: "Order placed successfully", data: order, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET ORDERS OF PARTICULAR USER
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET ALL ORDERS - ADMIN ONLY
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found", });
    }

    order.orderStatus = status;

    if (status === "delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", data: order, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// CANCEL ORDER
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only allow cancel if not shipped
    if (order.orderStatus !== "pending") {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled", });
    }

    order.orderStatus = "cancelled";

    // restore stock
    for (let item of order.orderItems) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      await product.save();
    }

    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  buyNow,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
}