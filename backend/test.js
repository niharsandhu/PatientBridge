const axios = require('axios');

// Replace with your local server URL
const BASE_URL = 'http://localhost:3001/api';

// Sample test data
const testUser = {
  name: "Nihar Sandhu",
  phone: "9876543210",
  email: "nihar@example.com",
  latitude: 30.7333,  // Chandigarh approx
  longitude: 76.7794,
  address: "2538, Sector 19-C, Chandigarh"
};

const testAmbulance = {
  driverName: "Raj Singh",
  phone: "8888888888",
  vehicleNumber: "CH01AB1234",
  latitude: 30.7276,  // Sector 27 Chandigarh approx
  longitude: 76.7884,
  address: "Sector 27, Chandigarh"
};

const testEmergency = {
  emergencyType: "heart",
  latitude: 30.7333,
  longitude: 76.7794
};

const runTestFlow = async () => {
  try {
    console.log("=== Creating User ===");
    const userResp = await axios.post(`${BASE_URL}/auth/user`, testUser);
    const userId = userResp.data.user._id;
    console.log("User created:", userResp.data.user);

    console.log("\n=== Creating Ambulance Driver ===");
    const ambResp = await axios.post(`${BASE_URL}/auth/ambulance`, testAmbulance);
    console.log("Ambulance driver created:", ambResp.data.ambulance);

    console.log("\n=== Triggering Emergency ===");
    const emergencyResp = await axios.post(`${BASE_URL}/emergency/create`, {
      ...testEmergency,
      userId
    });
    const emergencyId = emergencyResp.data.emergency._id;
    console.log("Emergency created:", emergencyResp.data.emergency);
    console.log("Hospital assigned:", emergencyResp.data.hospital);

    console.log("\n=== Auto-assigning Nearest Ambulance ===");
    const assignResp = await axios.post(`${BASE_URL}/emergency/accept`, { emergencyId });
    console.log("Ambulance assigned:", assignResp.data.ambulance);
    console.log("Emergency status:", assignResp.data.emergency.status);

  } catch (error) {
    if (error.response) {
      console.error("Error Response:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
};

runTestFlow();
