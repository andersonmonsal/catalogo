import React, { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const { storeConfig } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-layout">
      {/* Mobile toggle */}
      <button 
        className="admin-mobile-toggle"
        style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 60 }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__logo">
          <span className="admin-sidebar__brand">Shalito Admin</span>
          <span className="admin-sidebar__subbrand">{storeConfig?.name || 'Cosmetics'}</span>
        </div>
        
        <nav className="admin-nav">
          <NavLink 
            to="/admin/productos" 
            className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Package size={18} /> Productos
          </NavLink>
          <NavLink 
            to="/admin/configuracion" 
            className={({isActive}) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Settings size={18} /> Configuración
          </NavLink>
          
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link" style={{ marginTop: '2rem' }}>
            <ExternalLink size={18} /> Ver Tienda
          </a>
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <button 
            className="admin-nav-link" 
            onClick={() => logout()}
            style={{ color: '#ef4444' }}
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <Outlet />
      </div>
      
      {/* Backdrop for mobile */}
      {menuOpen && (
        <div 
          className="mobile-nav__backdrop show-mobile-only" 
          style={{ zIndex: 40 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
