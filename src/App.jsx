import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppFloat from './components/layout/WhatsAppFloat';

// Public Pages
import Home from './pages/public/Home';
import Catalog from './pages/public/Catalog';
import ProductDetail from './pages/public/ProductDetail';
import Contact from './pages/public/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminSettings from './pages/admin/AdminSettings';

import './styles/main.css';

function PublicLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function NotFound() {
  return (
    <div
      className="empty-state"
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="empty-state-icon">🔍</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Página no encontrada
      </h3>
      <p>La URL que visitaste no existe.</p>
      <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
        Volver al inicio
      </a>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="catalogo" element={<Catalog />} />
                  <Route path="producto/:id" element={<ProductDetail />} />
                  <Route path="contacto" element={<Contact />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="productos" replace />} />
                  <Route path="productos" element={<AdminProducts />} />
                  <Route path="configuracion" element={<AdminSettings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ToastProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
