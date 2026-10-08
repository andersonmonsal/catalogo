import React, { createContext, useContext, useState, useEffect } from 'react';
import { WHATSAPP_NUMBER } from '../config/firebase';
import { formatPrice } from '../services/productService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shalito_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('shalito_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, selectedShade = null, quantity = 1) => {
    setItems((prev) => {
      const key = `${product.id}_${selectedShade}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.images?.[0] || '',
          shade: selectedShade,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) {
      removeItem(key);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const sendWhatsApp = (whatsappNumber) => {
    const number = whatsappNumber || WHATSAPP_NUMBER;
    if (!number || number === '573000000000') {
      alert('El número de WhatsApp no está configurado. Configúralo en el Panel de Administrador > Configuración.');
      return;
    }

    let message = `¡Hola! 💕 Quisiera hacer el siguiente pedido:\n\n`;
    message += `🛍️ *PRODUCTOS SELECCIONADOS:*\n`;
    message += `─────────────────────\n`;

    items.forEach((item, index) => {
      message += `\n${index + 1}. 💄 *${item.name}*`;
      if (item.brand) message += `\n   📌 Marca: ${item.brand}`;
      if (item.shade) message += `\n   🎨 Tono: *${item.shade}*`;
      message += `\n   🔢 Cantidad: ${item.quantity}`;
      message += `\n   💲 Precio: ${formatPrice(item.price)} c/u`;
      if (item.quantity > 1) {
        message += `\n   💵 Subtotal: ${formatPrice(item.price * item.quantity)}`;
      }
      message += `\n`;
    });

    message += `\n─────────────────────\n`;
    message += `💰 *TOTAL A PAGAR: ${formatPrice(total)}*\n`;
    message += `─────────────────────\n\n`;
    message += `¡Quedo atenta a la confirmación! 🙏✨`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = number.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        sendWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
