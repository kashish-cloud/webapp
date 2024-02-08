const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// User routes
router.use(authenticate); // Middleware to authenticate user for the routes below

// Get authenticated user information: GET /user/self
router.get("/v1/user/self", userController.getSelf);

// Update authenticated user information: PUT /user/self
router.put("/v1/user/self", userController.updateSelf);

module.exports = router;
