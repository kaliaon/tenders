const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Tender = sequelize.define(
  "Tender",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide a title",
        },
        len: {
          args: [1, 100],
          msg: "Title cannot be more than 100 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide a description",
        },
      },
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "closed", "in_progress", "awarded"),
      defaultValue: "open",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create a virtual getter for formattedCreatedAt (used in API responses)
Tender.prototype.getFormattedCreatedAt = function () {
  return this.createdAt ? this.createdAt.toISOString().split("T")[0] : null;
};

module.exports = Tender;
