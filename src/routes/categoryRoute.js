const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createCategory, getAllCategories, getCategory, updateCategory, removeCategory } = require("../controller/categoryController");
const router = express.Router();

router.get("/get-all/:type", getAllCategories);
router.get("/:id", getCategory);

// must login and be an admin
router.use(authMiddleware);
router.use(isAdmin);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", removeCategory);

module.exports = router;
