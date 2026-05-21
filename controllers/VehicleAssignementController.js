const VehicleAssignment = require("../models/VehicleAssignement");
const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");
const Route = require("../models/Route");

/**
 * @swagger
 * /api/vehicle-assignments:
 *   post:
 *     summary: Assigner un véhicule à une route, un trip ou un block
 *     description: Crée une affectation et met à jour le véhicule concerné.
 *     tags: [VehicleAssignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_id
 *               - assigned_type
 *             properties:
 *               vehicle_id:
 *                 type: string
 *                 description: ID du véhicule.
 *               assigned_type:
 *                 type: object
 *                 required:
 *                   - type
 *                   - id
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [trip, route, block]
 *                     description: Type d'affectation.
 *                   id:
 *                     type: string
 *                     description: ID du trip, route ou block.
 *     responses:
 *       201:
 *         description: Affectation créée avec succès.
 *       400:
 *         description: Champs obligatoires manquants.
 *       404:
 *         description: Véhicule, trip ou route non trouvé.
 */
const createAssignment = async (req, res) => {
    try {
      const { vehicle_id, assigned_type } = req.body;
  
      if (!vehicle_id || !assigned_type || !assigned_type.type || !assigned_type.id) {
        return res.status(400).json({ message: "Champs obligatoires manquants." });
      }
  
      const vehicle = await Vehicle.findById(vehicle_id);
      if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé." });
  
      let updateFields = {
        assignedRoute: null,
        assignedTrip: null,
        assignedBlock: null,
      };
  
      if (assigned_type.type === "trip") {
        const trip = await Trip.findById(assigned_type.id);
        if (!trip) return res.status(404).json({ message: "Trip non trouvé." });
        updateFields.assignedTrip = trip._id;
      } else if (assigned_type.type === "route") {
        const route = await Route.findById(assigned_type.id);
        if (!route) return res.status(404).json({ message: "Route non trouvée." });
        updateFields.assignedRoute = route._id;
      } else if (assigned_type.type === "block") {
        updateFields.assignedBlock = assigned_type.id;
      } else {
        return res.status(400).json({ message: "Type d'affectation invalide." });
      }
  
      const assignment = new VehicleAssignment({ vehicle_id, assigned_type });
      await assignment.save();
  
      await Vehicle.findByIdAndUpdate(vehicle_id, updateFields, { new: true });
  
      res.status(201).json({ message: "Véhicule assigné et mis à jour avec succès.", assignment });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'affectation.", error: error.message });
    }
  };
  
/**
 * @swagger
 * /api/vehicle-assignments:
 *   get:
 *     summary: Récupérer toutes les affectations
 *     description: Retourne la liste de toutes les affectations de véhicules.
 *     tags: [VehicleAssignments]
 *     responses:
 *       200:
 *         description: Liste des affectations.
 *       500:
 *         description: Erreur serveur.
 */
const getAllAssignments = async (req, res) => {
    try {
      const assignments = await VehicleAssignment.find().populate("vehicle_id").exec();
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des affectations.", error: error.message });
    }
  };
  

/**
 * @swagger
 * /api/vehicle-assignments/{id}:
 *   get:
 *     summary: Récupérer une affectation spécifique
 *     description: Retourne une affectation en fonction de son ID.
 *     tags: [VehicleAssignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'affectation.
 *     responses:
 *       200:
 *         description: Affectation trouvée.
 *       404:
 *         description: Affectation non trouvée.
 */
  const getAssignmentById = async (req, res) => {
    try {
      const assignment = await VehicleAssignment.findById(req.params.id).populate("vehicle_id").exec();
      if (!assignment) return res.status(404).json({ message: "Affectation non trouvée." });
  
      res.status(200).json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'affectation.", error: error.message });
    }
  };
  
/**
 * @swagger
 * /api/vehicle-assignments/{id}:
 *   put:
 *     summary: Mettre à jour une affectation de véhicule
 *     description: Met à jour une affectation existante et synchronise les informations du véhicule.
 *     tags: [VehicleAssignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'affectation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_id
 *               - assigned_type
 *             properties:
 *               vehicle_id:
 *                 type: string
 *                 description: ID du véhicule.
 *               assigned_type:
 *                 type: object
 *                 required:
 *                   - type
 *                   - id
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [trip, route, block]
 *                     description: Type d'affectation.
 *                   id:
 *                     type: string
 *                     description: ID du trip, route ou block.
 *     responses:
 *       200:
 *         description: Affectation mise à jour avec succès.
 *       404:
 *         description: Affectation ou véhicule non trouvé.
 */
 const updateAssignment = async (req, res) => {
    try {
      const { vehicle_id, assigned_type } = req.body;
  
      if (!vehicle_id || !assigned_type || !assigned_type.type || !assigned_type.id) {
        return res.status(400).json({ message: "Champs obligatoires manquants." });
      }
  
      const assignment = await VehicleAssignment.findById(req.params.id);
      if (!assignment) return res.status(404).json({ message: "Affectation non trouvée." });
  
      const vehicle = await Vehicle.findById(vehicle_id);
      if (!vehicle) return res.status(404).json({ message: "Véhicule non trouvé." });
  
      let updateFields = {
        assignedRoute: null,
        assignedTrip: null,
        assignedBlock: null,
      };
  
      if (assigned_type.type === "trip") {
        const trip = await Trip.findById(assigned_type.id);
        if (!trip) return res.status(404).json({ message: "Trip non trouvé." });
        updateFields.assignedTrip = trip._id;
      } else if (assigned_type.type === "route") {
        const route = await Route.findById(assigned_type.id);
        if (!route) return res.status(404).json({ message: "Route non trouvée." });
        updateFields.assignedRoute = route._id;
      } else if (assigned_type.type === "block") {
        updateFields.assignedBlock = assigned_type.id;
      } else {
        return res.status(400).json({ message: "Type d'affectation invalide." });
      }
  
      assignment.vehicle_id = vehicle_id;
      assignment.assigned_type = assigned_type;
      await assignment.save();
  
      await Vehicle.findByIdAndUpdate(vehicle_id, updateFields, { new: true });
  
      res.status(200).json({ message: "Affectation et véhicule mis à jour avec succès.", assignment });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour.", error: error.message });
    }
  };
  
/**
 * @swagger
 * /api/vehicle-assignments/{id}:
 *   delete:
 *     summary: Supprimer une affectation et désaffecter le véhicule
 *     description: Supprime une affectation et remet à zéro l'affectation dans le modèle `Vehicle`.
 *     tags: [VehicleAssignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'affectation.
 *     responses:
 *       200:
 *         description: Affectation supprimée avec succès.
 *       404:
 *         description: Affectation non trouvée.
 */
const deleteAssignment = async (req, res) => {
    try {
      const assignment = await VehicleAssignment.findByIdAndDelete(req.params.id);
      if (!assignment) return res.status(404).json({ message: "Affectation non trouvée." });
  
      await Vehicle.findByIdAndUpdate(assignment.vehicle_id, {
        assignedRoute: null,
        assignedTrip: null,
        assignedBlock: null,
      });
  
      res.status(200).json({ message: "Affectation supprimée et véhicule désaffecté." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression.", error: error.message });
    }
  };
module.exports = {
createAssignment,
getAllAssignments,
getAssignmentById,
updateAssignment,
deleteAssignment
};