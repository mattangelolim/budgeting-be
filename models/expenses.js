// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const expenses = sequelize.define("expenses", {
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
    category_type: {
        type: DataTypes.ENUM("Needs", "Wants"),
        defaultValue: "Needs"
    },
    category: {
        type: DataTypes.ENUM("Food", "Transportation", "Utilities", "Rent", "Entertainment", "Clothing", "Savings", "Others"),
        defaultValue: "Food"
    },
    thisPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    allocated_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date:{
        type: DataTypes.STRING,
        allowNull:false
    }
});

// expenses.sync()

module.exports = expenses;