// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const savingstips = sequelize.define("savingstips", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    threshold: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

savingstips.sync()

module.exports = savingstips;