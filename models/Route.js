const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    agency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
        required: true
    },
    route_id: {
        type: String, required: true,
        unique: true
    },
    route_short_name: {
        type: String,
        required: true
    },
    route_long_name: {
        type: String
    },
    route_type: {
        type: String
    },
    trips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip'
        }
    ],
    createdAt: { type: Date, default: Date.now }
});
routeSchema.index({ route_id: 1 });

module.exports = mongoose.model('Route', routeSchema);