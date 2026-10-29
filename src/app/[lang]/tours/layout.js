// src/app/[lang]/tours/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/tours',
      title: "Tours y Excursiones en Los Cabos | Ballard Tours",
      description: "Reserva paseos en camello, paseos en ATVs, snorkel, nado con tiburón ballena y el famoso bote transparente al arco en Los Cabos."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/tours',
    title: "Top Los Cabos Tours & Excursions | Ballard Tours",
    description: "Book camel rides, ATV desert tours, snorkeling adventures, whale shark swims, and clear boat tours to the Cabo Arch."
  });
}

export default function Layout({ children }) {
  return children;
}
