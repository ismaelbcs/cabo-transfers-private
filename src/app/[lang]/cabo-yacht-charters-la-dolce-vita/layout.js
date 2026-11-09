// src/app/[lang]/cabo-yacht-charters-la-dolce-vita/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/la-dolce-vita/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/cabo-yacht-charters-la-dolce-vita', {
  titleEs: 'Chárter de Yate en Cabo La Dolce Vita 57 FT | Paseo Privado con Barra Libre',
  titleEn: 'Cabo Yacht Charters La Dolce Vita 57 FT | Private Cruise with Open Bar & Snorkel',
  descEs: 'Renta el yate La Dolce Vita de 57 pies en Cabo San Lucas para hasta 12 personas. Chárters privados de 2, 4 y 8 horas con barra libre, snorkel y paddleboards.',
  descEn: 'Charter the 57ft La Dolce Vita yacht in Cabo San Lucas for up to 12 guests. Private 2, 4, and 8-hour Cabo yacht charters with open bar, snorkeling & paddleboards.'
});

export default BaseLayout;
