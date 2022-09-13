"use strict";

const router = require("express").Router();

const {
  register,
  login,
  refreshToken,
  changePassword,
  userExists,
  verifyUser,
} = require("../../controllers/api/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/change-password", changePassword);
router.post("/user-exists", userExists);
router.post("/verify-user", verifyUser);

module.exports = router;
