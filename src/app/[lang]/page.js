// src/app/[lang]/page.js
import HomePageClient from './HomePageClient';
import { generatePageMetadata } from '../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '',
      title: 'Cabo Airport Shuttle & Transporte Privado | Ballard Tours',
      description: 'Evita las filas de taxi en el Aeropuerto SJD. Reserva tu transporte privado seguro y directo a tu hotel en Cabo San Lucas y San José del Cabo.',
      keywords: [
        'taxi aeropuerto los cabos',
        'transporte privado cabo',
        'shuttle los cabos',
        'cabo airport shuttle',
        'ballard tours'
      ],
      image: '/private-transportation-nobu-hotel-los-cabos.webp'
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '',
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
    image: '/private-transportation-nobu-hotel-los-cabos.webp'
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  return <HomePageClient lang={lang} />;
}