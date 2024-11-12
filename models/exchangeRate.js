// models/exchangeRate.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const exchangeRate = sequelize.define("exchangeRate", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rateData: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    fetchDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

// exchangeRate.sync()

module.exports = exchangeRate;
