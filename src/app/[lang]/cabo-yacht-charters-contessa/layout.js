// src/app/[lang]/cabo-yacht-charters-contessa/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/contessa/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/cabo-yacht-charters-contessa', {
  titleEs: 'Chárter de Yate en Cabo Contessa 85 FT | Crucero Privado y Pesca de Altura',
  titleEn: 'Cabo Yacht Charters Contessa 85 FT | Private Luxury Cruise & Sportfishing',
  descEs: 'Disfruta un chárter privado en Cabo San Lucas a bordo del yate Contessa de 85 pies. Perfecto para paseos al Arco, avistamiento de ballenas y pesca deportiva de lujo.',
  descEn: 'Book Cabo Yacht Charters aboard the 85ft Contessa in Cabo San Lucas. All-inclusive private cruising to The Arch, sunset charters, and tournament-grade sportfishing.'
});

export default BaseLayout;
