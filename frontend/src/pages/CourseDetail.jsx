import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageWithFallback from '../components/ImageWithFallback';
import { Spinner } from '../components/Spinner';
import { User, MapPin, Users, Monitor, Send, ArrowLeft } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    mensaje: ''
  });

  useEffect(() => {
    // Si el usuario está logueado, prellenar datos
    if (user && user.role === 'CLIENTE') {
      setFormData(prev => ({
        ...prev,
        nombre: user.name || '',
        email: user.email || '',
        // Asumimos que podemos tener el teléfono en el user context o dejarlo vacío para que lo llene
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Curso no encontrado');
        }
        const data = await response.json();
        setCourse(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        curso_id: id,
        cliente_id: user?.role === 'CLIENTE' ? user.id : null,
        ...formData
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar la solicitud');
      }

      setSuccess('¡Solicitud enviada correctamente! El colaborador se pondrá en contacto pronto.');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        ciudad: '',
        mensaje: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}><Spinner /></div>;
  if (error && !course) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: '#ff5f56' }}>{error}</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 0' }}>
      <button className="btn btn-outline mb-3" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
        <ArrowLeft size={16} /> Volver
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Detalles del curso */}
        <div>
          <div style={{ aspectRatio: '16/9', maxHeight: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <ImageWithFallback 
              src={course.imagen_url}
              alt={course.titulo}
              className="w-full h-full object-cover"
              fallbackText={course.categoria || 'Curso'}
            />
          </div>
          <span style={{ background: 'var(--primary)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '16px', fontSize: '0.85rem' }}>
            {course.categoria}
          </span>
          <h1 style={{ marginTop: '1rem', fontSize: '2rem' }}>{course.titulo}</h1>
          <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem', margin: '0.5rem 0' }}>
            {course.precio > 0 ? `Bs. ${course.precio}` : 'Gratis'}
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} /> {course.instructor_name}
          </p>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{course.descripcion}</p>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Monitor size={20} color="var(--primary-color)" />
              <p style={{ margin: 0 }}><strong>Modalidad:</strong> {course.modalidad}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--secondary-color)" />
              <p style={{ margin: 0 }}><strong>Ubicación:</strong> {course.ubicacion || 'N/A'}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#10b981" />
              <p style={{ margin: 0 }}><strong>Cupos disponibles:</strong> {course.cupos}</p>
            </div>
          </div>
        </div>

        {/* Formulario de Solicitud */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Solicitar Cupo</h2>
          
          {!user && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid #3b82f6', borderRadius: '4px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Estás solicitando como invitado. Puedes <a href="/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>iniciar sesión</a> para autocompletar tus datos.</p>
            </div>
          )}

          {success && (
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid #4ade80', borderRadius: '8px', marginBottom: '1rem' }}>
              {success}
            </div>
          )}

          {error && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid #f87171', borderRadius: '8px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nombre Completo *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Correo Electrónico *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Teléfono *</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ciudad *</label>
                <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mensaje Adicional</label>
              <textarea name="mensaje" rows="4" value={formData.mensaje} onChange={handleChange} placeholder="¿Tienes alguna consulta o necesidad específica?" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', resize: 'vertical' }}></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '12px', fontSize: '1rem' }} disabled={submitting}>
              {submitting ? 'Enviando...' : <><Send size={18} /> Enviar Solicitud</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CourseDetail;
