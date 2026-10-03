import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { updateStoreConfig } from '../../services/storeService';
import { uploadImage } from '../../services/storageService';

export default function AdminSettings() {
  const { storeConfig, refreshConfig } = useStore();
  const [form, setForm] = useState(storeConfig || {});
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (storeConfig) setForm(storeConfig);
  }, [storeConfig]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let dataToSave = { ...form };
      if (logoFile) {
        const url = await uploadImage(logoFile, `config/logo_${Date.now()}`);
        dataToSave.logo = url;
      }
      
      await updateStoreConfig(dataToSave);
      refreshConfig(); // update context
      alert('Configuración guardada exitosamente');
      setLogoFile(null);
    } catch (e) {
      alert('Error guardando configuración');
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar__title">Configuración de Tienda</h1>
      </div>
      
      <div className="admin-content">
        <div className="admin-table-wrap" style={{ padding: '2rem', maxWidth: '800px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nombre de la Tienda</label>
                <input className="form-input" name="name" value={form.name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Eslogan</label>
                <input className="form-input" name="slogan" value={form.slogan || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Descripción (SEO / Footer)</label>
              <textarea className="form-textarea" name="description" value={form.description || ''} onChange={handleChange} rows="2" />
            </div>

            <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Contacto y Redes</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">WhatsApp (ej. 573001234567)</label>
                <input className="form-input" name="whatsapp" value={form.whatsapp || ''} onChange={handleChange} placeholder="Sin espacios ni signos +" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Horario de Atención</label>
                <input className="form-input" name="schedule" value={form.schedule || ''} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Usuario de Instagram</label>
                <input className="form-input" name="instagram" value={form.instagram || ''} onChange={handleChange} placeholder="ej. shalito_cosmetics" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Usuario de TikTok</label>
                <input className="form-input" name="tiktok" value={form.tiktok || ''} onChange={handleChange} placeholder="ej. shalito_cosmetics" />
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Logo</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--border)' }}>
                {logoFile ? (
                  <img src={URL.createObjectURL(logoFile)} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : form.logo ? (
                  <img src={form.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={32} color="var(--gray-400)" />
                )}
              </div>
              <div>
                <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                  Subir nuevo logo
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => setLogoFile(e.target.files[0])} />
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Imagen recomendada: Cuadrada, JPG o PNG.</p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
