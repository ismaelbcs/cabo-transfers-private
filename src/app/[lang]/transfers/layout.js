// src/app/[lang]/transfers/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/transfers',
      title: "Traslados Entre Hoteles y Zonas en Los Cabos | Ballard Tours",
      description: "Servicio de transporte privado entre hoteles, restaurantes y actividades en San José del Cabo, Corredor Turístico y Cabo San Lucas."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/transfers',
    title: "Hotel-to-Hotel & Area Transfers in Los Cabos | Ballard Tours",
    description: "Private inter-hotel and area transfers between San Jose del Cabo, Tourist Corridor, and Cabo San Lucas."
  });
}

export default function Layout({ children }) {
  return children;
}
