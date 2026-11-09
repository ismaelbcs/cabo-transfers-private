// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-la-dolce-vita/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/la-dolce-vita/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-yacht-charter-cabo-san-lucas-la-dolce-vita', {
  titleEs: 'Renta de Yate en Cabo San Lucas | La Dolce Vita 57 FT (Hasta 12 Personas)',
  titleEn: 'Luxury Yacht Charter Cabo San Lucas | La Dolce Vita 57 FT Private Yacht',
  descEs: 'Reserva el yate privado La Dolce Vita de 57 pies en Cabo San Lucas. Recorridos de 2, 4 y 8 horas al Arco y Bahía Chileno con barra libre, snorkel y paddleboards.',
  descEn: 'Luxury yacht charter in Cabo San Lucas aboard the 57ft La Dolce Vita. Private 2, 4, and 8-hour cruises to The Arch for up to 12 guests with open bar & snorkeling.'
});

export default BaseLayout;
