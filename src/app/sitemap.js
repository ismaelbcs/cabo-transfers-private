import { golfSEOData } from '../data/golfSEOData.js';
import { restaurantSEOData } from '../data/restaurantSEOData.js';
import { landingPagesSEO, toursLandingPages } from '../data/seoData.js';

export default function sitemap() {
  const baseUrl = 'https://www.caboprivateairporttransfers.com';
  
  // Idiomas soportados
  const languages = ['en', 'es'];

  // 1. Rutas principales y páginas de servicios clave
  const mainRoutes = [
    '', // Página de inicio
    '/transfers', // Centro de traslados entre hoteles y zonas
    '/tours', // Catálogo principal de tours
    '/fleet', // Flota de vehículos
    '/about-us', // Quiénes somos
    '/contact', // Contacto y soporte
    '/booking', // Formulario directo de reserva
    '/dinners', // Traslados a cenas y restaurantes
    '/nightlife', // Traslados para vida nocturna y clubs
    '/weddings', // Transporte para bodas y eventos
    '/golf', // Traslados a campos de golf
    '/yachts', // Renta exclusiva de yates de lujo en Los Cabos (Capella 116ft)
    '/cabo-yacht-charters', // Renta de yates de lujo en Cabo San Lucas
    '/yachts/capella', // Yate Capella 116ft Azimut-Benetti
    '/agencies', // Portal para agencias de viajes
    '/terms-and-conditions',
    '/privacy-policy',
    '/politicas-de-cancelacion'
  ];

  // 2. Rutas adicionales de servicios y transporte por palabra clave SEO
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
    '/los-cabos-airport-transportation',
    '/private-cabo-transfers',
    '/private-transfers-cabo-san-lucas',
    '/san-jose-del-cabo-airport-shuttle',
    '/san-jose-del-cabo-airport-transportation',
    '/san-jose-del-cabo-private-transfers',
    '/san-jose-del-cabo-private-transfers-airport',
    '/sjd-airport-transportation',
    '/sjd-to-pedregal-private-shuttle',
    '/skip-taxi-lines-at-cabo-airport',
    '/taxi-airport-cabo',
    '/uber-cabo',
    '/uber-transportation-cabo'
  ];

  // 3. Rutas de tours individuales y experiencias (deduplicadas dinámicamente)
  const tourRoutes = Array.from(new Set([
    '/clear-boat',
    ...toursLandingPages.map(tour => `/tours/${tour.slug}`)
  ]));

  // 4. Rutas de destinos y hoteles (sincronizadas dinámicamente sin duplicados)
  // Incluye hoteles estáticos con ruta propia y todos los de landingPagesSEO
  const staticDestinations = ['sjd-to-pedregal'];
  const destinationRoutes = Array.from(new Set([
    ...staticDestinations,
    ...landingPagesSEO.map(dest => dest.slug)
  ])).map(slug => `/destinations/${slug}`);

  // 5. Rutas de restaurantes y campos de golf
  const restaurantRoutes = restaurantSEOData.map(r => `/restaurants/${r.slug}`);
  const golfRoutes = golfSEOData.map(g => `/golf-courses/${g.slug}`);

  // Rutas con prioridad alta (servicios clave y hubs)
  const highPriorityRoutes = new Set([
    '',
    '/transfers',
    '/tours',
    '/cabo-airport-transportation',
    '/sjd-airport-transportation',
    '/los-cabos-airport-transportation',
    '/cabo-san-lucas-private-transfers',
    '/private-transfers-los-cabos',
    '/fleet',
    '/dinners',
    '/nightlife',
    '/weddings',
    '/golf'
  ]);

  // Rutas legales / secundarias con menor prioridad
  const lowPriorityRoutes = new Set([
    '/terms-and-conditions',
    '/privacy-policy',
    '/politicas-de-cancelacion',
    '/agencies'
  ]);

  // Juntamos todas las rutas únicas
  const allPaths = Array.from(new Set([
    ...mainRoutes,
    ...serviceRoutes,
    ...tourRoutes,
    ...destinationRoutes,
    ...restaurantRoutes,
    ...golfRoutes
  ]));

  const sitemapEntries = [];

  // Generamos las URLs para cada idioma con prioridades y frecuencias optimizadas para Google
  languages.forEach((lang) => {
    allPaths.forEach((route) => {
      let priority = 0.8;
      let changeFrequency = 'weekly';

      if (route === '') {
        priority = 1.0;
        changeFrequency = 'daily';
      } else if (highPriorityRoutes.has(route)) {
        priority = 0.9;
        changeFrequency = 'weekly';
      } else if (lowPriorityRoutes.has(route)) {
        priority = 0.4;
        changeFrequency = 'yearly';
      } else if (route.startsWith('/restaurants/') || route.startsWith('/golf-courses/')) {
        priority = 0.7;
        changeFrequency = 'monthly';
      }

      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
      });
    });
  });

  return sitemapEntries;
}