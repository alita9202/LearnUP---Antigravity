import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';
import { ServerCrash, FileSearch, Filter, Search, User, Sparkles, BookOpen, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import CourseCarousel from '../components/CourseCarousel';
import './Landing.css';

const Landing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modalidad, setModalidad] = useState('');
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (categoria) queryParams.append('categoria', categoria);
      if (modalidad) queryParams.append('modalidad', modalidad);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Error de red al intentar conectar con el servidor');
      }
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.error("Error obteniendo cursos: ", err);
      setError("Lo sentimos, no pudimos cargar los cursos. Verifica la conexión.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [categoria, modalidad]); // Refetch when filters change

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const renderHero = () => {
    if (!user) {
      return (
        <section className="hero">
          <div className="container hero-container animate-fade-in">
            <div className="hero-content">
              <h1>Descubre y Aprende <br/> <span className="highlight">Habilidades Reales</span> en Sucre</h1>
              <p>Conecta con expertos locales. Desde cocina hasta programación, LearnUp es el marketplace donde el talento de la ciudad se encuentra con tus ganas de aprender.</p>
              <div className="hero-actions">
                <a href="#catalogo" className="btn btn-primary btn-large">Explorar Talleres</a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="glass-card mockup-card">
                <div className="mockup-header">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="mockup-body">
                  <h3>Tendencia esta semana</h3>
                  <div className="mock-course">
                     <div className="mock-img"></div>
                     <div className="mock-details">
                       <h4>Fotografía Urbana</h4>
                       <p>Por Ana M.</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (user.role === 'CLIENTE') {
      return (
        <section className="hero" style={{ padding: '3rem 0', background: 'rgba(59, 130, 246, 0.05)' }}>
          <div className="container animate-fade-in" style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              ¡Hola de nuevo, {user.name.split(' ')[0]}! <Sparkles size={32} color="#fbbf24" />
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>¿Listo para seguir aprendiendo? Echa un vistazo a los nuevos cursos que tenemos para ti.</p>
            <a href="#catalogo" className="btn btn-primary mt-3" style={{ display: 'inline-block' }}>Ver Recomendaciones</a>
          </div>
        </section>
      );
    }

    if (user.role === 'COLABORADOR') {
      return (
        <section className="hero" style={{ padding: '3rem 0', background: 'rgba(168, 85, 247, 0.05)' }}>
          <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Bienvenido, Profesor {user.name.split(' ')[0]}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Inspira a otros y comparte tu conocimiento.</p>
            </div>
            <a href="/colaborador-panel/crear-curso" className="btn btn-primary">Crear Nuevo Curso</a>
          </div>
        </section>
      );
    }

    if (user.role === 'ADMINISTRADOR') {
      return (
        <section className="hero" style={{ padding: '3rem 0', background: 'rgba(236, 72, 153, 0.05)' }}>
          <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Panel de Control Activo</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Supervisa la plataforma y aprueba nuevos instructores.</p>
            </div>
            <a href="/admin-panel" className="btn btn-primary">Ir al Dashboard</a>
          </div>
        </section>
      );
    }
  };

  return (
    <div className="landing">
      {renderHero()}

      {/* Featured Section Carousel */}
      {!loading && !error && courses.length > 0 && (
        <section className="featured-carousel-section" style={{ padding: '0 2rem' }}>
          <CourseCarousel courses={courses} />
        </section>
      )}

      {/* Catalog Section */}
      <section id="catalogo" className="catalog container">
        <div className="catalog-header" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <BookOpen size={28} color="var(--secondary-color)" />
            <h2 style={{ fontSize: '2rem', margin: 0 }}>Explora nuestro catálogo</h2>
          </div>
          <form onSubmit={handleSearch} className="search-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
              <input 
                type="text" 
                placeholder="Buscar talleres, cursos, habilidades..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', height: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
              />
            </div>
            <select 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
              style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', outline: 'none' }}
            >
              <option value="" style={{ background: '#1e293b' }}>Todas las categorías</option>
              <option value="Tecnología" style={{ background: '#1e293b' }}>Tecnología</option>
              <option value="Arte" style={{ background: '#1e293b' }}>Arte</option>
              <option value="Negocios" style={{ background: '#1e293b' }}>Negocios</option>
              <option value="Idiomas" style={{ background: '#1e293b' }}>Idiomas</option>
              <option value="Repostería" style={{ background: '#1e293b' }}>Repostería</option>
              <option value="Gastronomía" style={{ background: '#1e293b' }}>Gastronomía</option>
              <option value="Fotografía" style={{ background: '#1e293b' }}>Fotografía</option>
              <option value="Educación" style={{ background: '#1e293b' }}>Educación</option>
            </select>
            <select 
              value={modalidad} 
              onChange={(e) => setModalidad(e.target.value)}
              style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1rem', outline: 'none' }}
            >
              <option value="" style={{ background: '#1e293b' }}>Todas las modalidades</option>
              <option value="Presencial" style={{ background: '#1e293b' }}>Presencial</option>
              <option value="Online" style={{ background: '#1e293b' }}>Online</option>
              <option value="Virtual" style={{ background: '#1e293b' }}>Virtual</option>
              <option value="Híbrido" style={{ background: '#1e293b' }}>Híbrido</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
              <Filter size={18} /> Filtrar
            </button>
          </form>
        </div>

        {loading ? (
          <div className="empty-state-box">
            <Spinner size={32} className="mb-2" />
            <p style={{ marginTop: '1rem' }}>Sincronizando con el servidor...</p>
          </div>
        ) : error ? (
          <div className="empty-state-box" style={{ borderColor: 'rgba(255, 95, 86, 0.3)', color: '#ff5f56' }}>
            <ServerCrash size={48} style={{ marginBottom: '1rem' }} />
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state-box">
            <FileSearch size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No hay cursos publicados todavía.</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-image" style={{ aspectRatio: '4/3', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                  <ImageWithFallback
                    src={course.imagen_url}
                    alt={course.titulo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    fallbackText={course.categoria || 'Curso'}
                  />
                  <span className="category-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--primary-color, #4f46e5)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', zIndex: 10 }}>{course.categoria}</span>
                </div>
                <div className="course-info">
                  <h3>{course.titulo}</h3>
                  <p className="instructor" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={14} /> {course.instructor_name}
                  </p>
                  <p className="description" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {course.descripcion}
                  </p>
                  <div className="course-footer" style={{ marginTop: '1rem' }}>
                    <span className="price">{course.precio > 0 ? `Bs. ${course.precio}` : 'Gratis'}</span>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/curso/${course.id}`)}
                    >
                      Solicitar Cupo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Landing;
