const express = require("express");
const router = express.Router();
const conAdminRoute = require("../Controller/userAdminController");
const adminEventCreate = require("../Controller/EventCreation")
const conParticipantRoute = require("../Controller/participantController");
const conEventBooking = require("../Controller/EventBooking");
const { authenticateToken } = require("../middleware/authMiddleware");
const { userAuthenticateToken } = require("../middleware/userMiddelware");


//Admin api

router.post('/adminCreate', conAdminRoute.adminCreate);
router.post('/adminLogin/:id', conAdminRoute.adminLogin);

//Event create

router.post('/CreateEvent', authenticateToken, adminEventCreate.eventCreate);
router.put('/UpdateEvent/:id', authenticateToken, adminEventCreate.eventUpdate);
router.delete('/DeleteEvent/:id', authenticateToken, adminEventCreate.eventDelete);
router.get('/GetEvent/:id', authenticateToken, adminEventCreate.getEvent);
router.get('/GetAllEvent', authenticateToken, adminEventCreate.getAllevent);

//Participants api

router.post('/ParticipantCreate', conParticipantRoute.participantCreate);
router.post('/ParticipantLogin/:id', conParticipantRoute.participantLogin);

//Event Book
router.post('/BookEvent/:id', userAuthenticateToken, conEventBooking.eventBooking);
router.put('/CancelEvent/:id', userAuthenticateToken, conEventBooking.eventCancellation);

router.get('/AllParticipants', conEventBooking.allParticipants);
router.post('/EventsNearby', conEventBooking.eventNearby);

module.exports = router; 