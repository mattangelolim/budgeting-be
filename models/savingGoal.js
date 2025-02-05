// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SavingGoal = sequelize.define("SavingGoals", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

SavingGoal.sync()

module.exports = SavingGoal;