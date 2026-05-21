const Stop = require('../models/Stop');

/**
 * @swagger
 * /api/stops:
 *   post:
 *     summary: Create a new stop
 *     tags:
 *       - Stops
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stop_id
 *               - stop_name
 *               - stop_lat
 *               - stop_lon
 *             properties:
 *               stop_id:
 *                 type: string
 *                 description: Unique identifier for the stop
 *               stop_name:
 *                 type: string
 *                 description: Name of the stop
 *               stop_lat:
 *                 type: number
 *                 description: Latitude of the stop
 *               stop_lon:
 *                 type: number
 *                 description: Longitude of the stop
 *               stop_desc:
 *                 type: string
 *                 description: Description of the stop (optional)
 *               zone_id:
 *                 type: string
 *                 description: Zone ID of the stop (optional)
 *               stop_url:
 *                 type: string
 *                 description: URL with more information about the stop (optional)
 *     responses:
 *       201:
 *         description: Stop created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createStop = async (req, res) => {
    const { stop_id, stop_name, stop_lat, stop_lon, stop_desc, zone_id, stop_url } = req.body;

    try {
        const stop = await Stop.create({ stop_id, stop_name, stop_lat, stop_lon, stop_desc, zone_id, stop_url });
        res.status(201).json(stop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/stops:
 *   get:
 *     summary: Retrieve all stops
 *     tags:
 *       - Stops
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stop_id:
 *                     type: string
 *                   stop_name:
 *                     type: string
 *                   stop_lat:
 *                     type: number
 *                   stop_lon:
 *                     type: number
 *                   stop_desc:
 *                     type: string
 *                   zone_id:
 *                     type: string
 *                   stop_url:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
const getStops = async (req, res) => {
    try {
        const stops = await Stop.find();
        res.status(200).json(stops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/stops/{id}:
 *   get:
 *     summary: Retrieve a stop by ID
 *     tags:
 *       - Stops
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Stop ID
 *     responses:
 *       200:
 *         description: Stop found
 *       404:
 *         description: Stop not found
 *       500:
 *         description: Server error
 */
const getStopById = async (req, res) => {
    try {
        const stop = await Stop.findById(req.params.id);
        if (!stop) {
            return res.status(404).json({ message: 'Stop not found' });
        }
        res.status(200).json(stop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/stops/{id}:
 *   put:
 *     summary: Update a stop
 *     tags:
 *       - Stops
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Stop ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stop_name:
 *                 type: string
 *               stop_lat:
 *                 type: number
 *               stop_lon:
 *                 type: number
 *               stop_desc:
 *                 type: string
 *               zone_id:
 *                 type: string
 *               stop_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stop updated successfully
 *       404:
 *         description: Stop not found
 *       500:
 *         description: Server error
 */
const updateStop = async (req, res) => {
    try {
        const stop = await Stop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!stop) {
            return res.status(404).json({ message: 'Stop not found' });
        }
        res.status(200).json(stop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/stops/{id}:
 *   delete:
 *     summary: Delete a stop
 *     tags:
 *       - Stops
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Stop ID
 *     responses:
 *       200:
 *         description: Stop deleted successfully
 *       404:
 *         description: Stop not found
 *       500:
 *         description: Server error
 */
const deleteStop = async (req, res) => {
    try {
        const stop = await Stop.findByIdAndDelete(req.params.id);
        if (!stop) {
            return res.status(404).json({ message: 'Stop not found' });
        }
        res.status(200).json({ message: 'Stop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStop,
    getStops,
    getStopById,
    updateStop,
    deleteStop,
};
