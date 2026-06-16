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

// 🔥 Función dinámica de Metadata (Reemplaza al bloque estático)
export async function generateMetadata({ params }) {
  // En Next.js 15 los params son una promesa en generateMetadata
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  const domain = 'https://www.caboprivateairporttransfers.com';
  // Usamos una de tus imágenes reales para la vista previa de WhatsApp/Redes
  const ogImage = `${domain}/suburban-airport-los-cabos-ballard.webp`;

  if (lang === 'es') {
    return {
      title: 'Cabo Airport Shuttle & Transporte Privado | Ballard Tours',
      description: 'Evita las filas de taxi en el Aeropuerto SJD. Reserva tu transporte privado seguro y directo a tu hotel en Cabo San Lucas y San José del Cabo.',
      keywords: [
        'taxi aeropuerto los cabos',
        'transporte privado cabo',
        'shuttle los cabos',
        'cabo airport shuttle', // Mantenemos el keyword en inglés para SEO general
        'ballard tours'
      ],
      alternates: { canonical: `${domain}/es` },
      openGraph: {
        title: 'Transporte Privado y Shuttle en Los Cabos',
        description: 'Reserva tu transporte privado seguro y directo desde el Aeropuerto SJD a tu hotel.',
        url: `${domain}/es`,
        siteName: 'Ballard Tours',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: 'Luxury Suburban Airport Los Cabos',
          }
        ],
        locale: 'es_MX',
        type: 'website',
      }
    };
  }

  // 🔥 PRIORIDAD AL INGLÉS (Por defecto)
  return {
    title: 'Cabo Airport Private Transportation & Shuttle | Ballard Tours',
    description: 'Skip the taxi lines. Book your reliable Cabo airport shuttle, private transportation, and luxury transfers from SJD Airport to your resort.',
    keywords: [
      'Cabo airport private transportation',
      'cabo airport shuttle',
      'private transportation cabo',
      'taxi airport los cabos',
      'SJD airport transfers',
      'Ballard Tours'
    ],
    alternates: { canonical: `${domain}/en` },
    openGraph: {
      title: 'Cabo Airport Private Transportation & Shuttle',
      description: 'Skip the lines with our reliable Cabo airport shuttle and private transportation from SJD Airport to your resort.',
      url: `${domain}/en`,
      siteName: 'Ballard Tours Cabo',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Cabo Airport Private Transportation',
        }
      ],
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