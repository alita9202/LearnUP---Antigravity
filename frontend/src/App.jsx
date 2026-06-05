import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import ColaboradorPanel from './pages/ColaboradorPanel';
import ClientePanel from './pages/ClientePanel';
import SolicitudColaborador from './pages/SolicitudColaborador';
import CourseDetail from './pages/CourseDetail';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css'; 

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const hasSidebar = user?.role === 'ADMINISTRADOR' || user?.role === 'COLABORADOR';

  return (
    <div className={`app-container ${hasSidebar ? 'with-sidebar' : ''} ${hasSidebar && sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {hasSidebar && (
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />
      )}
      <div className="main-content-wrapper">
        <Navbar 
          toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
        />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/curso/:id" element={<CourseDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/solicitud-colaborador" element={<SolicitudColaborador />} />
              <Route path="/admin-panel/*" element={<AdminPanel />} />
              <Route path="/colaborador-panel/*" element={<ColaboradorPanel />} />
              <Route path="/cliente-panel/*" element={<ClientePanel />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
