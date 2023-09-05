const { Eventdetail } = require("../model/eventModel");
const jwt = require("jsonwebtoken");

const eventCreate = async (req, res) => {
  const { adminId } = req;
  const { eventName, eventStartTime, eventEndTime, location_coordinates } = req.body;
  try {
    const existingEvent = await Eventdetail.findOne({ where: { eventName: eventName } });
    if (existingEvent) return res.status(200).send({ message: "Event Already Exists" });


    const event = await Eventdetail.create({
      eventName,
      eventStartTime,
      eventEndTime,
      location_coordinates: {
        type: 'Point',
        coordinates: [location_coordinates.lattitude, location_coordinates.longitude]
      },
      organizer: adminId
    });

    const id = event.id;
    return res.status(200).send({ message: "Event Created Successfully", id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Server Error", err })
  }
}

const eventUpdate = async (req, res) => {
  try {
    const { adminId } = req;
    const id = req.params.id;
    const upDetails = req.body
    const checkEvent = await Eventdetail.findByPk(id);
    if (!checkEvent) {
      return res.status(404).json({ message: "Event Data Not Found" });
    }

    upDetails.organizer = adminId;

    await checkEvent.update(upDetails);
    res.json({ message: "Updated", data: checkEvent })
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server Error..." });
  }
}

const eventDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const checkEvent = await Eventdetail.findByPk(id);
    if (!checkEvent) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    await checkEvent.destroy();
    res.json({ message: "Event Deleted", })
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server Error..." });
  }
}
const getEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const checkEvent = await Eventdetail.findByPk(id);
    if (!checkEvent) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    res.json({ userData: checkEvent });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server Error..." });
  }
}
const getAllevent = async (req, res) => {
  try {
    const allEvents = await Eventdetail.findAll();
    if (!allEvents) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    res.json({ allData: allEvents });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server Error..." });
  }
}


module.exports = {
  eventCreate,
  eventUpdate,
  eventDelete,
  getEvent,
  getAllevent
}