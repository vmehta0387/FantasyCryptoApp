const express = require("express");
const { loginUser, signUp, getUserDetails } = require("../controller/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signUp);

router.get("/profile", authMiddleware, getUserDetails);

module.exports = router;