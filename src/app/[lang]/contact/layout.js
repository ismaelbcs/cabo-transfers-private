// src/app/[lang]/contact/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/contact',
      title: "Contacto y Soporte | Ballard Tours Los Cabos",
      description: "Contáctanos por WhatsApp, teléfono o correo electrónico para resolver dudas y cotizar transportación privada en Los Cabos."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/contact',
    title: "Contact & Customer Support | Ballard Tours Los Cabos",
    description: "Contact us via WhatsApp, phone, or email for inquiries, custom bookings, and 24/7 customer support in Los Cabos."
  });
}

export default function Layout({ children }) {
  return children;
}
