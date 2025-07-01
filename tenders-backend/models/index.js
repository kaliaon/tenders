const { sequelize } = require("../config/db");
const User = require("./user.model");
const Tender = require("./tender.model");
const Subscription = require("./subscription.model");

// Define associations
User.hasMany(Tender, {
  foreignKey: "createdBy",
  as: "tenders",
});

Tender.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

User.hasMany(Subscription, {
  foreignKey: "userId",
  as: "subscriptions",
});

Subscription.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Tender.hasMany(Subscription, {
  foreignKey: "tenderId",
  as: "subscriptions",
});

Subscription.belongsTo(Tender, {
  foreignKey: "tenderId",
  as: "tender",
});

// Function to sync all models with the database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing database:", error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  User,
  Tender,
  Subscription,
  syncDatabase,
};
