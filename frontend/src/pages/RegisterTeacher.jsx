import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import './Auth.css';

const RegisterTeacher = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    experience: '',
    specialties: '',
    cv_reference: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await fetch('http://localhost:5000/api/instructors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ loading: false, error: '', success: data.message });
        setTimeout(() => navigate('/'), 3000);
      } else {
        setStatus({ loading: false, error: data.message, success: '' });
      }
    } catch (err) {
      setStatus({ loading: false, error: 'Error de red. Asegúrate de que el servidor está corriendo.', success: '' });
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card animate-fade-in" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h2>Unirse a la Familia LearnUp</h2>
          <p>Postúlate como instructor y comparte tu talento local.</p>
        </div>
        
        {status.error && <div className="auth-error">{status.error}</div>}
        {status.success && (
          <div style={{ background: 'rgba(39, 201, 63, 0.1)', color: '#27c93f', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(39,201,63,0.3)' }}>
            {status.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Teléfono (WhatsApp)</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Especialidades y Talleres que deseas impartir</label>
            <input type="text" name="specialties" placeholder="Ej: Repostería, Mecánica Básica..." value={formData.specialties} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Años de Experiencia y Motivación</label>
            <input type="text" name="experience" placeholder="Cuéntanos brevemente tu experiencia..." value={formData.experience} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Enlace a tu CV / Portafolio (Opcional)</label>
            <input type="url" name="cv_reference" placeholder="https://linkedin.com/in/..." value={formData.cv_reference} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={status.loading} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {status.loading ? <><Spinner size={20} /> Enviando postulación...</> : 'Enviar Postulación'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterTeacher;
