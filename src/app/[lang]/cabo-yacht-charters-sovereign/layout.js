// src/app/[lang]/cabo-yacht-charters-sovereign/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/sovereign/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/cabo-yacht-charters-sovereign', {
  titleEs: 'Chárter de Superyate en Cabo Sovereign 130 FT | Lujo y Pesca para 25 Personas',
  titleEn: 'Cabo Yacht Charters Sovereign 130 FT | Luxury Superyacht & Sportfisher Rental',
  descEs: 'Alquila el superyate Sovereign de 130 pies en Cabo San Lucas. Estabilizadores Zero-Speed, 2 Sea-Doo Sparks, lancha de 18ft, chef privado y capacidad para 25 invitados.',
  descEn: 'Book Cabo Yacht Charters aboard the 130ft Sovereign superyacht in Cabo San Lucas. Zero-Speed stabilizers, 2 Sea-Doo Sparks, 18ft tender, private chef & up to 25 guests.'
});

export default BaseLayout;
