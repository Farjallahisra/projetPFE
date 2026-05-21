const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: List of drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate('assignedVehicle');
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Get a driver by ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('assignedVehicle');
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: Create a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - cinNumber
 *               - phoneNumber
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               cinNumber:
 *                 type: string
 *               phoneNumber:
 *                 type: string  
 *     responses:
 *       201:
 *         description: Driver created
 *       400:
 *         description: Missing required fields or bad request
 */
const createDriver = async (req, res) => {
  const { username, email, cinNumber, phoneNumber } = req.body;

  if (!username || !email || !cinNumber || !phoneNumber) {
    return res.status(400).json({ message: "username, email, cinNumber, and phoneNumber are required" });
  }

  try {
    const newDriver = new Driver({ username, email, cinNumber, phoneNumber });
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/drivers/{id}:
 *   put:
 *     summary: Update a driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               cinNumber:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Driver not found
 */
const updateDriver = async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDriver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/drivers/{id}:
 *   delete:
 *     summary: Delete a driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Server error
 */
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // Remove the driver from its assigned vehicle
    if (driver.assignedVehicle) {
      await Vehicle.findByIdAndUpdate(driver.assignedVehicle, { $pull: { drivers: driver._id } });
    }

    await Driver.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
};