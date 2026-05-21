const Calendar = require('../models/Calendar');

// Create a new calendar

/**
 * @swagger
 * /api/calendars:
 *   post:
 *     summary: Create a new calendar
 *     tags: [Calendars]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: string
 *                 description: Unique identifier for the calendar service
 *               monday:
 *                 type: boolean
 *                 description: Indicates if the service is active on Monday
 *               tuesday:
 *                 type: boolean
 *                 description: Indicates if the service is active on Tuesday
 *               wednesday:
 *                 type: boolean
 *                 description: Indicates if the service is active on Wednesday
 *               thursday:
 *                 type: boolean
 *                 description: Indicates if the service is active on Thursday
 *               friday:
 *                 type: boolean
 *                 description: Indicates if the service is active on Friday
 *               saturday:
 *                 type: boolean
 *                 description: Indicates if the service is active on Saturday
 *               sunday:
 *                 type: boolean
 *                 description: Indicates if the service is active on Sunday
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: The start date for the calendar
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: The end date for the calendar
 *     responses:
 *       201:
 *         description: Calendar created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createCalendar = async (req, res) => {
  try {
    const calendar = new Calendar(req.body);
    await calendar.save();
    res.status(201).json(calendar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all calendars
/**
 * @swagger
 * /api/calendars:
 *   get:
 *     summary: Retrieve all calendars
 *     tags: [Calendars]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of calendars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   service_id:
 *                     type: string
 *                     description: Unique identifier for the calendar service
 *                   monday:
 *                     type: boolean
 *                     description: Indicates if the service is active on Monday
 *                   tuesday:
 *                     type: boolean
 *                     description: Indicates if the service is active on Tuesday
 *                   wednesday:
 *                     type: boolean
 *                     description: Indicates if the service is active on Wednesday
 *                   thursday:
 *                     type: boolean
 *                     description: Indicates if the service is active on Thursday
 *                   friday:
 *                     type: boolean
 *                     description: Indicates if the service is active on Friday
 *                   saturday:
 *                     type: boolean
 *                     description: Indicates if the service is active on Saturday
 *                   sunday:
 *                     type: boolean
 *                     description: Indicates if the service is active on Sunday
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     description: The start date for the calendar
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     description: The end date for the calendar
 *       500:
 *         description: Server error
 */


const getCalendars = async (req, res) => {
  try {
    const calendars = await Calendar.find();
    res.status(200).json(calendars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a calendar by ID

/**
 * @swagger
 * /api/calendars/{id}:
 *   get:
 *     summary: Retrieve a calendar by ID
 *     tags: [Calendars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Calendar's ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calendar found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service_id:
 *                   type: string
 *                   description: Unique identifier for the calendar service
 *                 monday:
 *                   type: boolean
 *                   description: Indicates if the service is active on Monday
 *                 tuesday:
 *                   type: boolean
 *                   description: Indicates if the service is active on Tuesday
 *                 wednesday:
 *                   type: boolean
 *                   description: Indicates if the service is active on Wednesday
 *                 thursday:
 *                   type: boolean
 *                   description: Indicates if the service is active on Thursday
 *                 friday:
 *                   type: boolean
 *                   description: Indicates if the service is active on Friday
 *                 saturday:
 *                   type: boolean
 *                   description: Indicates if the service is active on Saturday
 *                 sunday:
 *                   type: boolean
 *                   description: Indicates if the service is active on Sunday
 *                 start_date:
 *                   type: string
 *                   format: date
 *                   description: The start date for the calendar
 *                 end_date:
 *                   type: string
 *                   format: date
 *                   description: The end date for the calendar
 *       404:
 *         description: Calendar not found
 *       500:
 *         description: Server error
 */

const getCalendarById = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (!calendar) return res.status(404).json({ message: 'Calendar not found' });
    res.status(200).json(calendar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update a calendar by ID
/**
 * @swagger
 * /api/calendars/{id}:
 *   put:
 *     summary: Update a calendar by ID
 *     tags: [Calendars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Calendar's ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: string
 *               monday:
 *                 type: boolean
 *               tuesday:
 *                 type: boolean
 *               wednesday:
 *                 type: boolean
 *               thursday:
 *                 type: boolean
 *               friday:
 *                 type: boolean
 *               saturday:
 *                 type: boolean
 *               sunday:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Calendar updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Calendar not found
 *       500:
 *         description: Server error
 */
const updateCalendar = async (req, res) => {
  try {
    const updatedCalendar = await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCalendar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a calendar by ID
/**
 * @swagger
 * /api/calendars/{id}:
 *   delete:
 *     summary: Delete a calendar by ID
 *     tags: [Calendars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Calendar's ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calendar deleted successfully
 *       404:
 *         description: Calendar not found
 *       500:
 *         description: Server error
 */
const deleteCalendar = async (req, res) => {
  try {
    await Calendar.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Calendar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { createCalendar, getCalendars, getCalendarById, updateCalendar, deleteCalendar };
