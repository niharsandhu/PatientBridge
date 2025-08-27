const EmergencyRequest = require('../models/emergencyModel');
const User = require('../models/userModel');
const Ambulance = require('../models/ambulanceModel');
const Hospital = require('../models/hospitalModel');
const axios = require('axios');

// Utility function to calculate distance (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --------------- Patient triggers emergency ---------------
const createEmergency = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ error: "User ID, latitude, and longitude are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch hospitals within 10km using Geoapify API
    const API_KEY = process.env.GEOAPIFY_API_KEY;
    const placesResponse = await axios.get(
      `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${longitude},${latitude},10000&apiKey=${API_KEY}`
    );

    if (!placesResponse.data.features || !placesResponse.data.features.length) {
      return res.status(404).json({ error: "No hospitals found nearby" });
    }

    // Map and sort hospitals by distance
    let hospitals = placesResponse.data.features.map(h => ({
      name: h.properties.name,
      address:  h.properties.address_line2 || "",
      location: { lat: h.properties.lat, lng: h.properties.lon },
      distance: calculateDistance(latitude, longitude, h.properties.lat, h.properties.lon)
    })).sort((a, b) => a.distance - b.distance);

    const bestHospitalData = hospitals[0];

    // Save hospital to DB if not exists
    let hospital = await Hospital.findOne({ name: bestHospitalData.name });
    if (!hospital) {
      hospital = await Hospital.create({
        name: bestHospitalData.name,
        address: bestHospitalData.address,
        location: {
          type: 'Point',
          coordinates: [bestHospitalData.location.lng, bestHospitalData.location.lat]
        }
      });
    }

    // Create emergency request
    const emergency = await EmergencyRequest.create({
      patient: user._id,
      status: 'pending',
      patientLocation: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      hospital: hospital._id,
      hospitalLocation: hospital.location
    });

    // Update patient's emergency history
    user.emergencyHistory.push(emergency._id);
    await user.save();

    res.status(201).json({
      message: "Emergency created successfully",
      emergency,
      hospital
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


// --------------- Ambulance accepts emergency ---------------
const acceptEmergency = async (req, res) => {
  try {
    const { emergencyId, driverId } = req.body;
    if (!emergencyId || !driverId) {
      return res.status(400).json({ error: "Emergency ID and driver ID are required" });
    }

    const emergency = await EmergencyRequest.findById(emergencyId);
    if (!emergency) return res.status(404).json({ error: "Emergency not found" });
    if (emergency.status !== 'pending') {
      return res.status(400).json({ error: "Emergency already accepted" });
    }

    // Assign driver
    emergency.driver = driverId;

    // Find nearest available ambulance
    const ambulances = await Ambulance.find({ isAvailable: true });
    if (!ambulances.length) {
      return res.status(404).json({ error: "No available ambulances" });
    }

    const patientCoords = emergency.patientLocation.coordinates;
    let nearestAmbulance = ambulances[0];
    let minDistance = calculateDistance(
      patientCoords[1], patientCoords[0],
      ambulances[0].location.coordinates[1],
      ambulances[0].location.coordinates[0]
    );

    for (let i = 1; i < ambulances.length; i++) {
      const amb = ambulances[i];
      const distance = calculateDistance(
        patientCoords[1], patientCoords[0],
        amb.location.coordinates[1],
        amb.location.coordinates[0]
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestAmbulance = amb;
      }
    }

    // Assign ambulance and update status
    emergency.ambulance = nearestAmbulance._id;
    emergency.status = 'accepted';
    await emergency.save();

    // Mark ambulance as unavailable
    nearestAmbulance.isAvailable = false;
    nearestAmbulance.currentRequest = emergency._id;
    await nearestAmbulance.save();

    res.status(200).json({
      message: "Emergency accepted, ambulance assigned",
      emergency,
      ambulance: nearestAmbulance,
      hospital: await Hospital.findById(emergency.hospital)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// ----------------- Get emergencies within 5km -----------------
const getNearbyEmergencies = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const emergencies = await EmergencyRequest.find({
      status: 'pending',
      patientLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 5000 // 5 km
        }
      }
    }).populate('patient', 'name phone');

    const response = emergencies.map(e => ({
      emergencyId: e._id,
      patient: e.patient,
      patientLocation: e.patientLocation,
      distance: `${calculateDistance(
        latitude, longitude,
        e.patientLocation.coordinates[1],
        e.patientLocation.coordinates[0]
      ).toFixed(2)} km`
    }));

    res.status(200).json({ emergencies: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// Update ambulance location
const updateLocation = async (req, res) => {
  try {
    const { ambulanceId, lng, lat } = req.body;

    if (!ambulanceId || lng === undefined || lat === undefined) {
      return res.status(400).json({ error: 'ambulanceId, lng and lat are required' });
    }

    // Update the location
    const ambulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      { location: { type: 'Point', coordinates: [lng, lat] } },
      { new: true } // return the updated document
    );

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    return res.status(200).json({ message: 'Location updated', ambulance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
const getCurrentEmergencyByDriver = async (req, res) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({ error: "Driver ID is required" });
    }

    // Find the ambulance for the given driver
    const ambulance = await Ambulance.findById(driverId).populate("currentRequest");
    if (!ambulance) {
      return res.status(404).json({ error: "Ambulance (Driver) not found" });
    }

    // Check if driver has a current request
    if (!ambulance.currentRequest) {
      return res.status(200).json({ message: "No current emergency request for this driver" });
    }

    // Populate more details about the request
    const emergency = await EmergencyRequest.findById(ambulance.currentRequest)
      .populate("patient", "name phone") // get patient details
      .populate("hospital", "name address") // get hospital details
      .populate("ambulance", "driverName vehicleNumber"); // optional, show ambulance details too

    res.status(200).json({ success: true, emergency });
  } catch (error) {
    console.error("Error fetching current emergency:", error);
    res.status(500).json({ error: "Server error while fetching emergency request" });
  }
};

// ---------------- Get Current Emergency by User ----------------
const getCurrentEmergencyByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find the most recent emergency request for this user
    const emergency = await EmergencyRequest.findOne({ patient: userId })
      .sort({ createdAt: -1 }) // get the latest request
      .populate("patient", "name phone") // patient details
      .populate("hospital", "name address") // hospital details
      .populate("ambulance", "driverName vehicleNumber location"); // ambulance details

    if (!emergency) {
      return res
        .status(200)
        .json({ message: "No current emergency request for this user" });
    }

    res.status(200).json({ success: true, emergency });
  } catch (error) {
    console.error("Error fetching current emergency for user:", error);
    res.status(500).json({ error: "Server error while fetching emergency request" });
  }
};

const completeEmergency = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    if (!emergencyId) {
      return res.status(400).json({ error: "Emergency ID is required" });
    }

    const emergency = await EmergencyRequest.findById(emergencyId);
    if (!emergency) return res.status(404).json({ error: "Emergency not found" });
    if (emergency.status === 'completed') {
      return res.status(400).json({ error: "Emergency already completed" });
    }

    // Mark emergency as completed
    emergency.status = 'completed';
    await emergency.save();

    // Release the ambulance
    if (emergency.ambulance) {
      const ambulance = await Ambulance.findById(emergency.ambulance);
      if (ambulance) {
        ambulance.isAvailable = true;
        ambulance.currentRequest = null;
        await ambulance.save();
      }
    }

    res.status(200).json({
      message: "Emergency completed successfully",
      emergency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};




module.exports = { createEmergency, acceptEmergency, getNearbyEmergencies ,updateLocation,getCurrentEmergencyByDriver,completeEmergency,getCurrentEmergencyByUser };

