// src/app/[lang]/cabo-yacht-charters-papillon-9/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/papillon-9/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/cabo-yacht-charters-papillon-9', {
  titleEs: 'Chárter de Yate en Cabo Papillon 9 (80 FT Sunseeker) | Yate Negro Todo Incluido',
  titleEn: 'Cabo Yacht Charters Papillon 9 | 80 FT Sunseeker Manhattan Black Yacht Rental',
  descEs: 'Reserva el yate negro Sunseeker Manhattan de 80 pies Papillon 9 en Cabo San Lucas. 4 camarotes, plataforma hidráulica, chef a bordo, barra libre y hasta 30 invitados.',
  descEn: 'Book Cabo Yacht Charters aboard Papillon 9, an 80ft black Sunseeker Manhattan yacht in Cabo San Lucas. Up to 30 guests with private chef, open bar & hydraulic platform.'
});

export default BaseLayout;
