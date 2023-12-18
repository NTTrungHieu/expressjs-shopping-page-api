const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  removeCoupon,
} = require("../controller/couponController");
const router = express.Router();

// must login and be an admin
router.use(authMiddleware);
router.use(isAdmin);
router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.put("/:id", updateCoupon);
router.delete("/:id", removeCoupon);

module.exports = router;
