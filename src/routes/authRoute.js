const express = require("express");
const {
  createUser,
  loginUser,
  getAllUser,
  getOneUser,
  removeOneUser,
  updateUser,
  blockUser,
  unblockUser,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.use(authMiddleware);
router.get("/all-users", getAllUser);
router.get("/:id", isAdmin, getOneUser);
router.delete("/:id", removeOneUser);
router.put("/edit-user", updateUser);
router.put("/edit-user/:id", isAdmin, updateUser);
router.put("/block-user/:id", isAdmin, blockUser);
router.put("/unblock-user/:id", isAdmin, unblockUser);

module.exports = router;
