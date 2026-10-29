// src/app/[lang]/terms-and-conditions/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/terms-and-conditions',
      title: "Términos y Condiciones | Ballard Tours Los Cabos",
      description: "Consulta los términos y condiciones de servicio de reservación y transporte privado de Ballard Tours."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/terms-and-conditions',
    title: "Terms and Conditions | Ballard Tours Los Cabos",
    description: "Review terms and conditions for private transportation and tour bookings with Ballard Tours in Los Cabos."
  });
}

export default function Layout({ children }) {
  return children;
}
