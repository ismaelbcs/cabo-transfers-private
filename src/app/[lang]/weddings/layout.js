// src/app/[lang]/weddings/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/weddings',
      title: "Transporte para Bodas y Eventos en Los Cabos | Ballard Tours",
      description: "Logística y transportación de lujo para bodas, grupos y eventos especiales en Los Cabos con camionetas y vans de primer nivel."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/weddings',
    title: "Wedding & Event Transportation in Los Cabos | Ballard Tours",
    description: "Luxury wedding and group transportation in Los Cabos. Reliable shuttle logistics for wedding guests, VIPs, and events."
  });
}

export default function Layout({ children }) {
  return children;
}
