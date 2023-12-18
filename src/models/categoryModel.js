const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true, 
    },
    Type: {
      type: String,
      required: true,
      default: "product"
    }
  },
  {
    new: true,
  }
);

categorySchema.index({Title: 1, Type: 1}, {unique: true})

const Category = mongoose.model("Category", categorySchema);
//Export the model
module.exports = Category;
