// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-contessa/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/contessa/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-yacht-charter-cabo-san-lucas-contessa', {
  titleEs: 'Renta de Yate de Lujo en Cabo San Lucas | Contessa 85 FT Todo Incluido',
  titleEn: 'Luxury Yacht Charter Cabo San Lucas | Contessa 85 FT Private Cruise',
  descEs: 'Navega por Cabo San Lucas a bordo del yate de lujo Contessa de 85 pies. Chárters privados con alta cocina, barra libre premium, esnórquel, paddleboards y pesca.',
  descEn: 'Experience a luxury yacht charter in Cabo San Lucas aboard the 85ft Contessa. Private coastal cruises, sunset charters, gourmet dining, open bar, and water toys.'
});

export default BaseLayout;
