import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function Home() {
  const { featuredProducts, newProducts, offerProducts, products, storeConfig } = useStore();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleAdd = (product) => {
    addItem(product);
    addToast(`¡${product.name} añadido al carrito! 🛍️`);
  };

  return (
    <div className="home-page">
      {/* ── HERO ───────────────────────────────────── */}
      <section className="hero">
        {/* decorative blobs */}
        <div className="hero-blob hero-blob--1" aria-hidden="true" />
        <div className="hero-blob hero-blob--2" aria-hidden="true" />
        <div className="hero-blob hero-blob--3" aria-hidden="true" />

        <div className="container">
          <div className="hero__content hero__content--split">
            <div className="hero__text">
              <div className="hero__eyebrow">
                <SparkleIcon /> {storeConfig.name}
              </div>
              <h1 className="hero__title">
                Descubre tu <br />
                <span>belleza natural</span>
              </h1>
              <p className="hero__subtitle">
                {storeConfig.description}
              </p>
              <div className="hero__buttons">
                <Link to="/catalogo" className="btn btn-primary btn-lg">
                  Ver Catálogo <ArrowRight size={18} />
                </Link>
                {offerProducts.length > 0 && (
                  <Link to="/catalogo?filter=ofertas" className="btn btn-ghost btn-lg">
                    <Tag size={16} /> Ofertas
                  </Link>
                )}
              </div>

              {/* quick stats */}
              <div className="hero__mini-stats">
                <div className="hero__mini-stat">
                  <span className="hero__mini-num">{products.length}+</span>
                  <span className="hero__mini-label">productos</span>
                </div>
                <div className="hero__mini-divider" />
                <div className="hero__mini-stat">
                  <span className="hero__mini-num">Colombia</span>
                  <span className="hero__mini-label">envíos</span>
                </div>
                <div className="hero__mini-divider" />
                <div className="hero__mini-stat">
                  <span className="hero__mini-num">100%</span>
                  <span className="hero__mini-label">confianza</span>
                </div>
              </div>
            </div>

            {/* decorative right side */}
            <div className="hero__visual" aria-hidden="true">
              <div className="hero__logo-wrapper">
                <img src="/logo.png" alt="Shalito Cosmetics Logo" className="hero__logo-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Explora por Categoría</h2>
          <p className="section-subtitle">Encuentra todo lo que necesitas para tu rutina</p>

          <div className="categories-grid">
            {CATEGORIES_HOME.map(cat => (
              <Link to={`/catalogo?categoria=${cat.name}`} key={cat.name} className="category-card">
                <div className="category-card__icon">{cat.icon}</div>
                <div className="category-card__name">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title" style={{ textAlign: 'left' }}>⭐ Destacados</h2>
                <p className="section-subtitle" style={{ textAlign: 'left' }}>Los favoritos de nuestras clientas</p>
              </div>
              <Link to="/catalogo" className="btn btn-outline btn-sm hide-mobile">
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>

            <div className="products-grid">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} onAdd={() => handleAdd(product)} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }} className="show-mobile-only">
              <Link to="/catalogo" className="btn btn-outline">
                Ver todos los productos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* ── TRUST SECTION ──────────────────────────── */}
      <section className="section trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-card__icon">
                <Truck size={26} />
              </div>
              <h3 className="trust-card__title">Envíos Seguros</h3>
              <p className="trust-card__desc">Despachos a Medellín y a todo Colombia con total seguridad.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card__icon">
                <Star size={26} />
              </div>
              <h3 className="trust-card__title">Calidad Garantizada</h3>
              <p className="trust-card__desc">Trabajamos con las mejores marcas y productos del mercado.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card__icon">
                <ShieldCheck size={26} />
              </div>
              <h3 className="trust-card__title">Compra Segura</h3>
              <p className="trust-card__desc">Pagos protegidos y atención personalizada para cada clienta.</p>
            </div>
            <div className="trust-card">
              <div className="trust-card__icon">
                <Sparkles size={26} />
              </div>
              <h3 className="trust-card__title">Asesoría Gratis</h3>
              <p className="trust-card__desc">Te ayudamos a encontrar los productos perfectos para tu tono.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-card__content">
              <h2 className="cta-card__title">¿Lista para brillar? ✨</h2>
              <p className="cta-card__text">
                Explora nuestro catálogo completo y encuentra tu maquillaje ideal. ¡Envíanos un mensaje y te asesoramos!
              </p>
              <div className="hero__buttons" style={{ justifyContent: 'center' }}>
                <Link to="/catalogo" className="btn btn-primary btn-lg">
                  Ver Catálogo Completo
                </Link>
                <Link to="/contacto" className="btn btn-ghost btn-lg">
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────

const CATEGORIES_HOME = [
  { name: 'Skincare', icon: <CatIconSkincare /> },
  { name: 'Bases', icon: <CatIconBases /> },
  { name: 'Polvos', icon: <CatIconPolvos /> },
  { name: 'Rubores', icon: <CatIconRubores /> },
  { name: 'Iluminadores', icon: <CatIconIluminadores /> },
  { name: 'Pestañinas', icon: <CatIconPestaninas /> },
  { name: 'Correctores', icon: <CatIconCorrectores /> },
  { name: 'Labiales', icon: <CatIconLabiales /> },
  { name: 'Fijador de maquillaje', icon: <CatIconCremasFijadoras /> },
  { name: 'Paleta de sombra', icon: <CatIconDefault /> },
  { name: 'Lociones', icon: <CatIconLociones /> },
  { name: 'Cremas corporales', icon: <CatIconLociones /> },
];

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
    </svg>
  );
}

function getCategoryIcon(cat) {
  const map = {
    Skincare: <CatIconSkincare />, Correctores: <CatIconCorrectores />, Bases: <CatIconBases />, Polvos: <CatIconPolvos />,
    Rubores: <CatIconRubores />, Iluminadores: <CatIconIluminadores />, Pestañinas: <CatIconPestaninas />, Labiales: <CatIconLabiales />,
    'Paleta de sombra': <CatIconDefault />,
    'Fijador de maquillaje': <CatIconCremasFijadoras />, 'Lociones': <CatIconLociones />, 'Cremas corporales': <CatIconLociones />, 'Fijadores de cejas': <CatIconDefault />,
  };
  return map[cat] || <CatIconDefault />;
}

/* ── Category SVG Icons ───────────────────────── */
function CatIconSkincare() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 5 5.5 5 9c0 4 3 7 7 8 4-1 7-4 7-8 0-3.5-3-7-7-7z"/>
      <path d="M9 12c.5 1.5 1.5 2.5 3 3"/>
      <circle cx="14" cy="8" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function CatIconBases() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1"/>
      <path d="M7 6h10l1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L7 6z"/>
      <path d="M10 11c0 1 4 1 4 0"/>
    </svg>
  );
}
function CatIconPolvos() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="7"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2"/>
    </svg>
  );
}
function CatIconRubores() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21C7 21 3 17 3 12S7 3 12 3s9 4 9 9-4 9-9 9z"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function CatIconIluminadores() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/>
    </svg>
  );
}
function CatIconPestaninas() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c3-5 7-7 10-7s7 2 10 7"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M9 5.5l.5 2M12 4v2M15 5.5l-.5 2"/>
    </svg>
  );
}
function CatIconCorrectores() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
      <path d="M15 5l4 4"/>
    </svg>
  );
}
function CatIconLabiales() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C9 3 7 5 7 7c0 1.5.8 2.8 2 3.5C7.5 12 6 14 6 17c0 2 1.5 4 6 4s6-2 6-4c0-3-1.5-5-3-6.5 1.2-.7 2-2 2-3.5 0-2-2-4-5-4z"/>
    </svg>
  );
}
function CatIconCremasFijadoras() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2h6l1 4H8L9 2z"/>
      <rect x="7" y="6" width="10" height="14" rx="2"/>
      <path d="M12 10v4M10 12h4"/>
    </svg>
  );
}
function CatIconLociones() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2h4v3h2l1 15a1 1 0 01-1 1H8a1 1 0 01-1-1L8 5h2V2z"/>
      <path d="M9 9c1 2 5 2 6 0"/>
      <circle cx="15" cy="4" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function CatIconAccesorios() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2"/>
      <path d="M8 6V4a4 4 0 018 0v2"/>
    </svg>
  );
}
function CatIconDefault() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.98-1.67L23 6H6"/>
    </svg>
  );
}

function ProductCard({ product, onAdd }) {
  const isOutOfStock = product.available === false || product.stock === 0;

  return (
    <div className={`product-card ${isOutOfStock ? 'product-card--out-of-stock' : ''}`}>
      <Link to={`/producto/${product.id}`} style={{ display: 'block', position: 'relative' }}>
        {product.images?.[0] ? (
          <img className="product-card__img" src={product.images[0]} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card__img-placeholder">
            {getCategoryIcon(product.category)}
          </div>
        )}

        <div className="product-card__badges">
          {product.isNew && <span className="badge badge-new">Nuevo</span>}
          {product.isOffer && <span className="badge badge-offer">Oferta</span>}
        </div>

        {isOutOfStock && (
          <div className="out-of-stock-banner">Agotado</div>
        )}
      </Link>

      <div className="product-card__body">
        <div className="product-card__brand">{product.brand}</div>
        <Link to={`/producto/${product.id}`} className="product-card__name">
          {product.name}
        </Link>
        <div className="product-card__price-row">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="product-card__old-price">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>

      <div className="product-card__actions">
        <button
          className="btn btn-primary"
          onClick={onAdd}
          disabled={isOutOfStock}
          style={{ width: '100%' }}
        >
          {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
}
