const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// Create a user: POST /v1/user
router.post("/v1/user", async (req, res) => {
  try {
    const result = await userController.createUser(req, res);
    // Log success or other relevant information if needed
    console.log("User creation success:", result);
  } catch (error) {
    // Log the error
    console.error("User creation error:", error);
    // Return an appropriate response to the client
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
