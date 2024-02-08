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
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Start the server
// Synchronize models with the database
sequelize
  .sync({ force: true }) // Adjust the options as needed
  .then(() => {
    console.log("Database synced successfully");
    // Start the server after syncing the database
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
