import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import { BookOpen, CheckCircle, Award, Compass, PlayCircle, Star, X, Download, Share2 } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

/* ─── Función de impresión en ventana nueva ─────────────────────────────── */
const printCertificate = ({ userName, courseName, instructorName, fechaFin, hashCode }) => {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificado LearnUp — ${courseName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 landscape; margin: 0; }
    body {
      width: 297mm; height: 210mm;
      display: flex; align-items: center; justify-content: center;
      background: #fff;
      font-family: 'Inter', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cert {
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 12mm 18mm;
      position: relative;
      overflow: hidden;
    }
    /* Bordes decorativos */
    .cert::before, .cert::after {
      content: ''; position: absolute;
      width: 24mm; height: 24mm;
      border: 3px solid rgba(129,140,248,0.5);
    }
    .cert::before { top: 8mm; left: 8mm; border-right: none; border-bottom: none; }
    .cert::after  { bottom: 8mm; right: 8mm; border-left: none; border-top: none; }
    /* Círculos decorativos de fondo */
    .bg-circle-1 {
      position: absolute; width: 120mm; height: 120mm;
      border-radius: 50%; background: rgba(79,70,229,0.08);
      top: -30mm; right: -20mm;
    }
    .bg-circle-2 {
      position: absolute; width: 80mm; height: 80mm;
      border-radius: 50%; background: rgba(236,72,153,0.06);
      bottom: -20mm; left: -10mm;
    }
    .logo-area { display: flex; align-items: center; gap: 6px; margin-bottom: 4mm; }
    .logo-icon { font-size: 28px; }
    .logo-text {
      font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
      background: linear-gradient(135deg, #818cf8, #ec4899);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .cert-label {
      font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
      color: rgba(255,255,255,0.4); margin-bottom: 5mm;
    }
    .divider {
      width: 60mm; height: 1px;
      background: linear-gradient(to right, transparent, rgba(129,140,248,0.5), transparent);
      margin: 3mm 0;
    }
    .presents { font-size: 11px; color: rgba(255,255,255,0.5); font-style: italic; margin-bottom: 2mm; }
    .recipient {
      font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700;
      color: #f8fafc; margin-bottom: 3mm; text-align: center; line-height: 1.2;
    }
    .by-completing { font-size: 11px; color: rgba(255,255,255,0.5); font-style: italic; margin-bottom: 2mm; }
    .course-name {
      font-size: 18px; font-weight: 700; color: #e2e8f0;
      text-align: center; margin-bottom: 2mm; line-height: 1.3;
    }
    .instructor { font-size: 10px; color: rgba(255,255,255,0.45); margin-bottom: 5mm; }
    .instructor span { color: rgba(255,255,255,0.7); font-weight: 600; }
    .footer {
      display: flex; align-items: flex-start; justify-content: space-between;
      width: 100%; margin-top: 4mm; gap: 8mm;
    }
    .footer-col { text-align: center; flex: 1; }
    .footer-col .line {
      width: 35mm; height: 1px; background: rgba(255,255,255,0.2);
      margin: 0 auto 2mm;
    }
    .footer-label { font-size: 7px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); }
    .footer-value { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 600; margin-bottom: 1mm; }
    .seal { font-size: 24px; margin-bottom: 1mm; }
    .hash { font-family: 'Courier New', monospace; font-size: 9px; color: #818cf8; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="bg-circle-1"></div>
    <div class="bg-circle-2"></div>
    <div class="logo-area">
      <span class="logo-icon">🎓</span>
      <span class="logo-text">LearnUp</span>
    </div>
    <p class="cert-label">Certificado de Finalización</p>
    <div class="divider"></div>
    <p class="presents">Este certificado se otorga a</p>
    <h1 class="recipient">${userName}</h1>
    <p class="by-completing">por haber completado exitosamente el curso</p>
    <h2 class="course-name">&ldquo;${courseName}&rdquo;</h2>
    ${instructorName ? `<p class="instructor">Impartido por <span>${instructorName}</span></p>` : ''}
    <div class="divider"></div>
    <div class="footer">
      <div class="footer-col">
        <div class="seal">✦</div>
        <div class="line"></div>
        <p class="footer-label">Verificado por LearnUp</p>
      </div>
      <div class="footer-col">
        <p class="footer-value">${fechaFin}</p>
        <div class="line"></div>
        <p class="footer-label">Fecha de finalización</p>
      </div>
      <div class="footer-col">
        <p class="hash">${hashCode}</p>
        <div class="line"></div>
        <p class="footer-label">Código de verificación</p>
      </div>
    </div>
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 400); }<\/script>
</body>
</html>`;

  const popup = window.open('', '_blank', 'width=1120,height=800,toolbar=0,menubar=0,location=0');
  if (!popup) {
    alert('Por favor permite las ventanas emergentes para imprimir el certificado.');
    return;
  }
  popup.document.write(html);
  popup.document.close();
};

/* ─── Modal de Certificado ───────────────────────────────────────────────── */
const CertificateModal = ({ course, userName, onClose }) => {
  const fechaFin = course.fecha_inscripcion
    ? new Date(course.fecha_inscripcion).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });

  // Hash visual simulado basado en IDs
  const hashCode = `LU-${String(course.curso_id).padStart(4, '0')}-${String(course.inscripcion_id).padStart(6, '0')}`;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Certificado de finalización"
    >
      <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button
          id="cert-close-btn"
          className="certificate-close-btn"
          onClick={onClose}
          aria-label="Cerrar certificado"
        >
          <X size={22} />
        </button>

        {/* Certificado en sí */}
        <div className="certificate-body" id="certificate-printable">
          {/* Encabezado con logo/marca */}
          <div className="certificate-header">
            <div className="certificate-logo-area">
              <span className="certificate-logo-icon">🎓</span>
              <span className="certificate-logo-text">LearnUp</span>
            </div>
            <p className="certificate-subtitle">Certificado de Finalización</p>
          </div>

          {/* Separador decorativo */}
          <div className="certificate-divider">
            <span className="certificate-divider-gem">◆</span>
          </div>

          {/* Cuerpo del certificado */}
          <div className="certificate-main">
            <p className="certificate-presents">Este certificado se otorga a</p>
            <h2 className="certificate-recipient">{userName}</h2>
            <p className="certificate-by-completing">por completar exitosamente el curso</p>
            <h3 className="certificate-course-name">"{course.titulo}"</h3>
            {course.instructor_name && (
              <p className="certificate-instructor">
                Impartido por <strong>{course.instructor_name}</strong>
              </p>
            )}
          </div>

          {/* Separador decorativo */}
          <div className="certificate-divider">
            <span className="certificate-divider-gem">◆</span>
          </div>

          {/* Pie del certificado */}
          <div className="certificate-footer-area">
            <div className="certificate-footer-col">
              <div className="certificate-seal">✦</div>
              <p className="certificate-footer-label">Verificado por LearnUp</p>
            </div>
            <div className="certificate-footer-col">
              <p className="certificate-date">{fechaFin}</p>
              <p className="certificate-footer-label">Fecha de finalización</p>
            </div>
            <div className="certificate-footer-col">
              <p className="certificate-hash">{hashCode}</p>
              <p className="certificate-footer-label">Código de verificación</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="certificate-actions">
          <button
            id="cert-share-btn"
            className="btn btn-glass"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Mi Certificado LearnUp', text: `Completé el curso "${course.titulo}" en LearnUp!` });
              } else {
                navigator.clipboard.writeText(`Completé el curso "${course.titulo}" en LearnUp! Código: ${hashCode}`);
                alert('¡Enlace copiado al portapapeles!');
              }
            }}
          >
            <Share2 size={16} /> Compartir
          </button>
          <button
            id="cert-print-btn"
            className="btn btn-primary"
            onClick={() => printCertificate({
              userName,
              courseName: course.titulo,
              instructorName: course.instructor_name,
              fechaFin,
              hashCode
            })}
          >
            <Download size={16} /> Guardar PDF / Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Panel del Cliente ──────────────────────────────────────────────────── */
const ClientePanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null); // curso para certificado

  useEffect(() => {
    if (!user || user.role !== 'CLIENTE') return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('learnup_token')}` };
        const [dashRes, recRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/student/dashboard`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/student/recommended`, { headers })
        ]);
        if (dashRes.ok) setDashboardData(await dashRes.json());
        if (recRes.ok) setRecommended(await recRes.json());
      } catch (error) {
        console.error('Error cargando panel de estudiante:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user || user.role !== 'CLIENTE') return <Navigate to="/login" />;
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}><Spinner /></div>;

  const { stats, enrolledCourses } = dashboardData || { stats: {}, enrolledCourses: [] };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Encabezado */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Hola de nuevo, {user.name.split(' ')[0]} 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Aquí está el resumen de tu aprendizaje en LearnUp.</p>
      </div>

      {/* ── Tarjetas Resumen ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #3b82f6' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '12px', color: '#60a5fa' }}><BookOpen size={28} /></div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Cursos Inscritos</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.total || 0}</span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #f59e0b' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '12px', color: '#fbbf24' }}><PlayCircle size={28} /></div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>En Curso</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.en_curso || 0}</span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #10b981' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px', color: '#34d399' }}><CheckCircle size={28} /></div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Finalizados</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.finalizados || 0}</span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #a855f7' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '1rem', borderRadius: '12px', color: '#c084fc' }}><Award size={28} /></div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Certificados</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.certificados || 0}</span>
          </div>
        </div>
      </div>

      {/* ── Mis Cursos ── */}
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Compass size={24} color="var(--primary-color)" /> Mis Cursos
      </h2>
      {enrolledCourses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {enrolledCourses.map(course => {
            // Chequeo robusto: el backend devuelve `estado_inscripcion` (alias SQL),
            // pero por si acaso también revisamos `estado` y `progreso`.
            const estadoRaw = (course.estado_inscripcion || course.estado || '').trim().toUpperCase();
            const isFinished = estadoRaw === 'FINALIZADO' || Number(course.progreso) === 100;
            const estadoLabel = course.estado_inscripcion || course.estado || 'EN CURSO';

            return (
              // ⚠ overflow: 'visible' en la tarjeta para que el botón nunca quede recortado
              <div
                key={course.inscripcion_id}
                className="glass-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'visible',           // ← clave: no recortar
                  display: 'flex',
                  flexDirection: 'column',
                  border: isFinished
                    ? '1px solid rgba(16, 185, 129, 0.35)'
                    : '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {/* Imagen — su propio overflow:hidden para que se redondeen las esquinas superiores */}
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                  <ImageWithFallback
                    src={course.imagen_url}
                    alt={course.titulo}
                    fallbackText={course.categoria}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge de estado */}
                  <span style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: isFinished ? '#10b981' : 'var(--primary-color)',
                    color: '#fff', padding: '0.25rem 0.65rem', borderRadius: '12px',
                    fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.03em',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}>
                    {estadoLabel}
                  </span>
                  {/* Ícono de trofeo para finalizados */}
                  {isFinished && (
                    <div style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      background: 'rgba(0,0,0,0.65)', borderRadius: '50%',
                      padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Award size={18} color="#fbbf24" />
                    </div>
                  )}
                </div>

                {/* Cuerpo de la tarjeta */}
                <div style={{ padding: '1.4rem 1.4rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.4' }}>{course.titulo}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>Por {course.instructor_name}</p>

                  {/* Barra de progreso */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                      <span>Progreso</span>
                      <span style={{ color: isFinished ? '#34d399' : '#94a3b8', fontWeight: isFinished ? '700' : '400' }}>
                        {course.progreso}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${course.progreso}%`,
                        height: '100%',
                        borderRadius: '4px',
                        background: isFinished
                          ? 'linear-gradient(90deg, #10b981, #34d399)'
                          : 'linear-gradient(90deg, var(--primary-color), #818cf8)',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                  </div>

                  {/* ── Botón de acción ── siempre visible al final */}
                  {isFinished ? (
                    <button
                      id={`btn-certificado-${course.inscripcion_id}`}
                      className="btn"
                      style={{
                        width: '100%',
                        marginTop: '0.25rem',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.8rem',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.5)'; }}
                      onMouseOut={e =>  { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.35)'; }}
                      onClick={() => setSelectedCert(course)}
                    >
                      <Award size={18} /> Ver Certificado
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline"
                      style={{ width: '100%', marginTop: '0.25rem' }}
                      onClick={() => navigate(`/curso/${course.curso_id}`)}
                    >
                      {Number(course.progreso) === 0 ? 'Comenzar Curso' : 'Continuar'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px', marginBottom: '3rem' }}>
          <BookOpen size={48} style={{ opacity: 0.5, marginBottom: '1rem', color: 'var(--text-secondary)' }} />
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Aún no estás inscrito en ningún curso</h3>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Explorar Catálogo</button>
        </div>
      )}

      {/* ── Recomendados ── */}
      {recommended.length > 0 && (
        <>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={24} color="#fbbf24" /> Recomendados para ti
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {recommended.map(course => (
              <div
                key={course.id}
                className="glass-card"
                style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => navigate(`/curso/${course.id}`)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '140px', position: 'relative' }}>
                  <ImageWithFallback src={course.imagen_url} alt={course.titulo} fallbackText={course.categoria} className="w-full h-full object-cover" />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', lineHeight: '1.3' }}>{course.titulo}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{course.categoria}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{course.precio > 0 ? `Bs. ${course.precio}` : 'Gratis'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Modal de Certificado ── */}
      {selectedCert && (
        <CertificateModal
          course={selectedCert}
          userName={user.name}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};

export default ClientePanel;
