// src/app/[lang]/clear-boat/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/clear-boat',
      title: "Tour en Bote 100% Transparente al Arco de Cabo San Lucas | Ballard Tours",
      description: "Vive una experiencia única explorando el Arco de Cabo San Lucas, Playa del Amor y la vida marina en un bote totalmente transparente."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/clear-boat',
    title: "100% Clear Boat Tour to Cabo San Lucas Arch | Ballard Tours",
    description: "Discover the iconic Cabo San Lucas Arch, Lovers Beach, and marine sanctuary through an all-clear glass boat."
  });
}

export default function Layout({ children }) {
  return children;
}
