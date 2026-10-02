// ============================================================
// Storage Service — Cloudinary (gratis, sin tarjeta de crédito)
// Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en .env
// ============================================================

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Sube un archivo de imagen a Cloudinary y devuelve la URL pública.
 */
export const uploadImage = async (file, folder = 'products') => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary no está configurado. Revisa el .env (VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET).');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', `shalito-cosmetics/${folder}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Error subiendo imagen a Cloudinary');
  }

  const data = await response.json();
  return data.secure_url; // URL pública de la imagen
};

/**
 * Sube la imagen de portada de un producto.
 */
export const uploadProductImage = async (productId, file) => {
  const url = await uploadImage(file, `products/${productId}`);
  return { url, path: url }; // Cloudinary no usa "paths" como Firebase
};

/**
 * Sube el logo de la tienda.
 */
export const uploadLogo = async (file) => {
  return uploadImage(file, 'config');
};

/**
 * Eliminar imagen — Cloudinary requiere backend para borrar de forma segura.
 * En modo gratuito simplemente omitimos el borrado del servidor;
 * la imagen deja de usarse en la app aunque quede en Cloudinary.
 */
export const deleteImage = async (url) => {
  // No se puede borrar de Cloudinary sin backend (clave secreta).
  // Las imágenes huérfanas no afectan el funcionamiento de la tienda.
  console.info('deleteImage: imagen removida de la app (no eliminada de Cloudinary):', url);
};

export const deleteProductImage = deleteImage;

