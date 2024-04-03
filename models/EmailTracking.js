const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

const EmailTracking = sequelize.define("EmailTracking", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verification_link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sent_timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  verification_status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  expiry_timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Synchronize the model with the database
// This will create the EmailTracking table if it doesn't exist
sequelize
  .sync()
  .then(() => {
    console.log("EmailTracking table created successfully.");
  })
  .catch((error) => {
    console.error("Error creating EmailTracking table:", error);
  });

module.exports = EmailTracking;
