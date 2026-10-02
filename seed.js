import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { INITIAL_PRODUCTS } from './src/data/initialProducts.js';

const firebaseConfig = {
  apiKey: "AIzaSyCRw9FRj3yztGz41lxv5aCYsWprSnaZH-0",
  authDomain: "shalito-cosmetics.firebaseapp.com",
  projectId: "shalito-cosmetics",
  storageBucket: "shalito-cosmetics.firebasestorage.app",
  messagingSenderId: "1081029440068",
  appId: "1:1081029440068:web:5d3bbde485e340ba030211"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('Empezando a subir productos a la base de datos real...');
  const prods = collection(db, 'products');
  
  for (const p of INITIAL_PRODUCTS) {
    try {
      await addDoc(prods, {
        ...p,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('✅ Subido:', p.name);
    } catch (e) {
      console.error('Error subiendo', p.name, e);
    }
  }
  console.log('¡Todos los productos han sido subidos exitosamente!');
  process.exit(0);
}

seed();
