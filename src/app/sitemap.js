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

  // 2. Rutas de destinos populares (extraídas de tu código)
  const destinationRoutes = [
    '/destinations/sjd-to-nobu-hotel',
    '/destinations/sjd-to-grand-solmar',
    '/destinations/sjd-to-hard-rock',
    '/destinations/sjd-to-jw-marriott',
    '/destinations/sjd-to-montage',
    '/destinations/sjd-to-secrets-puerto-los-cabos',
    '/destinations/sjd-to-hyatt-ziva',
    '/destinations/sjd-to-playa-grande',
    '/destinations/sjd-to-riu-palace'
  ];

  // 3. Rutas de tours populares (extraídas de tu código)
  const tourRoutes = [
    '/tours/atv-off-road-adventure-cabo',
    '/tours/cabo-san-lucas-snorkel-tour',
    '/tours/camel-safari-tour-cabo-san-lucas',
    '/tours/clear-boat-tour-cabo-san-lucas-arch',
    '/tours/espiritu-santo-island-tour-from-cabo',
    '/tours/swim-with-whale-sharks-la-paz-cabo'
  ];

  // Juntamos todas las rutas
  const allPaths = [...mainRoutes, ...destinationRoutes, ...tourRoutes];

  const sitemapEntries = [];

  // Generamos dinámicamente las URLs para Inglés y Español
  languages.forEach((lang) => {
    allPaths.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        // Le decimos a Google que la página de inicio cambia más seguido que las demás
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });
  });

  return sitemapEntries;
}