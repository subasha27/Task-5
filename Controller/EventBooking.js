const EventBookList = require("../model/bookingListModel");
const { Eventdetail } = require("../model/eventModel");
const { Op, literal, fn, col, Sequelize } = require("sequelize")

const eventBooking = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { userId } = req;
    const selectedEvent = await Eventdetail.findByPk(eventId);
    if (!selectedEvent) {
      return res.status(404).send({ message: "Event not found" });
    }
    const existingBooking = await EventBookList.findOne({ where: { eventId: eventId, participantId: userId } });
    if (existingBooking) return res.status(200).send({ message: "Event is already booked by the user" });


    const startTime = new Date(selectedEvent.eventStartTime)
    const endTime = new Date(selectedEvent.eventEndTime)
    const currentTime = new Date();

    console.log("Selected Event:", selectedEvent);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
    console.log("Current Time:", currentTime);

    if (currentTime > endTime) {
      return res.status(400).send({ message: "Event has already ended" });
    }

    const eventOverlap = await Eventdetail.findOne({
      where: {
        id: {
          [Op.ne]: eventId
        },
        eventStartTime: {
          [Op.lte]: endTime
        },
        eventEndTime: {
          [Op.gte]: startTime
        }
      }
    });
    console.log(eventOverlap)
    if (eventOverlap) {
      const over = await EventBookList.findOne({ where: { eventId: eventOverlap.id, participantId: userId } })
      if (over) { return res.status(400).send({ message: "Event time overlaps with another event" }); }
    }

    await EventBookList.create({
      eventId,
      participantId: userId,
      participantStatus: 'Booked',
    });
    return res.status(201).send({ message: "Booking successful" });

  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: "Server Error" })
  }
}




const eventCancellation = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { userId } = req;

    const booking = await EventBookList.findOne({ where: { eventId, participantId: userId } });
    if (!booking) {
      return res.status(404).send({ message: "Booking not found" });
    }

    const selectedEvent = await Eventdetail.findByPk(eventId);
    if (!selectedEvent) {
      return res.status(404).send({ message: "Event not found" });
    }

    const startTime = new Date(selectedEvent.eventStartTime);
    const currentTime = new Date();
    const timeDifference = startTime - currentTime;


    if (timeDifference < 8 * 60 * 60 * 1000) {
      return res.status(400).send({ message: "Event cannot be canceled less than 8 hours before start time" });
    }

    await EventBookList.update({ participantStatus: "cancelled" }, { where: { eventId, participantId: userId } });
    return res.status(200).send({ message: "Event canceled successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server Error" });
  }
};


const allParticipants = async (req, res) => {
  try {
    const allParticipantList = await EventBookList.findAll();
    return res.status(200).send({ message: "Participant List", allParticipantList })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: "Server Error" })
  }
}



const eventNearby = async (req, res) => {
  try {
    const { userCoordinates } = req.body;
    console.log(userCoordinates)
    const events = await Eventdetail.findAll({
      where: Sequelize.where(
        Sequelize.fn('ST_Distance_Sphere', Sequelize.col('location_coordinates'), Sequelize.fn('POINT', userCoordinates[0], userCoordinates[1])),
        { [Op.lte]: 30000 } // Max distance in meters
      ),
    })
    console.log(events)

    if (events.length > 0) {
      res.send(events);
    } else {
      res.status(500).json({ message: 'No nearby events' });
    }
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: "Server Error" })
  }
}


module.exports = {
  eventBooking,
  eventCancellation,
  allParticipants,
  eventNearby
}