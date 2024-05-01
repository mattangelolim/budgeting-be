// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Users = sequelize.define("Users", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isDone: {
        type: DataTypes.ENUM[1, 0],
        defaultValue: 0
    }
});

Users.sync()

module.exports = Users;