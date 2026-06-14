const express = require("express");
const { protect, restrictTo } = require("../middleware/protect");
const { createPayment, verifyPayment, getUserPayments, getAllPayments } = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.post("/create", protect, createPayment);
paymentRouter.post("/verify", protect, verifyPayment);
paymentRouter.get("/my", protect, getUserPayments);

// ADMIN
paymentRouter.get("/", protect, restrictTo("admin"), getAllPayments);

module.exports = paymentRouter;