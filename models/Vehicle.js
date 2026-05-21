const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    id: { type: String }, 
    uniqueId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String }, 
    latitude: { type: Number, required: true }, 
    longitude: { type: Number, required: true },  
    temperature: { type: Number }, 
    pression: { type: Number }, 
    humidity: { type: Number }, 
    flame: { type: Boolean },
    drivers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver"
        }],
        validate: {
            validator: function(array) {
                return array.length <= 2 && array.length > 0;
            },
            message: "A vehicle must have 1 or 2 drivers."
        },
        required: true
    },
    positionId: { type: String }, 
    updatedAt: { type: Date, default: Date.now }, 
    assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: "Route" }, 
    assignedTrip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    assignedBlock: { type: String }, 
    headsign: { type: String }, 
    estimatedArrivalTimes: [{ 
        stopId: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" }, 
        arrivalTime: { type: Date } 
    }],
    currentShapeSequence: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle_details: {
        next_stop_id: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
        next_stop_name: { type: String },
        next_stop_distance: { type: Number } // Distance in km
    }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);