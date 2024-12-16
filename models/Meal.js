const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Meal = sequelize.define("Meal", {
  meal_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  meal_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "meals",
  timestamps: false,
});

module.exports = Meal;
