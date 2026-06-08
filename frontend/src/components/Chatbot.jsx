import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy el asistente virtual de LearnUp. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'bot', text: data.text, courses: data.courses }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Lo siento, tuve un problema de conexión. Intenta de nuevo más tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--primary-color)', color: 'white',
          border: 'none', cursor: 'pointer',
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)', zIndex: 1000,
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageSquare size={28} />
      </button>

      {/* Ventana de Chat */}
      <div style={{
        position: 'fixed', bottom: '2rem', right: '2rem',
        width: '350px', height: '500px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        zIndex: 1000,
        overflow: 'hidden',
        transition: 'opacity 0.3s, transform 0.3s',
        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
        opacity: isOpen ? 1 : 0
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem', background: 'rgba(79, 70, 229, 0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={24} color="var(--primary-color)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Asistente LearnUp</h3>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Mensajes */}
        <div style={{
          flex: 1, padding: '1rem', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex', gap: '0.5rem',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}>
              {msg.role === 'bot' && (
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={16} color="white" />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                  background: msg.role === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  padding: '0.8rem 1rem',
                  borderRadius: '16px',
                  borderTopRightRadius: msg.role === 'user' ? 0 : '16px',
                  borderTopLeftRadius: msg.role === 'bot' ? 0 : '16px',
                  color: 'white', fontSize: '0.9rem', lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
                {msg.courses && msg.courses.map(course => (
                  <div key={course.id} style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(79, 70, 229, 0.3)',
                    padding: '0.8rem', borderRadius: '12px', cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => { setIsOpen(false); navigate(`/curso/${course.id}`); }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '0.2rem' }}>{course.categoria}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{course.titulo}</div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Bs. {course.precio}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="white" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem 1rem', borderRadius: '16px', borderTopLeftRadius: 0 }}>
                <Loader2 size={16} className="animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{
          padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', gap: '0.5rem'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntame algo..."
            style={{
              flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px', padding: '0.5rem 1rem', color: 'white', outline: 'none'
            }}
          />
          <button type="submit" disabled={isLoading || !input.trim()} style={{
            background: 'var(--primary-color)', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
            opacity: (isLoading || !input.trim()) ? 0.5 : 1
          }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
