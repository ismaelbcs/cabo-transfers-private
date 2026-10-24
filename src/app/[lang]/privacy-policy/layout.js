// src/app/[lang]/privacy-policy/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/privacy-policy',
      title: "Aviso de Privacidad | Ballard Tours Los Cabos",
      description: "Información sobre cómo protegemos y gestionamos tus datos personales al reservar en Ballard Tours."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/privacy-policy',
    title: "Privacy Policy | Ballard Tours Los Cabos",
    description: "Information on how Ballard Tours protects and manages your personal data and reservation information."
  });
}

export default function Layout({ children }) {
  return children;
}
