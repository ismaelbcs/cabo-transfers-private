// src/app/[lang]/restaurants/[slug]/layout.js
import { restaurantSEOData } from '../../../../data/restaurantSEOData.js';
import { generatePageMetadata } from '../../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';

  const restaurant = restaurantSEOData.find(r => r.slug === slug);
  const restName = restaurant?.nombre || slug.replace(/-/g, ' ');
  const zona = restaurant?.zonaText || 'Los Cabos';
  const isEs = lang === 'es';

  const title = isEs
    ? `Transporte Privado a Restaurante ${restName} (${zona}) | Ballard Tours`
    : `Private Transportation to ${restName} (${zona}) | Cabo Dinner Transfers`;

  const description = isEs
    ? `Reserva transporte privado y seguro de ida y vuelta para tu cena en ${restName} (${zona}). Chofer bilingüe a tu disposición sin esperas ni preocupaciones de estacionamiento.`
    : `Book luxury private round-trip dinner transportation to ${restName} in ${zona}. Punctual private chauffeur service, no taxi lines, and pure comfort for your night out in Los Cabos.`;

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

export default function RestaurantLayout({ children }) {
  return children;
}
