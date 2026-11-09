// src/app/[lang]/tours/[slug]/layout.js
import { toursLandingPages } from '../../../../data/seoData.js';
import { generatePageMetadata, BASE_URL } from '../../../../lib/seoHelper.js';

export async function generateStaticParams() {
  const langs = ['en', 'es'];
  return langs.flatMap(lang => toursLandingPages.map(t => ({ lang, slug: t.slug })));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';

  const tour = toursLandingPages.find(t => t.slug === slug);
  const tourName = tour?.nombre || slug.replace(/-/g, ' ');
  const precio = tour?.precio || '100';
  const isEs = lang === 'es';

  const title = isEs
    ? `Tour ${tourName} en Los Cabos desde $${precio} USD | Transporte Incluido | Ballard Tours`
    : `${tourName} in Los Cabos from $${precio} USD | Private Transport Included | Ballard Tours`;

  const description = isEs
    ? `Reserva ${tourName} en Los Cabos desde $${precio} USD con transporte privado redondo desde tu hotel y guías certificados. ¡Asegura tu lugar hoy con Ballard Tours!`
    : `Book the ${tourName} in Los Cabos starting at $${precio} USD. Includes round-trip private hotel transportation and expert local guides. Reserve online with Ballard Tours!`;

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

export default async function TourLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';
  const isEs = lang === 'es';
  const tour = toursLandingPages.find(t => t.slug === slug);
  const tourName = tour?.nombre || slug.replace(/-/g, ' ');

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
            name: isEs ? 'Tours y Experiencias' : 'Tours & Experiences',
            item: `${BASE_URL}/${lang}/tours`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tourName,
            item: `${BASE_URL}/${lang}/tours/${slug}`
          }
        ]
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
