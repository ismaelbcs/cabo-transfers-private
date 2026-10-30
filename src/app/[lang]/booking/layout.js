// src/app/[lang]/booking/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/booking',
      title: 'Reservar Transporte Privado en Los Cabos (SJD) | Cotizador Oficial',
      description: 'Reserva en línea tu traslado privado desde el Aeropuerto Internacional de Los Cabos (SJD) a tu hotel o villa. Tarifas fijas, confirmación inmediata y sin filas de taxi.',
      keywords: [
        'reservar transporte aeropuerto los cabos',
        'cotizar traslado privado sjd',
        'booking cabo airport shuttle',
        'reservas ballard tours'
      ]
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/booking',
    title: 'Book Private Cabo Airport Transportation (SJD) | Instant Online Quote',
    description: 'Book your private airport transfer from Los Cabos International Airport (SJD) directly to your resort or villa. Flat rates, flight tracking, and instant confirmation.',
    keywords: [
      'book cabo airport transportation',
      'sjd airport shuttle booking',
      'reserve private transfer los cabos',
      'ballard tours booking'
    ]
  });
}

export default function BookingLayout({ children }) {
  return children;
}

