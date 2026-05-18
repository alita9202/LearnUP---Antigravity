const express = require('express');
const router = express.Router();
const { checkout, getMyEnrollments } = require('../controllers/enrollmentController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Checkout (Puede ser público si envían datos de invitado)
router.post('/checkout', checkout);

// Obtener mis inscripciones (Solo para clientes o usuarios logueados)
router.get('/my-enrollments', verifyToken, requireRole(['CLIENTE', 'COLABORADOR', 'ADMINISTRADOR']), getMyEnrollments);

module.exports = router;
