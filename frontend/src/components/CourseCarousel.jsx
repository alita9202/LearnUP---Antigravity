import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, User, Tag, Monitor, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

const AUTOPLAY_INTERVAL = 6000;

const HeroCarousel = ({ courses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  // Usamos solo los 6 primeros cursos destacados
  const featured = courses.slice(0, 6);

  const goTo = useCallback((index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setProgress(0);
    startTimeRef.current = Date.now();
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, currentIndex]);

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % featured.length);
  }, [currentIndex, featured.length, goTo]);

  const goPrev = useCallback(() => {
    goTo(currentIndex === 0 ? featured.length - 1 : currentIndex - 1);
  }, [currentIndex, featured.length, goTo]);

  // Barra de progreso animada
  useEffect(() => {
    if (featured.length <= 1 || isPaused) return;
    
    let animFrameId;
    startTimeRef.current = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        animFrameId = requestAnimationFrame(animate);
      }
    };
    
    animFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameId);
  }, [currentIndex, isPaused, featured.length]);

  // Autoplay
  useEffect(() => {
    if (featured.length <= 1 || isPaused) return;
    const timer = setTimeout(goNext, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, goNext, featured.length]);

  // Teclado
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  if (!featured || featured.length === 0) return null;

  const course = featured[currentIndex];

  const getModalidadIcon = (modalidad) => {
    if (!modalidad) return null;
    const m = modalidad.toLowerCase();
    if (m === 'online' || m === 'virtual') return <Monitor size={14} />;
    if (m === 'presencial') return <MapPin size={14} />;
    return <Star size={14} />;
  };

  return (
    <div
      className="hero-carousel-root"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Carrusel de cursos destacados"
    >
      {/* Slides container */}
      <div className="hero-slides-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {featured.map((c, idx) => (
          <div key={c.id} className="hero-slide" aria-hidden={idx !== currentIndex}>
            {/* Imagen de fondo */}
            <ImageWithFallback
              src={c.imagen_url}
              alt={c.titulo}
              fallbackText={c.categoria || 'Curso'}
              className="hero-slide-bg"
            />
            {/* Overlay con gradiente lateral para legibilidad */}
            <div className="hero-slide-overlay" />
          </div>
        ))}
      </div>

      {/* Contenido del slide activo — fuera del track para no moverse */}
      <div className="hero-content-wrapper">
        <div className={`hero-content animate-fade-in`} key={currentIndex}>
          {/* Eyebrow label */}
          <div className="hero-eyebrow">
            <span className="hero-badge">{course.categoria || 'Destacado'}</span>
            {course.modalidad && (
              <span className="hero-meta-chip">
                {getModalidadIcon(course.modalidad)}
                {course.modalidad}
              </span>
            )}
          </div>

          {/* Headline estático de la plataforma */}
          <h1 className="hero-headline">
            Descubre y aprende<br />
            <span className="hero-headline-accent">habilidades reales</span> en Sucre
          </h1>

          {/* Tarjeta glassmorphism del curso actual */}
          <div className="hero-course-card">
            <p className="hero-course-label">Curso en tendencia</p>
            <h2 className="hero-course-title">{course.titulo}</h2>
            <div className="hero-course-meta">
              <span className="hero-course-instructor">
                <User size={15} />
                {course.instructor_name || 'Instructor'}
              </span>
              <span className="hero-course-price">
                {course.precio > 0 ? `Bs. ${course.precio}` : 'Gratis'}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-ctas">
            <button
              id={`hero-cta-ver-${course.id}`}
              className="btn btn-primary hero-btn-primary"
              onClick={() => navigate(`/curso/${course.id}`)}
            >
              Ver Curso
            </button>
            <button
              className="hero-btn-secondary"
              id="hero-cta-explorar"
              onClick={() => navigate('/catalogo')}
            >
              Explorar Catálogo
            </button>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      {featured.length > 1 && (
        <>
          <button
            id="hero-prev"
            className="hero-nav-btn hero-nav-prev"
            onClick={goPrev}
            aria-label="Slide anterior"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            id="hero-next"
            className="hero-nav-btn hero-nav-next"
            onClick={goNext}
            aria-label="Slide siguiente"
          >
            <ChevronRight size={26} />
          </button>

          {/* Dots + barra de progreso */}
          <div className="hero-dots-bar">
            {featured.map((_, idx) => (
              <button
                key={idx}
                id={`hero-dot-${idx}`}
                className={`hero-dot ${idx === currentIndex ? 'hero-dot-active' : ''}`}
                onClick={() => goTo(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
              >
                {idx === currentIndex && (
                  <span
                    className="hero-dot-progress"
                    style={{ width: isPaused ? `${progress}%` : `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Contador de posición */}
          <div className="hero-counter" aria-live="polite">
            {currentIndex + 1} / {featured.length}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
