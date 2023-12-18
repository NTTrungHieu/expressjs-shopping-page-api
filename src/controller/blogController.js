const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogModel");
const { validateMongoId } = require("../utils/validate");

const createBlog = asyncHandler(async (req, res) => {
  req.body.Author = req.body?.Name || req.user.FullName;
  const newBlog = await Blog.create(req.body);
  res.json({ newBlog });
});

const updateBlog = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json({ updatedBlog });
});

const getBlog = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const blog = await Blog.findByIdAndUpdate(
    id,
    {
      $inc: { Views: 1 },
    },
    { new: true }
  );
  res.json({ blog });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();
  res.json({ blogs });
});

const removeBlog = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const removedBlog = await Blog.findByIdAndDelete(id);
  res.json({ removedBlog });
});

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, removeBlog };
