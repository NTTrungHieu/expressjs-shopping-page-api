const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { getAllBrands, getBrand, createBrand, updateBrand, removeBrand } = require("../controller/brandController");
const router = express.Router();

router.get("/", getAllBrands);
router.get("/:id", getBrand);

// must login and be an admin
router.use(authMiddleware);
router.use(isAdmin);
router.post("/", createBrand);
router.put("/:id", updateBrand);
router.delete("/:id", removeBrand);

module.exports = router;
