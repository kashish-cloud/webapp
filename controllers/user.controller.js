const bcrypt = require("bcrypt");
const User = require("../models/User");

const userController = {
  // Creating a new user
  createUser: async (req, res) => {
    const { first_name, last_name, password, username } = req.body;

    try {
      // Checking if the user already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Creating a new user
      const newUser = await User.create({
        first_name,
        last_name,
        password,
        username,
      });

      // Responding with the created user details excluding the password
      return res.status(201).json({
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        username: newUser.username,
        account_created: newUser.account_created,
        account_updated: newUser.account_updated,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Getting user information based on the authenticated user
  getSelf: async (req, res) => {
    try {
      if (!req.user) {
        console.error("No user found in req");
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
        console.error("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Internal server error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Updating user information based on the authenticated user
  updateSelf: async (req, res) => {
    const { first_name, last_name, password, username } = req.body;

    try {
      console.log("Update Self Controller: Started");

      // Log received request body
      console.log("Received Request Body:", req.body);

      const user = await User.findByPk(req.user.id);

      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      // Log current user information before update
      console.log("Current User Information:", user.toJSON());

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
        console.log("Attempt to update username detected");
        return res
          .status(400)
          .json({ message: "Cannot update the 'username' field" });
      }

      await user.save();

      // Log updated user information
      console.log("Updated User Information:", user.toJSON());

      return res.status(204).send();
    } catch (error) {
      console.error("Update Self Controller Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = userController;
