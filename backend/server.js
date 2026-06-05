const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:4173', 
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes'); // Pendiente
const instructorRoutes = require('./routes/instructorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const requestRoutes = require('./routes/requestRoutes'); // Sprint 3

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestRoutes); // Sprint 3

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API REST de LearnUp PWA!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '¡Algo salió mal en el servidor!', error: err.message });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
