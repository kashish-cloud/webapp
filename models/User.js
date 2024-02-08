const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    account_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    hooks: {
      beforeCreate: (user) => {
        user.account_created = new Date();
        user.account_updated = new Date();
      },
      beforeUpdate: (user) => {
        user.account_updated = new Date();
      },
    },
  }
);

// Before saving the user, hashing the password
User.beforeCreate(async (user) => {
  const saltRounds = 12;
  const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
  user.password = hashedPassword;
});

module.exports = User;
