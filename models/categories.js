// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const categories = sequelize.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    category_type: {
        type: DataTypes.ENUM("Needs", "Wants", "Savings"),
        defaultValue: "Needs"
    },
    categories: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correctPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// categories.sync()
categories.sync({ alter: true });


module.exports = categories;