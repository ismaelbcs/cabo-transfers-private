// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-sovereign/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/sovereign/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-yacht-charter-cabo-san-lucas-sovereign', {
  titleEs: 'Renta de Superyate en Cabo San Lucas | Sovereign 130 FT (Hasta 25 Invitados)',
  titleEn: 'Luxury Yacht Charter Cabo San Lucas | Sovereign 130 FT Superyacht Rental',
  descEs: 'Reserva el superyate Sovereign de 130 pies en Cabo San Lucas para hasta 25 pasajeros. 5 camarotes, estabilizadores Zero-Speed, 2 motos acuáticas Sea-Doo y chef privado.',
  descEn: 'Luxury superyacht charter in Cabo San Lucas aboard the 130ft Sovereign for up to 25 guests. Features 5 staterooms, Zero-Speed stabilizers, 2 Sea-Doo Sparks & private chef.'
});

export default BaseLayout;
