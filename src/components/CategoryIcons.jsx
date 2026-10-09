/**
 * Category SVG Icons — Shalito Cosmetics
 * Iconografía lineal artesanal. Stroke-based, consistente y elegante.
 */

const S = { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function CatIconSkincare() {
  return (
    <svg {...S}>
      <path d="M12 2C8 2 5 5.5 5 9c0 4 3 7 7 8 4-1 7-4 7-8 0-3.5-3-7-7-7z"/>
      <path d="M9 12c.5 1.5 1.5 2.5 3 3"/>
      <circle cx="14" cy="8" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export function CatIconBases() {
  return (
    <svg {...S}>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
      <path d="M7 6h10l1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L7 6z"/>
      <path d="M10 11c0 1 4 1 4 0"/>
    </svg>
  );
}

export function CatIconPolvos() {
  return (
    <svg {...S}>
      <circle cx="12" cy="12" r="7"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2"/>
    </svg>
  );
}

export function CatIconRubores() {
  return (
    <svg {...S}>
      <path d="M12 21C7 21 3 17 3 12S7 3 12 3s9 4 9 9-4 9-9 9z"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export function CatIconIluminadores() {
  return (
    <svg {...S}>
      <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/>
    </svg>
  );
}

export function CatIconPestaninas() {
  return (
    <svg {...S}>
      <path d="M2 12c3-5 7-7 10-7s7 2 10 7"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M9 5.5l.5 2M12 4v2M15 5.5l-.5 2"/>
    </svg>
  );
}

export function CatIconCorrectores() {
  return (
    <svg {...S}>
      <path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
      <path d="M15 5l4 4"/>
    </svg>
  );
}

export function CatIconLabiales() {
  return (
    <svg {...S}>
      <path d="M12 3C9 3 7 5 7 7c0 1.5.8 2.8 2 3.5C7.5 12 6 14 6 17c0 2 1.5 4 6 4s6-2 6-4c0-3-1.5-5-3-6.5 1.2-.7 2-2 2-3.5 0-2-2-4-5-4z"/>
    </svg>
  );
}

export function CatIconCremasFijadoras() {
  return (
    <svg {...S}>
      <path d="M9 2h6l1 4H8L9 2z"/>
      <rect x="7" y="6" width="10" height="14" rx="2"/>
      <path d="M12 10v4M10 12h4"/>
    </svg>
  );
}

export function CatIconLociones() {
  return (
    <svg {...S}>
      <path d="M10 2h4v3h2l1 15a1 1 0 01-1 1H8a1 1 0 01-1-1L8 5h2V2z"/>
      <path d="M9 9c1 2 5 2 6 0"/>
      <circle cx="15" cy="4" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export function CatIconBrochas() {
  return (
    <svg {...S}>
      <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03L12.1 15.9"/>
      <path d="M7.07 14.94C5.79 16.22 5 18 5 20c2 0 3.78-.79 5.06-2.07L7.07 14.94z"/>
    </svg>
  );
}

export function CatIconAccesorios() {
  return (
    <svg {...S}>
      <rect x="3" y="6" width="18" height="13" rx="2"/>
      <path d="M8 6V4a4 4 0 018 0v2"/>
    </svg>
  );
}

export function CatIconDefault() {
  return (
    <svg {...S}>
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.98-1.67L23 6H6"/>
    </svg>
  );
}

/**
 * Devuelve el icono SVG correspondiente a una categoría.
 */
export function getCategoryIcon(cat) {
  const map = {
    'Skincare':                    <CatIconSkincare />,
    'Correctores':                 <CatIconCorrectores />,
    'Bases':                       <CatIconBases />,
    'Polvos':                      <CatIconPolvos />,
    'Rubores':                     <CatIconRubores />,
    'Iluminadores':                <CatIconIluminadores />,
    'Pestañinas':                  <CatIconPestaninas />,
    'Labiales':                    <CatIconLabiales />,
    'Paleta de sombra':            <CatIconDefault />,
    'Fijador de maquillaje':       <CatIconCremasFijadoras />,
    'Lociones':                    <CatIconLociones />,
    'Cremas corporales':           <CatIconLociones />,
    'Brochas':                     <CatIconBrochas />,
    'Accesorios':                  <CatIconAccesorios />,
  };
  return map[cat] || <CatIconDefault />;
}
