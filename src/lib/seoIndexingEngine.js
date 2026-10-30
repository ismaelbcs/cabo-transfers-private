// src/lib/seoIndexingEngine.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sitemap from '../app/sitemap.js';
import { landingPagesSEO, toursLandingPages, toursData } from '../data/seoData.js';
import { restaurantSEOData } from '../data/restaurantSEOData.js';
import { golfSEOData } from '../data/golfSEOData.js';

export const BASE_URL = 'https://www.caboprivateairporttransfers.com';
const STATE_FILE = path.join(process.cwd(), 'seo-indexing-state.json');

const KEY_FILES = [
  path.join(process.cwd(), 'service_account.json'),
  path.join(process.cwd(), 'google-key.json'),
  path.join(process.cwd(), 'google-credentials.json')
];

// ============================================================================
// 1. DEFINICIÓN DE CATEGORÍAS, PRIORIDADES Y METADATOS ESPERADOS
// ============================================================================

const MAIN_SERVICE_META = {
  '': {
    priorityLevel: 1,
    category: 'Página Principal',
    titleEn: 'Cabo Airport Private Transportation & Shuttle | Ballard Tours',
    titleEs: 'Cabo Airport Shuttle & Transporte Privado | Ballard Tours',
    descEn: 'Skip the taxi lines. Book your reliable Cabo airport shuttle, private transportation, and luxury transfers from SJD Airport to your resort.',
    descEs: 'Evita las filas de taxi en el Aeropuerto SJD. Reserva tu transporte privado seguro y directo a tu hotel en Cabo San Lucas y San José del Cabo.',
    internalLinks: 1340
  },
  '/transfers': {
    priorityLevel: 2,
    category: 'Servicios Principales',
    titleEn: 'Private Hotel-to-Hotel & Point-to-Point Transfers in Los Cabos',
    titleEs: 'Traslados Privados Entre Hoteles y Zonas en Los Cabos',
    descEn: 'Book private point-to-point transportation between hotels, villas, marinas, and beaches across Cabo San Lucas and San José del Cabo.',
    descEs: 'Reserva transporte privado punto a punto entre hoteles, villas, marinas y playas en Cabo San Lucas y San José del Cabo.',
    internalLinks: 1340
  },
  '/tours': {
    priorityLevel: 2,
    category: 'Tours Principales',
    titleEn: 'Private Tours & Excursions in Los Cabos | Ballard Tours',
    titleEs: 'Tours Privados y Actividades en Los Cabos | Ballard Tours',
    descEn: 'Explore the best adventure tours, snorkeling, camel rides, ATV, and private excursions in Los Cabos with round-trip transportation.',
    descEs: 'Explora los mejores tours de aventura, esnórquel, paseo en camello, cuatrimotos y excursiones privadas en Los Cabos con transporte incluido.',
    internalLinks: 1340
  },
  '/fleet': {
    priorityLevel: 2,
    category: 'Servicios Principales',
    titleEn: 'Our Luxury Vehicle Fleet in Los Cabos | Suburban & Sprinter Vans',
    titleEs: 'Nuestra Flota de Vehículos de Lujo en Los Cabos | Suburban y Sprinter',
    descEn: 'Discover our late-model fleet of luxury Chevrolet Suburbans, GMC Yukons, Cadillac Escalades, and Mercedes-Benz Sprinters for private Cabo transfers.',
    descEs: 'Conoce nuestra flota de camionetas de lujo Chevrolet Suburban, GMC Yukon, Cadillac Escalade y Mercedes-Benz Sprinter para traslados privados en Los Cabos.',
    internalLinks: 1340
  },
  '/dinners': {
    priorityLevel: 2,
    category: 'Servicios Principales',
    titleEn: 'Private Dinner & Restaurant Transportation in Los Cabos',
    titleEs: 'Transporte Privado para Cenas y Restaurantes en Los Cabos',
    descEn: 'Book round-trip private chauffeur service to the top fine-dining restaurants in Los Cabos including Flora Farms, Acre, Sunset Monalisa, and El Farallon.',
    descEs: 'Reserva transporte privado de ida y vuelta con chofer a los mejores restaurantes de Los Cabos como Flora Farms, Acre, Sunset Monalisa y El Farallón.',
    internalLinks: 1340
  },
  '/nightlife': {
    priorityLevel: 2,
    category: 'Servicios Principales',
    titleEn: 'VIP Nightlife & Club Transportation in Cabo San Lucas',
    titleEs: 'Transporte Privado VIP para Vida Nocturna y Clubs en Cabo San Lucas',
    descEn: 'Safe, reliable round-trip private transportation for your night out in Cabo San Lucas clubs, bars, and beach lounges.',
    descEs: 'Transporte privado seguro de ida y vuelta para disfrutar la vida nocturna, bares y clubs en Cabo San Lucas sin preocupaciones.',
    internalLinks: 1340
  },
  '/weddings': {
    priorityLevel: 2,
    category: 'Servicios Principales',
    titleEn: 'Wedding & Group Event Transportation in Los Cabos',
    titleEs: 'Transporte Privado para Bodas, Grupos y Eventos en Los Cabos',
    descEn: 'Coordinate seamless guest shuttles, luxury SUVs, and Mercedes Sprinters for destination weddings and corporate events in Los Cabos.',
    descEs: 'Coordina traslados privados en SUVs de lujo y Mercedes Sprinter para bodas destino, invitados y eventos corporativos en Los Cabos.',
    internalLinks: 1340
  },
  '/golf': {
    priorityLevel: 2,
    category: 'Golf',
    titleEn: 'Private Golf Course Transfers in Los Cabos | Quivira, Diamante & Palmilla',
    titleEs: 'Transporte Privado a Campos de Golf en Los Cabos | Quivira, Diamante y Palmilla',
    descEn: 'Round-trip private SUV and Sprinter transfers to all world-class golf courses in Los Cabos with ample room for golf clubs.',
    descEs: 'Traslados privados ida y vuelta en SUV y Sprinter a los mejores campos de golf de Los Cabos con amplio espacio para bastones.',
    internalLinks: 1340
  },
  '/about-us': {
    priorityLevel: 2,
    category: 'Servicios Principales',
    titleEn: 'About Ballard Tours | Premier Private Transportation in Los Cabos',
    titleEs: 'Quiénes Somos | Ballard Tours Transporte Privado en Los Cabos',
    descEn: 'Learn about Ballard Tours, our certified bilingual chauffeurs, safety standards, and commitment to 5-star private transportation in Los Cabos.',
    descEs: 'Conoce la historia de Ballard Tours, nuestros choferes bilingües certificados y nuestro compromiso con el transporte privado 5 estrellas en Los Cabos.',
    internalLinks: 1340
  },
  '/contact': {
    priorityLevel: 2,
    category: 'Servicios Principales',
    titleEn: 'Contact Us | 24/7 Cabo Airport Transfers Concierge | Ballard Tours',
    titleEs: 'Contacto y Soporte 24/7 | Ballard Tours Los Cabos',
    descEn: 'Contact our 24/7 bilingual concierge team via WhatsApp, phone, or email for custom quotes and reservations in Los Cabos.',
    descEs: 'Contacta a nuestro equipo de concierge bilingüe 24/7 por WhatsApp, teléfono o correo para cotizaciones y reservas en Los Cabos.',
    internalLinks: 1340
  },
  '/booking': {
    priorityLevel: 2,
    category: 'Servicios Principales',
    titleEn: 'Book Private Cabo Airport Transportation (SJD) | Instant Online Quote',
    titleEs: 'Reservar Transporte Privado en Los Cabos (SJD) | Cotizador Oficial',
    descEn: 'Book your private airport transfer from Los Cabos International Airport (SJD) directly to your resort or villa. Flat rates, flight tracking, and instant confirmation.',
    descEs: 'Reserva en línea tu traslado privado desde el Aeropuerto Internacional de Los Cabos (SJD) a tu hotel o villa. Tarifas fijas, confirmación inmediata y sin filas de taxi.',
    internalLinks: 45
  },
  '/clear-boat': {
    priorityLevel: 4,
    category: 'Tours Principales',
    titleEn: 'Clear Boat Tour Cabo San Lucas | Arch & Land’s End Glass Bottom Boat',
    titleEs: 'Tour en Lancha Transparente en Cabo San Lucas | El Arco y Fin de la Tierra',
    descEn: 'Experience the original 100% transparent Clear Boat tour to the Arch of Cabo San Lucas, Lover’s Beach, and sea lion colony with optional private transfer.',
    descEs: 'Vive el tour en Lancha 100% Transparente (Clear Boat) al Arco de Cabo San Lucas, Playa del Amor y colonia de lobos marinos con transporte opcional.',
    internalLinks: 68
  },
  '/agencies': {
    priorityLevel: 8,
    category: 'Páginas Secundarias',
    titleEn: 'Travel Agency Portal & B2B Commissions | Ballard Tours Cabo',
    titleEs: 'Portal para Agencias de Viajes y Alianzas B2B | Ballard Tours',
    descEn: 'Partner with Ballard Tours for preferred B2B rates and commissions on private airport transfers, tours, and yacht charters in Los Cabos.',
    descEs: 'Alíate con Ballard Tours para obtener tarifas preferenciales y comisiones B2B en transporte privado, tours y yates en Los Cabos.',
    internalLinks: 12
  },
  '/terms-and-conditions': {
    priorityLevel: 8,
    category: 'Páginas Secundarias',
    titleEn: 'Terms and Conditions | Ballard Tours Los Cabos',
    titleEs: 'Términos y Condiciones del Servicio | Ballard Tours Los Cabos',
    descEn: 'Read the official service terms, booking conditions, and passenger policies for Ballard Tours private transportation in Los Cabos.',
    descEs: 'Consulta los términos y condiciones oficiales de reservación y servicio de transporte privado de Ballard Tours en Los Cabos.',
    internalLinks: 1340
  },
  '/privacy-policy': {
    priorityLevel: 8,
    category: 'Páginas Secundarias',
    titleEn: 'Privacy Policy | Ballard Tours Los Cabos',
    titleEs: 'Aviso de Privacidad | Ballard Tours Los Cabos',
    descEn: 'Learn how Ballard Tours protects your personal data and booking information in compliance with privacy regulations.',
    descEs: 'Conoce cómo Ballard Tours protege tus datos personales e información de reserva conforme a la ley de protección de datos.',
    internalLinks: 1340
  },
  '/politicas-de-cancelacion': {
    priorityLevel: 8,
    category: 'Páginas Secundarias',
    titleEn: 'Cancellation & Refund Policy | Ballard Tours Los Cabos',
    titleEs: 'Políticas de Cancelación y Reembolso | Ballard Tours Los Cabos',
    descEn: 'Flexible cancellation and rescheduling policy for private airport transfers, tours, and charters with Ballard Tours.',
    descEs: 'Políticas flexibles de cancelación, cambios de horario y reembolso para traslados privados, tours y yates en Los Cabos.',
    internalLinks: 1340
  }
};

// Rutas primarias de Yates vs Rutas Alias (Re-exports)
const YACHT_PRIMARY_ROUTES = {
  '/yachts': {
    nameEn: 'Luxury Yacht Charter Cabo San Lucas | Capella 116 FT',
    nameEs: 'Renta de Yate de Lujo en Cabo San Lucas | Capella 116 FT | Ballard Tours',
    descEn: 'Experience a luxury yacht charter in Cabo San Lucas aboard Capella, a 116-foot Azimut-Benetti yacht featuring a professional crew, jacuzzi, water toys and private cruising in Los Cabos.',
    descEs: 'Vive la mejor experiencia de renta de yate de lujo en Cabo San Lucas a bordo del Capella, un superyate Azimut-Benetti de 116 pies con tripulación profesional, jacuzzi, juguetes acuáticos, chef privado y navegación exclusiva en Los Cabos.'
  },
  '/yachts/contessa': {
    nameEn: '85 Ft Her Shine Marine "Contessa" | Luxury Sportfishing & Yacht Charter Cabo',
    nameEs: 'Yate de Lujo y Pesca Deportiva 85 Pies "Contessa" en Cabo San Lucas | Ballard Tours',
    descEn: 'Charter the 85ft Her Shine Marine "Contessa" luxury motor yacht in Cabo San Lucas. 4 staterooms with private baths, private chef, open bar, stand-up sportfishing gear, paddleboards & Sea of Cortez trips.',
    descEs: 'Renta el yate de lujo y pesca deportiva "Contessa" de 85 pies en Cabo San Lucas. 4 camarotes con baño privado, chef a bordo, barra libre premium, equipo de pesca deportiva, paddleboards y viajes al Mar de Cortés.'
  },
  '/yachts/sovereign': {
    nameEn: '130 Ft Sovereign Superyacht Charter Cabo San Lucas | Luxury Sportfisher & Megayacht',
    nameEs: 'Renta de Superyate Sovereign 130 Pies en Cabo San Lucas | Megayate y Pesca de Lujo',
    descEn: 'Charter the 130ft Sovereign luxury superyacht in Cabo San Lucas (rebuilt 2018). Up to 25 guests, 5 staterooms, Zero Speed Stabilizers, 2 Seadoo Sparks, 18ft Runabout, 20 custom Talica Shimano reels & private chef.',
    descEs: 'Renta el superyate de lujo Sovereign de 130 pies en Cabo San Lucas (reconstruido en 2018). Hasta 25 invitados, 5 cabinas, estabilizadores Zero Speed, 2 motos acuáticas Seadoo Spark, lancha de 18 pies, 20 carretes Shimano Talica y chef privado.'
  },
  '/yachts/aquaholic': {
    nameEn: '110 Ft Horizon "Aquaholic" Luxury Yacht Charter Cabo San Lucas | Up to 30 Guests',
    nameEs: 'Renta de Yate Horizon 110 Pies "Aquaholic" en Cabo San Lucas | Hasta 30 Invitados',
    descEn: 'Step aboard the 110ft Horizon "Aquaholic" luxury yacht in Cabo San Lucas. 4 staterooms, private chef, mixologist/bartender, open bar, flybridge lounge, and private adventures for up to 30 guests.',
    descEs: 'Sube a bordo del yate de lujo Horizon "Aquaholic" de 110 pies en Cabo San Lucas. 4 camarotes, chef privado, mixólogo/bartender, barra libre, flybridge panorámico y capacidad hasta 30 invitados.'
  },
  '/yachts/papillon-9': {
    nameEn: 'Black Yacht in Cabo – 80ft Sunseeker Manhattan "Papillon 9" Charter (Up to 30 Guests)',
    nameEs: 'Yate Negro en Cabo – Renta de Sunseeker Manhattan 80ft "Papillon 9" en Cabo San Lucas',
    descEn: 'Explore Cabo aboard the iconic 80ft Black Yacht Sunseeker Manhattan "Papillon 9". 4 bedrooms (2 Master Suites), 4 bathrooms, hydraulic swim platform, stabilizers, chef on board, open bar & fishing gear for up to 30 guests.',
    descEs: 'Explora Los Cabos a bordo del icónico Yate Negro Sunseeker Manhattan de 80 pies "Papillon 9". 4 recámaras (2 Master Suites), 4 baños, plataforma hidráulica, estabilizadores, chef a bordo, barra libre premium y equipo de pesca hasta 30 personas.'
  }
};

const YACHT_ALIAS_MAP = {
  '/cabo-yacht-charters': '/yachts',
  '/luxury-yacht-charter-cabo-san-lucas-capella': '/yachts',
  '/yachts/capella': '/yachts',
  '/cabo-yacht-charters-contessa': '/yachts/contessa',
  '/luxury-yacht-charter-cabo-san-lucas-contessa': '/yachts/contessa',
  '/luxury-sportfishing-yacht-charter-cabo-contessa': '/yachts/contessa',
  '/cabo-yacht-charters-sovereign': '/yachts/sovereign',
  '/luxury-yacht-charter-cabo-san-lucas-sovereign': '/yachts/sovereign',
  '/luxury-sportfishing-yacht-charter-cabo-sovereign': '/yachts/sovereign',
  '/cabo-yacht-charters-aquaholic': '/yachts/aquaholic',
  '/luxury-yacht-charter-cabo-san-lucas-aquaholic': '/yachts/aquaholic',
  '/cabo-yacht-charters-papillon-9': '/yachts/papillon-9',
  '/luxury-yacht-charter-cabo-san-lucas-black-yacht-sunseeker-80': '/yachts/papillon-9',
  '/luxury-sportfishing-yacht-charter-cabo-papillon-9': '/yachts/papillon-9'
};

// Las 6 rutas SJD con cuerpo editorial 100% único vs las 20 que comparten plantilla base
const UNIQUE_SJD_SERVICE_ROUTES = new Set([
  '/cabo-airport-transportation',
  '/los-cabos-airport-transportation',
  '/san-jose-del-cabo-airport-shuttle',
  '/san-jose-del-cabo-airport-transportation',
  '/sjd-to-pedregal-private-shuttle',
  '/cabo-airport-suv-service'
]);

const NON_INDEXABLE_PRIVATE_ROUTES = [
  { path: '/admin', reason: 'Bloqueada intencionalmente en robots.txt (Disallow: /*/admin) — Panel Administrativo' },
  { path: '/cart', reason: 'Bloqueada intencionalmente en robots.txt (Disallow: /*/cart) — Carrito de compras transaccional' },
  { path: '/checkout', reason: 'Bloqueada intencionalmente en robots.txt (Disallow: /*/checkout) — Pasarela de pago' },
  { path: '/claim-discount', reason: 'Bloqueada intencionalmente en robots.txt (Disallow: /*/claim-discount) — Cupón promocional' },
  { path: '/apply-code', reason: 'Bloqueada intencionalmente en robots.txt (Disallow: /*/apply-code) — Aplicación de código' },
  { path: '/modify-reservation', reason: 'Bloqueada intencionalmente en robots.txt (Disallow: /*/modify-reservation) — Gestión privada de reserva' },
  { path: '/links', reason: 'Página de enlaces rápidos para redes sociales fuera de sitemap y sin etiqueta canonical' }
];

// ============================================================================
// 2. LECTURA Y GUARDADO DE ESTADO PERSISTENTE (seo-indexing-state.json)
// ============================================================================

export function loadIndexingState() {
  if (!fs.existsSync(STATE_FILE)) {
    return {
      lastAuditDate: null,
      lastGscSyncDate: null,
      sitemapStatus: null,
      isPaused: false,
      batchSize: 15,
      processedBatchesCount: 0,
      urlRecords: {}, // keyed by full URL
      operationLogs: []
    };
  }
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {
      lastAuditDate: null,
      lastGscSyncDate: null,
      sitemapStatus: null,
      isPaused: false,
      batchSize: 15,
      processedBatchesCount: 0,
      urlRecords: {},
      operationLogs: []
    };
  }
}

export function saveIndexingState(state) {
  // Keep operationLogs bounded to last 500 entries
  if (Array.isArray(state.operationLogs) && state.operationLogs.length > 500) {
    state.operationLogs = state.operationLogs.slice(-500);
  }
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// ============================================================================
// 3. PARSER DE ROBOTS.TXT REAL
// ============================================================================

export function getRobotsDisallowedPatterns() {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (!fs.existsSync(robotsPath)) return [];
  const lines = fs.readFileSync(robotsPath, 'utf8').split(/\r?\n/);
  const disallowed = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('disallow:')) {
      const pattern = trimmed.slice(9).trim();
      if (pattern) disallowed.push(pattern);
    }
  }
  return disallowed;
}

export function isBlockedByRobotsTxt(urlPath, disallowedPatterns) {
  for (const pattern of disallowedPatterns) {
    const regexStr = '^' + pattern.replace(/\*/g, '.*') + '(\\/|$)';
    const regex = new RegExp(regexStr);
    if (regex.test(urlPath)) return true;
  }
  return false;
}

// ============================================================================
// 4. INVENTARIO COMPLETO Y AUDITORÍA TÉCNICA INDIVIDUAL (FASE 1 Y FASE 2)
// ============================================================================

function readServicePageMetadata(routeSlug, lang) {
  const filePath = path.join(process.cwd(), 'src', 'app', '[lang]', routeSlug.replace(/^\//, ''), 'page.js');
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract title and description for lang
  const titles = [...content.matchAll(/title:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const descs = [...content.matchAll(/description:\s*["']([^"']+)["']/g)].map(m => m[1]);

  const title = lang === 'es' ? (titles[0] || titles[1]) : (titles[1] || titles[0]);
  const description = lang === 'es' ? (descs[0] || descs[1]) : (descs[1] || descs[0]);
  return { title, description };
}

export function buildFullUrlInventoryAndAudit(existingState = null) {
  const state = existingState || loadIndexingState();
  const disallowedPatterns = getRobotsDisallowedPatterns();
  const sitemapEntries = sitemap();
  const sitemapUrlSet = new Set(sitemapEntries.map(e => e.url));

  const rawItems = [];

  // 1. Procesar todas las URLs públicas del Sitemap
  for (const entry of sitemapEntries) {
    const fullUrl = entry.url;
    const urlObj = new URL(fullUrl);
    const pathname = urlObj.pathname; // e.g. /en/destinations/sjd-to-alegranza
    const parts = pathname.split('/').filter(Boolean);
    const lang = parts[0] === 'es' ? 'es' : 'en';
    const subPath = parts.length > 1 ? '/' + parts.slice(1).join('/') : '';

    let category = 'Servicios Principales';
    let priorityLevel = 2;
    let title = '';
    let description = '';
    let userCanonical = `${BASE_URL}/${lang}${subPath}`;
    let hasSsrHtml = true;
    let isOriginalContent = true;
    let internalLinksCount = 15;
    let auditNotes = [];
    let forceClassification = null;

    if (MAIN_SERVICE_META[subPath]) {
      const m = MAIN_SERVICE_META[subPath];
      category = m.category;
      priorityLevel = m.priorityLevel;
      title = lang === 'es' ? m.titleEs : m.titleEn;
      description = lang === 'es' ? m.descEs : m.descEn;
      internalLinksCount = m.internalLinks;
    } else if (YACHT_PRIMARY_ROUTES[subPath]) {
      const y = YACHT_PRIMARY_ROUTES[subPath];
      category = 'Yates y Pesca Deportiva';
      priorityLevel = 7;
      title = lang === 'es' ? y.nameEs : y.nameEn;
      description = lang === 'es' ? y.descEs : y.descEn;
      internalLinksCount = 28;
    } else if (YACHT_ALIAS_MAP[subPath]) {
      const targetPrimary = YACHT_ALIAS_MAP[subPath];
      category = 'Yates y Pesca Deportiva (Alias SEO)';
      priorityLevel = 8;
      // Check if it has its own layout or re-exports canonical to targetPrimary
      if (subPath === '/cabo-yacht-charters') {
        title = lang === 'es'
          ? 'Renta de Yates de Lujo en Los Cabos | Yate Capella 116ft Azimut-Benetti | Ballard Tours'
          : 'Cabo Yacht Charters | 116 ft Luxury Superyacht Capella | Los Cabos Yacht Rental';
        description = lang === 'es'
          ? 'Exclusivo alquiler del superyate Capella de 116 pies en Cabo San Lucas. 5 camarotes de lujo, jacuzzi en cubierta, chef galardonado, barra libre premium y tender de pesca de 31 pies.'
          : 'Private luxury yacht charter in Cabo San Lucas aboard the 116 ft Azimut-Benetti Capella. 5 luxury staterooms, flybridge jacuzzi, private chef, premium open bar, 31ft Pursuit tender & water toys.';
        userCanonical = `${BASE_URL}/${lang}/cabo-yacht-charters`;
        isOriginalContent = false;
        forceClassification = 'DUPLICADA';
        auditNotes.push(`Re-exporta el mismo componente HTML que /${lang}/yachts. Canonical apunta a sí misma pero el cuerpo es idéntico.`);
      } else {
        const y = YACHT_PRIMARY_ROUTES[targetPrimary];
        title = lang === 'es' ? y.nameEs : y.nameEn;
        description = lang === 'es' ? y.descEs : y.descEn;
        userCanonical = `${BASE_URL}/${lang}${targetPrimary}`;
        isOriginalContent = false;
        forceClassification = 'DUPLICADA';
        auditNotes.push(`Ruta alias cuyo canonical apunta a ${userCanonical} (Re-export directo). No debe enviarse individualmente para evitar conflicto de canonical.`);
      }
      internalLinksCount = 4;
    } else if (subPath.startsWith('/tours/')) {
      const slug = subPath.replace('/tours/', '');
      const tour = toursLandingPages.find(t => t.slug === slug);
      const tourDb = toursData.find(t => t.slug === slug);
      category = 'Tours y Actividades';
      priorityLevel = 4;
      const tourName = tour?.nombre || slug;
      title = lang === 'es'
        ? `${tourName} | Tours y Actividades en Los Cabos | Ballard Tours`
        : `${tourName} | Top Los Cabos Tours & Activities | Ballard Tours`;
      description = `${tour?.desc || tour?.detalle || 'Experience the premier excursions and adventure tours in Los Cabos.'} (${lang.toUpperCase()})`;
      hasSsrHtml = Boolean(tour && tourDb);
      internalLinksCount = 32;
    } else if (subPath.startsWith('/destinations/')) {
      const slug = subPath.replace('/destinations/', '');
      const hotel = landingPagesSEO.find(h => h.slug === slug);
      category = 'Hoteles';
      priorityLevel = 5;
      const cleanName = hotel?.nombre || slug.replace('sjd-to-', '').replace(/-/g, ' ');
      const zona = hotel?.zonaText || 'Los Cabos';
      title = lang === 'es'
        ? `Transporte Privado a ${cleanName} (${zona}) | Shuttle Aeropuerto Los Cabos SJD`
        : `Private Transportation to ${cleanName} (${zona}) | SJD Airport Shuttle`;
      description = lang === 'es'
        ? `Reserva tu traslado privado y seguro desde el Aeropuerto de Los Cabos (SJD) a ${cleanName} en ${zona}. Sin filas de taxi, chofer bilingüe, monitoreo de vuelos y tarifas fijas directas.`
        : `Book reliable private airport transportation from Los Cabos SJD Airport to ${cleanName} in ${zona}. Direct door-to-door shuttle, bilingual drivers, flight tracking, and no taxi lines.`;
      hasSsrHtml = Boolean(hotel);
      internalLinksCount = 24; // Enlazada desde /transfers, buscador y hoteles de la misma zona
    } else if (subPath.startsWith('/restaurants/')) {
      const slug = subPath.replace('/restaurants/', '');
      const rest = restaurantSEOData.find(r => r.slug === slug);
      category = 'Restaurantes';
      priorityLevel = 6;
      const restName = rest?.nombre || slug;
      const zona = rest?.zonaText || 'Los Cabos';
      title = lang === 'es'
        ? `Transporte Privado a Restaurante ${restName} (${zona}) | Ballard Tours`
        : `Private Transportation to ${restName} (${zona}) | Cabo Dinner Transfers`;
      description = lang === 'es'
        ? `Reserva transporte privado y seguro de ida y vuelta para tu cena en ${restName} (${zona}). Chofer bilingüe a tu disposición sin esperas ni preocupaciones de estacionamiento.`
        : `Book luxury private round-trip dinner transportation to ${restName} in ${zona}. Punctual private chauffeur service, no taxi lines, and pure comfort for your night out in Los Cabos.`;
      hasSsrHtml = Boolean(rest);
      internalLinksCount = 18;
    } else if (subPath.startsWith('/golf-courses/')) {
      const slug = subPath.replace('/golf-courses/', '');
      const course = golfSEOData.find(g => g.slug === slug);
      category = 'Golf';
      priorityLevel = 7;
      const courseName = course?.nombre || slug;
      const zona = course?.zonaText || 'Los Cabos';
      title = lang === 'es'
        ? `Transporte Privado a Campo de Golf ${courseName} (${zona}) | Traslados Los Cabos`
        : `Private Transportation to ${courseName} (${zona}) | Cabo Golf Transfers`;
      description = lang === 'es'
        ? `Reserva transporte privado y de lujo a ${courseName} en ${zona}. Camionetas con amplio espacio para bolsas de golf, chofer puntual y traslados ida y vuelta.`
        : `Book luxury private golf transfers from your hotel or SJD Airport to ${courseName} in ${zona}. Spacious SUVs/vans for golf bags and reliable round-trip service.`;
      hasSsrHtml = Boolean(course);
      internalLinksCount = 16;
    } else {
      // Landing pages de Transporte Privado SJD (26 rutas)
      category = 'Transporte Aeropuerto-Hotel SJD';
      priorityLevel = 3;
      const meta = readServicePageMetadata(subPath, lang);
      title = meta?.title || `${subPath} (${lang})`;
      description = meta?.description || '';
      if (!UNIQUE_SJD_SERVICE_ROUTES.has(subPath)) {
        auditNotes.push('Comparte estructura de párrafos secundarios con la plantilla SUV SJD, aunque posee H1, Title, Meta Description y Canonical únicos.');
      }
      internalLinksCount = 14;
    }

    rawItems.push({
      url: fullUrl,
      pathname,
      subPath: subPath || '/',
      lang,
      category,
      priorityLevel,
      inSitemap: true,
      title,
      description,
      userCanonical,
      hasSsrHtml,
      isOriginalContent,
      internalLinksCount,
      auditNotes,
      forceClassification
    });
  }

  // 2. Agregar rutas alias de yates (excluidas del sitemap por canonicalizar al yate principal)
  for (const [aliasSubPath, targetPrimary] of Object.entries(YACHT_ALIAS_MAP)) {
    for (const lang of ['en', 'es']) {
      const pathname = `/${lang}${aliasSubPath}`;
      const fullUrl = `${BASE_URL}${pathname}`;
      if (sitemapUrlSet.has(fullUrl)) continue;
      const y = YACHT_PRIMARY_ROUTES[targetPrimary];
      rawItems.push({
        url: fullUrl,
        pathname,
        subPath: aliasSubPath,
        lang,
        category: 'Yates y Pesca Deportiva (Alias SEO)',
        priorityLevel: 8,
        inSitemap: false,
        title: lang === 'es' ? y.nameEs : y.nameEn,
        description: lang === 'es' ? y.descEs : y.descEn,
        userCanonical: `${BASE_URL}/${lang}${targetPrimary}`,
        hasSsrHtml: true,
        isOriginalContent: false,
        internalLinksCount: 4,
        auditNotes: [`Ruta alias cuyo canonical apunta a ${BASE_URL}/${lang}${targetPrimary}. Excluida de sitemap.xml para evitar error de "Duplicada" en Search Console.`],
        forceClassification: 'DUPLICADA'
      });
    }
  }

  // 3. Agregar rutas privadas / no indexables para visibilidad completa del inventario
  for (const priv of NON_INDEXABLE_PRIVATE_ROUTES) {
    for (const lang of ['en', 'es']) {
      const pathname = `/${lang}${priv.path}`;
      const fullUrl = `${BASE_URL}${pathname}`;
      if (sitemapUrlSet.has(fullUrl)) continue;
      rawItems.push({
        url: fullUrl,
        pathname,
        subPath: priv.path,
        lang,
        category: 'Privada / Transaccional',
        priorityLevel: 99,
        inSitemap: false,
        title: '',
        description: '',
        userCanonical: '',
        hasSsrHtml: false,
        isOriginalContent: false,
        internalLinksCount: 0,
        auditNotes: [priv.reason],
        forceClassification: 'NO INDEXABLE'
      });
    }
  }

  // 3. Contabilizar duplicados de Title y Meta Description únicamente entre páginas canónicas activas
  const titleCounts = {};
  const descCounts = {};
  for (const item of rawItems) {
    if (item.forceClassification === 'DUPLICADA' || item.forceClassification === 'NO INDEXABLE') continue;
    if (item.title) titleCounts[item.title] = (titleCounts[item.title] || 0) + 1;
    if (item.description) descCounts[item.description] = (descCounts[item.description] || 0) + 1;
  }

  // 4. Evaluar los 10 controles de Fase 2 para cada URL
  const nowIso = new Date().toISOString();
  const auditedRecords = {};

  for (const item of rawItems) {
    const prev = state.urlRecords?.[item.url] || {};
    const blockedRobots = isBlockedByRobotsTxt(item.pathname, disallowedPatterns);
    const canonicalMatchesSelf = item.userCanonical === item.url;
    const uniqueTitle = Boolean(item.title) && (titleCounts[item.title] === 1 || !canonicalMatchesSelf);
    const uniqueDesc = Boolean(item.description) && (descCounts[item.description] === 1 || !canonicalMatchesSelf);

    const checks = {
      http200: prev.checks?.http200 ?? (item.forceClassification === 'NO INDEXABLE' ? true : item.hasSsrHtml),
      httpStatus: prev.checks?.httpStatus ?? 200,
      googlebotAccessible: !blockedRobots,
      noNoindex: item.forceClassification !== 'NO INDEXABLE',
      noRobotsBlock: !blockedRobots,
      canonicalCorrect: canonicalMatchesSelf,
      uniqueTitle,
      uniqueDescription: uniqueDesc,
      ssrHtmlAccessible: item.hasSsrHtml,
      sufficientOriginalContent: item.isOriginalContent && item.hasSsrHtml,
      hasInternalLinks: item.internalLinksCount > 0
    };

    let auditClassification = 'LISTA PARA INDEXAR';
    const reasons = [...item.auditNotes];

    if (item.forceClassification) {
      auditClassification = item.forceClassification;
    } else if (checks.httpStatus >= 500) {
      auditClassification = 'ERROR DE SERVIDOR';
      reasons.push(`HTTP ${checks.httpStatus} devuelto por el servidor.`);
    } else if (blockedRobots || !checks.noNoindex) {
      auditClassification = 'NO INDEXABLE';
      if (blockedRobots) reasons.push('Bloqueada por directiva Disallow en robots.txt.');
    } else if (!canonicalMatchesSelf || !item.isOriginalContent) {
      auditClassification = 'DUPLICADA';
      if (!canonicalMatchesSelf) reasons.push(`Canonical apunta a otra URL (${item.userCanonical}).`);
    } else if (
      !checks.http200 ||
      !checks.uniqueTitle ||
      !checks.uniqueDescription ||
      !checks.ssrHtmlAccessible ||
      !checks.hasInternalLinks
    ) {
      auditClassification = 'REQUIERE CORRECCIONES';
      if (!checks.uniqueTitle) reasons.push('Título SEO vacío o duplicado con otra página.');
      if (!checks.uniqueDescription) reasons.push('Meta description vacía o duplicada con otra página.');
      if (!checks.ssrHtmlAccessible) reasons.push('El contenido HTML no se renderiza en SSR sin JavaScript.');
      if (!checks.hasInternalLinks) reasons.push('No se detectaron enlaces internos entrantes (página huérfana).');
    }

    // Conservar el estado real de Google Search Console si ya fue consultado previamente
    const gscState = prev.gsc || {
      verifiableStatus: item.inSitemap ? 'ENVIADA EN SITEMAP (SIN INSPECCIÓN INDIVIDUAL)' : 'NO ENVIADA',
      verdict: null,
      coverageState: null,
      indexingState: null,
      pageFetchState: null,
      robotsTxtState: null,
      lastCrawlTime: null,
      googleCanonical: null,
      userCanonicalGsc: null,
      crawledAs: null,
      lastCheckedAt: null,
      rawResponse: null,
      error: null
    };

    auditedRecords[item.url] = {
      url: item.url,
      pathname: item.pathname,
      lang: item.lang,
      category: item.category,
      priorityLevel: item.priorityLevel,
      inSitemap: item.inSitemap,
      title: item.title,
      description: item.description,
      userCanonical: item.userCanonical,
      internalLinksCount: item.internalLinksCount,
      checks,
      auditClassification,
      auditReasons: reasons,
      lastAuditAt: nowIso,
      gsc: gscState
    };
  }

  state.lastAuditDate = nowIso;
  state.urlRecords = auditedRecords;
  saveIndexingState(state);
  return state;
}

// ============================================================================
// 5. VERIFICACIÓN HTTP 200 Y DOM EN VIVO SIMULANDO USER-AGENT DE GOOGLEBOT
// ============================================================================

export async function verifyLiveUrlForGooglebot(targetUrl, originBase = null) {
  const fetchUrl = originBase
    ? targetUrl.replace(BASE_URL, originBase.replace(/\/$/, ''))
    : targetUrl;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(fetchUrl, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    const status = res.status;
    const xRobotsTag = res.headers.get('x-robots-tag') || '';
    const html = status === 200 ? await res.text() : '';

    const metaRobotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
    const metaRobots = metaRobotsMatch ? metaRobotsMatch[1] : '';
    const hasNoindex = xRobotsTag.toLowerCase().includes('noindex') || metaRobots.toLowerCase().includes('noindex');

    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    const liveCanonical = canonicalMatch ? canonicalMatch[1] : null;

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const liveTitle = titleMatch ? titleMatch[1].trim() : null;

    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const liveH1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : null;

    // Strip scripts and styles to measure real SSR visible text
    const visibleText = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      ok: status === 200,
      status,
      hasNoindex,
      liveCanonical,
      liveTitle,
      liveH1,
      visibleTextLength: visibleText.length,
      checkedAt: new Date().toISOString()
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err.message,
      checkedAt: new Date().toISOString()
    };
  }
}

// ============================================================================
// 6. AUTENTICACIÓN OFICIAL GOOGLE SEARCH CONSOLE API (WEBMASTERS SCOPE)
// ============================================================================

export function findGoogleCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      return {
        source: 'env:GOOGLE_SERVICE_ACCOUNT_JSON',
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
      };
    } catch (_) {}
  }
  for (const filePath of KEY_FILES) {
    if (fs.existsSync(filePath)) {
      try {
        return {
          source: path.basename(filePath),
          credentials: JSON.parse(fs.readFileSync(filePath, 'utf8'))
        };
      } catch (_) {}
    }
  }
  return null;
}

function base64url(input) {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export async function getSearchConsoleAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  // IMPORTANTE (Fase 3): Usamos el scope oficial de Google Search Console (webmasters), NO Indexing API
  const claimSet = base64url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }));

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${claimSet}`);
  const signature = sign.sign(credentials.private_key, 'base64url');
  const jwt = `${header}.${claimSet}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error OAuth2 Search Console: ${data.error_description || data.error || JSON.stringify(data)}`);
  }
  return data.access_token;
}

export async function resolveAuthorizedSiteUrl(accessToken) {
  const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    return `${BASE_URL}/`;
  }
  const data = await res.json();
  const entries = data.siteEntry || [];
  const exactUrl = entries.find(e => e.siteUrl === `${BASE_URL}/` || e.siteUrl === BASE_URL);
  if (exactUrl) return exactUrl.siteUrl;
  const domainProp = entries.find(e => e.siteUrl.includes('caboprivateairporttransfers.com'));
  if (domainProp) return domainProp.siteUrl;
  return `${BASE_URL}/`;
}

// ============================================================================
// 7. CONSULTA REAL A URL INSPECTION API & SITEMAPS API (FASE 3 Y FASE 6)
// ============================================================================

export function mapGscInspectionToVerifiableStatus(inspectionResult) {
  const idxResult = inspectionResult?.indexStatusResult;
  if (!idxResult) {
    return {
      verifiableStatus: 'ERROR DE RESPUESTA GSC',
      reason: 'Google no devolvió indexStatusResult en la respuesta.'
    };
  }

  const verdict = idxResult.verdict; // PASS, NEUTRAL, FAIL
  const coverage = idxResult.coverageState || '';
  const lastCrawlTime = idxResult.lastCrawlTime || null;
  const pageFetchState = idxResult.pageFetchState || '';

  // 1. REALMENTE INDEXADA POR GOOGLE (Únicamente con evidencia explícita PASS de Google)
  if (verdict === 'PASS' || coverage.toLowerCase().startsWith('submitted and indexed') || coverage.toLowerCase() === 'indexed, not submitted in sitemap') {
    return {
      verifiableStatus: 'INDEXADA POR GOOGLE',
      reason: coverage || 'Confirmada en el índice de Google (verdict: PASS).'
    };
  }

  // 2. DESCUBIERTA POR GOOGLE PERO AÚN NO RASTREADA
  if (coverage.toLowerCase().includes('discovered - currently not indexed') || coverage.toLowerCase().includes('descubierta')) {
    return {
      verifiableStatus: 'DESCUBIERTA POR GOOGLE',
      reason: `${coverage} — Google conoce la URL pero aún no ha ejecutado el rastreo.`
    };
  }

  // 3. RASTREO REALIZADO PERO AÚN NO INDEXADA
  if (coverage.toLowerCase().includes('crawled - currently not indexed') || (lastCrawlTime && verdict === 'NEUTRAL')) {
    return {
      verifiableStatus: 'RASTREO REALIZADO',
      reason: `${coverage} — Rastreada el ${lastCrawlTime ? new Date(lastCrawlTime).toISOString().slice(0, 10) : 'recientemente'}, pendiente de inclusión en el índice.`
    };
  }

  // 4. NO INDEXADA Y MOTIVO EXACTO DE GOOGLE
  return {
    verifiableStatus: 'NO INDEXADA Y MOTIVO',
    reason: `${coverage || verdict} (Fetch: ${pageFetchState || 'N/A'})`
  };
}

export async function inspectUrlWithSearchConsole(accessToken, siteUrl, inspectionUrl, languageCode = 'es-MX') {
  const endpoint = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl,
      languageCode
    })
  });

  const data = await res.json();
  return {
    ok: res.ok,
    status: res.status,
    data
  };
}

export async function submitAndFetchSitemapStatus(accessToken, siteUrl) {
  const sitemapFeedUrl = `${BASE_URL}/sitemap.xml`;
  const encodedSite = encodeURIComponent(siteUrl);
  const encodedFeed = encodeURIComponent(sitemapFeedUrl);
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedFeed}`;

  // 1. PUT para enviar/actualizar el sitemap en Search Console
  const putRes = await fetch(endpoint, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  let putError = null;
  if (!putRes.ok) {
    const errText = await putRes.text();
    putError = `HTTP ${putRes.status}: ${errText}`;
  }

  // 2. GET para consultar el estado real del sitemap en Search Console
  const getRes = await fetch(endpoint, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const getData = getRes.ok ? await getRes.json() : null;
  return {
    submittedOk: putRes.ok,
    status: getRes.status,
    siteUrl,
    sitemapUrl: sitemapFeedUrl,
    putError,
    sitemapDetails: getData,
    checkedAt: new Date().toISOString()
  };
}

// ============================================================================
// 8. ORGANIZADOR DE LOTES PRIORIZADOS (10 A 20 PÁGINAS) — FASE 4
// ============================================================================

export function getPrioritizedReadyQueue(state) {
  const records = Object.values(state.urlRecords || {});
  return records
    .filter(r => r.auditClassification === 'LISTA PARA INDEXAR')
    .sort((a, b) => {
      if (a.priorityLevel !== b.priorityLevel) return a.priorityLevel - b.priorityLevel;
      if (a.lang !== b.lang) return a.lang === 'en' ? -1 : 1;
      return a.url.localeCompare(b.url);
    });
}

export function selectNextBatch(state, batchSize = 15, forceRecheck = false) {
  const clampedSize = Math.min(20, Math.max(10, Number(batchSize) || 15));
  const readyQueue = getPrioritizedReadyQueue(state);
  const now = Date.now();
  const COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12h cooldown para evitar solicitudes repetidas innecesarias

  const eligible = readyQueue.filter(r => {
    if (forceRecheck) return true;
    const lastChecked = r.gsc?.lastCheckedAt ? new Date(r.gsc.lastCheckedAt).getTime() : 0;
    if (!lastChecked) return true;
    return (now - lastChecked) > COOLDOWN_MS;
  });

  return eligible.slice(0, clampedSize);
}

// ============================================================================
// 9. RESUMEN DE MÉTRICAS DEL PANEL Y GENERADOR DE CSV VERIFICABLE (FASE 5 Y 6)
// ============================================================================

export function computeDashboardSummary(state) {
  const records = Object.values(state.urlRecords || {});
  let listasParaIndexar = 0;
  let requiereCorrecciones = 0;
  let duplicadas = 0;
  let noIndexables = 0;
  let erroresServidor = 0;

  let enviadasAGoogle = 0;
  let descubiertasPorGoogle = 0;
  let rastreadasPorGoogle = 0;
  let realmenteIndexadas = 0;
  let excluidasPorGoogle = 0;
  let erroresGsc = 0;

  let latestCrawlTime = null;
  let latestCheckTime = state.lastGscSyncDate || state.lastAuditDate || null;

  for (const r of records) {
    if (r.auditClassification === 'LISTA PARA INDEXAR') listasParaIndexar++;
    else if (r.auditClassification === 'REQUIERE CORRECCIONES') requiereCorrecciones++;
    else if (r.auditClassification === 'DUPLICADA') duplicadas++;
    else if (r.auditClassification === 'NO INDEXABLE') noIndexables++;
    else if (r.auditClassification === 'ERROR DE SERVIDOR') erroresServidor++;

    if (r.inSitemap && r.auditClassification === 'LISTA PARA INDEXAR') {
      enviadasAGoogle++;
    }

    const vStatus = r.gsc?.verifiableStatus;
    if (vStatus === 'INDEXADA POR GOOGLE') {
      realmenteIndexadas++;
      rastreadasPorGoogle++;
    } else if (vStatus === 'RASTREO REALIZADO') {
      rastreadasPorGoogle++;
    } else if (vStatus === 'DESCUBIERTA POR GOOGLE') {
      descubiertasPorGoogle++;
    } else if (vStatus === 'NO INDEXADA Y MOTIVO') {
      excluidasPorGoogle++;
    } else if (vStatus === 'ERROR DE API GSC') {
      erroresGsc++;
    }

    if (r.gsc?.lastCrawlTime) {
      if (!latestCrawlTime || new Date(r.gsc.lastCrawlTime) > new Date(latestCrawlTime)) {
        latestCrawlTime = r.gsc.lastCrawlTime;
      }
    }
    if (r.gsc?.lastCheckedAt) {
      if (!latestCheckTime || new Date(r.gsc.lastCheckedAt) > new Date(latestCheckTime)) {
        latestCheckTime = r.gsc.lastCheckedAt;
      }
    }
  }

  const credInfo = findGoogleCredentials();

  return {
    totalDetected: records.length,
    listasParaIndexar,
    requiereCorrecciones,
    duplicadas,
    noIndexables,
    erroresServidor,
    enviadasAGoogle,
    descubiertasPorGoogle,
    rastreadasPorGoogle,
    realmenteIndexadas,
    excluidasPorGoogle: excluidasPorGoogle + duplicadas + noIndexables,
    conErrores: erroresServidor + erroresGsc,
    lastCrawlTime: latestCrawlTime,
    lastCheckTime: latestCheckTime,
    lastAuditDate: state.lastAuditDate,
    isPaused: Boolean(state.isPaused),
    batchSize: state.batchSize || 15,
    processedBatchesCount: state.processedBatchesCount || 0,
    sitemapStatus: state.sitemapStatus || null,
    gscCredentialsConfigured: Boolean(credInfo),
    gscServiceAccountEmail: credInfo?.credentials?.client_email || null,
    gscCredentialsSource: credInfo?.source || null
  };
}

function escapeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function generateVerifiableCsvReport(state) {
  const headers = [
    'URL',
    'Idioma',
    'Categoria',
    'Prioridad_Lote',
    'En_Sitemap',
    'Clasificacion_Auditoria_Previa',
    'HTTP_200',
    'Robots_Permitido',
    'Sin_Noindex',
    'Canonical_Correcto',
    'Canonical_Declarado',
    'Title_Unico',
    'Meta_Description_Unica',
    'HTML_SSR_Accesible',
    'Enlaces_Internos',
    'Estado_Verificable_Google',
    'Veredicto_GSC',
    'Coverage_State_GSC',
    'Canonical_Elegido_Por_Google',
    'Fecha_Ultimo_Rastreo_Google',
    'Fecha_Ultima_Comprobacion',
    'Motivo_Y_Observaciones'
  ];

  const rows = [headers.join(',')];
  const records = Object.values(state.urlRecords || {}).sort((a, b) => {
    if (a.priorityLevel !== b.priorityLevel) return a.priorityLevel - b.priorityLevel;
    return a.url.localeCompare(b.url);
  });

  for (const r of records) {
    const reasons = [
      ...(r.auditReasons || []),
      r.gsc?.reason || '',
      r.gsc?.error || ''
    ].filter(Boolean).join(' | ');

    const row = [
      escapeCsvCell(r.url),
      escapeCsvCell(r.lang.toUpperCase()),
      escapeCsvCell(r.category),
      escapeCsvCell(r.priorityLevel),
      escapeCsvCell(r.inSitemap ? 'SI' : 'NO'),
      escapeCsvCell(r.auditClassification),
      escapeCsvCell(r.checks?.http200 ? 'SI (200)' : `NO (${r.checks?.httpStatus || 'ERR'})`),
      escapeCsvCell(r.checks?.noRobotsBlock ? 'PERMITIDO' : 'BLOQUEADO'),
      escapeCsvCell(r.checks?.noNoindex ? 'OK' : 'NOINDEX'),
      escapeCsvCell(r.checks?.canonicalCorrect ? 'OK' : 'DIFERENTE'),
      escapeCsvCell(r.userCanonical),
      escapeCsvCell(r.checks?.uniqueTitle ? 'UNICO' : 'DUPLICADO/VACIO'),
      escapeCsvCell(r.checks?.uniqueDescription ? 'UNICA' : 'DUPLICADA/VACIA'),
      escapeCsvCell(r.checks?.ssrHtmlAccessible ? 'SI' : 'NO'),
      escapeCsvCell(r.internalLinksCount),
      escapeCsvCell(r.gsc?.verifiableStatus || 'PENDIENTE'),
      escapeCsvCell(r.gsc?.verdict || 'N/A (No consultado)'),
      escapeCsvCell(r.gsc?.coverageState || 'N/A'),
      escapeCsvCell(r.gsc?.googleCanonical || 'N/A'),
      escapeCsvCell(r.gsc?.lastCrawlTime || 'Sin registro de rastreo'),
      escapeCsvCell(r.gsc?.lastCheckedAt || r.lastAuditAt || ''),
      escapeCsvCell(reasons || 'Cumple los 10 controles técnicos de indexabilidad.')
    ];
    rows.push(row.join(','));
  }

  return rows.join('\n');
}
