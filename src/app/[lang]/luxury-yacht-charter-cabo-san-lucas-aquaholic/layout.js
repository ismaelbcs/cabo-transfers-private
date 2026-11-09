// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-aquaholic/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/aquaholic/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-yacht-charter-cabo-san-lucas-aquaholic', {
  titleEs: 'Renta de Yate de Lujo en Cabo San Lucas | Aquaholic 110 FT Horizon (30 Pax)',
  titleEn: 'Luxury Yacht Charter Cabo San Lucas | 110 FT Horizon Aquaholic Superyacht',
  descEs: 'Renta privada del superyate Horizon Aquaholic de 110 pies en Cabo San Lucas. Capacidad hasta 30 invitados, 4 camarotes, chef privado, mixólogo y juguetes acuáticos.',
  descEn: 'Luxury yacht charter in Cabo San Lucas aboard the 110ft Horizon Aquaholic. Host up to 30 guests with 4 staterooms, private chef, mixologist, open bar & water toys.'
});

export default BaseLayout;
