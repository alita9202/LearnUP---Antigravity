const express = require('express');
const router = express.Router();
const { applyToBeInstructor } = require('../controllers/instructorController');

// Rutas de Instructores (Aspirantes)
router.post('/apply', applyToBeInstructor);

module.exports = router;
