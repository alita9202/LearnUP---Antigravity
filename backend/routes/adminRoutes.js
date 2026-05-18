const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getRequests, 
  approveRequest, 
  rejectRequest, 
  getUsers, 
  toggleUserStatus,
  createUser,
  updateUser,
  deleteUser 
} = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Proteger todas las rutas con rol ADMINISTRADOR
router.use(verifyToken);
router.use(requireRole(['ADMINISTRADOR']));

router.get('/stats', getDashboardStats);
router.get('/requests', getRequests);
router.put('/requests/:id/approve', approveRequest);
router.put('/requests/:id/reject', rejectRequest);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', toggleUserStatus);
router.patch('/users/:id/status', toggleUserStatus); // Adding PATCH as per request just in case
module.exports = router;
