const express = require("express");
const logger = require("../logger.js");
const userController = require("../controllers/user.controller");

const router = express.Router();

// Create a user: POST /v1/user
router.post("/v1/user", async (req, res) => {
  try {
    const result = await userController.createUser(req, res);
    // Log success or other relevant information if needed
    logger.info("User creation success:", result);
    res.status(200).json(result);
  } catch (error) {
    // Log the error
    logger.error("User creation error:", error);
    // Return an appropriate response to the client
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
