import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Search, Image as ImageIcon, X, Package } from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct, duplicateProduct, toggleAvailability, formatPrice } from '../../services/productService';
import { uploadImage, deleteImage } from '../../services/storageService';
import { INITIAL_CATEGORIES } from '../../data/initialProducts';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    name: '', brand: '', category: 'Skincare', price: '', oldPrice: '', 
    description: '', stock: '', available: true, isOffer: false, isNew: false, isFeatured: false,
    shades: [], images: []
  });
  const [shadeInput, setShadeInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // new files to upload
  
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
      alert('Error cargando productos');
    }
    setLoading(false);
  };
  
  useEffect(() => { loadProducts(); }, []);
  
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setForm({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || 'Skincare',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        description: product.description || '',
        stock: product.stock !== null ? product.stock : '',
        available: product.available !== false,
        isOffer: product.isOffer || false,
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
        shades: product.shades || [],
        images: product.images || []
      });
    } else {
      setEditingId(null);
      setForm({
        name: '', brand: '', category: 'Skincare', price: '', oldPrice: '', 
        description: '', stock: '', available: true, isOffer: false, isNew: false, isFeatured: false,
        shades: [], images: []
      });
    }
    setImageFiles([]);
    setShadeInput('');
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Strip everything except digits
    const clean = value.replace(/[^0-9]/g, '');
    setForm(prev => ({ ...prev, [name]: clean }));
  };
  
  const handleAddShade = () => {
    if (shadeInput.trim() && !form.shades.includes(shadeInput.trim())) {
      setForm(prev => ({ ...prev, shades: [...prev.shades, shadeInput.trim()] }));
      setShadeInput('');
    }
  };
  const handleRemoveShade = (shade) => {
    setForm(prev => ({ ...prev, shades: prev.shades.filter(s => s !== shade) }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };
  
  const handleRemoveExistingImage = async (url) => {
    if (window.confirm('¿Eliminar esta imagen permanentemente?')) {
      try {
        await deleteImage(url);
        setForm(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }));
      } catch(e) {
        alert('Error al eliminar imagen');
      }
    }
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrls = [...form.images];
      
      // Upload new images
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await uploadImage(file, `products/${Date.now()}_${file.name}`);
          imageUrls.push(url);
        }
      }
      
      const productData = {
        ...form,
        price: form.price ? Number(String(form.price).replace(/[^0-9]/g, '')) : null,
        oldPrice: form.oldPrice ? Number(String(form.oldPrice).replace(/[^0-9]/g, '')) : null,
        stock: form.stock !== '' ? Number(form.stock) : null,
        images: imageUrls
      };
      
      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await addProduct(productData);
      }
      
      handleCloseModal();
      loadProducts();
    } catch (e) {
      alert('Error guardando el producto');
      console.error(e);
    }
    setSaving(false);
  };
  
  const handleDelete = async (id, images) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        // Delete images first if any
        if (images && images.length > 0) {
          for (const url of images) {
            await deleteImage(url).catch(console.error);
          }
        }
        await deleteProduct(id);
        loadProducts();
      } catch(e) {
        alert('Error eliminando producto');
      }
    }
  };
  
  const handleDuplicate = async (product) => {
    if (window.confirm('¿Duplicar este producto?')) {
      try {
        await duplicateProduct(product);
        loadProducts();
      } catch(e) {
        alert('Error duplicando producto');
      }
    }
  };
  
  const handleToggleAvail = async (id, avail) => {
    try {
      await toggleAvailability(id, !avail);
      loadProducts();
    } catch(e) {
      alert('Error actualizando disponibilidad');
    }
  };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar__title">Productos</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>
      
      <div className="admin-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__icon" style={{background: 'var(--rose-50)', color: 'var(--primary)'}}>
              <Package size={20} />
            </div>
            <div className="stat-card__value">{products.length}</div>
            <div className="stat-card__label">Total Productos</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon" style={{background: '#dcfce7', color: '#16a34a'}}>
              <Package size={20} />
            </div>
            <div className="stat-card__value">{products.filter(p => p.available !== false).length}</div>
            <div className="stat-card__label">Activos</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon" style={{background: '#fef3c7', color: '#d97706'}}>
              <Package size={20} />
            </div>
            <div className="stat-card__value">{products.filter(p => p.available === false || p.stock === 0).length}</div>
            <div className="stat-card__label">Agotados</div>
          </div>
        </div>
        
        {/* Table */}
        <div className="admin-table-wrap">
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
            <div className="search-input-wrap" style={{ flex: 1, maxWidth: '400px' }}>
              <Search size={16} />
              <input 
                type="text" className="search-input" placeholder="Buscar productos..." 
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: '0.5rem 1rem 0.5rem 2.5rem' }}
              />
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Img</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th style={{ width: '120px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No hay productos.</td></tr>
                ) : filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="admin-table__img" />
                      ) : (
                        <div className="admin-table__img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💄</div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{p.brand}</div>
                    </td>
                    <td>{p.category}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(p.price)}</td>
                    <td>
                      <label className="toggle-switch" title="Disponibilidad">
                        <input 
                          type="checkbox" 
                          checked={p.available !== false}
                          onChange={() => handleToggleAvail(p.id, p.available !== false)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="action-btn edit" onClick={() => handleOpenModal(p)} title="Editar"><Edit2 size={16}/></button>
                        <button className="action-btn duplicate" onClick={() => handleDuplicate(p)} title="Duplicar"><Copy size={16}/></button>
                        <button className="action-btn delete" onClick={() => handleDelete(p.id, p.images)} title="Eliminar"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="cart-close" onClick={handleCloseModal}><X size={20}/></button>
            </div>
            
            <div className="modal-body">
              <form id="product-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Nombre *</label>
                    <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Marca *</label>
                    <input className="form-input" name="brand" value={form.brand} onChange={handleChange} required />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Categoría</label>
                    <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                      {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Precio ($)</label>
                    <input className="form-input" type="text" inputMode="numeric" name="price" value={form.price} onChange={handlePriceChange} placeholder="Ej: 34900" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Precio Anterior</label>
                    <input className="form-input" type="text" inputMode="numeric" name="oldPrice" value={form.oldPrice} onChange={handlePriceChange} placeholder="Ej: 45000" />
                  </div>
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Descripción</label>
                  <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} rows="3" />
                </div>
                
                <div>
                  <label className="form-label">Tonos / Variantes</label>
                  <div className="shade-tags" style={{ marginTop: '0.5rem' }}>
                    {form.shades.map(s => (
                      <span key={s} className="shade-tag">
                        {s} <button type="button" onClick={() => handleRemoveShade(s)}><X size={14}/></button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input 
                      type="text" className="form-input" placeholder="Ej: Vainilla" 
                      value={shadeInput} onChange={e => setShadeInput(e.target.value)}
                      onKeyDown={e => { if(e.key === 'Enter'){ e.preventDefault(); handleAddShade(); } }}
                    />
                    <button type="button" className="btn btn-outline" onClick={handleAddShade}>Agregar</button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', background: 'var(--bg-soft)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input type="checkbox" name="available" checked={form.available} onChange={handleChange} /> Disponible
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input type="checkbox" name="isOffer" checked={form.isOffer} onChange={handleChange} /> Es Oferta
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} /> Es Nuevo
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Destacado
                  </label>
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Imágenes</label>
                  <label className="image-upload-zone">
                    <ImageIcon size={32} color="var(--gray-400)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Haz clic para subir imágenes</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPG, PNG. Max 2MB.</div>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                  </label>
                  
                  <div className="image-previews">
                    {/* Existing Images */}
                    {form.images.map((url, i) => (
                      <div key={url} className={`image-preview ${i === 0 ? 'main-image' : ''}`}>
                        <img src={url} alt="" />
                        <div className="image-preview__actions">
                          <button type="button" className="img-action-btn delete" onClick={() => handleRemoveExistingImage(url)}><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                    {/* New local files */}
                    {imageFiles.map((file, i) => (
                      <div key={i} className="image-preview" style={{ opacity: 0.7 }}>
                        <img src={URL.createObjectURL(file)} alt="" />
                        <div className="image-preview__actions">
                          <button type="button" className="img-action-btn delete" onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))}><X size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={handleCloseModal} disabled={saving}>Cancelar</button>
              <button type="submit" form="product-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
