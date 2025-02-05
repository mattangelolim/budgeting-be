const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PlannedBills = sequelize.define("PlannedBills", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

PlannedBills.sync()

module.exports = PlannedBills;
