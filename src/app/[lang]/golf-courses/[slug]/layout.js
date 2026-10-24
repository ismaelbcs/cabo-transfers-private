// src/app/[lang]/golf-courses/[slug]/layout.js
import { golfSEOData } from '../../../../data/golfSEOData.js';
import { generatePageMetadata } from '../../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';

  const course = golfSEOData.find(g => g.slug === slug);
  const courseName = course?.nombre || slug.replace(/-/g, ' ');
  const zona = course?.zonaText || 'Los Cabos';
  const isEs = lang === 'es';

  const title = isEs
    ? `Transporte Privado a Campo de Golf ${courseName} (${zona}) | Traslados Los Cabos`
    : `Private Transportation to ${courseName} (${zona}) | Cabo Golf Transfers`;

  const description = isEs
    ? `Reserva transporte privado y de lujo a ${courseName} en ${zona}. Camionetas con amplio espacio para bolsas de golf, chofer puntual y traslados ida y vuelta.`
    : `Book luxury private golf transfers from your hotel or SJD Airport to ${courseName} in ${zona}. Spacious SUVs/vans for golf bags and reliable round-trip service.`;

  const keywords = isEs
    ? [
        `transporte golf ${courseName}`,
        `traslado a ${courseName}`,
        'transporte campos de golf cabo',
        'cabo golf transfers',
        'ballard tours'
      ]
    : [
        `private golf transfer to ${courseName}`,
        `transportation to ${courseName} cabo`,
        'cabo golf shuttle',
        'cabo golf transfers',
        'ballard tours'
      ];

  const image = course?.imageHero ? `/${course.imageHero}` : '/suburban-airport-los-cabos-ballard.webp';

  return generatePageMetadata({
    lang,
    path: `/golf-courses/${slug}`,
    title,
    description,
    keywords,
    image
  });
}

export default function GolfCourseLayout({ children }) {
  return children;
}
