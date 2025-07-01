const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Subscription = sequelize.define(
  "Subscription",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tenders",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["tenderId", "userId"],
      },
    ],
  }
);

module.exports = Subscription;
