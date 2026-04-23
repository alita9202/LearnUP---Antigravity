import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Spinner } from '../components/Spinner';
import { ServerCrash, FileSearch } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

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

  return (
    <div className="landing">
      {/* Hero Section */}
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
                  <span className="category-badge">{course.category}</span>
                </div>
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p className="instructor">👤 {course.instructor_name}</p>
                  <p className="description">{course.description}</p>
                  <div className="course-footer">
                    <span className="price">{course.price > 0 ? `Bs. ${course.price}` : 'Gratis'}</span>
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
