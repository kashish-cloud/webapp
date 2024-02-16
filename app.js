const express = require("express");
const healthRoutes = require("./routes/health.route");
//const authRoutes = require("./routes/auth.route");
const userCreationRoutes = require("./routes/userCreation.route");
const userRoutes = require("./routes/user.route");
const sequelize = require("./db/connection");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/", healthRoutes);
app.use("/", userCreationRoutes);
app.use("/", userRoutes);

// Database connection
const connectToDatabase = async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connection has been established successfully");
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

// Start the server
const startServer = async () => {
  try {
    await connectToDatabase();
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Close the database connection when the server is closed
    server.on("close", async () => {
      console.log("Closing database connection");
      await sequelize.close();
    });

    return server;
  } catch (error) {
    console.error("Error starting the server:", error);
    throw error;
  }
};

// Start the server after syncing the database
startServer();

// Export the app for testing purposes
module.exports = { app, startServer };
