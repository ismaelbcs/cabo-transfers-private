// src/app/[lang]/layout.js
import '../globals.css';
import { dict } from '../../locales/dict';
import { CartProvider } from '../../context/CartContext';
import { BookingProvider } from '../../context/BookingContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import CartDrawer from '../../components/CartDrawer';
import AuthAndPromoManager from '../../components/AuthAndPromoManager';
import { Toaster } from 'sonner';
import React, { use } from 'react';

// 🔥 Metadatos base globales (sin canónicos forzados para permitir que cada página defina su propia URL)
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  const domain = 'https://www.caboprivateairporttransfers.com';
  const ogImage = `${domain}/private-transportation-nobu-hotel-los-cabos.webp`;

  const iconsConfig = {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  };

  if (lang === 'es') {
    return {
      metadataBase: new URL(domain),
      title: {
        default: 'Cabo Airport Shuttle & Transporte Privado | Ballard Tours',
        template: '%s | Ballard Tours Los Cabos'
      },
      description: 'Evita las filas de taxi en el Aeropuerto SJD. Reserva tu transporte privado seguro y directo a tu hotel en Cabo San Lucas y San José del Cabo.',
      icons: iconsConfig,
      openGraph: {
        siteName: 'Ballard Tours',
        locale: 'es_MX',
        type: 'website',
      }
    };
  }

  return {
    metadataBase: new URL(domain),
    title: {
      default: 'Cabo Airport Private Transportation & Shuttle | Ballard Tours',
      template: '%s | Ballard Tours Cabo'
    },
    description: 'Skip the taxi lines. Book your reliable Cabo airport shuttle, private transportation, and luxury transfers from SJD Airport to your resort.',
    icons: iconsConfig,
    openGraph: {
      siteName: 'Ballard Tours Cabo',
      locale: 'en_US',
      type: 'website',
    }
  };
}

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

            <WhatsAppButton lang={lang} />

          </CartProvider>
        </BookingProvider>
      </body>
    </html>
  );
}