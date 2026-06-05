import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

const CourseCarousel = ({ courses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  // Mostramos solo los 5 más recientes o primeros
  const carouselCourses = courses.slice(0, 5);

  useEffect(() => {
    if (carouselCourses.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselCourses.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselCourses.length]);

  if (!carouselCourses || carouselCourses.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselCourses.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselCourses.length);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '3rem auto 4rem', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', background: 'var(--surface-color)' }}>
      <div style={{ position: 'relative', width: '100%', height: '450px', display: 'flex', transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)', transform: `translateX(-${currentIndex * 100}%)` }}>
        {carouselCourses.map((course) => (
          <div key={course.id} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
            <ImageWithFallback 
              src={course.imagen_url} 
              alt={course.titulo} 
              fallbackText={course.categoria || 'Curso'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              className="w-full h-full object-cover"
            />
            {/* Overlay Oscuro para asegurar legibilidad en el diseño Premium Dark */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.1) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '4rem' }}>
              <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
                <span style={{ alignSelf: 'flex-start', background: 'var(--primary-color)', color: 'white', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'inline-block' }}>
                  {course.categoria}
                </span>
                <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem', textShadow: '0 2px 8px rgba(0,0,0,0.6)', lineHeight: '1.2' }}>{course.titulo}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', margin: 0, fontSize: '1.2rem' }}>
                    <User size={20} /> {course.instructor_name}
                  </p>
                  <p style={{ color: '#fbbf24', fontWeight: 'bold', margin: 0, fontSize: '1.4rem' }}>
                    {course.precio > 0 ? `Bs. ${course.precio}` : 'Gratis'}
                  </p>
                </div>
                <button 
                  onClick={() => navigate(`/curso/${course.id}`)}
                  className="btn btn-primary" 
                  style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Ver Curso
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles del Carrusel */}
      {carouselCourses.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            style={{ position: 'absolute', top: '50%', left: '2rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.3s, transform 0.2s', zIndex: 10 }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={handleNext}
            style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.3s, transform 0.2s', zIndex: 10 }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          >
            <ChevronRight size={28} />
          </button>
          
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.8rem', zIndex: 10 }}>
            {carouselCourses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{ width: index === currentIndex ? '32px' : '10px', height: '10px', borderRadius: '5px', background: index === currentIndex ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }}
                aria-label={`Ir al curso ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseCarousel;
