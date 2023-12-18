const express = require("express");
const {
  createProduct,
  getOneProduct,
  getAllProduct,
  updateProduct,
  removeProduct,
  addToWishList,
  rateProduct,
  uploadImages,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { resizeProductImage, uploadPhoto } = require("../middlewares/uploadImages");
const router = express.Router();

router.get("/:id", getOneProduct);
router.get("/", getAllProduct);

// must login
router.use(authMiddleware);
router.put("/wishlist/:id", addToWishList);
router.put("/rate/:id", rateProduct);

// must be an admin
router.use(isAdmin);
router.post("/", createProduct);
router.put("/upload/:id", uploadPhoto.array("images",10), resizeProductImage, uploadImages);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);

module.exports = router;
