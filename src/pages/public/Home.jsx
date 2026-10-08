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
                  <span className="hero__mini-num">Medellín</span>
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
              <div className="hero__visual-ring hero__visual-ring--outer" />
              <div className="hero__visual-ring hero__visual-ring--inner" />
              <div className="hero__visual-emoji">
                <span>💄</span><span>✨</span><span>🌸</span>
                <span>💅</span><span>🧴</span><span>⭐</span>
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
              <p className="trust-card__desc">Despachos a toda el área metropolitana de Medellín con total seguridad.</p>
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
  { name: 'Skincare', icon: '✨' },
  { name: 'Bases', icon: '🧴' },
  { name: 'Polvos', icon: '💨' },
  { name: 'Rubores', icon: '🌸' },
  { name: 'Iluminadores', icon: '⭐' },
  { name: 'Pestañinas', icon: '👁️' },
  { name: 'Correctores', icon: '🖌️' },
  { name: 'Labiales', icon: '💋' },
];

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
    </svg>
  );
}

function getCategoryIcon(cat) {
  const icons = {
    Skincare: '✨', Correctores: '🖌️', Bases: '🧴', Polvos: '💨',
    Rubores: '🌸', Iluminadores: '⭐', Pestañinas: '👁️', Labiales: '💋',
    Accesorios: '🎀',
  };
  return icons[cat] || '🛍️';
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
