const express = require("express");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById
} = require("../controllers/orderController");
router.post("/", createOrder);
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);
router.get("/:id", getOrderById);
module.exports = router;