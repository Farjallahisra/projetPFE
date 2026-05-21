const Route = require('../models/Route');
const Agency = require('../models/Agency');


/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create a new route
 *     description: Associates a new route with an agency.
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agency
 *               - route_id
 *               - route_short_name
 *               - route_long_name
 *               - route_type
 *             properties:
 *               agency:
 *                 type: string
 *                 description: Agency ID
 *                 example: "60f5b3b8e1b4a824d8e4f456"
 *               route_id:
 *                 type: string
 *                 description: Unique identifier for the route
 *                 example: "R001"
 *               route_short_name:
 *                 type: string
 *                 example: "Route 1"
 *               route_long_name:
 *                 type: string
 *                 example: "Downtown to Uptown"
 *               route_type:
 *                 type: string
 *                 example: "Bus"
 *     responses:
 *       201:
 *         description: Route successfully created and assigned to an agency.
 *       400:
 *         description: Duplicate route or invalid data.
 *       404:
 *         description: Agency not found.
 *       500:
 *         description: Server error.
 */
const createRoute = async (req, res) => {
    const { agency, route_id, route_short_name, route_long_name, route_type } = req.body;

    try {
        // Validate agency existence
        const existingAgency = await Agency.findById(agency);
        if (!existingAgency) {
            return res.status(404).json({ message: 'Agence non trouvée' });
        }

        // Check for duplicate route
        const existingRoute = await Route.findOne({ route_id });
        if (existingRoute) {
            return res.status(400).json({ message: 'Cette route existe déjà' });
        }

        // Create the route
        const route = new Route({
            agency,
            route_id,
            route_short_name,
            route_long_name,
            route_type,
        });

        const savedRoute = await route.save();

        // Link route to agency
        existingAgency.routes.push(savedRoute._id);
        await existingAgency.save();

        res.status(201).json(savedRoute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Retrieve all routes
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of routes retrieved successfully.
 *       500:
 *         description: Server error.
 */
const getRoutes = async (req, res) => {
    try {
        const routes = await Route.find().populate('agency');
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     summary: Retrieve a route by ID
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Route ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route retrieved successfully.
 *       404:
 *         description: Route not found.
 *       500:
 *         description: Server error.
 */
const getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id).populate('agency');
        if (!route) {
            return res.status(404).json({ message: 'Route non trouvée' });
        }
        res.json(route);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/routes/{id}:
 *   put:
 *     summary: Update a route
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Route ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               route_short_name:
 *                 type: string
 *               route_long_name:
 *                 type: string
 *               route_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Route updated successfully.
 *       404:
 *         description: Route not found.
 *       500:
 *         description: Server error.
 */
const updateRoute = async (req, res) => {
    try {
        const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRoute) {
            return res.status(404).json({ message: 'Route non trouvée' });
        }
        res.json(updatedRoute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     summary: Delete a route
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Route ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route successfully deleted.
 *       404:
 *         description: Route not found.
 *       500:
 *         description: Server error.
 */
const deleteRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndDelete(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route non trouvée' });
        }

        // Unlink the route from the agency
        await Agency.findByIdAndUpdate(route.agency, {
            $pull: { routes: route._id },
        });

        res.json({ message: 'Route supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRoute, getRoutes, getRouteById, updateRoute, deleteRoute };
