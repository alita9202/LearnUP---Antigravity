import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';
import { ServerCrash, FileSearch } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const { user } = useAuth();

  useEffect(() => {
    // Llamada real al backend local (Node.js API)
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        if (!response.ok) {
          throw new Error('Error de red al intentar conectar con el servidor');
        }
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error("Error obteniendo cursos: ", err);
        setError("Lo sentimos, no pudimos cargar los cursos. Verifica que XAMPP y Node.js estén corriendo.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>¡Hola de nuevo, {user.name.split(' ')[0]}! 👋</h1>
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

      {/* Catalog Section */}
      <section id="catalogo" className="catalog container">
        <div className="catalog-header">
          <h2>Explora nuestro catálogo</h2>
          <div className="search-bar">
            <input type="text" placeholder="Buscar talleres, categorías..." />
            <button className="btn btn-primary">Buscar</button>
          </div>
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
                <div className="course-image-placeholder">
                  <span className="category-badge">{course.categoria}</span>
                </div>
                <div className="course-info">
                  <h3>{course.titulo}</h3>
                  <p className="instructor">👤 {course.instructor_name}</p>
                  <p className="description">{course.descripcion}</p>
                  <div className="course-footer">
                    <span className="price">{course.precio > 0 ? `Bs. ${course.precio}` : 'Gratis'}</span>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => addToCart(course)}
                    >
                      Añadir al Carrito
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
