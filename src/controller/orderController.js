const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");
const { randomUUID } = require("crypto");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const createOrder = asyncHandler(async (req, res) => {
  const { COD } = req.body;
  const id = req.user._id;
  if (!COD) throw new Error(`Create cash order failed`);
  const cart = await Cart.findOne({ User: id });
  const finalAmount = cart?.TotalAfterDiscount || cart.CartTotal;
  const newOrder = await new Order({
    Products: cart.Products,
    PaymentIntent: {
      id: randomUUID(),
      method: "COD",
      amount: finalAmount,
      status: "Cash on Delivery",
      created: Date.now(),
      currency: "usd",
    },
    OrderBy: id,
    OrderStatus: "Cash on Delivery",
  }).save();
  const updateArr = cart.Products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.Product },
        update: { $inc: { Quantity: -item.Quantity, Sold: +item.Quantity } },
      },
    };
  });
  const updatedProduct = await Product.bulkWrite(updateArr);
  res.json({ newOrder });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("Products.Product")
    .populate("OrderBy");
  res.json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const order = await Order.findById(id)
    .populate("Products.Product")
    .populate("OrderBy");
  res.json(order);
});

const getAllOrdersByUserId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ OrderBy: req.user._id })
    .populate("Products.Product")
    .populate("OrderBy");
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const status = req.body.Status;
  const id = validateMongoId(req.params.id);
  const updateOrderStatus = await Order.findByIdAndUpdate(
    id,
    {
      $set: {
        "OrderStatus": status,
        "PaymentIntent.status": status,
      }
    },
    { new: true }
  );
  res.json(updateOrderStatus);
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  getAllOrdersByUserId,
  updateOrderStatus,
};
