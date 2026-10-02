import React, { useState } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function Contact() {
  const { storeConfig } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      alert('Por favor completa tu nombre y mensaje.');
      return;
    }

    const number = storeConfig?.whatsapp?.replace(/\D/g, '') || '573000000000';
    if (!number || number === '573000000000') {
      alert('El número de WhatsApp no está configurado aún.');
      return;
    }

    let msg = `¡Hola, Shalito Cosmetics! 💕\n\n`;
    msg += `*Nombre:* ${form.name}\n`;
    if (form.phone) msg += `*Teléfono:* ${form.phone}\n`;
    msg += `\n*Mensaje:*\n${form.message}`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${number}?text=${encoded}`, '_blank');
    setSent(true);
    setForm({ name: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero" style={{ minHeight: 260, padding: '3rem 0' }}>
        <div className="container">
          <div className="hero__content" style={{ textAlign: 'center' }}>
            <div className="hero__eyebrow" style={{ justifyContent: 'center' }}>
              ✉️ Contacto
            </div>
            <h1 className="hero__title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Estamos para <span>ayudarte</span>
            </h1>
            <p className="hero__subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
              ¿Tienes dudas sobre algún producto o pedido? Escríbenos y te respondemos pronto.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.6rem' }}>
                Información de contacto
              </h2>

              <ContactCard icon={<Phone size={20} />} title="WhatsApp">
                {storeConfig?.whatsapp ? (
                  <a
                    href={`https://wa.me/${storeConfig.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#25D366', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {storeConfig.whatsapp}
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>No configurado</span>
                )}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Respuesta rápida
                </span>
              </ContactCard>

              <ContactCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>} title="Instagram">
                {storeConfig?.instagram ? (
                  <a
                    href={`https://instagram.com/${storeConfig.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--primary)', fontWeight: 600 }}
                  >
                    @{storeConfig.instagram}
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>No configurado</span>
                )}
              </ContactCard>

              <ContactCard icon={<Clock size={20} />} title="Horario de atención">
                <span style={{ fontWeight: 500 }}>
                  {storeConfig?.schedule || 'Lunes a Sábado: 9am – 6pm'}
                </span>
              </ContactCard>

              <ContactCard icon={<MapPin size={20} />} title="Zona de cobertura">
                <span>Área metropolitana de Medellín</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Despachos a domicilio disponibles
                </span>
              </ContactCard>
            </div>

            {/* Form */}
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-light)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  color: 'var(--gray-800)',
                  marginBottom: '0.5rem',
                }}
              >
                Envíanos un mensaje
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Te redirigiremos a WhatsApp con tu mensaje listo.
              </p>

              {sent && (
                <div
                  style={{
                    background: '#d1fae5', color: '#065f46', padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                    fontSize: '0.88rem', fontWeight: 500, border: '1px solid #a7f3d0',
                  }}
                >
                  ✓ ¡Mensaje enviado! Redirigimos a WhatsApp.
                </div>
              )}

              <form onSubmit={handleWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-name">Nombre *</label>
                  <input
                    id="contact-name"
                    className="form-input"
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-phone">Teléfono (opcional)</label>
                  <input
                    id="contact-phone"
                    className="form-input"
                    type="tel"
                    name="phone"
                    placeholder="Tu número de contacto"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-message">Mensaje *</label>
                  <textarea
                    id="contact-message"
                    className="form-textarea"
                    name="message"
                    placeholder="Escribe tu pregunta o mensaje aquí..."
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', background: '#25D366', marginTop: '0.5rem' }}
                >
                  <WhatsAppIcon />
                  Enviar por WhatsApp
                </button>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Al hacer clic serás redirigido a WhatsApp con tu mensaje pre-escrito.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({ icon, title, children }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.25rem',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-md)',
          background: 'var(--rose-50)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
