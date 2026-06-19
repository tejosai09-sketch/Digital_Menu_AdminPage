const express = require("express");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  createRazorpayOrder,
  updatePaymentStatus,
} = require("../controllers/orderController");
router.post("/", createOrder);
router.get("/", getAllOrders);
router.post("/create-payment-order", createRazorpayOrder);
router.put("/:id/status", updateOrderStatus);
router.get("/:id", getOrderById);
router.put("/:id/payment-status", updatePaymentStatus);
module.exports = router;