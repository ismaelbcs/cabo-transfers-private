// src/app/[lang]/golf-courses/[slug]/layout.js
import { golfSEOData } from '../../../../data/golfSEOData.js';
import { generatePageMetadata, BASE_URL } from '../../../../lib/seoHelper.js';

export async function generateStaticParams() {
  const langs = ['en', 'es'];
  return langs.flatMap(lang => golfSEOData.map(g => ({ lang, slug: g.slug })));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';

  const course = golfSEOData.find(g => g.slug === slug);
  const courseName = course?.nombre || slug.replace(/-/g, ' ');
  const zona = course?.zonaText || 'Los Cabos';
  const isEs = lang === 'es';

  const title = isEs
    ? `Transporte Privado a Campo de Golf ${courseName} (${zona}) | Traslado Redondo`
    : `Private Golf Transfer to ${courseName} (${zona}) | Round-Trip Cabo Golf Shuttle`;

  const description = isEs
    ? `Reserva transporte privado redondo a ${courseName} en ${zona} desde $160 USD. SUVs y Sprinters con amplio espacio para bolsas de golf y hasta 4 horas de espera incluida.`
    : `Book luxury private round-trip golf transfers to ${courseName} in ${zona} from $160 USD. Spacious SUVs and vans for golf bags with up to 4 hours of wait time included.`;

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

export default async function GolfCourseLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';
  const isEs = lang === 'es';
  const course = golfSEOData.find(g => g.slug === slug);
  const courseName = course?.nombre || slug.replace(/-/g, ' ');
  const zona = course?.zonaText || 'Los Cabos';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isEs ? 'Inicio' : 'Home',
            item: `${BASE_URL}/${lang}`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isEs ? 'Transporte de Golf' : 'Golf Transfers',
            item: `${BASE_URL}/${lang}/golf`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: courseName,
            item: `${BASE_URL}/${lang}/golf-courses/${slug}`
          }
        ]
      },
      {
        '@type': 'Service',
        name: isEs
          ? `Transporte Privado de Golf a ${courseName} (${zona})`
          : `Private Round-Trip Golf Transfer to ${courseName} (${zona})`,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Ballard Tours',
          url: `${BASE_URL}/${lang}`
        },
        areaServed: `${zona}, Los Cabos, Baja California Sur`,
        url: `${BASE_URL}/${lang}/golf-courses/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
