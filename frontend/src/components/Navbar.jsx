import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogIn, UserPlus, LogOut, UserCircle, BookOpen, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartModal from './CartModal';
import InstallPWA from './InstallPWA';
import './Navbar.css';

const Navbar = ({ toggleMobileSidebar }) => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Si es ADMIN o COLAB, la Navbar superior será minimalista o incluso oculta en partes
  // pero mantendremos un logo para móvil si el sidebar colapsa.
  // Por requerimiento: "Navbar superior minimal. Mostrar sidebar lateral".
  const hasSidebar = user?.role === 'ADMINISTRADOR' || user?.role === 'COLABORADOR';

  return (
    <>
      <nav className={`navbar ${hasSidebar ? 'navbar-minimal' : ''}`}>
        <div className="container nav-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {hasSidebar && (
              <button 
                className="btn btn-glass mobile-menu-btn" 
                onClick={toggleMobileSidebar}
                style={{ padding: '0.5rem' }}
              >
                <Menu size={20} />
              </button>
            )}
            <Link to="/" className="nav-logo">
              <span className="logo-icon">🚀</span>
              {!hasSidebar && <h1>LearnUp</h1>}
            </Link>
          </div>
          
          <div className="nav-links">
            {!hasSidebar && <InstallPWA />}
            
            {/* El Carrito lo mostramos siempre para CLIENTE y Visitantes */}
            {(!user || user.role === 'CLIENTE') && (
              <button 
                className="btn btn-glass cart-btn" 
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              </button>
            )}

            {!user ? (
              // USUARIO NO LOGUEADO
              <>
                <Link to="/login" className="btn btn-outline">
                  <LogIn size={18} /> Iniciar Sesión
                </Link>
                <Link to="/solicitud-colaborador" className="btn btn-primary">
                  <UserPlus size={18} /> Unirse a la Familia
                </Link>
              </>
            ) : user.role === 'CLIENTE' ? (
              // USUARIO CLIENTE LOGUEADO
              <div className="nav-user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/cliente-panel" className="btn btn-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} /> Mis Cursos
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                  <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '500', color: '#fff' }}>{user.name}</span>
                </div>
                <button onClick={logout} className="btn btn-outline" style={{ border: 'none', color: '#f87171', padding: '0.5rem' }}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              // ADMIN o COLAB (Minimal top navbar)
              <div className="nav-user-menu">
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Modo {user.role.toLowerCase()}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
