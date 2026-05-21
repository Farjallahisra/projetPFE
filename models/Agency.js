const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    website: {
        type: String
    },
    routes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route'
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agency', agencySchema);