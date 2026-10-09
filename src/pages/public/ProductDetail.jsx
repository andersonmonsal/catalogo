import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../services/productService';
import { getCategoryIcon } from '../../components/CategoryIcons';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useStore();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [selectedShade, setSelectedShade] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const product = products.find((p) => p.id === id);

  // Reset state when product changes
  useEffect(() => {
    setSelectedShade(null);
    setQuantity(1);
    setActiveImg(0);
  }, [id]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state-icon">🔍</div>
        <h3>Producto no encontrado</h3>
        <p>Es posible que el producto haya sido eliminado o la URL sea incorrecta.</p>
        <Link to="/catalogo" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          <ArrowLeft size={18} /> Ver Catálogo
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.available === false || product.stock === 0;
  const hasShades = product.shades?.length > 0;
  const images = product.images?.length > 0 ? product.images : [];
  const discountPct = product.oldPrice && product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (hasShades && !selectedShade) {
      addToast('Por favor selecciona un tono antes de agregar al carrito.', 'info');
      return;
    }
    addItem(product, selectedShade, quantity);
    setAddedFeedback(true);
    addToast(`¡${product.name} añadido al carrito! 🛍️`);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Mira este producto: ${product.name}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };


  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo">Catálogo</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/catalogo?categoria=${product.category}`}>{product.category}</Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: 'var(--gray-600)', fontWeight: 500 }}>{product.name}</span>
        </div>

        <div className="product-detail__grid">
          {/* Gallery */}
          <div>
            <div className="product-gallery__main" style={{ position: 'relative' }}>
              {images.length > 0 ? (
                <>
                  <img src={images[activeImg]} alt={product.name} />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImg((prev) => (prev - 1 + images.length) % images.length)}
                        style={{
                          position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 2,
                        }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setActiveImg((prev) => (prev + 1) % images.length)}
                        style={{
                          position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                          background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 2,
                        }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div
                  style={{
                    width: '100%', aspectRatio: '1/1',
                    background: 'linear-gradient(135deg, var(--rose-50) 0%, var(--nude-100) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '4rem', borderRadius: 'var(--radius-xl)',
                  }}
                >
                  {getCategoryIcon(product.category)}
                </div>
              )}

              {/* Badges overlay */}
              <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', zIndex: 3 }}>
                {product.isNew && <span className="badge badge-new">Nuevo</span>}
                {product.isOffer && <span className="badge badge-offer">Oferta</span>}
                {discountPct && <span className="badge" style={{ background: '#dc2626', color: 'white' }}>-{discountPct}%</span>}
              </div>

              {isOutOfStock && (
                <div className="out-of-stock-banner">Agotado</div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="product-gallery__thumbs">
                {images.map((img, i) => (
                  <img
                    key={i}
                    className={`thumb ${activeImg === i ? 'active' : ''}`}
                    src={img}
                    alt={`${product.name} vista ${i + 1}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            {/* Brand + Share */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="product-detail__brand">{product.brand}</div>
              <button
                onClick={handleShare}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gray-500)', cursor: 'pointer', background: 'white',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--gray-500)'; }}
                aria-label="Compartir producto"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Name */}
            <h1 className="product-detail__name">{product.name}</h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
              {product.price ? (
                <span className="product-detail__price">{formatPrice(product.price)}</span>
              ) : (
                <span className="price-missing">Precio a consultar</span>
              )}
              {product.oldPrice && (
                <span className="product-detail__old-price">{formatPrice(product.oldPrice)}</span>
              )}
              {discountPct && (
                <span className="product-card__discount">-{discountPct}%</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="product-detail__description">{product.description}</p>
            )}

            {/* Category badge */}
            {product.category && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Categoría:</span>
                <Link
                  to={`/catalogo?categoria=${product.category}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.25rem 0.75rem', background: 'var(--rose-50)', color: 'var(--primary)',
                    borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
                    border: '1px solid var(--rose-100)',
                  }}
                >
                  {getCategoryIcon(product.category)} {product.category}
                </Link>
              </div>
            )}

            {/* Shade Selector */}
            {hasShades && (
              <div className="shade-selector">
                <div className="shade-selector__label">
                  Tono: {selectedShade ? <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedShade}</span> : <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Selecciona un tono</span>}
                </div>
                <div className="shade-selector__grid">
                  {product.shades.map((shade) => (
                    <button
                      key={shade}
                      className={`shade-option ${selectedShade === shade ? 'selected' : ''}`}
                      onClick={() => setSelectedShade(selectedShade === shade ? null : shade)}
                    >
                      {shade}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="quantity-selector">
                <div className="quantity-selector__label">Cantidad:</div>
                <div className="quantity-control">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Reducir cantidad">−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar cantidad">+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-detail__actions">
              <button
                className={`btn btn-primary btn-lg ${addedFeedback ? '' : ''}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                style={{ flex: 1 }}
              >
                {isOutOfStock ? (
                  'Producto Agotado'
                ) : addedFeedback ? (
                  <>✓ ¡Añadido al carrito!</>
                ) : (
                  <><ShoppingBag size={18} /> Añadir al Carrito</>
                )}
              </button>
            </div>

            {/* Out of stock notice */}
            {isOutOfStock && (
              <div style={{
                padding: '0.75rem 1rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                📦 Este producto está temporalmente agotado. ¡Contáctanos para más info!
              </div>
            )}

            {/* Back link */}
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline"
              style={{ alignSelf: 'flex-start', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} /> Volver
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts products={products} currentProduct={product} onAdd={(p) => { addItem(p); addToast(`¡${p.name} añadido! 🛍️`); }} />
    </div>
  );
}

function RelatedProducts({ products, currentProduct, onAdd }) {
  const related = products
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category && p.available !== false)
    .slice(0, 4);

  if (related.length === 0) return null;


  return (
    <div className="section section-alt" style={{ marginTop: '2rem' }}>
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.4rem' }}>
          Más de {currentProduct.category}
        </h2>
        <div className="products-grid" style={{ marginTop: '1.5rem' }}>
          {related.map(product => (
            <div key={product.id} className="product-card">
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
              </Link>
              <div className="product-card__body">
                <div className="product-card__brand">{product.brand}</div>
                <Link to={`/producto/${product.id}`} className="product-card__name">{product.name}</Link>
                <div className="product-card__price-row">
                  <span className="product-card__price">{formatPrice(product.price)}</span>
                  {product.oldPrice && <span className="product-card__old-price">{formatPrice(product.oldPrice)}</span>}
                </div>
              </div>
              <div className="product-card__actions">
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onAdd(product)}>
                  Añadir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
