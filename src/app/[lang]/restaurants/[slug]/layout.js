// src/app/[lang]/restaurants/[slug]/layout.js
import { restaurantSEOData } from '../../../../data/restaurantSEOData.js';
import { generatePageMetadata, BASE_URL } from '../../../../lib/seoHelper.js';

export async function generateStaticParams() {
  const langs = ['en', 'es'];
  return langs.flatMap(lang => restaurantSEOData.map(r => ({ lang, slug: r.slug })));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';

  const restaurant = restaurantSEOData.find(r => r.slug === slug);
  const restName = restaurant?.nombre || slug.replace(/-/g, ' ');
  const zona = restaurant?.zonaText || 'Los Cabos';
  const isEs = lang === 'es';

  const title = isEs
    ? `Transporte Privado a Restaurante ${restName} (${zona}) | Traslado Redondo con Espera`
    : `Private Dinner Transfer to ${restName} (${zona}) | Round-Trip Chauffeur Service`;

  const description = isEs
    ? `Reserva transporte privado redondo para tu cena en ${restName} (${zona}) desde $120 USD. Incluye hasta 3 horas de espera en el restaurante, chofer bilingüe y SUV o Sprinter de lujo.`
    : `Book luxury private round-trip dinner transportation to ${restName} in ${zona} from $120 USD. Includes up to 3 hours of waiting time, bilingual chauffeur & luxury SUV or Sprinter.`;

  const keywords = isEs
    ? [
        `transporte a ${restName}`,
        `traslado cena ${restName}`,
        'transporte a restaurantes los cabos',
        'cabo dinner transfers',
        'ballard tours'
      ]
    : [
        `dinner transfer to ${restName}`,
        `private transportation to ${restName} cabo`,
        'cabo restaurant shuttle',
        'cabo dinner transfers',
        'ballard tours'
      ];

  const image = restaurant?.imageDiners ? `/${restaurant.imageDiners}` : '/suburban-airport-los-cabos-ballard.webp';

  return generatePageMetadata({
    lang,
    path: `/restaurants/${slug}`,
    title,
    description,
    keywords,
    image
  });
}

export default async function RestaurantLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';
  const isEs = lang === 'es';
  const restaurant = restaurantSEOData.find(r => r.slug === slug);
  const restName = restaurant?.nombre || slug.replace(/-/g, ' ');
  const zona = restaurant?.zonaText || 'Los Cabos';

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
            name: isEs ? 'Restaurantes y Cenas' : 'Dinner Transfers',
            item: `${BASE_URL}/${lang}/dinners`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: restName,
            item: `${BASE_URL}/${lang}/restaurants/${slug}`
          }
        ]
      },
      {
        '@type': 'Service',
        name: isEs
          ? `Transporte Privado Redondo a ${restName} (${zona})`
          : `Private Round-Trip Dinner Transfer to ${restName} (${zona})`,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Ballard Tours',
          url: `${BASE_URL}/${lang}`
        },
        areaServed: `${zona}, Los Cabos, Baja California Sur`,
        url: `${BASE_URL}/${lang}/restaurants/${slug}`
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
