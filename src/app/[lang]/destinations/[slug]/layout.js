// src/app/[lang]/destinations/[slug]/layout.js
import { landingPagesSEO, zonasData } from '../../../../data/seoData.js';
import { generatePageMetadata, BASE_URL } from '../../../../lib/seoHelper.js';

export async function generateStaticParams() {
  const langs = ['en', 'es'];
  const slugs = Array.from(new Set(['sjd-to-pedregal', ...landingPagesSEO.map(h => h.slug)]));
  return langs.flatMap(lang => slugs.map(slug => ({ lang, slug })));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';

  const hotel = landingPagesSEO.find(h => h.slug === slug);

  const cleanName = hotel?.nombre || slug.replace('sjd-to-', '').replace(/-/g, ' ');
  const zona = hotel?.zonaText || 'Los Cabos';
  const tiempo = hotel?.tiempo || '30 min';
  const dist = hotel?.dist || '25 km';
  const zonaInfo = zonasData.find(z => z.id === Number(hotel?.zona)) || { tarifaSuburban: 80, tarifaSprinter: 110 };
  const isEs = lang === 'es';

  const title = isEs
    ? `Transporte Privado a ${cleanName} (${zona}) desde $${zonaInfo.tarifaSuburban} USD | Aeropuerto SJD`
    : `Private SJD Airport Transfer to ${cleanName} (${zona}) from $${zonaInfo.tarifaSuburban} USD`;

  const description = isEs
    ? `Traslado privado directo desde el Aeropuerto de Los Cabos (SJD) a ${cleanName} en ${zona} (${dist}, ${tiempo}). SUV de lujo desde $${zonaInfo.tarifaSuburban} USD y Sprinter desde $${zonaInfo.tarifaSprinter} USD con monitoreo de vuelo y bebidas incluidas.`
    : `Direct private airport transfer from Los Cabos Airport (SJD) to ${cleanName} in ${zona} (${dist}, ${tiempo}). Luxury SUV from $${zonaInfo.tarifaSuburban} USD & Sprinter Van from $${zonaInfo.tarifaSprinter} USD with flight tracking & cold drinks.`;

  const keywords = isEs
    ? [
        `transporte a ${cleanName}`,
        `shuttle aeropuerto ${cleanName}`,
        `taxi aeropuerto a ${cleanName}`,
        `traslado privado ${cleanName} cabo`,
        'transporte aeropuerto los cabos',
        'ballard tours'
      ]
    : [
        `private transportation to ${cleanName}`,
        `SJD airport shuttle to ${cleanName}`,
        `taxi from cabo airport to ${cleanName}`,
        `cabo airport transfers ${cleanName}`,
        'los cabos airport transportation',
        'ballard tours'
      ];

  const image = hotel?.image ? `/${hotel.image}` : '/suburban-airport-los-cabos-ballard.webp';

  return generatePageMetadata({
    lang,
    path: `/destinations/${slug}`,
    title,
    description,
    keywords,
    image
  });
}

export default async function DestinationLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';
  const isEs = lang === 'es';
  const hotel = landingPagesSEO.find(h => h.slug === slug);
  const cleanName = hotel?.nombre || slug.replace('sjd-to-', '').replace(/-/g, ' ');
  const zona = hotel?.zonaText || 'Los Cabos';
  const zonaInfo = zonasData.find(z => z.id === Number(hotel?.zona)) || { tarifaSuburban: 80, tarifaSprinter: 110 };

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
            name: isEs ? 'Traslados y Destinos' : 'Transfers & Destinations',
            item: `${BASE_URL}/${lang}/transfers`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: cleanName,
            item: `${BASE_URL}/${lang}/destinations/${slug}`
          }
        ]
      },
      {
        '@type': 'Product',
        name: isEs
          ? `Traslado Privado Aeropuerto SJD a ${cleanName} (${zona})`
          : `Private SJD Airport Transfer to ${cleanName} (${zona})`,
        description: isEs
          ? `Servicio de transporte privado puerta a puerta entre el Aeropuerto Internacional de Los Cabos (SJD) y ${cleanName} en ${zona}.`
          : `Door-to-door private airport shuttle service between Los Cabos International Airport (SJD) and ${cleanName} in ${zona}.`,
        brand: {
          '@type': 'Brand',
          name: 'Ballard Tours'
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: String(zonaInfo.tarifaSuburban),
          highPrice: String(zonaInfo.tarifaSprinter),
          offerCount: '2',
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/${lang}/destinations/${slug}`
        }
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
