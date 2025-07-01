const { Op } = require("sequelize");
const Tender = require("../models/tender.model");
const Subscription = require("../models/subscription.model");

// Helper function to format tender for API response
const formatTenderForResponse = (tender) => {
  if (!tender) return null;

  // Clone the tender to avoid modifying the original
  const formattedTender = { ...tender.get({ plain: true }) };

  // Add the formatted createdAt from the prototype method
  formattedTender.createdAt = tender.getFormattedCreatedAt();

  return formattedTender;
};

// @desc    Get all tenders
// @route   GET /api/tenders
// @access  Public
exports.getAllTenders = async (req, res, next) => {
  try {
    const tenders = await Tender.findAll();

    // Format all tenders for response
    const formattedTenders = tenders.map(formatTenderForResponse);

    res.status(200).json(formattedTenders);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single tender
// @route   GET /api/tenders/:id
// @access  Public
exports.getTender = async (req, res, next) => {
  try {
    const tender = await Tender.findByPk(req.params.id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found",
      });
    }

    res.status(200).json(formatTenderForResponse(tender));
  } catch (err) {
    next(err);
  }
};

// @desc    Create new tender
// @route   POST /api/tenders
// @access  Private
exports.createTender = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const tender = await Tender.create(req.body);

    res.status(201).json(formatTenderForResponse(tender));
  } catch (err) {
    next(err);
  }
};

// @desc    Update tender
// @route   PUT /api/tenders/:id
// @access  Private
exports.updateTender = async (req, res, next) => {
  try {
    let tender = await Tender.findByPk(req.params.id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found",
      });
    }

    // Make sure user is tender owner or admin
    if (tender.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this tender",
      });
    }

    // Update the tender
    await tender.update(req.body);

    // Fetch the updated tender
    tender = await Tender.findByPk(req.params.id);

    res.status(200).json(formatTenderForResponse(tender));
  } catch (err) {
    next(err);
  }
};

// @desc    Delete tender
// @route   DELETE /api/tenders/:id
// @access  Private
exports.deleteTender = async (req, res, next) => {
  try {
    const tender = await Tender.findByPk(req.params.id);

    if (!tender) {
      return res.status(404).json({
        success: false,
        message: "Tender not found",
      });
    }

    // Make sure user is tender owner or admin
    if (tender.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this tender",
      });
    }

    // Delete the tender
    await tender.destroy();

    // Delete all subscriptions to this tender
    await Subscription.destroy({
      where: { tenderId: req.params.id },
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search tenders
// @route   GET /api/tenders/search
// @access  Public
exports.searchTenders = async (req, res, next) => {
  try {
    // Handle both simple string query and nested query object
    let searchTerm, category, status;

    // Check if query is a nested object (query[searchTerm], query[category], etc.)
    if (req.query.query) {
      // If it's a string, parse it as JSON
      if (typeof req.query.query === "string") {
        try {
          const parsedQuery = JSON.parse(req.query.query);
          searchTerm = parsedQuery.searchTerm;
          category = parsedQuery.category;
          status = parsedQuery.status;
        } catch (e) {
          // If it's not valid JSON, use it as a direct search term
          searchTerm = req.query.query;
        }
      }
      // If it's already an object (due to query[x] notation)
      else {
        searchTerm = req.query.query.searchTerm;
        category = req.query.query.category;
        status = req.query.query.status;
      }
    } else {
      // Backward compatibility with the old API
      searchTerm = req.query.searchTerm;
      category = req.query.category;
      status = req.query.status;
    }

    // Build the query conditions
    const whereClause = {};

    // If search term is provided, search in title, description and company
    if (searchTerm) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { description: { [Op.iLike]: `%${searchTerm}%` } },
        { company: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    // Add category filter if provided and not "All"
    if (category && category !== "All") {
      whereClause.category = category;
    }

    // Add status filter if provided and not "All"
    if (status && status !== "All") {
      whereClause.status = status;
    }

    // Find all tenders matching the conditions
    const tenders = await Tender.findAll({
      where: whereClause,
    });

    // Format all tenders for response
    const formattedTenders = tenders.map(formatTenderForResponse);

    res.status(200).json(formattedTenders);
  } catch (err) {
    next(err);
  }
};

// @desc    Filter tenders
// @route   GET /api/tenders/filter
// @access  Public
exports.filterTenders = async (req, res, next) => {
  try {
    const { category, status, minBudget, maxBudget } = req.query;
    const whereClause = {};

    if (category) {
      whereClause.category = category;
    }

    if (status) {
      whereClause.status = status;
    }

    if (minBudget || maxBudget) {
      whereClause.budget = {};
      if (minBudget)
        whereClause.budget = {
          ...whereClause.budget,
          [Op.gte]: Number(minBudget),
        };
      if (maxBudget)
        whereClause.budget = {
          ...whereClause.budget,
          [Op.lte]: Number(maxBudget),
        };
    }

    const tenders = await Tender.findAll({ where: whereClause });

    // Format all tenders for response
    const formattedTenders = tenders.map(formatTenderForResponse);

    res.status(200).json(formattedTenders);
  } catch (err) {
    next(err);
  }
};
