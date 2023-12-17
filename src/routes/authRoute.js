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
  handleRefreshToken,
  logout,
  updatePassword,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

// must login
router.use(authMiddleware);
router.get("/logout", logout);
router.get("/refresh", handleRefreshToken);
router.get("/all-users", getAllUser);
router.delete("/:id", removeOneUser);
router.put("/edit-user", updateUser);
router.put("/password", updatePassword);

// must be admin
router.use(isAdmin);
router.get("/:id", getOneUser);
router.put("/edit-user/:id", updateUser);
router.put("/block-user/:id", blockUser);
router.put("/unblock-user/:id", unblockUser);

module.exports = router;
