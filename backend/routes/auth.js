const express = require('express');
const router = express.Router();
const { createUser, createAmbulance ,loginDriver,loginUser} = require('../controllers/authController');

// Create patient user
router.post('/user', createUser);

// Create ambulance driver
router.post('/ambulance', createAmbulance);

router.post('/login', loginDriver);

router.post('/userlogin', loginUser);

module.exports = router;
