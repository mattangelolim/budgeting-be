
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TotalDebt = sequelize.define("TotalDebt", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    totalDebtAmount: {
        type: DataTypes.STRING,
        allowNull: true
    },
    paymentAmount: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

TotalDebt.sync()

module.exports = TotalDebt;