// src/app/[lang]/golf/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/golf',
      title: "Traslados a Campos de Golf en Los Cabos | Ballard Tours",
      description: "Transporte privado con espacio para palos de golf a los mejores campos de golf de Los Cabos con servicio de ida y vuelta puntual."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/golf',
    title: "Cabo Golf Course Transportation | Ballard Tours",
    description: "Private golf transfers with ample club space to premier championship golf courses throughout Los Cabos."
  });
}

export default function Layout({ children }) {
  return children;
}
