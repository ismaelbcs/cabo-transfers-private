// src/app/[lang]/tours/[slug]/layout.js
import { toursLandingPages } from '../../../../data/seoData.js';
import { generatePageMetadata } from '../../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';

  const tour = toursLandingPages.find(t => t.slug === slug);
  const tourName = tour?.nombre || slug.replace(/-/g, ' ');
  const isEs = lang === 'es';

  const title = isEs
    ? `${tourName} | Tours y Actividades en Los Cabos | Ballard Tours`
    : `${tourName} | Top Los Cabos Tours & Activities | Ballard Tours`;

  const description = isEs
    ? `${tour?.desc || tour?.detalle || 'Vive los mejores tours y actividades en Los Cabos con transporte privado seguro incluido.'}`
    : `${tour?.desc || tour?.detalle || 'Experience the premier excursions and adventure tours in Los Cabos with round-trip private transportation.'}`;

  const keywords = isEs
    ? [
        `tour ${tourName}`,
        'actividades en los cabos',
        'excursiones los cabos',
        'tours cabo san lucas',
        'ballard tours'
      ]
    : [
        `${tourName} cabo`,
        'best tours in los cabos',
        'cabo excursions',
        'cabo activities',
        'ballard tours'
      ];

  const image = tour?.imageUrl || '/suburban-airport-los-cabos-ballard.webp';

  return generatePageMetadata({
    lang,
    path: `/tours/${slug}`,
    title,
    description,
    keywords,
    image
  });
}

export default function TourLayout({ children }) {
  return children;
}
