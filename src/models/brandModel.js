const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      unique: true,
      required: true, 
    }
  },
  {
    new: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);
//Export the model
module.exports = Brand;
