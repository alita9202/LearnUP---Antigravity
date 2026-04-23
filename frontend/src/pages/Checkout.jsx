import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  if (cart.length === 0 && !status.success) {
    return (
      <div className="container empty-state-box" style={{ marginTop: '4rem' }}>
        <h2>Carrito Vacío</h2>
        <p>No tienes cursos para procesar.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Volver al Catálogo</button>
      </div>
    );
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user && formData.password !== formData.confirmPassword) {
      return setStatus({ loading: false, error: 'Las contraseñas no coinciden', success: false });
    }

    setStatus({ loading: true, error: '', success: false });

    const payload = {
      coursesIds: cart.map(c => c.id),
      user: user ? { id: user.id } : formData
    };

    try {
      const response = await fetch('http://localhost:5000/api/enrollments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        setStatus({ loading: false, error: '', success: true });
        clearCart();
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        setStatus({ loading: false, error: data.message, success: false });
      }
    } catch (err) {
      setStatus({ loading: false, error: 'Error de red. Verifica tu conexión al servidor.', success: false });
    }
  };

  if (status.success) {
    return (
      <div className="container" style={{ marginTop: '5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '5rem', display: 'block', animation: 'fadeIn 0.5s ease' }}>🎉</span>
          <h2 style={{ color: '#27c93f', marginTop: '1rem' }}>¡Inscripción Exitosa!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Estamos redirigiéndote a tu panel de control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 350px', gap: '2rem', alignItems: 'start' }}>
      
      {/* Checkout Formulario */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Finalizar Inscripción</h2>
        
        {status.error && <div className="auth-error">{status.error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {user ? (
            <div style={{ padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
              <p>Vas a inscribirte utilizando tu cuenta registrada:</p>
              <strong>{user.email}</strong>
            </div>
          ) : (
            <>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)'}}>Para inscribirte necesitamos crear una cuenta básica.</p>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Teléfono (WhatsApp)</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Crear Contraseña</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
                </div>
                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength="6" />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={status.loading} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {status.loading ? <><Spinner size={20} /> Procesando...</> : 'Confirmar e Inscribirse'}
          </button>
        </form>
      </div>

      {/* Resumen de Compra */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Resumen</h3>
        <ul className="cart-list">
          {cart.map((course) => (
            <li key={course.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.9rem', width: '70%' }}>{course.title}</span>
              <span style={{ fontWeight: 'bold' }}>Bs. {course.price}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', marginTop: '1.5rem' }}>
          <span>Total:</span>
          <strong style={{ color: 'var(--primary-color)' }}>Bs. {cartTotal.toFixed(2)}</strong>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
