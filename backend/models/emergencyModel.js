const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'enroute', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  patientLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat] !!
  },
  hospitalLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }
  },
}, { timestamps: true });

emergencyRequestSchema.index({ patientLocation: '2dsphere' });
emergencyRequestSchema.index({ hospitalLocation: '2dsphere' });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
