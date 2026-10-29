// src/app/[lang]/politicas-de-cancelacion/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/politicas-de-cancelacion',
      title: "Políticas de Cancelación | Ballard Tours Los Cabos",
      description: "Conoce nuestras políticas claras y flexibles de cambios y cancelación para servicios de transporte y tours."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/politicas-de-cancelacion',
    title: "Cancellation Policies | Ballard Tours Los Cabos",
    description: "Review our clear and flexible cancellation and refund policies for Los Cabos transfers and tours."
  });
}

export default function Layout({ children }) {
  return children;
}
