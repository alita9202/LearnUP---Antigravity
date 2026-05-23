import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ClientePanel = () => {
  const { user, logout } = useAuth();

  if (!user || user.role !== 'CLIENTE') return <Navigate to="/login" />;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mi Panel (Cliente)</h1>
      <p style={{ marginBottom: '1rem' }}>Bienvenido, {user.name}</p>
      
      <h2>Mis Cursos Inscritos</h2>
      <p>Aún no te has inscrito a ningún curso.</p>
      {/* Aquí iría la lista de cursos a los que se inscribió */}
    </div>
  );
};

export default ClientePanel;
