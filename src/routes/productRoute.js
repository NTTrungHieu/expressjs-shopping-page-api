const express = require("express");
const {
  createProduct,
  getOneProduct,
  getAllProduct,
} = require("../controller/productController");
const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProduct);
router.get("/:id", getOneProduct);

module.exports = router;
