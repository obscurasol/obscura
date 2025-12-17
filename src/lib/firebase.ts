import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, remove, push, update, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDpm0eKyxei2vUJBp4YhbqgxbIuSNyQFNg",
  authDomain: "obscura-54708.firebaseapp.com",
  databaseURL: "https://obscura-54708-default-rtdb.firebaseio.com",
  projectId: "obscura-54708",
  storageBucket: "obscura-54708.firebasestorage.app",
  messagingSenderId: "72670101326",
  appId: "1:72670101326:web:ec6047688834d5714e681f",
  measurementId: "G-B34QRB2XTZ"
};

// Only initialize on client side
let app: FirebaseApp | undefined;
let database: Database | undefined;

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  database = getDatabase(app);
}

export { database, ref, set, get, onValue, remove, push, update };
