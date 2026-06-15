// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx6qoFqOmunIEgn7YomDdy80Pnquvh6AY",
  authDomain: "ballardtours.firebaseapp.com",
  databaseURL: "https://ballardtours-default-rtdb.firebaseio.com",
  projectId: "ballardtours",
  storageBucket: "ballardtours.firebasestorage.app",
  messagingSenderId: "895636049481",
  appId: "1:895636049481:web:ede542e568698d398af998",
  measurementId: "G-NFVGKZWR4T"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
// Inicializamos Firestore y lo exportamos
export const db = getFirestore(app);