const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    Products: [
      {
        Product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        Quantity: Number,
        Color: String,
      },
    ],
    CartTotal: {
      type: Number,
      default: 0,
    },
    TotalAfterDiscount: {
      type: Number,
      default: 0,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

//Export the model
module.exports = Cart;
