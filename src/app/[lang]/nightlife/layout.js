// src/app/[lang]/nightlife/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/nightlife',
      title: "Transporte Nocturno y Vida Nocturna en Cabo San Lucas | Ballard Tours",
      description: "Diviértete en los mejores bares y clubes de Cabo San Lucas con transporte privado seguro y puntual toda la noche."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/nightlife',
    title: "Cabo Nightlife Private Transportation | Ballard Tours",
    description: "Experience Cabo San Lucas nightlife safely with dedicated private round-trip transportation to top clubs and bars."
  });
}

export default function Layout({ children }) {
  return children;
}
