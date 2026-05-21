const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    trip_id: {
        type: String, required: true, unique: true
    },
    trip_headsign: {
        type: String
    }, 
    direction_id: {
        type: Number
    }, // 0 = aller, 1 = retour
    stop_times: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StopTime'
        }
    ],
    block_id: {
        type: String
    }, 
    trip_short_name: {
        type: String
    }, 
    shape_id: {
        type: String
    }, // Optionnel, identifiant pour le trajet géographique
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calendar',
        required: true // Ensure that service_id is required
},
    vehicle_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'
    }, // Référence au véhicule assigné
    createdAt: { type: Date, default: Date.now }
});
tripSchema.index({ trip_id: 1 }); // Index for efficient lookup

module.exports = mongoose.model('Trip', tripSchema);
