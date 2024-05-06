// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BudgetTF = sequelize.define("BudgetTF", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    income: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    overall_expense: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    total_savings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    Timeframe: {
        type: DataTypes.ENUM("Daily", "Weekly", "Monthly"),
        defaultValue: "Daily"
    },
    TF_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// BudgetTF.sync()

module.exports = BudgetTF;