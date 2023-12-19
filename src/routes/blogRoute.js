const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  getBlog,
  removeBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
  deleteImages,
} = require("../controller/blogController");
const { uploadPhoto, resizeBlogImage } = require("../middlewares/uploadImages");
const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlog);

// must login and be an admin
router.use(authMiddleware);
router.use(isAdmin);
router.post("/", createBlog);
router.put("/like/:blogId", likeBlog);
router.put("/dislike/:blogId", dislikeBlog);
router.put(
  "/upload/:id",
  uploadPhoto.array("images", 10),
  resizeBlogImage,
  uploadImages
);
router.put("/:id", updateBlog);
router.delete("/delete-images/:id", deleteImages);
router.delete("/:id", removeBlog);

module.exports = router;
