const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Views: {
      type: Number,
      default: 0,
    },
    Likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Image: {
      type: String,
      default:
        "https://www.toponseek.com/blogs/wp-content/uploads/2022/06/viet-blog-3.jpg",
    },
    Author: {
      type: String,
      default: "Admin",
    },
    Images: [],
  },
  {
    ToJSON: {
      virtuals: true,
    },
    ToObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

//Export the model
module.exports = Blog;
