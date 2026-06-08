import React, { useEffect, useState } from 'react';
import { Spinner } from '../components/Spinner';
import { User, BookOpen, ChevronRight, Star, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import HeroCarousel from '../components/CourseCarousel';
import './Landing.css';

/* ─── Datos demo de Colaboradores ──────────────────────────────────────────── */
const DEMO_COLABORADORES = [
  {
    id: 1,
    nombre: 'USFX Virtual',
    especialidad: 'Educación Universitaria',
    cursos: 12,
    iniciales: 'UV',
    color: '#4f46e5',
    gradiente: 'linear-gradient(135deg, #4f46e5, #818cf8)',
    descripcion: 'Extensión virtual de la Universidad San Francisco Xavier de Chuquisaca.',
    rating: 4.9,
  },
  {
    id: 2,
    nombre: 'Instituto Tecnológico Sucre',
    especialidad: 'Tecnología & Programación',
    cursos: 8,
    iniciales: 'IT',
    color: '#ec4899',
    gradiente: 'linear-gradient(135deg, #db2777, #ec4899)',
    descripcion: 'Formación técnica de vanguardia en desarrollo de software e inteligencia artificial.',
    rating: 4.8,
  },
  {
    id: 3,
    nombre: 'Academia Digital Bolivia',
    especialidad: 'Marketing & Diseño Digital',
    cursos: 6,
    iniciales: 'AD',
    color: '#f59e0b',
    gradiente: 'linear-gradient(135deg, #d97706, #fbbf24)',
    descripcion: 'Especialistas en marketing digital, branding y diseño gráfico para el mercado boliviano.',
    rating: 4.7,
  },
  {
    id: 4,
    nombre: 'Chef Academy',
    especialidad: 'Gastronomía & Repostería',
    cursos: 5,
    iniciales: 'CA',
    color: '#10b981',
    gradiente: 'linear-gradient(135deg, #059669, #34d399)',
    descripcion: 'Escuela culinaria líder en Bolivia con técnicas nacionales e internacionales.',
    rating: 4.9,
  },
  {
    id: 5,
    nombre: 'LearnUp Partners',
    especialidad: 'Formación Profesional',
    cursos: 9,
    iniciales: 'LP',
    color: '#8b5cf6',
    gradiente: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    descripcion: 'Red de instructores independientes certificados por LearnUp en diversas áreas.',
    rating: 4.8,
  },
];

/* ─── Tarjeta de Colaborador ────────────────────────────────────────────────── */
const ColaboradorCard = ({ colab }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="colab-card"
      style={{
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${colab.color}44`
          : '0 4px 24px rgba(0,0,0,0.3)',
        borderColor: hovered ? `${colab.color}55` : 'rgba(255,255,255,0.07)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar con iniciales */}
      <div className="colab-avatar" style={{ background: colab.gradiente }}>
        <span className="colab-initials">{colab.iniciales}</span>
      </div>

      {/* Nombre y especialidad */}
      <h3 className="colab-nombre">{colab.nombre}</h3>
      <p className="colab-especialidad">{colab.especialidad}</p>
      <p className="colab-desc">{colab.descripcion}</p>

      {/* Estadísticas */}
      <div className="colab-stats">
        <div className="colab-stat">
          <BookOpen size={14} style={{ color: colab.color }} />
          <span>{colab.cursos} cursos</span>
        </div>
        <div className="colab-stat">
          <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
          <span>{colab.rating}</span>
        </div>
      </div>

      {/* Indicador de color inferior */}
      <div className="colab-accent-bar" style={{ background: colab.gradiente }} />
    </div>
  );
};

/* ─── Datos demo de Redes Sociales ──────────────────────────────────────────── */
const DEMO_REDES = [
  {
    id: 1, nombre: 'Facebook', handle: '@LearnUpBolivia',
    seguidores: '12.4K', miembros: '2.1K',
    gradiente: 'linear-gradient(135deg, #1877f2, #1565c0)',
    color: '#1877f2', descripcion: 'Últimas noticias y cursos nuevos cada semana.',
    url: 'https://www.facebook.com/ale.terceros.246224/', boton: 'Seguir',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 2, nombre: 'Instagram', handle: '@learnup.bo',
    seguidores: '8.7K', miembros: null,
    gradiente: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    color: '#e1306c', descripcion: 'Inspírate con historias de éxito de nuestros estudiantes.',
    url: 'https://www.instagram.com/alitaterceros/', boton: 'Seguir',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    id: 3, nombre: 'TikTok', handle: '@learnupbolivia',
    seguidores: '5.2K', miembros: null,
    gradiente: 'linear-gradient(135deg, #010101 0%, #69c9d0 50%, #ee1d52 100%)',
    color: '#69c9d0', descripcion: 'Tips rápidos de aprendizaje en videos cortos.',
    url: 'https://tiktok.com', boton: 'Seguir',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  },
  {
    id: 4, nombre: 'YouTube', handle: 'LearnUp Bolivia',
    seguidores: '3.1K', miembros: null,
    gradiente: 'linear-gradient(135deg, #ff0000, #cc0000)',
    color: '#ff0000', descripcion: 'Clases gratuitas, tutoriales y webinars en vivo.',
    url: 'https://youtube.com', boton: 'Suscribirse',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    id: 5, nombre: 'WhatsApp', handle: 'Comunidad LearnUp',
    seguidores: null, miembros: '2.8K',
    gradiente: 'linear-gradient(135deg, #25d366, #128c7e)',
    color: '#25d366', descripcion: 'Grupo de estudio con noticias exclusivas y descuentos.',
    url: 'https://wa.me/59169669938?text=Hola%20quiero%20informacion%20sobre%20los%20cursos%20de%20LearnUp', boton: 'Unirse',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

/* ─── Enlace de Red Social ───────────────────────────────────────────────── */
const SocialLink = ({ red }) => {
  return (
    <a
      href={red.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        color: 'var(--text-secondary)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = red.color;
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.querySelector('.social-icon-box').style.borderColor = red.color;
        e.currentTarget.querySelector('.social-icon-box').style.boxShadow = `0 8px 20px ${red.color}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.querySelector('.social-icon-box').style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.querySelector('.social-icon-box').style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
      }}
    >
      <div 
        className="social-icon-box"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '18px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'inherit',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        {red.icon}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{red.nombre}</span>
    </a>
  );
};

/* ─── Landing Principal ─────────────────────────────────────────────────────── */
const Landing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`);
      if (!response.ok) throw new Error('Error de red');
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.error('Error obteniendo cursos:', err);
      setError('Lo sentimos, no pudimos cargar los cursos.');
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  // Solo primeros 3 cursos para el bloque destacado
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="landing">

      {/* ══ 1. HERO CAROUSEL ══════════════════════════════════════════════════ */}
      <section className="hero-carousel-section">
        {loading ? (
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
            <Spinner size={48} />
          </div>
        ) : error || courses.length === 0 ? (
          <div className="hero-fallback animate-fade-in">
            <h1 className="hero-fallback-headline">
              Descubre y Aprende <br />
              <span style={{ color: '#818cf8' }}>Habilidades Reales</span> en Sucre
            </h1>
            <p className="hero-fallback-sub">
              Conecta con expertos locales. LearnUp es el marketplace donde el talento de la ciudad se encuentra con tus ganas de aprender.
            </p>
            <a href="#catalogo" className="btn btn-primary btn-large">Explorar Talleres</a>
          </div>
        ) : (
          <HeroCarousel courses={courses} />
        )}
      </section>

      {/* ══ 2. CURSOS DESTACADOS ══════════════════════════════════════════════ */}
      {!loading && !error && featuredCourses.length > 0 && (
        <section className="featured-section">
          <div className="container">
            {/* Encabezado */}
            <div className="section-header">
              <div className="section-header-left">
                <span className="section-eyebrow">
                  <Star size={14} style={{ fill: '#fbbf24', color: '#fbbf24' }} /> Más populares
                </span>
                <h2 className="section-title">Cursos Destacados</h2>
              </div>
              <button 
                className="section-see-all" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                onClick={() => navigate('/catalogo')}
              >
                Ver todo el catálogo <ChevronRight size={16} />
              </button>
            </div>

            {/* Grid de 3 tarjetas */}
            <div className="featured-grid">
              {featuredCourses.map(course => (
                <div key={course.id} className="featured-card">
                  {/* Imagen */}
                  <div className="featured-card-img">
                    <ImageWithFallback
                      src={course.imagen_url}
                      alt={course.titulo}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      fallbackText={course.categoria || 'Curso'}
                    />
                    <span className="featured-card-badge">{course.categoria}</span>
                  </div>
                  {/* Contenido */}
                  <div className="featured-card-body">
                    <h3 className="featured-card-title">{course.titulo}</h3>
                    <p className="featured-card-instructor">
                      <User size={13} /> {course.instructor_name}
                    </p>
                    <p className="featured-card-desc">
                      {course.descripcion?.slice(0, 90)}{course.descripcion?.length > 90 ? '…' : ''}
                    </p>
                    <div className="featured-card-footer">
                      <span className="featured-card-price">
                        {course.precio > 0 ? `Bs. ${course.precio}` : 'Gratis'}
                      </span>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem', borderRadius: '10px' }}
                        onClick={() => navigate(`/curso/${course.id}`)}
                      >
                        Ver Curso
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA centrado */}
            <div className="featured-cta-wrapper">
              <button
                className="hero-btn-secondary"
                id="hero-cta-explorar"
                onClick={() => navigate('/catalogo')}
              >
                Explorar Catálogo
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══ 3. COLABORADORES DESTACADOS ══════════════════════════════════════ */}
      <section className="colabs-section">
        {/* Fondo decorativo */}
        <div className="colabs-bg-glow" />

        <div className="container">
          {/* Encabezado */}
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
            <span className="section-eyebrow">
              <Award size={14} style={{ color: '#fbbf24' }} /> Red de excelencia
            </span>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>
              Nuestros Colaboradores Destacados
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto', lineHeight: '1.7', fontSize: '1rem' }}>
              Instituciones y expertos comprometidos con la educación de calidad en Sucre y Bolivia.
            </p>
          </div>

          {/* Grid de colaboradores */}
          <div className="colabs-grid">
            {DEMO_COLABORADORES.map(colab => (
              <ColaboradorCard key={colab.id} colab={colab} />
            ))}
          </div>

          {/* Stats globales */}
          <div className="colabs-stats-bar">
            <div className="colabs-stat-item">
              <span className="colabs-stat-number">5+</span>
              <span className="colabs-stat-label">Instituciones aliadas</span>
            </div>
            <div className="colabs-stat-divider" />
            <div className="colabs-stat-item">
              <span className="colabs-stat-number">40+</span>
              <span className="colabs-stat-label">Cursos disponibles</span>
            </div>
            <div className="colabs-stat-divider" />
            <div className="colabs-stat-item">
              <span className="colabs-stat-number">500+</span>
              <span className="colabs-stat-label">Estudiantes activos</span>
            </div>
            <div className="colabs-stat-divider" />
            <div className="colabs-stat-item">
              <span className="colabs-stat-number">4.8★</span>
              <span className="colabs-stat-label">Calificación promedio</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. ÚNETE A NUESTRA COMUNIDAD ══════════════════════════════════════ */}
      <section className="social-section">
        <div className="container">
          {/* Encabezado */}
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
            <span className="section-eyebrow">
              <Users size={14} style={{ color: '#818cf8' }} /> Comunidad activa
            </span>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>
              Únete a Nuestra Comunidad
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7', fontSize: '1rem' }}>
              Más de <strong style={{ color: '#818cf8' }}>32,000 personas</strong> ya forman parte de la familia LearnUp en redes sociales.
            </p>
          </div>

          {/* Grid de tarjetas sociales */}
          <div className="social-grid">
            {DEMO_REDES.map(red => (
              <SocialLink key={red.id} red={red} />
            ))}
          </div>

          {/* CTA final */}
          <div className="social-cta-wrapper">
            <p className="social-cta-text">¿Quieres aprender rodeado de una comunidad que te impulsa?</p>
            <button
              id="landing-explorar-cursos"
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', borderRadius: '14px' }}
              onClick={() => navigate('/catalogo')}
            >
              Explorar cursos gratis →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
