const express = require("express");
const { register, login, logout, getCurrentUser } = require("../controllers/authController.js");
const { verifyToken } = require("../middlewares/authMiddleware.js");
const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;