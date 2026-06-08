const express = require('express');
const router = express.Router();
const { getStudentDashboard, getRecommendedCourses } = require('../controllers/studentController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(requireRole('CLIENTE'));

router.get('/dashboard', getStudentDashboard);
router.get('/recommended', getRecommendedCourses);

module.exports = router;
