const mongoose = require('mongoose');

const stopTimeSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    stop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop',
        required: true
    },
    arrival_time: {
         type: String, 
         required: true 
        }, // Heure d'arrivée (HH:MM:SS)
    departure_time: {
         type: String, 
         required: true,
         validate: {
            validator: function(value) {
                return value > this.arrival_time; // Ensure end_date is after start_date
            },
            message: 'departure time date must be later than arrival time date'
        } }, // Heure de départ (HH:MM:SS)
    stop_sequence: {
         type: Number, 
         required: true },
    pickup_type: {
         type: Number 
        }, // Type de prise en charge
    drop_off_type: { 
        type: Number 
    }, // Type de dépose
    createdAt: {
         type: Date, default: Date.now }
});

module.exports = mongoose.model('StopTime', stopTimeSchema);
