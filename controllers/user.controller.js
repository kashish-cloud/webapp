const bcrypt = require("bcrypt");
const User = require("../models/User");
const logger = require("../logger.js");
const { PubSub } = require("@google-cloud/pubsub");

const pubSubClient = new PubSub();

const userController = {
  // Creating a new user
  createUser: async (req, res) => {
    const { first_name, last_name, password, username } = req.body;

    try {
      // Checking if the user already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        logger.error("User creation failed: User already exists", { username });
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate verification token
      //const verificationToken = generateVerificationToken();

      // Creating a new user
      const newUser = await User.create({
        first_name,
        last_name,
        password,
        username,
        verified,
      });

      logger.info("New user created successfully:", {
        id: newUser.id,
        username,
      });

      // Publish a message to the 'verify_email' topic in Pub/Sub
      const messageData = {
        email: newUser.username,
        userId: newUser.id,
      };

      const topicName = "verify-email";
      const dataBuffer = Buffer.from(JSON.stringify(messageData));
      await pubSubClient.topic(topicName).publish(dataBuffer);

      logger.info(`Message published to topic ${topicName}`);

      // Responding with the created user details excluding the password
      logger.info("User created successfully", { id: newUser.id, username });
      return res.status(201).json({
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        username: newUser.username,
        account_created: newUser.account_created,
        account_updated: newUser.account_updated,
        verified: newUser.verified,
      });
    } catch (error) {
      logger.error("Error creating user", { error: error.message });
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Getting user information based on the authenticated user
  getSelf: async (req, res) => {
    try {
      if (!req.user) {
        logger.error("No user found in request");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findByPk(req.user.id, {
        attributes: [
          "id",
          "first_name",
          "last_name",
          "username",
          "account_created",
          "account_updated",
        ],
      });

      if (!user) {
        logger.error("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      logger.info("User details retrieved successfully", {
        id: user.id,
        username: user.username,
      });
      return res.json(user);
    } catch (error) {
      logger.error("Internal server error:", { error: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Updating user information based on the authenticated user
  updateSelf: async (req, res) => {
    const { first_name, last_name, password, username } = req.body;

    try {
      logger.info("Update Self Controller: Started");

      // Log received request body
      logger.debug("Received Request Body:", req.body);

      const user = await User.findByPk(req.user.id);

      if (!user) {
        logger.error("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      // Log current user information before update
      logger.debug("Current User Information:", user.toJSON());

      // Update user information
      if (first_name) {
        user.first_name = first_name;
      }

      if (last_name) {
        user.last_name = last_name;
      }

      if (password) {
        user.password = bcrypt.hashSync(password, 12);
      }

      // Checking if username is present in the request body
      if (username) {
        logger.error("Attempt to update username detected");
        return res
          .status(400)
          .json({ message: "Cannot update the 'username' field" });
      }

      await user.save();

      // Log updated user information
      logger.debug("Updated User Information:", user.toJSON());

      logger.info("User information updated successfully", {
        id: user.id,
        username: user.username,
      });
      return res.status(204).send();
    } catch (error) {
      logger.error("Update Self Controller Error:", { error: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get user verification status and token expiry time
  getVerificationStatus: async (req, res) => {
    try {
      // Assuming you have a middleware to authenticate the user,
      // you can access the user ID from req.user.id
      const userId = req.user.id;

      // Fetch user from the database
      const user = await User.findByPk(userId);

      if (!user) {
        logger.error("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is verified and retrieve verification token expiry time
      const verificationStatus = {
        verified: user.verified,
        verificationTokenExpiry: user.verificationTokenExpiry,
      };

      logger.info("User verification status retrieved successfully", {
        id: user.id,
        username: user.username,
        verificationStatus,
      });

      return res.json(verificationStatus);
    } catch (error) {
      logger.error("Error getting user verification status:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = userController;
