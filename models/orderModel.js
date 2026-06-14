const mongoose = require("mongoose");

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },

  size: {
    type: String,
  },

  color: {
    type: String,
  },
}, { _id: true } // keep _id for updates if needed
);


// Order Schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  orderItems: [orderItemSchema],

  // Pricing
  totalItems: {
    type: Number,
    required: true,
    default: 0,
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  shippingPrice: {
    type: Number,
    default: 0,
  },

  taxPrice: {
    type: Number,
    default: 0,
  },

  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  // Shipping Address
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "India" },
  },

  // Payment Info
  paymentMethod: {
    type: String,
    // required: true,
    enum: ["COD", "Card", "UPI"],
  },

  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  isPaid: {
    type: Boolean,
    default: false,
  },

  paidAt: Date,

  // Delivery Status
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },

  deliveredAt: Date,

}, { timestamps: true, });


// Auto calculate totals before saving
orderSchema.pre("save", function (next) {
  this.totalItems = this.orderItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  this.itemsPrice = this.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  this.totalPrice = this.itemsPrice + this.shippingPrice + this.taxPrice;
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;