const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/authenticate");
const User = require("../models/User");
const { verifyToken } = require("../tokenUtils");
const logger = require("../logger");

const router = express.Router();

// User routes
router.use(authenticate); // Middleware to authenticate user for the routes below

// Middleware to check if the user is verified
const checkVerificationStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      logger.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verified) {
      logger.error("User not verified");
      return res.status(403).json({ message: "User not verified" });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    logger.error("Error checking user verification status:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get authenticated user information: GET /user/self
router.get("/v1/user/self", checkVerificationStatus, userController.getSelf);

// Update authenticated user information: PUT /user/self
router.put("/v1/user/self", checkVerificationStatus, userController.updateSelf);

// Get user verification status and token expiry time: GET /user/verification-status
router.get(
  "/v1/user/verification-status",
  userController.getVerificationStatus
);

// Route to handle email verification
router.get("/v1/user/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    const userId = req.query.userId;

    // Retrieve user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      logger.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already verified
    if (user.verified) {
      logger.info("User is already verified");
      return res.status(200).json({ message: "User is already verified" });
    }

    // Verify the token (You need to implement this logic)
    const isTokenValid = await verifyToken(token, userId);

    if (isTokenValid) {
      // Update user's verification status
      user.verified = true;
      await user.save();

      logger.info("User verified successfully");
      return res.status(200).json({ message: "User verified successfully" });
    } else {
      logger.error("Invalid or expired verification token");
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }
  } catch (error) {
    logger.error("Error verifying email:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
