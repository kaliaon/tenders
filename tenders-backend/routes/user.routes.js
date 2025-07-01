const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require("../controllers/user.controller");
const {
  getUserSubscriptions,
} = require("../controllers/subscription.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Apply the protect middleware to all routes in this router
// This will NOT affect other routers like auth.routes.js
router.use(protect);

router.route("/:id").get(getUserProfile).put(updateUserProfile);

router.put("/:id/password", changePassword);
router.get("/:id/subscriptions", getUserSubscriptions);

module.exports = router;
