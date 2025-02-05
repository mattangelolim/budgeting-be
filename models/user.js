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
    name: {
        type: DataTypes.STRING,
        allowNull: false
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
    fcmToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isDone: {
        type: DataTypes.ENUM("1", "0"),
        defaultValue: "0"
    }
});

// Users.sync({ alter: true })
//     .then(() => console.log("Users table updated"))
//     .catch((err) => console.error("Error updating Users table:", err));

module.exports = Users;
