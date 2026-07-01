// src/context/CartContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [combo, setCombo] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // Para evitar problemas de hidratación en Next.js

  // 1. Al cargar la página, buscamos si ya había un carrito guardado
  useEffect(() => {
    const savedCart = localStorage.getItem('cabo_cart_items');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const validItems = Array.isArray(parsedCart) ? parsedCart.filter(i => i && i.titulo) : [];
        setCombo(validItems);
      } catch (error) {
        console.error("Error leyendo el carrito:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Cada vez que el carrito cambie (agregues o elimines algo), lo guardamos
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cabo_cart_items', JSON.stringify(combo));
    }
  }, [combo, isLoaded]);

  const agregarAlCombo = (item) => {
    if (!item || !item.titulo) return;
    setCombo((prev) => [...prev, item]);
  };

  const eliminarDelCombo = (id) => {
    setCombo((prev) => prev.filter(item => item.id !== id));
  };

  const vaciarCombo = () => {
    setCombo([]);
    localStorage.removeItem('cabo_cart_items');
  };

  return (
    <CartContext.Provider value={{ combo, agregarAlCombo, eliminarDelCombo, vaciarCombo, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);