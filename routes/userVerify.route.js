const express = require("express");
const userController = require("../controllers/user.controller");
const User = require("../models/User");
const { verifyToken } = require("../tokenUtils");
const logger = require("../logger");

const router = express.Router();

router.get("/v2/user/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    console.log("Received token:", token);

    // Verify the token (You need to implement this logic)
    const userId = await verifyToken(token);

    if (!userId) {
      logger.error("Invalid or expired verification token");
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

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

    // Update user's verification status
    user.verified = true;
    await user.save();

    logger.info("User verified successfully");
    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    logger.error("Error verifying email:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
