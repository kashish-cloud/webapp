const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jwtSecret = crypto.randomBytes(32).toString("hex");

const verifyToken = async (token, userId) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Check if the token contains the correct user ID
    if (decoded.userId !== userId) {
      return false;
    }

    // Token is valid
    return true;
  } catch (error) {
    // Token verification failed (expired, invalid, etc.)
    return false;
  }
};

module.exports = { verifyToken };
