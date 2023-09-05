const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database");

sequelize.options.timezone = "+05:30";
const Admin = sequelize.define('admins', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNUll: false,

    },
    mail: {
        type: DataTypes.STRING,
        allowNUll: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNUll: false
    }
}, {
    timestamps: true
}
);


module.exports = Admin;