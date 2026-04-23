const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Rutas protegidas (Requieren token)
router.post('/', verifyToken, courseController.createCourse);

module.exports = router;
