const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database");
const { Eventdetail } = require("../model/eventModel");


sequelize.options.timezone = "+05:30";
const EventBookList = sequelize.define(
  "eventbooklist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    participantId: {
      type: DataTypes.STRING,
    },
    participantStatus: {
      type: DataTypes.STRING,
    }
  }, {
  timestamps: true
}
);

EventBookList.belongsTo(Eventdetail, { through: 'eventbooklist', as: 'eventdetails', foreignKey: "eventId" });

module.exports = EventBookList;
