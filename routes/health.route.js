const express = require("express");
const sequelize = require("../db/connection");
const logger = require("../logger.js");

const router = express.Router();

// Handle HEAD request
router.head("/healthz", (req, res) => {
  logger.warn("HEAD request received, responding with 405 Method Not Allowed");
  // Send 405 Method Not Allowed
  res.status(405).end();
});

router.get("/healthz", async (req, res) => {
  if (Object.keys(req.body).length > 0) {
    logger.error("Query parameters not allowed");
    return res.status(400).json({ error: "Query parameters not allowed" });
  }

  try {
    await sequelize.authenticate();

    logger.info("Health check successful");
    res
      .status(200)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .end();
  } catch (error) {
    logger.error("Health check failed:", error);
    res
      .status(503)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .end();
  }
});

router.all("/healthz", (req, res) => {
  logger.warn(
    "Unexpected request method received, responding with 405 Method Not Allowed"
  );
  res.status(405).end();
});

module.exports = router;
