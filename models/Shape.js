const mongoose = require('mongoose');

const ShapeSchema = new mongoose.Schema({
  shape_id: { type: String, required: true },
  points: [
    {
      shape_pt_lat: { type: Number, required: true },
      shape_pt_lon: { type: Number, required: true },
      shape_pt_sequence: { type: Number, required: true },
      shape_dist_traveled: { type: Number }, // Optional
    },
  ],
});

module.exports = mongoose.model('Shape', ShapeSchema);
