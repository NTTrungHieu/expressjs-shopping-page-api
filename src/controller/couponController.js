const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");
const Coupon = require("../models/couponModel");

const createCoupon = asyncHandler(async (req, res) => {
  const newCoupon = await Coupon.create(req.body);
  res.json(newCoupon);
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

const updateCoupon = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedCoupon);
});

const removeCoupon = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const removedCoupon = await Coupon.findByIdAndDelete(id);
  res.json(removedCoupon);
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  removeCoupon,
};
