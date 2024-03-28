const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/authenticate");

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

module.exports = router;
