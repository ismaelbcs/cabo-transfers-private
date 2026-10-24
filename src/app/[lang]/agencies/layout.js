// src/app/[lang]/agencies/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/agencies',
      title: "Portal para Agencias de Viajes | Ballard Tours Los Cabos",
      description: "Únete a nuestro programa de socios para agencias de viajes y comisiona con transporte privado de alta calidad en Los Cabos."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/agencies',
    title: "Travel Agencies & Partners Portal | Ballard Tours Los Cabos",
    description: "Partner with Ballard Tours for travel agency commissions and premium private transportation services in Los Cabos."
  });
}

export default function Layout({ children }) {
  return children;
}
