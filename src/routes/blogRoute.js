const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createBlog, getAllBlogs, updateBlog, getBlog, removeBlog, likeBlog, dislikeBlog } = require("../controller/blogController");
const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlog);

// must login and be an admin
router.use(authMiddleware);
router.use(isAdmin);
router.post("/", createBlog);
router.put("/like/:blogId", likeBlog);
router.put("/dislike/:blogId", dislikeBlog);
router.put("/:id", updateBlog);
router.delete("/:id", removeBlog);

module.exports = router;
