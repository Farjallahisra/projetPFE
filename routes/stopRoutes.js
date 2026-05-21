const express = require('express');
const { createStop, getStops, getStopById, updateStop, deleteStop } = require('../controllers/stopController');

const router = express.Router();

router.post('/', createStop);       
router.get('/',  getStops);          
router.get('/:id',  getStopById);   
router.put('/:id', updateStop);     
router.delete('/:id',  deleteStop);  

module.exports = router;
