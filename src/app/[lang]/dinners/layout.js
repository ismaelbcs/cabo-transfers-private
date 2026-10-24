// src/app/[lang]/dinners/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/dinners',
      title: "Transporte Privado para Cenas en Los Cabos | Ballard Tours",
      description: "Disfruta de una cena inolvidable sin preocuparte por taxis ni estacionamiento con nuestro transporte privado de ida y vuelta en Los Cabos."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/dinners',
    title: "Private Dinner Transportation in Los Cabos | Ballard Tours",
    description: "Enjoy a worry-free culinary evening in Los Cabos with round-trip private chauffeur service to top restaurants."
  });
}

export default function Layout({ children }) {
  return children;
}
