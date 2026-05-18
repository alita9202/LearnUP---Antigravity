import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, FileText, BookOpen, 
  BarChart, Settings, LogOut, ChevronLeft, ChevronRight,
  UserCircle, UsersIcon
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'ADMINISTRADOR';
  const isColab = user?.role === 'COLABORADOR';

  if (!isAdmin && !isColab) return null;

  const adminLinks = [
    { to: '/admin-panel', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin-panel/usuarios', icon: <Users size={20} />, label: 'Usuarios' },
    { to: '/admin-panel/solicitudes', icon: <FileText size={20} />, label: 'Solicitudes' },
    { to: '/admin-panel/cursos', icon: <BookOpen size={20} />, label: 'Cursos' },
    { to: '/admin-panel/reportes', icon: <BarChart size={20} />, label: 'Reportes' },
    { to: '/admin-panel/configuracion', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  const colabLinks = [
    { to: '/colaborador-panel', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/colaborador-panel/mis-cursos', icon: <BookOpen size={20} />, label: 'Mis Cursos' },
    { to: '/colaborador-panel/crear-curso', icon: <FileText size={20} />, label: 'Crear Curso' },
    { to: '/colaborador-panel/estudiantes', icon: <UsersIcon size={20} />, label: 'Estudiantes Inscritos' },
    { to: '/colaborador-panel/perfil', icon: <UserCircle size={20} />, label: 'Perfil' },
    { to: '/colaborador-panel/configuracion', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  const links = isAdmin ? adminLinks : colabLinks;

  return (
    <>
      {/* Overlay for mobile drawer */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-logo">LearnUp</h2>}
        {collapsed && <span className="sidebar-logo-icon">🚀</span>}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
        {!collapsed && (
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role.toLowerCase()}</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {links.map((link, idx) => (
            <li key={idx}>
              <NavLink 
                to={link.to} 
                end 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                {!collapsed && <span className="nav-label">{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={logout}>
          <span className="nav-icon"><LogOut size={20} /></span>
          {!collapsed && <span className="nav-label">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
