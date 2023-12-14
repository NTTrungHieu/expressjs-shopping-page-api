const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (req.body?.Title) {
    req.body.Slug = slugify(req.body.Title);
  }
  const product = await Product.create(req.body);
  res.json({ product });
});

const updateProduct = asyncHandler(async (req, res) => {
  if (req.body?.Title) {
    req.body.Slug = slugify(req.body.Title);
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json(updatedProduct);
});

const removeProduct = asyncHandler(async (req, res) => {
  const removedProduct = await Product.findByIdAndDelete(req.params.id);
  res.json(removedProduct);
});

const getOneProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json({ product });
});

const getAllProduct = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((e) => delete queryObj[e]);
  const query = Product.find(queryObj);

  // sorting
  let sortStr = req.query?.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";
  query.sort(sortStr);

  // limiting the fields
  let fields = req.query?.fields
    ? req.query.fields.split(",").join(" ")
    : "-__v";
  query.select(fields);

  // pagination
  let limitedNumber = req.query?.limit || 10;
  let pageNumber = req.query?.page - 1 || 0;
  let skipNumber = pageNumber * limitedNumber;
  query.skip(skipNumber).limit(limitedNumber);

  const products = await query;
  res.json({ products });
});

module.exports = {
  createProduct,
  getOneProduct,
  getAllProduct,
  updateProduct,
  removeProduct,
};
