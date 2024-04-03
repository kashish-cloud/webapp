const jwt = require("jsonwebtoken");
const jwtSecret = "testing";

const verifyToken = async (token) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Check if the token contains the correct user ID
    if (!decoded.userId) {
      return false;
    }

    // Token is valid
    return decoded.userId;
  } catch (error) {
    // Token verification failed (expired, invalid, etc.)
    return false;
  }
};

module.exports = { verifyToken };
