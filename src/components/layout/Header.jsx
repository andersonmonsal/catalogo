import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Home, BookOpen, Tag, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../services/productService';
import CartDrawer from '../cart/CartDrawer';

const NAV_LINKS = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { to: '/catalogo?filter=ofertas', label: 'Ofertas', icon: Tag },
  { to: '/contacto', label: 'Contacto', icon: Phone },
];

export default function Header() {
  const { itemCount, isOpen, setIsOpen } = useCart();
  const { products, storeConfig } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = products
      .filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.shades?.some((s) => s.toLowerCase().includes(q))
      )
      .slice(0, 6);
    setSearchResults(results);
  }, [searchQuery, products]);

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleResultClick = (product) => {
    navigate(`/producto/${product.id}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__inner">
            {/* Logo */}
            <Link to="/" className="header__logo">
              {storeConfig?.logo ? (
                <img src={storeConfig.logo} alt={storeConfig.name} />
              ) : null}
              <span>{storeConfig?.name || 'Shalito Cosmetics'}</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="header__nav hide-mobile">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="header__actions">
              <button
                id="search-toggle-btn"
                className="search-toggle"
                aria-label="Buscar"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </button>

              <button
                id="cart-open-btn"
                className="cart-btn"
                aria-label={`Carrito (${itemCount} productos)`}
                onClick={() => setIsOpen(true)}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </button>

              <button
                id="mobile-menu-btn"
                className="hamburger show-mobile-only"
                aria-label="Menú"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="search-bar">
            <div className="container">
              <div className="search-input-wrap" ref={searchRef}>
                <Search size={18} />
                <input
                  id="search-input"
                  className="search-input"
                  type="text"
                  placeholder="Buscar productos, marcas, tonos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((p) => (
                      <div
                        key={p.id}
                        className="search-result-item"
                        onClick={() => handleResultClick(p)}
                      >
                        {p.images?.[0] ? (
                          <img className="search-result-img" src={p.images[0]} alt={p.name} />
                        ) : (
                          <div className="search-result-img" style={{ background: 'var(--rose-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>💄</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-800)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{p.brand} · {formatPrice(p.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchQuery && searchResults.length === 0 && (
                  <div className="search-results">
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      No se encontraron productos para "{searchQuery}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="mobile-nav" onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}>
          <div className="mobile-nav__backdrop" onClick={() => setMenuOpen(false)} />
          <div className="mobile-nav__panel">
            <div className="mobile-nav__logo">{storeConfig?.name || 'Shalito Cosmetics'}</div>
            <button
              className="mobile-nav__close"
              onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `mobile-nav__link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isOpen && <CartDrawer />}
    </>
  );
}
