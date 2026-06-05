import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Plus, Edit, Trash2, XCircle, Image as ImageIcon, CheckCircle, XSquare } from 'lucide-react';
import { Spinner } from '../components/Spinner';

const ColaboradorPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('cursos'); // 'cursos' o 'solicitudes'
  
  const [courses, setCourses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal de Curso
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal de Rechazo de Solicitud
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [modalidad, setModalidad] = useState('Presencial');
  const [ubicacion, setUbicacion] = useState('');
  const [cupos, setCupos] = useState('');
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'cursos') {
      await fetchCourses();
    } else {
      await fetchRequests();
    }
    setLoading(false);
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/colaborador/mis-cursos`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/requests/collaborator`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleRequestStatus = async (id, status, reason = null) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/requests/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('learnup_token')}` 
        },
        body: JSON.stringify({ estado: status, motivo_rechazo: reason })
      });
      if (res.ok) {
        alert(`Solicitud ${status.toLowerCase()} correctamente`);
        setShowRejectModal(false);
        setRejectReason('');
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.message || 'Error al actualizar solicitud');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Error de red al actualizar solicitud');
    }
  };

  const openRejectModal = (request) => {
    setRejectingRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setTitulo(course.titulo);
      setDescripcion(course.descripcion);
      setCategoria(course.categoria);
      setPrecio(course.precio);
      setModalidad(course.modalidad);
      setUbicacion(course.ubicacion || '');
      setCupos(course.cupos);
    } else {
      setEditingCourse(null);
      setTitulo('');
      setDescripcion('');
      setCategoria('');
      setPrecio('');
      setModalidad('Presencial');
      setUbicacion('');
      setCupos('');
    }
    setImagen(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !precio || !categoria || !cupos) return alert('Por favor llena los campos requeridos');

    if (editingCourse) {
      const isCritical = editingCourse.titulo !== titulo || 
                         editingCourse.descripcion !== descripcion || 
                         Number(editingCourse.precio) !== Number(precio) || 
                         editingCourse.categoria !== categoria || 
                         imagen !== null;
      if (isCritical) {
        if (!window.confirm('Estás modificando campos críticos (título, precio, categoría, descripción o imagen). El curso volverá a estado PENDIENTE de revisión. ¿Deseas continuar?')) return;
      }
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('precio', precio);
    formData.append('modalidad', modalidad);
    formData.append('ubicacion', ubicacion);
    formData.append('cupos', cupos);
    if (imagen) formData.append('imagen', imagen);

    try {
      const url = editingCourse 
        ? `${import.meta.env.VITE_API_URL}/api/courses/${editingCourse.id}` 
        : `${import.meta.env.VITE_API_URL}/api/courses`;
      
      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      closeModal();
      fetchCourses();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás completamente seguro de eliminar este curso? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` }
      });
      if (res.ok) {
        alert('Curso eliminado');
        fetchCourses();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user || user.role !== 'COLABORADOR') return <Navigate to="/login" />;

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'APROBADO': return <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>APROBADO</span>;
      case 'RECHAZADO': return <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>RECHAZADO</span>;
      default: return <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>PENDIENTE</span>;
    }
  };

  const getRequestStatusBadge = (estado) => {
    switch (estado) {
      case 'ACEPTADA': return <span style={{ color: '#4ade80', fontWeight: 'bold' }}>ACEPTADA</span>;
      case 'RECHAZADA': return <span style={{ color: '#f87171', fontWeight: 'bold' }}>RECHAZADA</span>;
      default: return <span style={{ color: '#fcd34d', fontWeight: 'bold' }}>PENDIENTE</span>;
    }
  };

  return (
    <React.Fragment>
      <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Panel de Colaborador</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Bienvenido, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className={`btn ${activeTab === 'cursos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('cursos')}>
            Mis Cursos
          </button>
          <button className={`btn ${activeTab === 'solicitudes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('solicitudes')}>
            Solicitudes Recibidas
          </button>
          {activeTab === 'cursos' && (
            <button className="btn btn-primary" onClick={() => openModal()} style={{ marginLeft: '1rem' }}>
              <Plus size={18} style={{ marginRight: '0.5rem' }} /> Nuevo Curso
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}><Spinner /></div>
      ) : activeTab === 'cursos' ? (
        <React.Fragment>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {courses.map(course => (
              <div key={course.id} className="glass-card" style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                  {course.imagen_url ? (
                    <img src={`${import.meta.env.VITE_API_URL}${course.imagen_url}`} alt={course.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <ImageIcon size={48} opacity={0.5} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    {getStatusBadge(course.estado_validacion)}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{course.titulo}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                    <p><strong>Categoría:</strong> {course.categoria}</p>
                    <p><strong>Modalidad:</strong> {course.modalidad}</p>
                    <p><strong>Precio:</strong> Bs. {course.precio}</p>
                    <p><strong>Cupos:</strong> {course.cupos}</p>
                  </div>

                  {course.estado_validacion === 'RECHAZADO' && course.motivo_rechazo && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      <strong>Motivo de rechazo:</strong> {course.motivo_rechazo}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center' }} onClick={() => openModal(course)}>
                      <Edit size={16} style={{ marginRight: '0.5rem' }} /> Editar
                    </button>
                    <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444', padding: '0.5rem' }} onClick={() => handleDelete(course.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {courses.length === 0 && (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '12px' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Aún no has publicado cursos.</h3>
              <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>¡Crea tu primer curso ahora!</p>
            </div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map(req => (
              <div key={req.id} className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{req.nombre} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({req.email})</span></h3>
                  <p style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><strong>Curso:</strong> {req.curso_titulo}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Teléfono:</strong> {req.telefono} | <strong>Ciudad:</strong> {req.ciudad}</p>
                  {req.mensaje && <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>"{req.mensaje}"</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>Estado: {getRequestStatusBadge(req.estado)}</div>
                  {req.estado === 'PENDIENTE' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline" style={{ borderColor: '#4ade80', color: '#4ade80', padding: '0.5rem 1rem' }} onClick={() => handleRequestStatus(req.id, 'ACEPTADA')}>
                        Aceptar
                      </button>
                      <button className="btn btn-outline" style={{ borderColor: '#f87171', color: '#f87171', padding: '0.5rem 1rem' }} onClick={() => openRejectModal(req)}>
                        Rechazar
                      </button>
                    </div>
                  )}
                  {req.estado === 'RECHAZADA' && req.motivo_rechazo && (
                    <div style={{ fontSize: '0.8rem', color: '#f87171', maxWidth: '200px', textAlign: 'right' }}>
                      Motivo: {req.motivo_rechazo}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '12px' }}>
                <h3 style={{ color: 'var(--text-secondary)' }}>Aún no tienes solicitudes.</h3>
              </div>
            )}
          </div>
        </React.Fragment>
      )}
      </div>

      {/* Modal de Crear/Editar Curso */}
      {showModal && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content glass-card animate-slide-up" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }}>
            <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={closeModal}>
              <XCircle size={24} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              {editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Título del Curso *</label>
                <input required type="text" value={titulo} onChange={e => setTitulo(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Descripción Corta *</label>
                <textarea required rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Categoría *</label>
                  <input required type="text" placeholder="Ej. Tecnología, Arte..." value={categoria} onChange={e => setCategoria(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Precio (Bs) *</label>
                  <input required type="number" min="0" step="0.1" value={precio} onChange={e => setPrecio(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Modalidad *</label>
                  <select required value={modalidad} onChange={e => setModalidad(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px' }}>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Cupos Totales *</label>
                  <input required type="number" min="1" value={cupos} onChange={e => setCupos(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ubicación (Opcional)</label>
                <input type="text" placeholder="Solo si es presencial o híbrido" value={ubicacion} onChange={e => setUbicacion(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Imagen de Portada (Opcional)</label>
                <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal} disabled={saving}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Rechazo de Solicitud */}
      {showRejectModal && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content glass-card animate-slide-up" style={{ width: '100%', maxWidth: '400px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#f87171' }}>Rechazar Solicitud</h3>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Por favor indica el motivo del rechazo para <strong>{rejectingRequest?.nombre}</strong>:</p>
            <textarea 
              rows="3" 
              value={rejectReason} 
              onChange={e => setRejectReason(e.target.value)} 
              placeholder="Ej. Curso lleno, no cumple requisitos..."
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '8px', resize: 'vertical' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={() => setShowRejectModal(false)}>Cancelar</button>
              <button className="btn btn-primary" style={{ background: '#f87171' }} onClick={() => handleRequestStatus(rejectingRequest.id, 'RECHAZADA', rejectReason)}>
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ColaboradorPanel;
