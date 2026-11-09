// src/app/[lang]/cabo-yacht-charters-neoprene/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/neoprene/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/cabo-yacht-charters-neoprene', {
  titleEs: 'Chárter de Superyate en Cabo Neoprene 108 FT Mangusta | Hasta 30 Invitados',
  titleEn: 'Cabo Yacht Charters Neoprene 108 FT Mangusta | Matte-Black Superyacht Rental',
  descEs: 'Experimenta el superyate negro mate Mangusta 108 Neoprene en Cabo San Lucas. Servicio todo incluido con chef privado, bartender, Seabob y capacidad para 30 personas.',
  descEn: 'Book Cabo Yacht Charters aboard the 108ft matte-black Mangusta superyacht Neoprene. All-inclusive charter for up to 30 guests with private chef, bartender & Seabob.'
});

export default BaseLayout;
