'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Phone, MapPin, Clock, User, Building2, AlertTriangle, Shield, Activity, X, Loader } from 'lucide-react';
import MapComponent from '../components/map';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Separate component for live time display
const LiveTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <p suppressHydrationWarning className="text-black font-bold">
      {currentTime.toLocaleTimeString()}
    </p>
  );
};

const EmergencyResponsePage = () => {
  const [emergencyData, setEmergencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID from localStorage or session
  useEffect(() => {
    const getUserId = () => {
      try {
        // Try to get user from localStorage
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          return userData._id || userData.id;
        }
        
        // Fallback: try to get from URL params or session
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('userId');
      } catch (err) {
        console.error('Error getting user ID:', err);
        return null;
      }
    };

    const id = getUserId();
    setUserId(id);
  }, []);

  // Fetch current emergency for user
  const fetchCurrentEmergency = useCallback(async (userId) => {
    if (!userId) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/emergency/current/user/${userId}`);
      
      if (response.data.success && response.data.emergency) {
        setEmergencyData(response.data.emergency);
        setError(null);
      } else {
        setEmergencyData(null);
        setError('No active emergency found for your account.');
      }
    } catch (err) {
      console.error('Error fetching emergency:', err);
      if (err.response?.status === 404) {
        setError('No active emergency found for your account.');
      } else {
        setError('Failed to fetch emergency details. Please try again.');
      }
      setEmergencyData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch when userId is available
  useEffect(() => {
    if (userId) {
      fetchCurrentEmergency(userId);
    }
  }, [userId, fetchCurrentEmergency]);

  // Poll for updates every 30 seconds
  useEffect(() => {
    if (userId && emergencyData) {
      const interval = setInterval(() => {
        fetchCurrentEmergency(userId);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [userId, emergencyData, fetchCurrentEmergency]);

  // Manual refresh
  const handleRefresh = () => {
    if (userId) {
      fetchCurrentEmergency(userId);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 mx-auto mb-4 animate-spin" />
          <p className="text-black font-semibold">Loading emergency details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !emergencyData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-xl border border-orange-200/50 rounded-2xl p-6 shadow-xl text-center">
          <AlertTriangle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">No Active Emergency</h2>
          <p className="text-black/70 mb-4">{error || 'No emergency request found for your account.'}</p>
          <button 
            onClick={handleRefresh}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get coordinates from location
  const getLocationCoords = (location) => {
    if (!location) return null;
    
    if (location.coordinates && Array.isArray(location.coordinates)) {
      return {
        lat: location.coordinates[1],
        lng: location.coordinates[0],
        address: location.address
      };
    }
    
    if (location.lat && location.lng) {
      return location;
    }
    
    return null;
  };

  const patientLocation = getLocationCoords(emergencyData.patientLocation);
  const hospitalLocation = getLocationCoords(emergencyData.hospitalLocation);
  const ambulanceLocation = getLocationCoords(emergencyData.ambulance?.location);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 bg-gradient-to-r from-orange-500/5 to-orange-400/3 rounded-full blur-3xl animate-pulse top-10 right-10" />
        <div className="absolute w-48 h-48 bg-gradient-to-r from-orange-600/4 to-orange-500/2 rounded-full blur-3xl animate-pulse bottom-20 left-20" style={{ animationDelay: '2s' }} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
              <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-xl border border-orange-200/50 rounded-2xl p-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                  <div className="absolute inset-0 w-3 h-3 bg-orange-600 rounded-full" />
                </div>
                <div>
                  <span className="text-black font-bold text-lg">EMERGENCY ACTIVE</span>
                  <span className="text-orange-600 font-medium ml-4">ID: {emergencyData._id}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-orange-600 font-bold">{emergencyData.priority || 'High'}</p>
                  <p className="text-black/60">Priority</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-600 font-bold">{emergencyData.status}</p>
                  <p className="text-black/60">Status</p>
                </div>
                <div className="text-center">
                  <LiveTime />
                  <p className="text-black/60">Current Time</p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-orange-100 hover:bg-orange-200 border border-orange-300 text-orange-800 font-bold py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? '🔄' : '↻'} Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* Patient Status & Map Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          
          {/* Patient Info */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black">Patient Status</h3>
                <p className="text-orange-600 text-sm font-medium">Help is coming, {emergencyData.patient?.name || 'Patient'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-orange-50/80 rounded-xl p-3 border border-orange-200/40">
                <p className="text-black font-semibold">{emergencyData.emergencyType || 'Emergency'}</p>
                <p className="text-black/70 text-sm">{patientLocation?.address || 'Location updating...'}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="text-center p-2 bg-orange-50/60 rounded-lg border border-orange-200/30">
                  <Activity className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-black text-xs font-bold">Emergency</p>
                </div>
                <div className="text-center p-2 bg-orange-50/60 rounded-lg border border-orange-200/30">
                  <Shield className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-black text-xs font-bold">Active</p>
                </div>
                <div className="text-center p-2 bg-orange-50/60 rounded-lg border border-orange-200/30">
                  <Clock className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-black text-xs font-bold">{new Date(emergencyData.createdAt).toLocaleTimeString()}</p>
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
                <h3 className="text-lg font-bold text-black">Live Tracking</h3>
                <p className="text-orange-600 text-sm font-medium">Real-time ambulance location</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-black">{emergencyData.ambulance ? 'En Route' : 'Dispatching'}</p>
                <p className="text-black/60 text-sm">Status</p>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-orange-200/40 h-64">
              <MapComponent 
                patientLocation={patientLocation}
                driverLocation={ambulanceLocation}
                hospitalLocation={hospitalLocation}
              />
            </div>
          </div>
        </div>

        {/* Driver & Hospital Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          
          {/* Driver Information */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black">Your Driver</h3>
                <p className="text-orange-600 text-sm font-medium">{emergencyData.ambulance ? 'Currently En Route' : 'Being Assigned'}</p>
              </div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-3">
              {emergencyData.ambulance ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50/80 rounded-lg p-3 border border-orange-200/40">
                      <p className="text-black font-bold text-sm">{emergencyData.ambulance.driverName || 'Driver Assigned'}</p>
                      <p className="text-black/70 text-xs">Professional Driver</p>
                    </div>
                    <div className="bg-orange-50/80 rounded-lg p-3 border border-orange-200/40">
                      <p className="text-black font-bold text-sm">{emergencyData.ambulance.vehicleNumber || 'Vehicle Assigned'}</p>
                      <p className="text-black/70 text-xs">Vehicle ID</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50/60 rounded-lg border border-orange-200/30">
                    <div>
                      <p className="text-black font-semibold">Ambulance Assigned</p>
                      <p className="text-black/60 text-xs">Experienced Emergency Team</p>
                    </div>
                    <button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
                      onClick={() => window.open(`tel:${emergencyData.ambulance.phone || '+911234567890'}`)}
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <Loader className="w-8 h-8 text-orange-600 mx-auto mb-2 animate-spin" />
                  <p className="text-black font-semibold">Assigning Ambulance</p>
                  <p className="text-black/60 text-xs">Finding nearest available unit</p>
                </div>
              )}
            </div>
          </div>

          {/* Hospital Information */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-orange-200/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black">Destination Hospital</h3>
                <p className="text-orange-600 text-sm font-medium">{emergencyData.hospital ? 'Emergency Team Ready' : 'Finding Hospital'}</p>
              </div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-3">
              {emergencyData.hospital ? (
                <>
                  <div className="bg-orange-50/80 rounded-lg p-3 border border-orange-200/40">
                    <p className="text-black font-bold text-sm">{emergencyData.hospital.name}</p>
                    <p className="text-black/70 text-xs">{emergencyData.hospital.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50/60 rounded-lg p-2 border border-orange-200/30">
                      <p className="text-black font-semibold text-xs">Emergency Dept.</p>
                      <p className="text-black/60 text-xs">Department</p>
                    </div>
                    <div className="bg-orange-50/60 rounded-lg p-2 border border-orange-200/30">
                      <p className="text-orange-600 font-semibold text-xs">Ready</p>
                      <p className="text-black/60 text-xs">Status</p>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    onClick={() => window.open(`tel:${emergencyData.hospital.phone || '+911234567890'}`)}
                  >
                    <Phone className="w-4 h-4" />
                    Call Hospital
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <Loader className="w-8 h-8 text-orange-600 mx-auto mb-2 animate-spin" />
                  <p className="text-black font-semibold">Finding Hospital</p>
                  <p className="text-black/60 text-xs">Locating nearest facility</p>
                </div>
              )}
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
              className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2"
              onClick={() => window.confirm('Are you sure you want to cancel this emergency?')}
            >
              <X className="w-5 h-5 group-hover:animate-pulse" />
              <span className="text-sm">Cancel Emergency</span>
            </button>
            
            <button 
              className="group bg-orange-50/60 hover:bg-orange-50/80 border border-orange-200/40 hover:border-orange-400/50 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2"
              onClick={handleRefresh}
            >
              <MapPin className="w-5 h-5 text-orange-600 group-hover:animate-bounce" />
              <span className="text-sm">Refresh Status</span>
            </button>
            
            <button 
              className="group bg-orange-50/60 hover:bg-orange-50/80 border border-orange-200/40 hover:border-orange-400/50 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2"
              onClick={() => window.open(`tel:${emergencyData.patient?.phone || ''}`)}
            >
              <Phone className="w-5 h-5 text-orange-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm">Emergency Line</span>
            </button>
            
            <button className="group bg-orange-50/60 hover:bg-orange-50/80 border border-orange-200/40 hover:border-orange-400/50 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">Medical Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponsePage;