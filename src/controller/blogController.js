const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogModel");
const { validateMongoId } = require("../utils/validate");
const fs = require("fs");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

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
  const userName = "FirstName LastName";
  await blog.populate({ path: "Likes", select: userName });
  await blog.populate({ path: "Dislikes", select: userName });
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

const likeBlog = asyncHandler(async (req, res) => {
  const blogId = validateMongoId(req.params.blogId);
  const blog = await Blog.findById(blogId);
  const userId = req.user._id;
  let IsLiked = await blog.Likes.find(
    (id) => id.toString() === userId.toString()
  );
  let IsDisliked = await blog.Dislikes.find(
    (id) => id.toString() === userId.toString()
  );
  const updatedObj = {};
  if (IsLiked) {
    (IsLiked = false), (updatedObj.$pull = { Likes: userId });
  } else {
    IsLiked = true;
    if (IsDisliked) {
      updatedObj.$pull = { Dislikes: userId };
    }
    updatedObj.$push = { Likes: userId };
  }
  IsDisliked = false;
  const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedObj, {
    new: true,
  });
  res.json({ ...updatedBlog._doc, IsLiked, IsDisliked });
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const blogId = validateMongoId(req.params.blogId);
  const blog = await Blog.findById(blogId);
  const userId = req.user._id;
  let IsLiked = await blog.Likes.find(
    (id) => id.toString() === userId.toString()
  );
  let IsDisliked = await blog.Dislikes.find(
    (id) => id.toString() === userId.toString()
  );
  const updatedObj = {};
  if (IsDisliked) {
    (IsDisliked = false), (updatedObj.$pull = { Dislikes: userId });
  } else {
    IsDisliked = true;
    if (IsLiked) {
      updatedObj.$pull = { Likes: userId };
    }
    updatedObj.$push = { Dislikes: userId };
  }
  IsLiked = false;
  const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedObj, {
    new: true,
  });
  res.json({ ...updatedBlog._doc, IsLiked, IsDisliked });
});

const uploadImages = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const urls = [];
  for (const file of req.files) {
    const newPath = await cloudinaryUploadImage(file.path, "blogs");
    urls.push(newPath);
  }
  const blog = await Blog.findById(id);
  blog.Images.push(...urls);
  await blog.save();
  return res.json(blog);
});

const deleteImages = asyncHandler(async (req, res) => {
  const publicIdList = req.body.Images;
  const id = validateMongoId(req.params.id);
  const updateArr = [];
  for (const public_id of publicIdList) {
    await cloudinaryDeleteImage(public_id);
    updateArr.push({
      updateOne: {
        filter: { _id: id },
        update: { $pull: { Images: { PublicId: public_id } } },
      },
    });
  }
  const updatedBlog = await Blog.bulkWrite(updateArr);
  return res.json(updatedBlog);
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  removeBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
  deleteImages,
};
