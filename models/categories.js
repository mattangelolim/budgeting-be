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
        type: DataTypes.ENUM("Food", "Transportation", "Utilities", "Rent", "Entertainment", "Clothing", "Savings", "Others"),
    },
    correctPercentage:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

// categories.sync()


module.exports = categories;