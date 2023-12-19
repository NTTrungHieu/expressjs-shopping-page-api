const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  createOrder,
  getAllOrders,
  getOrder,
  getAllOrdersByUserId,
  updateOrderStatus,
} = require("../controller/orderController");
const router = express.Router();

// must login
router.use(authMiddleware);
router.get("/user-orders", getAllOrdersByUserId);
router.post("/", createOrder);

// must be an admin
router.use(isAdmin);
router.get("/all-orders", getAllOrders);
router.get("/:id", getOrder);
router.put("/update-order/:id", updateOrderStatus);

module.exports = router;
