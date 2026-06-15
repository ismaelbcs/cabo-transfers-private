// src/app/[lang]/layout.js
import '../globals.css'; // Actualizamos la ruta del CSS
import { dict } from '../../locales/dict';
import { CartProvider } from '../../context/CartContext';
import { BookingProvider } from '../../context/BookingContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartDrawer from '../../components/CartDrawer';
import AuthAndPromoManager from '../../components/AuthAndPromoManager'; // <-- REEMPLAZO UNIFICADO
import { Toaster } from 'sonner';
import React, { use } from 'react';

export const metadata = {
  title: 'Cabo Airport Shuttle & Private Transfers | Ballard Tours',
  description: 'Top-rated Cabo Airport Shuttle and private transportation. Reliable SJD airport taxi, luxury resort transfers, and private tours in Los Cabos. Book online!',
  keywords: [
    'Cabo Airport Shuttle',
    'Airport taxi Cabo',
    'SJD Airport Transfers',
    'Cabo transportation',
    'Private shuttle Los Cabos',
    'Cabo San Lucas airport shuttle',
    'Cabo private tours'
  ],
  alternates: {
    canonical: 'https://www.ballardtours.com', // Cambia esto por tu dominio real
  },
  openGraph: {
    title: 'Premium Cabo Airport Shuttle & Private Tours',
    description: 'Reliable, safe, and private transportation from SJD Airport to your resort.',
    type: 'website',
  }
};

export default function RootLayout({ children, params }) {
  // 🔥 DESEMPAQUETAMOS LA PROMESA DE LOS PARÁMETROS PARA NEXT.JS 15
  const resolvedParams = use(params);
  const lang = resolvedParams.lang || 'en';
  
  // Cargamos el diccionario, si no encuentra la traducción, usa inglés por defecto
  const t = dict[lang] || dict['en'];

  return (
    <html lang={lang}>
      <body className="bg-slate-50 text-slate-800 antialiased">
        <BookingProvider>
          <CartProvider t={t}>

            <Navbar t={t} lang={lang} cartCount={0} />
            <CartDrawer lang={lang} />

            {/* ✨ COMPONENTE DE AUTENTICACIÓN Y PROMOCIONES UNIFICADO ✨ */}
            <AuthAndPromoManager lang={lang} />

            <main className="min-h-screen">
              {children}
            </main>

            <Footer t={t} lang={lang} />
            <Toaster richColors position="bottom-right" />

          </CartProvider>
        </BookingProvider>
      </body>
    </html>
  );
}