const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true, unique: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat] !!
  },
  isAvailable: { type: Boolean, default: true },
  currentRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyRequest' }
}, { timestamps: true });

ambulanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
