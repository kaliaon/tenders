const express = require("express");
const { login, register } = require("../controllers/auth.controller");

const router = express.Router();

// Public routes - these should NOT be protected by authentication
router.post("/login", login);
router.post("/register", register);

module.exports = router;
