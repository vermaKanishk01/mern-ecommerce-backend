const express = require("express");
const { protect, restrictTo } = require("../middleware/protect");
const { createOrder, buyNow, getUserOrders, cancelOrder, getAllOrders, updateOrderStatus } = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.post("/", protect, createOrder);
orderRouter.post("/buy-now", protect, buyNow);
orderRouter.get("/my-orders", protect, getUserOrders);
orderRouter.put("/:id/cancel", protect, cancelOrder);

// ADMIN
orderRouter.get("/", protect, restrictTo("admin"), getAllOrders);
orderRouter.put("/:id/status", protect, restrictTo("admin"), updateOrderStatus);

module.exports = orderRouter;