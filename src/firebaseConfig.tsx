// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBjNzgijeFDjWGnxZV30ZGechBDcI3MILk",
  authDomain: "fir-authapp-878b1.firebaseapp.com",
  projectId: "fir-authapp-878b1",
  storageBucket: "fir-authapp-878b1.appspot.com",
  messagingSenderId: "528242881979",
  appId: "1:528242881979:android:a58865795ba72b6f95809e"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Exportar autenticação
export const auth = getAuth(app);

