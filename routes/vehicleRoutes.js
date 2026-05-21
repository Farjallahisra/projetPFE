const express = require('express');
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { protect, isSuperAdmin, isSuperOrAdmin, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllVehicles);
router.get('/:id', getVehicleById); // ✅ Corrected line
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
