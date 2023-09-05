const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database");


sequelize.options.timezone = "+05:30";
const Eventdetail = sequelize.define('eventdetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  eventStartTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  eventEndTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location_coordinates: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false,
  },
  organizer: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: true
}
);



module.exports = {
  Eventdetail
};