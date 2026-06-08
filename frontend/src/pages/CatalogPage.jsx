import React, { useEffect, useState } from 'react';
import { Spinner } from '../components/Spinner';
import { ServerCrash, FileSearch, Filter, Search, User, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import './CatalogPage.css';

const CatalogPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modalidad, setModalidad] = useState('');

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (categoria) queryParams.append('categoria', categoria);
      if (modalidad) queryParams.append('modalidad', modalidad);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Error de red');
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.error('Error obteniendo cursos:', err);
      setError('Lo sentimos, no pudimos cargar los cursos. Verifica la conexión.');
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [categoria, modalidad]);
  const handleSearch = (e) => { e.preventDefault(); fetchCourses(); };

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Encabezado con filtros */}
        <div className="catalog-header glass-panel">
          <div className="catalog-title-wrapper">
            <BookOpen size={32} className="catalog-title-icon" />
            <h1 className="catalog-title">Explora nuestro catálogo</h1>
          </div>
          
          <form onSubmit={handleSearch} className="search-bar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar talleres, cursos, habilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="filter-select">
              <option value="">Todas las categorías</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Arte">Arte</option>
              <option value="Negocios">Negocios</option>
              <option value="Idiomas">Idiomas</option>
              <option value="Repostería">Repostería</option>
              <option value="Gastronomía">Gastronomía</option>
              <option value="Fotografía">Fotografía</option>
              <option value="Educación">Educación</option>
            </select>
            <select value={modalidad} onChange={(e) => setModalidad(e.target.value)} className="filter-select">
              <option value="">Todas las modalidades</option>
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrido">Híbrido</option>
            </select>
            <button type="submit" className="btn btn-primary filter-btn">
              <Filter size={18} /> Filtrar
            </button>
          </form>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="empty-state-box">
            <Spinner size={32} />
            <p style={{ marginTop: '1rem' }}>Sincronizando con el servidor...</p>
          </div>
        ) : error ? (
          <div className="empty-state-box error-box">
            <ServerCrash size={48} style={{ marginBottom: '1rem' }} />
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state-box empty-box">
            <FileSearch size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No hay cursos publicados todavía.</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-image-wrapper">
                  <ImageWithFallback
                    src={course.imagen_url}
                    alt={course.titulo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    fallbackText={course.categoria || 'Curso'}
                  />
                  <span className="category-badge">
                    {course.categoria}
                  </span>
                </div>
                <div className="course-info">
                  <h3>{course.titulo}</h3>
                  <p className="instructor">
                    <User size={14} /> {course.instructor_name}
                  </p>
                  <p className="description">
                    {course.descripcion}
                  </p>
                  <div className="course-footer">
                    <span className="price">{course.precio > 0 ? `Bs. ${course.precio}` : 'Gratis'}</span>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/curso/${course.id}`)}>
                      Solicitar Cupo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
