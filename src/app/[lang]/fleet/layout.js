// src/app/[lang]/fleet/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/fleet',
      title: "Nuestra Flota de Vehículos de Lujo | Ballard Tours Los Cabos",
      description: "Conoce nuestra flota de camionetas Suburban de lujo y vans Sprinter con choferes certificados para tu traslado en Los Cabos."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/fleet',
    title: "Our Luxury Fleet | Ballard Tours Los Cabos",
    description: "Explore our fleet of luxury Suburbans and passenger Sprinter vans with certified drivers for your Los Cabos transfer."
  });
}

export default function Layout({ children }) {
  return children;
}
