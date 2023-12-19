const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  getCart,
  updateCart,
  clearCart,
  applyCoupon,
} = require("../controller/cartController");
const router = express.Router();

// must login and be an admin
router.use(authMiddleware);

router.get("/", getCart);

router.post("/apply-coupon", applyCoupon);
router.post("/", updateCart);

router.delete("/", clearCart);

module.exports = router;
