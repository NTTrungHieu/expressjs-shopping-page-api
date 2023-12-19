const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");
const Coupon = require("../models/couponModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const getCart = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const cart = await Cart.findOne({ User: id }).populate(
    "Products.Product",
    "_id Title Price Images"
  );
  res.json({ cart });
});

const updateCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const userId = req.user._id;
  let products = [];
  // check if user already have product in cart
  await Cart.findOneAndDelete({ User: userId });
  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.Product = cart[i]._id;
    object.Quantity = cart[i].Quantity;
    object.Color = cart[i].Color;
    let getPrice = await Product.findById(cart[i]._id).select("Price").exec();
    object.Price = getPrice.Price;
    products.push(object);
  }
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].Price * products[i].Quantity;
  }
  let newCart = await new Cart({
    Products: products,
    CartTotal: cartTotal,
    User: userId,
  }).save();
  newCart = await newCart.populate("Products.Product");
  res.json(newCart);
});

const clearCart = asyncHandler(async (req, res) => {
  const emptyCart = await Cart.findOneAndDelete({ User: req.user._id });
  res.json(emptyCart);
});

const applyCoupon = asyncHandler(async (req, res) => {
  const coupon = req.body.Coupon;
  const validCoupon = await Coupon.findOne({ Name: coupon });
  const cart = await Cart.findOne({ User: req.user._id });
  if (validCoupon) {
    const priceDiscounted = (validCoupon.Discount * cart.CartTotal) / 100;
    cart.TotalAfterDiscount = cart.CartTotal - priceDiscounted.toFixed(2);
    await cart.save();
    res.json({ TotalAfterDiscount: cart.TotalAfterDiscount });
  } else {
    throw new Error("Invalid Coupon.");
  }
});

module.exports = { getCart, updateCart, clearCart, applyCoupon };
