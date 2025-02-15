
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TotalDebt = sequelize.define("TotalDebt", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: true
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
    status: {
        type: DataTypes.ENUM("active", "paid"),
        defaultValue: "active",
        allowNull: true
    }
});

// TotalDebt.sync({ alter: true })
//     .then(() => console.log("TotalDebt table updated"))
//     .catch((err) => console.error("Error updating TotalDebt table:", err));

module.exports = TotalDebt;