import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simular un leve retraso para UX si el back responde muy rapido
    setTimeout(async () => {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard'); 
      } else {
        setError(result.message);
        setIsSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card animate-fade-in">
        <div className="auth-header">
          <h2>Bienvenido de vuelta</h2>
          <p>Inicia sesión para gestionar tus talleres</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@correo.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="********"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {isSubmitting ? <><Spinner size={20} /> Accediendo...</> : 'Acceder'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
