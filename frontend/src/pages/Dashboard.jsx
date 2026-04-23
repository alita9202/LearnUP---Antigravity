import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, Users, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container empty-state-box">
        <h2>Acceso Denegado</h2>
        <p>Inicia sesión para visualizar tu panel.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>Ir a Login</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Panel de Control: <span className="highlight">{user.role.toUpperCase()}</span></h2>
        <button className="btn btn-glass" onClick={handleLogout} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
          <LogOut size={16} /> Cerrar Sesión
        </button>
      </div>
      
      <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <h3>Hola, {user.name} 👋</h3>
        <p style={{ color: 'var(--text-secondary)'}}>Tu correo: {user.email}</p>
        
        <hr style={{ margin: '2rem 0', borderColor: 'var(--glass-border)' }} />

        {user.role === 'admin' && (
          <div className="admin-actions">
            <h4>Acciones Globales</h4>
            <div className="empty-state-box">
              <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>El panel de administración está listo. Aún no hay eventos registrados hoy.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-outline btn-sm">Ver Usuarios</button>
                <button className="btn btn-primary btn-sm">Solicitudes Pendientes</button>
              </div>
            </div>
          </div>
        )}

        {user.role === 'docente' && (
          <div className="docente-actions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>Tus Talleres Publicados</h4>
              <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <PlusCircle size={18} /> Crear Taller
              </button>
            </div>
            <div className="empty-state-box">
              <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Aún no has publicado ningún taller en LearnUp.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Al crearlos, aparecerán en el catálogo principal.</p>
            </div>
          </div>
        )}

        {user.role === 'interesado' && (
          <div className="interesado-actions">
            <h4>Tus Inscripciones y Certificados</h4>
            <div className="empty-state-box">
              <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No tienes inscripciones activas actualmente.</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Explorar Catálogo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
