const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { getAllColors, getColor, createColor, updateColor, removeColor } = require("../controller/colorController");
const router = express.Router();

router.get("/", getAllColors);
router.get("/:id", getColor);

// must login and be an admin
router.use(authMiddleware);
router.use(isAdmin);
router.post("/", createColor);
router.put("/:id", updateColor);
router.delete("/:id", removeColor);

module.exports = router;
