import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <h2>Tu Selección</h2>
        </div>

        <div className="modal-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-icon">🛒</span>
              <p>Tu carrito está vacío.</p>
              <button className="btn btn-primary btn-sm mt-3" onClick={onClose}>Explorar Cursos</button>
            </div>
          ) : (
            <>
              <ul className="cart-list">
                {cart.map((course) => (
                  <li key={course.id} className="cart-item">
                    <div className="cart-item-details">
                      <h4>{course.title}</h4>
                      <span className="cart-item-category">{course.category}</span>
                    </div>
                    <div className="cart-item-action">
                      <span className="cart-item-price">Bs. {course.price}</span>
                      <button className="remove-btn" onClick={() => removeFromCart(course.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total a Pagar:</span>
                  <strong>Bs. {cartTotal.toFixed(2)}</strong>
                </div>
                <button className="btn btn-primary btn-large btn-block" onClick={handleCheckout}>
                  Ir a Inscripción
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
