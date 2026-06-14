const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const crypto = require("crypto");
const razorpay = require("../config/razorpay"); 

const mongoose = require("mongoose");

const createPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, paymentMethod } = req.body;

    const allowedMethods = ["COD", "Card", "UPI"];

    if (!allowedMethods.includes(paymentMethod)) {
      throw new Error("Invalid payment method");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized access");
    }

    if (order.isPaid) {
      throw new Error("Order already paid");
    }

    const existingPayment = await Payment.findOne({
      order: orderId,
      paymentStatus: "pending",
    });

    if (existingPayment) {
      throw new Error("Payment already initiated");
    }

    let paymentData = {
      order: order._id,
      user: userId,
      amount: order.totalPrice,
      paymentMethod,
      paymentStatus: "pending",
    };

    // COD
    if (paymentMethod === "COD") {
      order.paymentStatus = "cod_pending";
      order.paymentMethod = "COD";
      await order.save();

      const payment = await Payment.create(paymentData);

      return res.status(200).json({ success: true, message: "COD order placed", data: payment, });
    }

    // Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalPrice * 100,
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.paymentMethod = paymentMethod;
    order.save();

    paymentData.paymentGateway = "Razorpay";
    paymentData.razorpayOrderId = razorpayOrder.id;

    const payment = await Payment.create(paymentData);

    res.status(200).json({
      success: true,
      message: "Payment initiated",
      data: {
        paymentId: payment._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature", });
    }

    // Fetch payment/order from Razorpay
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);

    // Extra safety check
    if (razorpayOrder.status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed", });
    }

    // Find payment in DB
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id, });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found", });
    }

    // Update payment
    payment.paymentStatus = "success";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.paidAt = new Date();
    payment.gatewayResponse = razorpayOrder;

    await payment.save();

    // Update order
    const order = await Order.findById(payment.order);

    order.isPaid = true;
    order.paymentStatus = "paid";
    order.paidAt = new Date();

    await order.save();

    res.status(200).json({ success: true, message: "Payment verified successfully", });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  getUserPayments,
  getAllPayments,
}