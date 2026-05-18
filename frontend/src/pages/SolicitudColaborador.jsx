import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, ChevronRight, User, Briefcase, FileText } from 'lucide-react';
import { Spinner } from '../components/Spinner';

const SolicitudColaborador = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', dob: '',
    specialties: '', experience: '', bio: '', social_links: '', desired_courses: '', price_range: ''
  });

  const [files, setFiles] = useState({
    cv: null, photo: null, id_doc: null
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const validateStep1 = () => formData.name && formData.email && formData.phone && formData.city && formData.dob;
  const validateStep2 = () => formData.specialties && formData.experience && formData.bio;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (files.cv) data.append('cv', files.cv);
    if (files.photo) data.append('photo', files.photo);
    if (files.id_doc) data.append('id_doc', files.id_doc);

    try {
      const response = await fetch('http://localhost:5000/api/instructors/apply', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        setStatus({ loading: false, error: '', success: true });
        setTimeout(() => navigate('/'), 5000);
      } else {
        setStatus({ loading: false, error: result.message, success: false });
      }
    } catch (error) {
      setStatus({ loading: false, error: 'Error de conexión. Verifica que el servidor esté activo.', success: false });
    }
  };

  if (status.success) {
    return (
      <div className="container" style={{ marginTop: '5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <CheckCircle size={80} color="#27c93f" style={{ margin: '0 auto', marginBottom: '1rem', animation: 'fadeIn 0.5s ease' }} />
          <h2 style={{ color: '#27c93f', marginTop: '1rem' }}>¡Postulación Enviada con Éxito!</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto' }}>
            Hemos recibido tus datos y documentos. Nuestro equipo evaluará tu perfil y te notificaremos por correo electrónico sobre los siguientes pasos.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2rem' }}>Serás redirigido al inicio en unos segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem', maxWidth: '800px' }}>
      <div className="glass-card" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(90deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Únete a la Familia LearnUp
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Comparte tu conocimiento y monetiza tu pasión.</p>
        </div>

        {/* Progreso */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: '15px', left: '10%', width: step === 1 ? '0%' : step === 2 ? '50%' : '80%', height: '2px', background: 'var(--primary-color)', zIndex: 0, transition: 'width 0.3s ease' }}></div>
          
          {[ { num: 1, icon: <User />, label: 'Personal' }, { num: 2, icon: <Briefcase />, label: 'Profesional' }, { num: 3, icon: <FileText />, label: 'Documentos' } ].map((s) => (
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, cursor: step >= s.num ? 'pointer' : 'default' }} onClick={() => step > s.num && setStep(s.num)}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= s.num ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', transition: 'all 0.3s' }}>
                {step > s.num ? <CheckCircle size={16} /> : s.icon}
              </div>
              <span style={{ fontSize: '0.8rem', color: step >= s.num ? '#fff' : '#94a3b8' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {status.error && <div className="auth-error" style={{ marginBottom: '2rem' }}>{status.error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" encType="multipart/form-data">
          
          {/* PASO 1: DATOS PERSONALES */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Datos Personales</h3>
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Como aparece en tu documento" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Correo Electrónico *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Teléfono (WhatsApp) *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Ciudad de Residencia *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Fecha de Nacimiento *</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn btn-primary" disabled={!validateStep1()} onClick={() => setStep(2)}>
                  Siguiente <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: DATOS PROFESIONALES */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Perfil Profesional</h3>
              <div className="form-group">
                <label>Especialidad Principal *</label>
                <input type="text" name="specialties" value={formData.specialties} onChange={handleChange} required placeholder="Ej: Desarrollo Web, Fotografía de Bodas, Gastronomía Local" />
              </div>
              <div className="form-group">
                <label>Años de Experiencia *</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} required placeholder="Ej: 5 años trabajando en agencias" />
              </div>
              <div className="form-group">
                <label>Biografía Breve *</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} required rows="4" placeholder="Cuéntanos sobre ti, tus logros y tu estilo de enseñanza..." style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: '#fff', padding: '0.75rem' }}></textarea>
              </div>
              <div className="form-group">
                <label>Redes Sociales o Portafolio (Opcional)</label>
                <input type="text" name="social_links" value={formData.social_links} onChange={handleChange} placeholder="LinkedIn, Instagram, GitHub o sitio web" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Volver</button>
                <button type="button" className="btn btn-primary" disabled={!validateStep2()} onClick={() => setStep(3)}>
                  Siguiente <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: ARCHIVOS Y CURSOS */}
          {step === 3 && (
            <div className="animate-slide-up">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Documentos y Cursos</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>Qué cursos deseas impartir *</label>
                  <input type="text" name="desired_courses" value={formData.desired_courses} onChange={handleChange} required placeholder="Ej: React Avanzado, Cocina Básica" />
                </div>
                <div className="form-group">
                  <label>Rango de precios esperado (Bs) *</label>
                  <input type="text" name="price_range" value={formData.price_range} onChange={handleChange} required placeholder="Ej: 50 - 150 Bs" />
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#e2e8f0' }}>Validación de Confianza</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Sube los siguientes documentos para validar tu identidad y experiencia (Formatos permitidos: PDF, JPG, PNG. Max 5MB).</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  
                  <div className="file-upload-box">
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Currículum Vitae (CV) *</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <input type="file" name="cv" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                      <UploadCloud size={20} style={{ marginRight: '0.5rem', color: '#a855f7' }} />
                      <span style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {files.cv ? files.cv.name : 'Seleccionar archivo'}
                      </span>
                    </div>
                  </div>

                  <div className="file-upload-box">
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Foto de Identidad (CI/Pasaporte) *</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <input type="file" name="id_doc" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} required style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                      <UploadCloud size={20} style={{ marginRight: '0.5rem', color: '#a855f7' }} />
                      <span style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {files.id_doc ? files.id_doc.name : 'Seleccionar archivo'}
                      </span>
                    </div>
                  </div>

                  <div className="file-upload-box">
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Fotografía Profesional (Opcional)</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <input type="file" name="photo" accept=".jpg,.jpeg,.png" onChange={handleFileChange} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                      <UploadCloud size={20} style={{ marginRight: '0.5rem', color: '#a855f7' }} />
                      <span style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {files.photo ? files.photo.name : 'Seleccionar imagen'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Volver</button>
                <button type="submit" className="btn btn-primary" disabled={status.loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {status.loading ? <><Spinner size={20} /> Enviando postulación...</> : 'Enviar Solicitud Final'}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default SolicitudColaborador;
