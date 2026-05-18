import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ColaboradorPanel = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Si fuera real, habría un endpoint para obtener MIS cursos, 
    // por ahora pedimos todos y filtramos en frontend para el demo (o asume un endpoint)
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch('http://localhost:5000/api/courses');
    if (res.ok) {
      const data = await res.json();
      setCourses(data.filter(c => c.instructor_name === user.name));
    }
  };

  if (!user || user.role !== 'COLABORADOR') return <Navigate to="/login" />;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel de Colaborador</h1>
      <p>Bienvenido, {user.name}</p>
      <button onClick={logout} style={{ marginBottom: '1rem', background: '#dc3545', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>Cerrar Sesión</button>
      
      <h2>Mis Cursos</h2>
      <button style={{ background: '#0d6efd', color: '#fff', border: 'none', padding: '0.5rem 1rem', marginBottom: '1rem', borderRadius: '4px' }}>+ Crear Nuevo Curso</button>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem' }}>
            <h3>{course.titulo}</h3>
            <p><strong>Categoría:</strong> {course.categoria}</p>
            <p><strong>Precio:</strong> {course.precio} Bs</p>
            <p><strong>Cupos:</strong> {course.cupos}</p>
          </div>
        ))}
        {courses.length === 0 && <p>Aún no has publicado cursos.</p>}
      </div>
    </div>
  );
};

export default ColaboradorPanel;
