import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../services/productService';

export default function CartDrawer() {
  const { 
    items, 
    total, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    sendWhatsApp 
  } = useCart();
  
  const { storeConfig } = useStore();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-overlay__backdrop" onClick={() => setIsOpen(false)} />
      
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 className="cart-title">
            <ShoppingBag size={24} color="var(--primary)" />
            Mi Carrito
          </h2>
          <button className="cart-close" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛍️</div>
            <h3>Tu carrito está vacío</h3>
            <p>¡Descubre nuestros productos y añade tus favoritos!</p>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Seguir Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.key} className="cart-item">
                  {item.image ? (
                    <img className="cart-item__img" src={item.image} alt={item.name} />
                  ) : (
                    <div className="cart-item__img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      💄
                    </div>
                  )}
                  
                  <div className="cart-item__info">
                    <div className="cart-item__name">{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.brand}</div>
                    {item.shade && (
                      <div className="cart-item__shade">Tono: {item.shade}</div>
                    )}
                    <div className="cart-item__price">{formatPrice(item.price)}</div>
                    
                    <div className="cart-item__qty">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="cart-item__remove"
                    onClick={() => removeItem(item.key)}
                    aria-label="Eliminar producto"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span className="cart-total-label">Total a pagar:</span>
                <span className="cart-total-value">{formatPrice(total)}</span>
              </div>
              
              <button 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: '#25D366' }}
                onClick={() => sendWhatsApp(storeConfig.whatsapp)}
              >
                Comprar por WhatsApp 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>
              
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', fontSize: '0.85rem' }}
                onClick={() => setIsOpen(false)}
              >
                Seguir Comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
