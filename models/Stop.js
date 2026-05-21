const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    stop_id: { 
        type: String, 
        required: true, 
        unique: true },
    stop_name: { 
        type: String, 
        required: true },
    stop_lat: { 
        type: Number, 
        required: true }, // Latitude
    stop_lon: { 
        type: Number, 
        required: true }, // Longitude
    stop_desc: {
        type: String 
    }, 
    zone_id: {
         type: String 
        }, 
    stop_url: { 
        type: String 
    }, 
    createdAt: {
         type: Date, default: Date.now }
});
stopSchema.index({ stop_id: 1 }); // Index for efficient lookup

module.exports = mongoose.model('Stop', stopSchema);
