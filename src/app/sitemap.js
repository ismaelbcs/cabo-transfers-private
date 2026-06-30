export default function sitemap() {
  const baseUrl = 'https://www.caboprivateairporttransfers.com';
  
  // Tus dos idiomas
  const languages = ['en', 'es'];

  // 1. Rutas principales de tu sitio
  const mainRoutes = [
    '', // La página de inicio
    '/contact',
    '/tours',
    '/about-us',
    '/fleet',
    '/terms-and-conditions',
    '/privacy-policy',
    '/politicas-de-cancelacion'
  ];

  // 2. Rutas adicionales de servicios y transporte
  const serviceRoutes = [
    '/cabo-airport-transportation',
    '/trans-cabo-airport-private-transportation',
    '/private-transfers-los-cabos',
    '/hyatt-ziva-los-cabos-transportation',
    '/airport-los-cabos',
    '/airport-los-cabos-sjd',
    '/airport-luxury-suv',
    '/allways-cabo-airport-transportation',
    '/cabo-airport-shuttle-transportation',
    '/cabo-airport-suv-service',
    '/cabo-airport-taxi-alternative',
    '/cabo-airport-transportation-with-beer-included',
    '/cabo-san-lucas-private-transfers',
    '/private-cabo-transfers',
    '/private-transfers-cabo-san-lucas',
    '/san-jose-del-cabo-private-transfers',
    '/san-jose-del-cabo-private-transfers-airport',
    '/sjd-airport-transportation',
    '/skip-taxi-lines-at-cabo-airport',
    '/taxi-airport-cabo',
    '/uber-cabo',
    '/uber-transportation-cabo'
  ];

  // 3. Rutas de destinos populares
  const destinationRoutes = [
    '/destinations/sjd-to-hyatt-ziva',
    '/destinations/sjd-to-cabo-azul',
    '/destinations/sjd-to-royal-solaris',
    '/destinations/sjd-to-park-royal',
    '/destinations/sjd-to-el-encanto-inn',
    '/destinations/sjd-to-royal-decameron',
    '/destinations/sjd-to-viceroy',
    '/destinations/sjd-to-barcelo-gran-faro',
    '/destinations/sjd-to-dreams-los-cabos',
    '/destinations/sjd-to-hilton-los-cabos',
    '/destinations/sjd-to-solaz',
    '/destinations/sjd-to-montage',
    '/destinations/sjd-to-waldorf-astoria',
    '/destinations/sjd-to-secrets-puerto-los-cabos',
    '/destinations/sjd-to-marquis',
    '/destinations/sjd-to-le-blanc',
    '/destinations/sjd-to-solaz-resort',
    '/destinations/sjd-to-grand-solmar',
    '/destinations/sjd-to-mykonos-los-cabos',
    '/destinations/sjd-to-las-olas-condominiums',
    '/destinations/sjd-to-garza-blanca',
    '/destinations/sjd-to-villa-la-valencia',
    '/destinations/sjd-to-jw-marriott',
    '/destinations/sjd-to-westin-los-cabos',
    '/destinations/sjd-to-paradisus',
    '/destinations/sjd-to-one-and-only-palmilla',
    '/destinations/sjd-to-hard-rock',
    '/destinations/sjd-to-nobu-hotel',
    '/destinations/sjd-to-pueblo-bonito-pacifica',
    '/destinations/sjd-to-montecristo-estates',
    '/destinations/sjd-to-querencia',
    '/destinations/sjd-to-dorado',
    '/destinations/sjd-to-riu-palace-baja-california',
    '/destinations/sjd-to-villas-de-pedregal',
    '/destinations/sjd-to-grand-fiesta-americana',
    '/destinations/sjd-to-krystal-grand',
    '/destinations/sjd-to-holiday-inn-resort',
    '/destinations/sjd-to-posada-real',
    '/destinations/sjd-to-casa-natalia',
    '/destinations/sjd-to-alegranza',
    '/destinations/sjd-to-las-mananitas',
    '/destinations/sjd-to-gr-solaris-lighthouse',
    '/destinations/sjd-to-casa-costa-azul',
    '/destinations/sjd-to-soleado-resort',
    '/destinations/sjd-to-cabo-surf-hotel',
    '/destinations/sjd-to-ocean-residence',
    '/destinations/sjd-to-villa-vista-del-mar',
    '/destinations/sjd-to-ocean-spirits',
    '/destinations/sjd-to-tropical-oasis',
    '/destinations/sjd-to-mariamar-suites',
    '/destinations/sjd-to-grand-velas',
    '/destinations/sjd-to-la-pacifica',
    '/destinations/sjd-to-las-ventanas-al-paraiso',
    '/destinations/sjd-to-el-ganzo',
    '/destinations/sjd-to-casa-del-mar-zoetry',
    '/destinations/sjd-to-mar-del-cabo',
    '/destinations/sjd-to-las-residencias',
    '/destinations/sjd-to-zadun',
    '/destinations/sjd-to-villa-la-valencia-resort',
    '/destinations/sjd-to-cabo-real',
    '/destinations/sjd-to-hampton-inn',
    '/destinations/sjd-to-sol-de-cabo',
    '/destinations/sjd-to-casa-cielo',
    '/destinations/sjd-to-villa-del-mar',
    '/destinations/sjd-to-club-regina',
    '/destinations/sjd-to-las-gardenias-condominiums',
    '/destinations/sjd-to-ty-warner-mansion',
    '/destinations/sjd-to-grand-velas-boutique',
    '/destinations/sjd-to-chileno-bay-resort',
    '/destinations/sjd-to-chileno-bay',
    '/destinations/sjd-to-breathless',
    '/destinations/sjd-to-pueblo-bonito-rose',
    '/destinations/sjd-to-riu-santa-fe',
    '/destinations/sjd-to-villa-del-arco',
    '/destinations/sjd-to-villa-la-estancia',
    '/destinations/sjd-to-villa-del-palmar',
    '/destinations/sjd-to-riu-palace',
    '/destinations/sjd-to-pueblo-bonito-blanco',
    '/destinations/sjd-to-playa-grande',
    '/destinations/sjd-to-fairfield',
    '/destinations/sjd-to-hacienda-del-mar',
    '/destinations/sjd-to-park-hyatt',
    '/destinations/sjd-to-villas-cabo-del-sol',
    '/destinations/sjd-to-corazon-cabo',
    '/destinations/sjd-to-me-cabo',
    '/destinations/sjd-to-marina-fiesta',
    '/destinations/sjd-to-bahia-hotel',
    '/destinations/sjd-to-los-milagros',
    '/destinations/sjd-to-the-bungalows',
    '/destinations/sjd-to-cabo-vista',
    '/destinations/sjd-to-siesta-suites',
    '/destinations/sjd-to-city-express-plus',
    '/destinations/sjd-to-holiday-inn-express-csl',
    '/destinations/sjd-to-el-tezal',
    '/destinations/sjd-to-villas-del-tezal',
    '/destinations/sjd-to-casas-de-pedregal',
    '/destinations/sjd-to-the-cape',
    '/destinations/sjd-to-misiones-del-cabo',
    '/destinations/sjd-to-cabo-bello',
    '/destinations/sjd-to-villas-de-cabo-bello',
    '/destinations/sjd-to-sirena-del-mar',
    '/destinations/sjd-to-esperanza',
    '/destinations/sjd-to-hacienda-encantada',
    '/destinations/sjd-to-vista-encantada',
    '/destinations/sjd-to-villas-hacienda-encantada',
    '/destinations/sjd-to-pueblo-bonito-sunset',
    '/destinations/sjd-to-diamante',
    '/destinations/sjd-to-grand-solmar-pacific-dunes',
    '/destinations/sjd-to-quivira-novaispania',
    '/destinations/sjd-to-st-regis-los-cabos',
    '/destinations/sjd-to-pueblo-bonito-pacifica-towers'
  ];

  // 4. Rutas de tours populares
  const tourRoutes = [
    '/tours/atv-off-road-adventure-cabo',
    '/tours/cabo-san-lucas-snorkel-tour',
    '/tours/camel-safari-tour-cabo-san-lucas',
    '/tours/clear-boat-tour-cabo-san-lucas-arch',
    '/tours/espiritu-santo-island-tour-from-cabo',
    '/tours/swim-with-whale-sharks-la-paz-cabo'
  ];

  // Juntamos todas las rutas
  const allPaths = [...mainRoutes, ...serviceRoutes, ...destinationRoutes, ...tourRoutes];

  const sitemapEntries = [];

  // Generamos dinámicamente las URLs para Inglés y Español
  languages.forEach((lang) => {
    allPaths.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });
  });

  return sitemapEntries;
}