import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import InstallPWA from './InstallPWA';
import './Navbar.css';

const Navbar = () => {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🚀</span>
            <h1>LearnUp</h1>
          </Link>
          <div className="nav-links">
            <InstallPWA />
            
            <button 
              className="btn btn-glass cart-btn" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
            
            <Link to="/login" className="btn btn-outline">
              <LogIn size={18} /> Iniciar Sesión
            </Link>
            
            <Link to="/register-teacher" className="btn btn-primary">
              <UserPlus size={18} /> Unirse a la Familia
            </Link>
          </div>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
