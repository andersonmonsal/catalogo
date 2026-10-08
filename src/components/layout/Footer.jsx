import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function Footer() {
  const { storeConfig } = useStore();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand col */}
          <div>
            <div className="footer__brand">{storeConfig?.name || 'Shalito Cosmetics'}</div>
            <div className="footer__tagline">{storeConfig?.slogan || 'Tu belleza, tu estilo.'}</div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {storeConfig?.description || 'Tienda de maquillaje y cosmética en Medellín. Bases, correctores, polvos, rubores, iluminadores y más.'}
            </p>
            <div className="footer__social">
              {storeConfig?.tiktok && (
                <a
                  href={`https://tiktok.com/@${storeConfig.tiktok}`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                  aria-label="TikTok"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.25 8.25 0 004.76 1.51V6.75a4.82 4.82 0 01-1-.06z"/>
                  </svg>
                </a>
              )}
              {storeConfig?.whatsapp && (
                <a
                  href={`https://wa.me/${storeConfig.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
              )}
            </div>
          </div>

          {/* Links col */}
          <div>
            <div className="footer__heading">Catálogo</div>
            <div className="footer__links">
              <Link to="/catalogo">Todos los productos</Link>
              <Link to="/catalogo?categoria=Skincare">Skincare</Link>
              <Link to="/catalogo?categoria=Bases">Bases</Link>
              <Link to="/catalogo?categoria=Polvos">Polvos</Link>
              <Link to="/catalogo?categoria=Rubores">Rubores</Link>
              <Link to="/catalogo?categoria=Iluminadores">Iluminadores</Link>
              <Link to="/catalogo?categoria=Pestañinas">Pestañinas</Link>
              <Link to="/catalogo?filter=ofertas">Ofertas</Link>
            </div>
          </div>

          {/* Info col */}
          <div>
            <div className="footer__heading">Información</div>
            <div className="footer__links">
              <Link to="/contacto">Contacto</Link>
              {storeConfig?.schedule && (
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)', cursor: 'default' }}>
                  📅 {storeConfig.schedule}
                </span>
              )}
              {storeConfig?.whatsapp && (
                <a
                  href={`https://wa.me/${storeConfig.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#5bce77' }}
                >
                  💬 Escríbenos
                </a>
              )}
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)', cursor: 'default' }}>
                📦 Envíos a Medellín
              </span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {storeConfig?.name || 'Shalito Cosmetics'}. Hecho con <Heart size={13} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--rose-400)' }} /> en Medellín, Colombia.
          </p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
