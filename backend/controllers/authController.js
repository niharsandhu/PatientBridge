const User = require('../models/userModel');
const Ambulance = require('../models/ambulanceModel');

// ----------------- Create Patient -----------------
const createUser = async (req, res) => {
  try {
    const { name, phone, email, latitude, longitude } = req.body;

    if (!name || !phone || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Name, phone, latitude and longitude are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "User with this phone already exists" });
    }

    const user = await User.create({
      name,
      phone,
      email,
      location: { type: 'Point', coordinates: [longitude, latitude] }
    });

    res.status(201).json({ message: "User created successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- Create Ambulance Driver -----------------
const createAmbulance = async (req, res) => {
  try {
    const { driverName, phone, vehicleNumber, latitude, longitude } = req.body;

    if (!driverName || !phone || !vehicleNumber || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if ambulance already exists
    const existingAmbulance = await Ambulance.findOne({ vehicleNumber });
    if (existingAmbulance) {
      return res.status(400).json({ error: "Ambulance with this vehicle number already exists" });
    }

    const ambulance = await Ambulance.create({
      driverName,
      phone,
      vehicleNumber,
      location: { type: 'Point', coordinates: [longitude, latitude] },
      isAvailable: true
    });

    res.status(201).json({ message: "Ambulance driver created successfully", ambulance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// Driver login (name + phone)
const loginDriver = async (req, res) => {
  try {
    const { driverName, phone } = req.body;

    if (!driverName || !phone) {
      return res.status(400).json({ error: "Driver name and phone are required" });
    }

    // Find existing driver
    let driver = await Ambulance.findOne({ phone });

    // If driver doesn't exist, create a new one
    if (!driver) {
      driver = await Ambulance.create({
        driverName,
        phone,
        location: { type: 'Point', coordinates: [0, 0] }, // default location
        isAvailable: true
      });
    }

    res.status(200).json({
      message: "Login successful",
      driver: {
        id: driver._id,
        name: driver.driverName,
        phone: driver.phone,
        vehicleNumber: driver.vehicleNumber,
        location: driver.location,
        isAvailable: driver.isAvailable
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// ------------------ User Login (Name + Phone) ------------------
const loginUser = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    const user = await User.findOne({ name, phone }).populate("emergencyHistory");

    if (!user) {
      return res.status(404).json({ error: "User not found. Please register first." });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};




module.exports = { createUser, createAmbulance,loginDriver,loginUser };
