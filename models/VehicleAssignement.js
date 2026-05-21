const mongoose = require("mongoose");

const vehicleAssignmentSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  assigned_type: {
    type: {
      type: String,
      enum: ["trip", "route", "block"],
      required: true
    },
    id: { type: mongoose.Schema.Types.ObjectId, required: true }
  },
  assigned_at: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
});

// Ensure only one assignment type is provided
vehicleAssignmentSchema.pre("save", function (next) {
  if (!this.assigned_type || !this.assigned_type.type || !this.assigned_type.id) {
    return next(new Error("A vehicle must be assigned to a valid trip, route, or block."));
  }
  next();
});

const VehicleAssignment = mongoose.model("VehicleAssignment", vehicleAssignmentSchema);

module.exports = VehicleAssignment;