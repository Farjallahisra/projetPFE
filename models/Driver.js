const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cinNumber: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    default: null
  }
});

module.exports = mongoose.model('Driver', driverSchema);