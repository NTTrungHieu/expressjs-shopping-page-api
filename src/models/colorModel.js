const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var colorSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      unique: true,
      required: true, 
    },
    Value: {
      type: String,
      required: true, 
    }
  },
  {
    new: true,
  }
);

const Color = mongoose.model("Color", colorSchema);
//Export the model
module.exports = Color;
