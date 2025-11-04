'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Phone, MapPin, Clock, Heart, User, Building2, AlertTriangle, Navigation, Shield, Activity, CheckCircle, X, Car, Timer } from 'lucide-react';
import axios from 'axios';
import { io } from "socket.io-client";
import MapComponent from '../components/map';
const socket = io("http://localhost:3001"); 
const API_BASE_URL = 'http://localhost:3001/api';

const AmbulanceDashboard = () => {
  // State
  const [currentEmergency, setCurrentEmergency] = useState(null);
  const [pendingEmergencies, setPendingEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [driverInfo, setDriverInfo] = useState({
    id: null,
    name: "Loading...",
    status: "Available",
    vehicleNumber: "Loading...",
    location: { lat: null, lng: null },
  });

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load driver info
  useEffect(() => {
    const storedDriver = localStorage.getItem('driver');
    if (storedDriver) {
      const driverData = JSON.parse(storedDriver);
      setDriverInfo({
        id: driverData._id || driverData.id, // handle both Mongo _id and custom id
        name: driverData.name || "Unknown Driver",
        status: driverData.isAvailable ? "Available" : "Busy",
        vehicleNumber: driverData.vehicleNumber || "Unknown Vehicle",
        location: driverData.location?.coordinates
          ? { lat: driverData.location.coordinates[1], lng: driverData.location.coordinates[0] }
          : { lat: null, lng: null },
      });
    }
  }, []);

  // Update driver location to server
const updateLocationToServer = useCallback(async (latitude, longitude) => {
  if (!driverInfo.id) return;
  console.log("📤 Sending location update:", { latitude, longitude }); // ✅ Debug log
  try {
    const res = await axios.post(`${API_BASE_URL}/emergency/update`, {
      ambulanceId: driverInfo.id,
      lat: latitude,
      lng: longitude,
    });
    console.log("✅ Server response:", res.data);
  } catch (err) {
    console.error("❌ Failed to update location:", err.response?.data || err.message);
  }
}, [driverInfo.id]);


  // Get current geolocation
  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation not supported by this browser");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverInfo(prev => ({
            ...prev,
            location: { lat: latitude, lng: longitude },
          }));
          updateLocationToServer(latitude, longitude);
        },
        (error) => {
          setLocationError("Unable to get current location");
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    };

    getCurrentLocation();
    const locationInterval = setInterval(getCurrentLocation, 30000);
    return () => clearInterval(locationInterval);
  }, [updateLocationToServer]);

  // Fetch nearby emergencies
  const fetchNearbyEmergencies = useCallback(async () => {
    if (!driverInfo.location.lat || !driverInfo.location.lng) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/emergency/nearby`, {
        params: {
          latitude: driverInfo.location.lat,
          longitude: driverInfo.location.lng,
        },
      });
      setPendingEmergencies(response.data.emergencies);
    } catch (err) {
      setError("Failed to fetch emergencies");
      console.error("Error fetching emergencies:", err);
    } finally {
      setLoading(false);
    }
  }, [driverInfo.location.lat, driverInfo.location.lng]);

  // Accept an emergency
  const acceptEmergency = useCallback(async (emergencyId) => {
    if (!driverInfo.id) {
      console.log("No driver ID available");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/emergency/accept`, {
        emergencyId,
        driverId: driverInfo.id,
      });

      // normalize id field
      setCurrentEmergency({
        ...response.data.emergency,
        emergencyId: response.data.emergency._id,
      });

      setPendingEmergencies(prev => prev.filter(e => e.emergencyId !== emergencyId));
      setDriverInfo(prev => ({ ...prev, status: "Busy" }));
    } catch (err) {
      setError("Failed to accept emergency");
      console.error("Error accepting emergency:", err);
    } finally {
      setLoading(false);
    }
  }, [driverInfo.id]);

  // Fetch current emergency details by driverId
const fetchCurrentEmergency = useCallback(async (driverId) => {
  console.log("🚀 [fetchCurrentEmergency] Function CALLED with driverId:", driverId);

  if (!driverId) {
    console.warn("⚠️ [fetchCurrentEmergency] No driverId provided, stopping execution.");
    return;
  }

  setLoading(true);
  try {
    console.log(`📡 [fetchCurrentEmergency] Sending request to: ${API_BASE_URL}/emergency/current/${driverId}`);

    const response = await axios.get(`${API_BASE_URL}/emergency/current/${driverId}`);

    console.log("✅ [fetchCurrentEmergency] Raw API response:", response);

    if (response.data?.emergency) {
      console.log("🆘 [fetchCurrentEmergency] Emergency FOUND:", response.data.emergency);

      setCurrentEmergency({
        ...response.data.emergency,
        emergencyId: response.data.emergency._id,
      });
    } else {
      console.log("ℹ️ [fetchCurrentEmergency] No current emergency for this driver.");
      setCurrentEmergency(null);
    }
  } catch (err) {
    console.error("❌ [fetchCurrentEmergency] Error fetching emergency:", err.response?.data || err.message);
    setError("Failed to fetch emergency details");
  } finally {
    setLoading(false);
    console.log("🔄 [fetchCurrentEmergency] Loading finished.");
  }
}, []);


  // Complete an emergency
  const completeEmergency = useCallback(async () => {
    if (!currentEmergency) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/emergency/complete`, {
        emergencyId: currentEmergency.emergencyId,
      });
      setCurrentEmergency(null);
      setDriverInfo(prev => ({ ...prev, status: "Available" }));
      fetchNearbyEmergencies();
    } catch (err) {
      setError("Failed to complete emergency");
      console.error("Error completing emergency:", err);
    } finally {
      setLoading(false);
    }
  }, [currentEmergency, fetchNearbyEmergencies]);

   // Initial load: Check for current emergency when driver info is loaded
  useEffect(() => {
    if (driverInfo.id && driverInfo.name !== "Loading...") {
      console.log("🚀 Initial load: Checking for current emergency for driver:", driverInfo.id);
      fetchCurrentEmergency(driverInfo.id);
    }
  }, [driverInfo.id, driverInfo.name, fetchCurrentEmergency]); 


  // Poll for nearby emergencies when idle
  useEffect(() => {
    if (driverInfo.location.lat && driverInfo.location.lng && !currentEmergency) {
      fetchNearbyEmergencies();
      const pollingInterval = setInterval(fetchNearbyEmergencies, 30000);
      return () => clearInterval(pollingInterval);
    }
  }, [driverInfo.location.lat, driverInfo.location.lng, currentEmergency, fetchNearbyEmergencies]);

  // Poll for current emergency updates when busy
  useEffect(() => {
    if (driverInfo.id) {
      const interval = setInterval(() => fetchCurrentEmergency(driverInfo.id), 30000);
      return () => clearInterval(interval);
    }
  }, [driverInfo.id, fetchCurrentEmergency]);

  // Manual refresh
  const handleManualRefresh = useCallback(async () => {
    setLoading(true);
    try {
      if (currentEmergency) {
        await fetchCurrentEmergency(driverInfo.id);
      } else {
        await fetchNearbyEmergencies();
      }
    } catch (err) {
      console.error("Error during manual refresh:", err);
    } finally {
      setLoading(false);
    }
  }, [currentEmergency, driverInfo.id, fetchCurrentEmergency, fetchNearbyEmergencies]);

  // Priority color helper
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 bg-gradient-to-r from-orange-500/5 to-orange-400/3 rounded-full blur-3xl animate-pulse top-10 right-10" />
        <div className="absolute w-48 h-48 bg-gradient-to-r from-orange-600/4 to-orange-500/2 rounded-full blur-3xl animate-pulse bottom-20 left-20" style={{ animationDelay: '2s' }} />
      </div>

      {/* Error Display */}
      {(error || locationError) && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
                <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {locationError && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{locationError}</span>
                <button onClick={() => setLocationError(null)} className="ml-2 text-yellow-500 hover:text-yellow-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="relative py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-xl border border-orange-200/50 rounded-2xl p-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-black font-bold text-xl">AMBULANCE DASHBOARD</span>
                  <p className="text-orange-600 font-medium">Driver: {driverInfo.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-orange-600 font-bold">{driverInfo.status}</p>
                  <p className="text-black/60">Status</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-600 font-bold">{driverInfo.vehicleNumber}</p>
                  <p className="text-black/60">Vehicle</p>
                </div>
                <div className="text-center">
                  <p suppressHydrationWarning className="text-black font-bold">{currentTime.toLocaleTimeString()}</p>
                  <p className="text-black/60">Current Time</p>
                </div>
                <button
                  onClick={handleManualRefresh}
                  disabled={loading || driverInfo.name === "Loading..."}
                  className="bg-orange-100 hover:bg-orange-200 border border-orange-300 text-orange-800 font-bold py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? '🔄' : '↻'} Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {currentEmergency ? (
          // Active Emergency View
          <>
            {/* Current Emergency Header */}
            <div className="mb-4">
              <div className="bg-white/70 backdrop-blur-xl border border-orange-200/50 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                      <div className="absolute inset-0 w-3 h-3 bg-orange-600 rounded-full" />
                    </div>
                    <div>
                      <span className="text-black font-bold text-lg">ACTIVE EMERGENCY</span>
                      <span className="text-orange-600 font-medium ml-4">ID: {currentEmergency.emergencyId}</span>
                    </div>
                  </div>
                  <button
                    onClick={completeEmergency}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {loading ? 'Processing...' : 'Complete'}
                  </button>
                </div>
              </div>
            </div>

            {/* Patient, Hospital & Map Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              {/* Patient Info */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">Patient Info</h3>
                    <p className="text-orange-600 text-sm font-medium">{currentEmergency.patient?.name}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-orange-50/80 rounded-xl p-3 border border-orange-200/40">
                    <p className="text-black font-semibold">{currentEmergency.patient?.phone}</p>
                    <p className="text-black/70 text-sm">{currentEmergency.patient?.address}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="text-center p-2 bg-orange-50/60 rounded-lg border border-orange-200/30">
                      <Activity className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                      <p className="text-black text-xs font-bold">{currentEmergency.patient?.vitals?.heartRate}</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50/60 rounded-lg border border-orange-200/30">
                      <Shield className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                      <p className="text-black text-xs font-bold">{currentEmergency.patient?.vitals?.bloodPressure}</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50/60 rounded-lg border border-orange-200/30">
                      <Activity className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                      <p className="text-black text-xs font-bold">{currentEmergency.patient?.vitals?.oxygen}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hospital Assigned */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">Assigned Hospital</h3>
                    <p className="text-orange-600 text-sm font-medium">Destination</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-orange-50/80 rounded-xl p-3 border border-orange-200/40">
                    <p className="text-black font-bold text-sm">{currentEmergency.hospital?.name}</p>
                    <p className="text-black/70 text-xs">{currentEmergency.hospital?.address}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-orange-50/60 rounded-lg p-2 border border-orange-200/30">
                      <div className="flex items-center gap-2">
                        <Heart className="w-3 h-3 text-orange-600" />
                        <p className="text-black text-xs font-semibold">Emergency Ready</p>
                      </div>
                    </div>
                    <div className="bg-orange-50/60 rounded-lg p-2 border border-orange-200/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <p className="text-black text-xs font-semibold">Bed Available</p>
                      </div>
                    </div>
                    <div className="bg-orange-50/60 rounded-lg p-2 border border-orange-200/30">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-orange-600" />
                        <p className="text-black text-xs font-semibold">Team Notified</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Map */}
              <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black">Navigation</h3>
                    <p className="text-orange-600 text-sm font-medium">Route to patient location</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-orange-200/40 h-64">
                  <MapComponent
                    patientLocation={currentEmergency.patientLocation}
                    driverLocation={driverInfo.location}
                    hospitalLocation={currentEmergency.hospitalLocation}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-black">Emergency Actions</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => window.open(`tel:${currentEmergency.patient?.phone}`, '_self')}
                  className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">Call Patient</span>
                </button>
                <button
                  onClick={() => window.open(`tel:${currentEmergency.hospital?.phone || '+1234567890'}`, '_self')}
                  className="group bg-orange-50/60 hover:bg-orange-50/80 border border-orange-200/40 hover:border-orange-400/50 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2"
                >
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">Call Hospital</span>
                </button>
                <button
                  onClick={() => {
                    const { lat, lng } = currentEmergency.patient?.location;
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                  }}
                  className="group bg-orange-50/60 hover:bg-orange-50/80 border border-orange-200/40 hover:border-orange-400/50 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2"
                >
                  <Navigation className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">Get Directions</span>
                </button>
                <button
                  onClick={() => setError("Report feature coming soon!")}
                  className="group bg-orange-50/60 hover:bg-orange-50/80 border border-orange-200/40 hover:border-orange-400/50 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">Report Issue</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          // Pending Emergencies List
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-black">{pendingEmergencies.length}</p>
                <p className="text-orange-600 text-sm font-medium">Pending</p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-black">{driverInfo.completedTrips || 0}</p>
                <p className="text-orange-600 text-sm font-medium">Completed</p>
              </div>
            </div>

            {/* Pending Emergencies */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-black">Incoming Emergencies</h3>
                {loading && <div className="animate-spin w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full" />}
              </div>
              <div className="space-y-4">
                {pendingEmergencies.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="text-black/60">No pending emergencies in your area</p>
                    <p className="text-black/40 text-sm mt-1">Stay ready for incoming requests</p>
                  </div>
                ) : (
                  pendingEmergencies.map((emergency) => (
                    <div key={emergency.emergencyId} className="bg-orange-50/60 border border-orange-200/40 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(emergency.patient?.priority || 'High')}`}>
                              {emergency.patient?.priority || 'High'}
                            </span>
                            <span className="text-black font-bold">#{emergency.emergencyId}</span>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-bold text-black mb-1">Patient</h4>
                              <p className="text-black text-sm">{emergency.patient?.name || 'Unknown Patient'}</p>
                              <p className="text-orange-600 text-sm font-medium">{emergency.patient?.condition || 'Emergency'}</p>
                            </div>
                            <div>
                              <h4 className="font-bold text-black mb-1">Location</h4>
                              <p className="text-black/70 text-sm">{emergency.patient?.location?.address || 'Location not specified'}</p>
                              <p className="text-orange-600 text-sm">{emergency.distance || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptEmergency(emergency.emergencyId)}
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {loading ? 'Processing...' : 'Accept'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AmbulanceDashboard;
