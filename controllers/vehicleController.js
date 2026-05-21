const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('drivers');
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('drivers');
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uniqueId
 *               - name
 *               - drivers
 *               - latitude
 *               - longitude
 *             properties:
 *               uniqueId:
 *                 type: string
 *               name:
 *                 type: string
 *               drivers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of 1 or 2 driver CIN numbers
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Vehicle created
 *       400:
 *         description: Missing required fields or bad request
 */
const createVehicle = async (req, res) => {
  const { uniqueId, name, drivers, latitude, longitude } = req.body;

  if (!uniqueId || !name || !drivers || !latitude || !longitude) {
    return res.status(400).json({ message: "uniqueId, name, drivers, latitude, and longitude are required" });
  }

  if (!Array.isArray(drivers) || drivers.length < 1 || drivers.length > 2) {
    return res.status(400).json({ message: "Drivers must be an array with 1 or 2 driver CIN numbers" });
  }

  try {
    // Convertir les CIN en IDs de conducteurs
    const driverDocs = await Driver.find({ cinNumber: { $in: drivers } });
    if (driverDocs.length !== drivers.length) {
      return res.status(400).json({ message: "One or more driver CIN numbers are invalid" });
    }
    const driverIds = driverDocs.map(driver => driver._id);

    // Vérifier que aucun conducteur n'est déjà assigné à un autre bus
    for (const driver of driverDocs) {
      if (driver.assignedVehicle && !driver.assignedVehicle.equals(null)) {
        return res.status(400).json({ message: `Driver with CIN ${driver.cinNumber} is already assigned to another vehicle` });
      }
    }

    const newVehicle = new Vehicle({ uniqueId, name, drivers: driverIds, latitude, longitude });
    const savedVehicle = await newVehicle.save();

    // Mettre à jour les conducteurs avec le véhicule assigné
    await Driver.updateMany(
      { _id: { $in: driverIds } },
      { $set: { assignedVehicle: savedVehicle._id } }
    );

    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *               name:
 *                 type: string
 *               drivers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of 1 or 2 driver CIN numbers
 *               category:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               temperature:
 *                 type: number
 *               pression:
 *                 type: number
 *               humidity:
 *                 type: number
 *               flame:
 *                 type: boolean
 *               positionId:
 *                 type: string
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *               assignedRoute:
 *                 type: string
 *               assignedTrip:
 *                 type: string
 *               assignedBlock:
 *                 type: string
 *               headsign:
 *                 type: string
 *               estimatedArrivalTimes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stopId:
 *                       type: string
 *                     arrivalTime:
 *                       type: string
 *                       format: date-time
 *               currentShapeSequence:
 *                 type: number
 *               user:
 *                 type: string
 *               vehicle_details:
 *                 type: object
 *                 properties:
 *                   next_stop_id:
 *                     type: string
 *                   next_stop_name:
 *                     type: string
 *                   next_stop_distance:
 *                     type: number
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Vehicle not found
 */
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const updates = req.body;

    if (updates.drivers && JSON.stringify(updates.drivers) !== JSON.stringify(vehicle.drivers.map(d => d.cinNumber))) {
      if (!Array.isArray(updates.drivers) || updates.drivers.length < 1 || updates.drivers.length > 2) {
        return res.status(400).json({ message: "Drivers must be an array with 1 or 2 driver CIN numbers" });
      }

      // Convertir les CIN en IDs de conducteurs
      const driverDocs = await Driver.find({ cinNumber: { $in: updates.drivers } });
      if (driverDocs.length !== updates.drivers.length) {
        return res.status(400).json({ message: "One or more driver CIN numbers are invalid" });
      }
      const newDriverIds = driverDocs.map(driver => driver._id);

      // Vérifier que aucun conducteur n'est déjà assigné à un autre bus
      for (const driver of driverDocs) {
        if (driver.assignedVehicle && !driver.assignedVehicle.equals(vehicle._id)) {
          return res.status(400).json({ message: `Driver with CIN ${driver.cinNumber} is already assigned to another vehicle` });
        }
      }

      // Libérer les anciens conducteurs
      if (vehicle.drivers && vehicle.drivers.length > 0) {
        await Driver.updateMany(
          { _id: { $in: vehicle.drivers } },
          { $set: { assignedVehicle: null } },
          { upsert: false }
        );
      }

      // Assigner les nouveaux conducteurs
      await Driver.updateMany(
        { _id: { $in: newDriverIds } },
        { $set: { assignedVehicle: vehicle._id } },
        { upsert: false }
      );

      updates.drivers = newDriverIds; // Mettre à jour avec les IDs
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('drivers');

    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Retirer le véhicule des conducteurs assignés
    if (vehicle.drivers && vehicle.drivers.length > 0) {
      await Driver.updateMany(
        { _id: { $in: vehicle.drivers } },
        { $set: { assignedVehicle: null } },
        { upsert: false }
      );
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};