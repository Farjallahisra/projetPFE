const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
    service_id: { type: String, required: true ,unique:true},
    monday: { type: Boolean, required: true },
    tuesday: { type: Boolean, required: true },
    wednesday: { type: Boolean, required: true },
    thursday: { type: Boolean, required: true },
    friday: { type: Boolean, required: true },
    saturday: { type: Boolean, required: true },
    sunday: { type: Boolean, required: true },
    start_date: { type: Date, required: true },
    end_date: {type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return value > this.start_date; // Ensure end_date is after start_date
            },
            message: 'End date must be later than start date'
        }},
});
CalendarSchema.index({ service_id: 1 }); // Index for efficient lookup

module.exports = mongoose.model('Calendar', CalendarSchema);