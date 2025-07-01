const User = require("../models/user.model");

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is authorized to view this profile
    if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this profile",
      });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    // Check if user is authorized to update this profile
    if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    // Remove fields that should not be updated
    const { password, email, role, ...updateFields } = req.body;

    // Allow admins to update role
    if (req.user.role === "admin" && role) {
      updateFields.role = role;
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields
    await user.update(updateFields);

    res.status(200).json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change user password
// @route   PUT /api/users/:id/password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if user is authorized to change this password
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to change this password",
      });
    }

    const user = await User.scope("withPassword").findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
