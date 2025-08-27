const express = require('express');
const router = express.Router();
const { createEmergency, acceptEmergency,getNearbyEmergencies,getCurrentEmergencyByUser, updateLocation ,getCurrentEmergencyByDriver,completeEmergency} = require('../controllers/emergencyController');

// Patient triggers emergency
router.post('/create', createEmergency);

// Ambulance accepts / auto-assign nearest ambulance
router.post('/accept', acceptEmergency);

router.get('/nearby', getNearbyEmergencies);

router.post('/update',updateLocation);

router.get('/current/:driverId', getCurrentEmergencyByDriver);

router.get('/current/user/:userId', getCurrentEmergencyByUser);

router.post('/complete', completeEmergency);

module.exports = router;
    