const sequelize = require("../db/connection");
const basicAuth = require("basic-auth");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name || !credentials.pass) {
    console.error("Unauthorized: Missing credentials");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ where: { username: credentials.name } });

    console.log("Entered password:", credentials.pass);
    console.log("Stored hashed password:", user ? user.password : null);

    if (!user || !bcrypt.compareSync(credentials.pass, user.password)) {
      console.error("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

module.exports = authenticate;
