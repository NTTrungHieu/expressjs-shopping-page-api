const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    Brand: {
      type: String,
      enum: ["Apple", "Samsung", "Lenovo"],
    },
    Quantity: Number,
    Sold: {
      type: Number,
      default: 0,
    },
    Images: {
      type: Array,
      required: true,
    },
    Color: {
      type: String,
      enum: ["Black", "Brown", "Red"],
    },
    Ratings: [
      {
        Star: Number,
        PostedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
