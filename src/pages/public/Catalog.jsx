import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../services/productService';
import {
  getCategoryIcon
} from '../../components/CategoryIcons';

export default function Catalog() {
  const { products, categories, loading } = useStore();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');

  // Filters state
  const activeCategory = searchParams.get('categoria') || 'all';
  const filterType = searchParams.get('filter') || 'all'; // all, ofertas, nuevos
  const [sortBy, setSortBy] = useState('newest'); // newest, price_asc, price_desc, name_asc

  const handleAdd = (product) => {
    addItem(product);
    addToast(`¡${product.name} añadido al carrito! 🛍️`);
  };

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Special filters
    if (filterType === 'ofertas') {
      result = result.filter(p => p.isOffer);
    } else if (filterType === 'nuevos') {
      result = result.filter(p => p.isNew);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return 0;
      }
    });

    return result;
  }, [products, activeCategory, filterType, sortBy, searchText]);

  const handleCategoryChange = (cat) => {
    if (cat === 'all') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', cat);
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <div className="container">
          <div className="catalog-controls">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <h1 className="section-title" style={{ textAlign: 'left', fontSize: '1.6rem', marginBottom: 0 }}>
                {filterType === 'ofertas' ? '🏷️ Ofertas Especiales' :
                 activeCategory !== 'all' ? activeCategory : 'Catálogo Completo'}
              </h1>
              {/* Search box */}
              <div className="catalog-search-wrap">
                <Search size={16} />
                <input
                  id="catalog-search"
                  type="text"
                  placeholder="Buscar producto o marca..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="catalog-search-input"
                />
              </div>
            </div>

            <div className="catalog-filters">
              <button
                className={`filter-btn ${activeCategory === 'all' && filterType === 'all' ? 'active' : ''}`}
                onClick={() => {
                  handleCategoryChange('all');
                  searchParams.delete('filter');
                  setSearchParams(searchParams);
                }}
              >
                Todos
              </button>
              <button
                className={`filter-btn ${filterType === 'ofertas' ? 'active' : ''}`}
                onClick={() => {
                  searchParams.set('filter', 'ofertas');
                  searchParams.delete('categoria');
                  setSearchParams(searchParams);
                }}
              >
                🏷️ Ofertas
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat && filterType === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div className="catalog-count">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                {searchText && <span style={{ color: 'var(--primary)', fontWeight: 600 }}> · "{searchText}"</span>}
              </div>
              <div className="catalog-sort">
                <SlidersHorizontal size={14} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Como todo</option>
                  <option value="price_asc">El más barato</option>
                  <option value="price_desc">El más caro</option>
                  <option value="name_asc">Nombre (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => handleAdd(product)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>Sin resultados</h3>
              <p>Intenta con otros filtros o busca otra cosa.</p>
              <button
                className="btn btn-outline"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  searchParams.delete('categoria');
                  searchParams.delete('filter');
                  setSearchParams(searchParams);
                  setSearchText('');
                }}
              >
                Ver todo el catálogo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reuse the ProductCard from Home, usually would put it in a separate file
function ProductCard({ product, onAdd }) {
  const isOutOfStock = product.available === false || product.stock === 0;
  
  return (
    <div className={`product-card ${isOutOfStock ? 'product-card--out-of-stock' : ''}`}>
      <Link to={`/producto/${product.id}`} style={{ display: 'block', position: 'relative' }}>
        {product.images?.[0] ? (
          <img className="product-card__img" src={product.images[0]} alt={product.name} />
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
        {product.shades?.length > 0 && (
          <div className="product-card__shades">
            {product.shades.slice(0, 3).map(shade => (
              <span key={shade} className="shade-chip">{shade}</span>
            ))}
            {product.shades.length > 3 && (
              <span className="shade-chip shade-chip-more">+{product.shades.length - 3}</span>
            )}
          </div>
        )}
      </div>
      
      <div className="product-card__actions">
        <button 
          className="btn btn-primary" 
          onClick={onAdd}
          disabled={isOutOfStock}
          style={{ width: '100%' }}
        >
          {isOutOfStock ? 'Agotado' : 'Añadir'}
        </button>
      </div>
    </div>
  );
}
