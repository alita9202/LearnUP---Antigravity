const express = require('express');
const router = express.Router();
const { applyToBeInstructor } = require('../controllers/instructorController');
const upload = require('../middlewares/uploadMiddleware');

// Rutas de Instructores (Aspirantes)
router.post('/apply', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'id_doc', maxCount: 1 }
]), applyToBeInstructor);

module.exports = router;
