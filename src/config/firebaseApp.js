import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './firebase';

// Only initialize if we have an API key, otherwise app will crash
let app = null;
let auth = null;
let db = null;
let storage = null;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    console.warn("Firebase no está configurado. Faltan variables de entorno.");
  }
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
}

export { app, auth, db, storage };
export default app;
