const Subscription = require("../models/subscription.model");
const Tender = require("../models/tender.model");

// Helper function to format tender for API response
const formatTenderForResponse = (tender) => {
  if (!tender) return null;

  // Clone the tender to avoid modifying the original
  const formattedTender = { ...tender.get({ plain: true }) };

  // Add the formatted createdAt from the prototype method
  formattedTender.createdAt = tender.getFormattedCreatedAt();

  return formattedTender;
};

// @desc    Subscribe to tender
// @route   POST /api/tenders/:id/subscribe
// @access  Private
exports.subscribeTender = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const tenderId = req.params.id;

    // Check if tender exists
    const tender = await Tender.findByPk(tenderId);
    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found",
      });
    }

    // Ensure user can only subscribe themselves or admin can subscribe users
    if (parseInt(userId) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to subscribe this user",
      });
    }

    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
      where: {
        tenderId,
        userId,
      },
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "User already subscribed to this tender",
      });
    }

    // Create subscription
    const subscription = await Subscription.create({
      tenderId,
      userId,
    });

    res.status(201).json(subscription);
  } catch (err) {
    next(err);
  }
};

// @desc    Unsubscribe from tender
// @route   DELETE /api/tenders/:id/subscribe
// @access  Private
exports.unsubscribeTender = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const tenderId = req.params.id;

    // Check if tender exists
    const tender = await Tender.findByPk(tenderId);
    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found",
      });
    }

    // Ensure user can only unsubscribe themselves or admin can unsubscribe users
    if (parseInt(userId) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to unsubscribe this user",
      });
    }

    // Check if subscription exists
    const subscription = await Subscription.findOne({
      where: {
        tenderId,
        userId,
      },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Delete subscription
    await subscription.destroy();

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user subscriptions
// @route   GET /api/users/:id/subscriptions
// @access  Private
exports.getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Ensure user can only view their own subscriptions or admin can view any
    if (parseInt(userId) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these subscriptions",
      });
    }

    // Find all subscriptions for this user with associated tender data
    const subscriptions = await Subscription.findAll({
      where: { userId },
      include: [{ model: Tender, as: "tender" }],
    });

    // Format the response
    const subscriptionsWithTenders = subscriptions.map((subscription) => {
      return {
        subscription: subscription.get({ plain: true }),
        tender: formatTenderForResponse(subscription.tender),
      };
    });

    res.status(200).json(subscriptionsWithTenders);
  } catch (err) {
    next(err);
  }
};

// @desc    Check if user is subscribed to tender
// @route   GET /api/tenders/:tenderId/subscriptions/:userId
// @access  Private
exports.checkSubscription = async (req, res, next) => {
  try {
    const { tenderId, userId } = req.params;

    // Ensure user can only check their own subscription or admin can check any
    if (parseInt(userId) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to check this subscription",
      });
    }

    // Check if subscription exists
    const subscription = await Subscription.findOne({
      where: {
        tenderId,
        userId,
      },
    });

    res.status(200).json(!!subscription);
  } catch (err) {
    next(err);
  }
};
