"use strict";

const router = require("express").Router();

const { route } = require("express/lib/application");
const {
  register,
  login,
  refreshToken,
  changePassword,
  userExists,
  verifyUser,
  getAuthTokens,
  deleteAuthTokens,
} = require("../../controllers/api/auth.controller");

const { verifyToken } = require("../../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.post("/change-password", changePassword);
router.post("/user-exists", userExists);
router.post("/verify-user", verifyUser); // delete on production

router.get("/auth-tokens", verifyToken, getAuthTokens);
router.delete("/auth-tokens", verifyToken, deleteAuthTokens);

module.exports = router;
