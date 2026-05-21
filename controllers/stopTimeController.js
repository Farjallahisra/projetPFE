const StopTime = require('../models/StopTime');
const Stop = require('../models/Stop');
const Trip = require('../models/Trip');


// Create a new StopTime
/**
 * @swagger
 * /api/stoptimes:
 *   post:
 *     summary: Create a new StopTime
 *     tags: [StopTimes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip:
 *                 type: string
 *                 description: ID of the associated trip
 *               stop:
 *                 type: string
 *                 description: ID of the associated stop
 *               arrival_time:
 *                 type: string
 *                 description: Arrival time in HH:MM:SS format
 *               departure_time:
 *                 type: string
 *                 description: Departure time in HH:MM:SS format
 *               stop_sequence:
 *                 type: number
 *                 description: Sequence of the stop within the trip
 *               pickup_type:
 *                 type: number
 *               drop_off_type:
 *                 type: number
 *     responses:
 *       201:
 *         description: StopTime created successfully
 *       400:
 *         description: Validation error or referenced entities not found
 *       500:
 *         description: Server error
 */
const createStopTime = async (req, res) => {
    const { trip, stop, arrival_time, departure_time, stop_sequence, pickup_type, drop_off_type } = req.body;

    try {
        const existingTrip = await Trip.findById(trip);
        if (!existingTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const existingStop = await Stop.findById(stop);
        if (!existingStop) {
            return res.status(404).json({ message: 'Stop not found' });
        }

        const duplicateStopTime = await StopTime.findOne({ trip, stop });
        if (duplicateStopTime) {
            return res.status(400).json({ message: 'A StopTime with the same trip and stop already exists' });
        }

        const stopTime = await StopTime.create({
            trip,
            stop,
            arrival_time,
            departure_time,
            stop_sequence,
            pickup_type,
            drop_off_type,
        });

        // Update the stop_times array of the trip
        existingTrip.stop_times.push(stopTime._id);
        await existingTrip.save();

        res.status(201).json(stopTime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a StopTime
/**
 * @swagger
 * /api/stoptimes/{id}:
 *   put:
 *     summary: Update a StopTime
 *     tags: [StopTimes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the StopTime to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip:
 *                 type: string
 *               stop:
 *                 type: string
 *               arrival_time:
 *                 type: string
 *               departure_time:
 *                 type: string
 *               stop_sequence:
 *                 type: number
 *               pickup_type:
 *                 type: number
 *               drop_off_type:
 *                 type: number
 *     responses:
 *       200:
 *         description: StopTime updated successfully
 *       404:
 *         description: StopTime, Trip, or Stop not found
 *       500:
 *         description: Server error
 */
const updateStopTime = async (req, res) => {
    const { id } = req.params;
    const { trip, stop, arrival_time, departure_time, stop_sequence, pickup_type, drop_off_type } = req.body;

    try {
        const stopTime = await StopTime.findById(id);
        if (!stopTime) {
            return res.status(404).json({ message: 'StopTime not found' });
        }

        // Check for duplicates only if trip or stop is being updated
        if (trip && trip !== stopTime.trip.toString() || stop && stop !== stopTime.stop.toString()) {
            const duplicateStopTime = await StopTime.findOne({
                trip: trip || stopTime.trip,
                stop: stop || stopTime.stop,
                _id: { $ne: id },
            });

            if (duplicateStopTime) {
                return res.status(400).json({ message: 'A StopTime with the same trip and stop already exists' });
            }
        }

        // Update the StopTime with other fields
        stopTime.arrival_time = arrival_time || stopTime.arrival_time;
        stopTime.departure_time = departure_time || stopTime.departure_time;
        stopTime.stop_sequence = stop_sequence || stopTime.stop_sequence;
        stopTime.pickup_type = pickup_type || stopTime.pickup_type;
        stopTime.drop_off_type = drop_off_type || stopTime.drop_off_type;

        // Only update trip and stop if not duplicate
        if (trip && trip !== stopTime.trip.toString()) {
            const existingTrip = await Trip.findById(trip);
            if (!existingTrip) {
                return res.status(404).json({ message: 'Trip not found' });
            }
            stopTime.trip = trip;

            // Update the stop_times field of the trip
            existingTrip.stop_times.push(stopTime._id);
            await existingTrip.save();
        }

        if (stop && stop !== stopTime.stop.toString()) {
            const existingStop = await Stop.findById(stop);
            if (!existingStop) {
                return res.status(404).json({ message: 'Stop not found' });
            }
            stopTime.stop = stop;
        }

        const updatedStopTime = await stopTime.save();
        res.status(200).json(updatedStopTime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve all stop times
/**
 * @swagger
 * /api/stoptimes:
 *   get:
 *     summary: Retrieve all stop times
 *     tags: [StopTimes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of stop times
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StopTime'
 *       500:
 *         description: Server error
 */
const getStopTimes = async (req, res) => {
    try {
        const stopTimes = await StopTime.find();
        res.status(200).json(stopTimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a stop time by ID
/**
 * @swagger
 * /api/stoptimes/{id}:
 *   get:
 *     summary: Retrieve a stop time by ID
 *     tags: [StopTimes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: StopTime ID
 *     responses:
 *       200:
 *         description: Stop time found
 *       404:
 *         description: Stop time not found
 *       500:
 *         description: Server error
 */
const getStopTimeById = async (req, res) => {
    try {
        const stopTime = await StopTime.findById(req.params.id);
        if (!stopTime) {
            return res.status(404).json({ message: 'Stop time not found' });
        }
        res.status(200).json(stopTime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Delete a stop time
/**
 * @swagger
 * /api/stoptimes/{id}:
 *   delete:
 *     summary: Delete a stop time
 *     tags: [StopTimes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: StopTime ID
 *     responses:
 *       200:
 *         description: Stop time deleted successfully
 *       404:
 *         description: Stop time not found
 *       500:
 *         description: Server error
 */
const deleteStopTime = async (req, res) => {
    try {
        const stopTime = await StopTime.findByIdAndDelete(req.params.id);
        if (!stopTime) {
            return res.status(404).json({ message: 'Stop time not found' });
        }

        // Update the trip's stop_times array by removing the deleted stopTime
        const trip = await Trip.findById(stopTime.trip);
        if (trip) {
            trip.stop_times.pull(stopTime._id);
            await trip.save();
        }

        res.status(200).json({ message: 'Stop time deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/stopTimes/trips/{tripId}:
 *   get:
 *     summary: Retrieve all stop times for a specific trip
 *     tags: [StopTimes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: tripId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the trip
 *     responses:
 *       200:
 *         description: List of stop times for the trip
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier of the StopTime
 *                   stop:
 *                     type: object
 *                     properties:
 *                       stop_name:
 *                         type: string
 *                         description: Name of the stop
 *                       stop_lat:
 *                         type: number
 *                         format: float
 *                         description: Latitude of the stop
 *                       stop_lon:
 *                         type: number
 *                         format: float
 *                         description: Longitude of the stop
 *                   stop_sequence:
 *                     type: number
 *                     description: Sequence of the stop within the trip
 *       404:
 *         description: No StopTimes found for this trip
 *       500:
 *         description: Server error
 */
const getStopTimesByTrip = async (req, res) => {
  const { tripId } = req.params;
console.log("TRIP_ID::",tripId);
  try {
      // Find StopTimes by trip ID and populate related data
      const stopTimes = await StopTime.find({ trip: tripId })
          .populate('stop', 'stop_name stop_lat stop_lon') // Populates only specific fields of stop
          .sort('stop_sequence'); // Ensures StopTimes are ordered by sequence

      if (!stopTimes.length) {
          return res.status(404).json({ message: 'No StopTimes found for this trip' });
      }

      res.status(200).json(stopTimes);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
module.exports = {
    createStopTime,
    getStopTimes,
    getStopTimeById,
    updateStopTime,
    deleteStopTime,
    getStopTimesByTrip
};
