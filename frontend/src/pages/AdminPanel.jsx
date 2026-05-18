import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, FileText, CheckCircle, XCircle, Eye, Download, Search, Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Spinner } from '../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` }
    }).then(res => res.json()).then(data => setStats(data));
  }, []);

  if (!stats) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}><Spinner /></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Resumen del Sistema</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
          <h4 style={{ color: 'var(--text-secondary)' }}>Total Usuarios</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</span>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #a855f7' }}>
          <h4 style={{ color: 'var(--text-secondary)' }}>Cursos Activos</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalCourses}</span>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
          <h4 style={{ color: 'var(--text-secondary)' }}>Solicitudes Pendientes</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pendingRequests}</span>
        </div>
      </div>
    </div>
  );
};

const AdminSolicitudes = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('¿Seguro de aprobar a este instructor? Se creará su cuenta automáticamente.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/requests/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Aprobado. Pass temporal: ${data.tempPassword}`);
        setSelectedReq(null);
        fetchRequests();
      }
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    if (!rejectReason) return alert('Debes especificar un motivo de rechazo');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/requests/${id}/reject`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('learnup_token')}` 
        },
        body: JSON.stringify({ motivo: rejectReason })
      });
      if (res.ok) {
        alert('Solicitud rechazada');
        setSelectedReq(null);
        fetchRequests();
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}><Spinner /></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Gestión de Solicitudes</h2>
      
      <div className="glass-card" style={{ overflow: 'hidden', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem' }}>Candidato</th>
              <th style={{ padding: '1rem' }}>Especialidad</th>
              <th style={{ padding: '1rem' }}>Fecha</th>
              <th style={{ padding: '1rem' }}>Estado</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>
                  <strong>{r.nombre}</strong><br/>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{r.email}</span>
                </td>
                <td style={{ padding: '1rem' }}>{r.especialidad}</td>
                <td style={{ padding: '1rem' }}>{new Date(r.fecha_solicitud).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem',
                    background: r.estado === 'PENDIENTE' ? 'rgba(245, 158, 11, 0.2)' : r.estado === 'APROBADO' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: r.estado === 'PENDIENTE' ? '#fcd34d' : r.estado === 'APROBADO' ? '#6ee7b7' : '#fca5a5'
                  }}>
                    {r.estado}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button className="btn btn-sm btn-outline" onClick={() => setSelectedReq(r)}>
                    <Eye size={16} /> Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No hay solicitudes.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal Detalles */}
      {selectedReq && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg glass-card animate-slide-up">
            <button style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => { setSelectedReq(null); setRejectReason(''); }}>
              <XCircle size={24} />
            </button>
            
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Perfil de Postulante</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <p><strong>Nombre:</strong> {selectedReq.nombre}</p>
                <p><strong>Email:</strong> {selectedReq.email}</p>
                <p><strong>Teléfono:</strong> {selectedReq.telefono}</p>
                <p><strong>Nacimiento:</strong> {selectedReq.fecha_nacimiento ? new Date(selectedReq.fecha_nacimiento).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p><strong>Especialidad:</strong> {selectedReq.especialidad}</p>
                <p><strong>Experiencia:</strong> {selectedReq.experiencia}</p>
                <p><strong>Cursos Propuestos:</strong> {selectedReq.cursos_deseados}</p>
                <p><strong>Rango Precio:</strong> {selectedReq.rango_precios}</p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <strong>Biografía:</strong>
              <p style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>{selectedReq.descripcion}</p>
            </div>

            {selectedReq.archivos && selectedReq.archivos.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <strong>Archivos Adjuntos:</strong>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  {selectedReq.archivos.map((file, i) => (
                    <a key={i} href={`http://localhost:5000${file.url_archivo}`} target="_blank" rel="noreferrer" 
                       style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '8px', textDecoration: 'none' }}>
                      <Download size={16} /> {file.tipo_archivo}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selectedReq.estado === 'PENDIENTE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <textarea 
                  placeholder="Si rechazas, escribe el motivo aquí..." 
                  value={rejectReason} 
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem', borderRadius: '4px' }}
                />
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleReject(selectedReq.id)}>
                    Rechazar
                  </button>
                  <button className="btn btn-primary" onClick={() => handleApprove(selectedReq.id)}>
                    <CheckCircle size={18} style={{ marginRight: '0.5rem' }}/> Aprobar y Crear Cuenta
                  </button>
                </div>
              </div>
            )}

            {selectedReq.estado === 'RECHAZADO' && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '8px' }}>
                <strong>Motivo de rechazo:</strong> {selectedReq.motivo_rechazo || 'N/A'}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

const AdminUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', rol: 'CLIENTE', estado: 'ACTIVO', telefono: '', ciudad: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre: user.nombre, email: user.email, password: '', 
        rol: user.rol, estado: user.estado, 
        telefono: user.telefono || '', ciudad: user.ciudad || ''
      });
    } else {
      setEditingUser(null);
      setFormData({ nombre: '', email: '', password: '', rol: 'CLIENTE', estado: 'ACTIVO', telefono: '', ciudad: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser && formData.password.length < 6) return alert('La contraseña debe tener al menos 6 caracteres');
    
    try {
      const url = editingUser ? `http://localhost:5000/api/admin/users/${editingUser.id}` : 'http://localhost:5000/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('learnup_token')}` 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) {
        console.error("Backend error:", data);
        return alert(`Error del servidor: ${data.message} ${data.error ? `(${data.error})` : ''}`);
      }
      
      alert(data.message);
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      console.error("Frontend exception:", err);
      alert(`Error en la petición: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser.id) return alert('No puedes eliminar tu propia cuenta');
    if (!window.confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` }
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      
      alert(data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    if (id === currentUser.id) return alert('No puedes cambiar tu propio estado');
    const newStatus = currentStatus === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO';
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('learnup_token')}` 
        },
        body: JSON.stringify({ estado: newStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, estado: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}><Spinner /></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Nuevo Usuario
        </button>
      </div>
      
      <div className="glass-card" style={{ overflow: 'hidden', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Usuario</th>
              <th style={{ padding: '1rem' }}>Rol</th>
              <th style={{ padding: '1rem' }}>Estado</th>
              <th style={{ padding: '1rem' }}>Fecha Registro</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>#{u.id}</td>
                <td style={{ padding: '1rem' }}>
                  <strong>{u.nombre}</strong><br/>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{u.email}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {u.rol}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => toggleStatus(u.id, u.estado)}
                    style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem', border: 'none', cursor: 'pointer',
                      background: u.estado === 'ACTIVO' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: u.estado === 'ACTIVO' ? '#6ee7b7' : '#fca5a5'
                    }}
                    title="Click para cambiar estado"
                  >
                    {u.estado}
                  </button>
                </td>
                <td style={{ padding: '1rem' }}>{new Date(u.fecha_creacion).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(u)} title="Editar">
                      <Edit size={16} />
                    </button>
                    {u.id !== currentUser.id && (
                      <button className="btn btn-sm btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleDelete(u.id)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-slide-up">
            <button style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={handleCloseModal}>
              <XCircle size={24} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre Completo</label>
                <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contraseña {editingUser && '(Deja en blanco para mantener)'}</label>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} minLength={editingUser ? 0 : 6} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rol</label>
                  <select value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }}>
                    <option value="CLIENTE">CLIENTE</option>
                    <option value="COLABORADOR">COLABORADOR</option>
                    <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Estado</label>
                  <select value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }}>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="SUSPENDIDO">SUSPENDIDO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Teléfono (Opcional)</label>
                  <input type="text" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ciudad (Opcional)</label>
                  <input type="text" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem', borderRadius: '4px' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const { user } = useAuth();
  if (user?.role !== 'ADMINISTRADOR') return <Navigate to="/" />;

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/solicitudes" element={<AdminSolicitudes />} />
      <Route path="/usuarios" element={<AdminUsuarios />} />
      <Route path="/cursos" element={<div style={{padding:'2rem'}}><h3>Cursos (Próximamente)</h3></div>} />
      <Route path="/reportes" element={<div style={{padding:'2rem'}}><h3>Reportes (Próximamente)</h3></div>} />
      <Route path="/configuracion" element={<div style={{padding:'2rem'}}><h3>Configuración</h3></div>} />
    </Routes>
  );
};

export default AdminPanel;