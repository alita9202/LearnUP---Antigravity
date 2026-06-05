const express = require('express');
const router = express.Router();

const {
  createRequest,
  getRequestsByCollaborator,
  updateRequestStatus
} = require('../controllers/requestController');

const { verifyToken } = require('../middlewares/authMiddleware');

// Crear solicitud (Público, puede incluir cliente_id si está logueado)
router.post('/', createRequest);

// Obtener solicitudes recibidas (Solo COLABORADOR)
router.get('/collaborator', verifyToken, getRequestsByCollaborator);

// Actualizar estado de solicitud (Aceptar / Rechazar)
router.put('/:id/status', verifyToken, updateRequestStatus);

module.exports = router;