const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rutas públicas
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Rutas protegidas (Requieren token)
router.get('/colaborador/mis-cursos', verifyToken, courseController.getMyCourses);
router.post('/', verifyToken, upload.single('imagen'), courseController.createCourse);
router.put('/:id', verifyToken, upload.single('imagen'), courseController.updateCourse);
router.delete('/:id', verifyToken, courseController.deleteCourse);

module.exports = router;
