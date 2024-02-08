const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "kashishdesai",
  password: "Flender@1",
  port: 5433,
});

// Handle HEAD request
router.head("/healthz", (req, res) => {
  // Send 405 Method Not Allowed
  res.status(405).end();
});

router.get("/healthz", async (req, res) => {
  if (Object.keys(req.body).length > 0) {
    return res.status(400).json({ error: "Query parameters not allowed" });
  }

  try {
    const client = await pool.connect();
    client.release();

    res
      .status(200)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .end();
  } catch (error) {
    res
      .status(503)
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .end();
  }
});

router.all("/healthz", (req, res) => {
  res.status(405).end();
});

module.exports = router;
