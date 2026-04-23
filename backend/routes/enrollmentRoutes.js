const express = require('express');
const router = express.Router();
const { processCheckout } = require('../controllers/enrollmentController');

// Ruta para finalizar compra/inscripción del carrito (pública, el controller valida roles)
router.post('/checkout', processCheckout);

module.exports = router;
