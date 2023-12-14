const express = require("express");
const {
  createProduct,
  getOneProduct,
  getAllProduct,
  updateProduct,
  removeProduct,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:id", getOneProduct);
router.get("/", getAllProduct);
router.use(authMiddleware);
router.use(isAdmin);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);

module.exports = router;
