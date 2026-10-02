import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseApp';
import { getStoreConfig, DEFAULT_STORE_CONFIG } from '../services/storeService';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialProducts';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeConfig, setStoreConfig] = useState(DEFAULT_STORE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time products listener
  useEffect(() => {
    if (!db) {
      // Fallback a los datos locales si no hay Firebase configurado
      setProducts(INITIAL_PRODUCTS.map((p, i) => ({ id: `local_${i}`, ...p })));
      setCategories(INITIAL_CATEGORIES);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let prods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          
          // Si la base de datos está vacía, mostramos los productos por defecto para que no se vea vacío
          if (prods.length === 0) {
            prods = INITIAL_PRODUCTS.map((p, i) => ({ id: `local_${i}`, ...p }));
          }

          setProducts(prods);
          
          // Extract unique categories from products
          const cats = [...new Set(prods.map((p) => p.category).filter(Boolean))];
          setCategories(cats);
          setLoading(false);
        },
        (err) => {
          console.error('Error listening to products:', err);
          setError(err.message);
          setLoading(false);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.error('Error in onSnapshot:', e);
      setLoading(false);
    }
  }, []);

  // Load store config
  useEffect(() => {
    getStoreConfig().then(setStoreConfig).catch(console.error);
  }, []);

  const refreshConfig = useCallback(() => {
    getStoreConfig().then(setStoreConfig).catch(console.error);
  }, []);

  // Filter helpers
  const featuredProducts = products.filter((p) => p.isFeatured && p.available !== false);
  const newProducts = products.filter((p) => p.isNew);
  const offerProducts = products.filter((p) => p.isOffer);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        storeConfig,
        loading,
        error,
        featuredProducts,
        newProducts,
        offerProducts,
        refreshConfig,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
