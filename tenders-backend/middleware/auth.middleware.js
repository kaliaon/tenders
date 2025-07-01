const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Protect routes
exports.protect = async (req, res, next) => {
  console.log(
    `[DEBUG] Protect middleware called for: ${req.method} ${req.originalUrl}`
  );

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Get token from header
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    console.log("[DEBUG] No token found");
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[DEBUG] Token decoded: user ID=${decoded.id}`);

    // Get user from token - add more detailed error logging
    try {
      // Try to find by primary key
      req.user = await User.findByPk(decoded.id);
      console.log(
        `[DEBUG] User lookup result: ${req.user ? "Found" : "Not found"}`
      );

      // If not found, try by id as a string (in case of type mismatch)
      if (!req.user) {
        console.log(`[DEBUG] Trying alternative lookup with id as string`);
        req.user = await User.findOne({ where: { id: decoded.id.toString() } });
        console.log(
          `[DEBUG] Alternative lookup result: ${
            req.user ? "Found" : "Not found"
          }`
        );
      }
    } catch (findError) {
      console.log(`[DEBUG] Error during user lookup: ${findError.message}`);
    }

    if (!req.user) {
      console.log("[DEBUG] User not found with token ID");
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    console.log(`[DEBUG] User authenticated: ${req.user.email}`);
    next();
  } catch (err) {
    console.log(`[DEBUG] Token verification error: ${err.message}`);
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
