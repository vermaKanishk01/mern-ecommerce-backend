const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Link to Order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Payment Info
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true,
    },

    // Gateway Details
    razorpayOrderId: { type: String }, 
    razorpayPaymentId: { type: String },

    paymentGateway: {
      type: String, // Razorpay, Stripe
    },

    gatewayResponse: {
      type: Object, // store full response for debugging
    },

    paidAt: Date,

    // Refund Support
    isRefunded: {
      type: Boolean,
      default: false,
    },

    refundedAt: Date,

    refundAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


// Indexing for faster queries
paymentSchema.index({ order: 1, user: 1 });

module.exports = mongoose.model("Payment", paymentSchema);