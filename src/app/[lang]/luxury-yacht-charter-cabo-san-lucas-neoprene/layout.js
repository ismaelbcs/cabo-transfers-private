// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-neoprene/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/neoprene/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-yacht-charter-cabo-san-lucas-neoprene', {
  titleEs: 'Renta de Superyate en Cabo San Lucas | Neoprene 108 FT Mangusta Negro Mate',
  titleEn: 'Luxury Yacht Charter Cabo San Lucas | 108 FT Mangusta Superyacht Neoprene',
  descEs: 'Alquila el superyate negro mate Mangusta 108 Neoprene en Cabo San Lucas para hasta 30 invitados. Incluye chef privado, mixólogo, barra libre, Seabob y 4 camarotes.',
  descEn: 'Luxury superyacht charter in Cabo San Lucas aboard the matte-black 108ft Mangusta Neoprene. Up to 30 guests with Private Chef Christian, open bar, Seabob & 4 staterooms.'
});

export default BaseLayout;
