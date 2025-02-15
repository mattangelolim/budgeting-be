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
    label: {
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
    status: {
        type: DataTypes.ENUM("active", "paid"),
        defaultValue: "active",
        allowNull: true
    }
}, {
    timestamps: true,
});

// PlannedBills.sync({ alter: true })
//     .then(() => console.log("PlannedBills table updated"))
//     .catch((err) => console.error("Error updating PlannedBills table:", err));

module.exports = PlannedBills;
