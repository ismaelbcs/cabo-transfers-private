// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-baja-therapy/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/baja-therapy/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-yacht-charter-cabo-san-lucas-baja-therapy', {
  titleEs: 'Renta de Pontón de Lujo en Cabo San Lucas | Baja Therapy 30 FT Doble Piso',
  titleEn: 'Luxury Yacht & Pontoon Charter Cabo San Lucas | 30 FT Baja Therapy (20 Guests)',
  descEs: 'Celebra en Cabo San Lucas a bordo de Baja Therapy, pontón de lujo de 30 pies y doble piso con tobogán, barra libre, sonido Bluetooth y snorkel para hasta 20 personas.',
  descEn: 'Private party boat and pontoon charter in Cabo San Lucas aboard the 30ft double-deck Baja Therapy. Up to 20 guests with upper deck slide, open bar & snorkel gear.'
});

export default BaseLayout;
