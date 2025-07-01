const express = require("express");
const {
  getAllTenders,
  getTender,
  createTender,
  updateTender,
  deleteTender,
  searchTenders,
  filterTenders,
} = require("../controllers/tender.controller");
const {
  subscribeTender,
  unsubscribeTender,
  checkSubscription,
} = require("../controllers/subscription.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllTenders);
router.get("/search", searchTenders);
router.get("/filter", filterTenders);
router.get("/:id", getTender);

// Protected routes
router.use(protect);
router.post("/", createTender);
router.route("/:id").put(updateTender).delete(deleteTender);

// Subscription routes
router.route("/:id/subscribe").post(subscribeTender).delete(unsubscribeTender);

router.get("/:tenderId/subscriptions/:userId", checkSubscription);

module.exports = router;
