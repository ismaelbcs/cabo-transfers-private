// src/app/[lang]/destinations/[slug]/layout.js
import { landingPagesSEO } from '../../../../data/seoData.js';
import { generatePageMetadata } from '../../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';

  const hotel = landingPagesSEO.find(h => h.slug === slug);

  const cleanName = hotel?.nombre || slug.replace('sjd-to-', '').replace(/-/g, ' ');
  const zona = hotel?.zonaText || 'Los Cabos';
  const isEs = lang === 'es';

  const title = isEs
    ? `Transporte Privado a ${cleanName} (${zona}) | Shuttle Aeropuerto Los Cabos SJD`
    : `Private Transportation to ${cleanName} (${zona}) | SJD Airport Shuttle`;

  const description = isEs
    ? `Reserva tu traslado privado y seguro desde el Aeropuerto de Los Cabos (SJD) a ${cleanName} en ${zona}. Sin filas de taxi, chofer bilingüe, monitoreo de vuelos y tarifas fijas directas.`
    : `Book reliable private airport transportation from Los Cabos SJD Airport to ${cleanName} in ${zona}. Direct door-to-door shuttle, bilingual drivers, flight tracking, and no taxi lines.`;

  const keywords = isEs
    ? [
        `transporte a ${cleanName}`,
        `shuttle aeropuerto ${cleanName}`,
        `taxi aeropuerto a ${cleanName}`,
        `traslado privado ${cleanName} cabo`,
        'transporte aeropuerto los cabos',
        'ballard tours'
      ]
    : [
        `private transportation to ${cleanName}`,
        `SJD airport shuttle to ${cleanName}`,
        `taxi from cabo airport to ${cleanName}`,
        `cabo airport transfers ${cleanName}`,
        'los cabos airport transportation',
        'ballard tours'
      ];

  const image = hotel?.image ? `/${hotel.image}` : '/suburban-airport-los-cabos-ballard.webp';

  return generatePageMetadata({
    lang,
    path: `/destinations/${slug}`,
    title,
    description,
    keywords,
    image
  });
}

export default function DestinationLayout({ children }) {
  return children;
}
