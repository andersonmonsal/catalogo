import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseApp';

const STORE_CONFIG_DOC = 'config/store';

export const DEFAULT_STORE_CONFIG = {
  name: 'Shalito Cosmetics',
  slogan: 'Tu belleza, tu estilo.',
  logo: '',
  whatsapp: '573027548207',
  facebook: '',
  tiktok: 'shalito_cosmetics',
  description: 'Tienda de maquillaje y cosmética en Medellín.',
  heroImage: '',
  schedule: 'Lunes a Sábado: 9am - 6pm',
};

export const getStoreConfig = async () => {
  try {
    if (!db) {
      return DEFAULT_STORE_CONFIG;
    }
    const docRef = doc(db, 'config', 'store');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_STORE_CONFIG, ...docSnap.data() };
    }
    return DEFAULT_STORE_CONFIG;
  } catch (error) {
    console.error('Error getting store config:', error);
    return DEFAULT_STORE_CONFIG;
  }
};

export const updateStoreConfig = async (data) => {
  try {
    const docRef = doc(db, 'config', 'store');
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating store config:', error);
    throw error;
  }
};
