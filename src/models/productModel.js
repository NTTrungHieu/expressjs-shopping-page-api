const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
      trim: true,
    },
    Slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Brand: {
      type: String,
      required: true,
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
      required: true,
    },
    Ratings: [
      {
        Star: Number,
        Comment: String,
        PostedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    AverageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

//Export the model
module.exports = Product;
