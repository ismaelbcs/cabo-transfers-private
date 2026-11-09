// src/app/[lang]/luxury-sportfishing-yacht-charter-cabo-papillon-9/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/papillon-9/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-sportfishing-yacht-charter-cabo-papillon-9', {
  titleEs: 'Yate de Pesca y Crucero de Lujo en Cabo | Papillon 9 Sunseeker 80 FT',
  titleEn: 'Luxury Sportfishing & Yacht Charter Cabo | Papillon 9 (80 FT Sunseeker)',
  descEs: 'Vive la pesca deportiva y navegación de lujo en Cabo San Lucas a bordo del Sunseeker Manhattan de 80 pies Papillon 9 con equipo de pesca, chef privado y barra libre.',
  descEn: 'Combine luxury cruising and sportfishing in Cabo San Lucas aboard the 80ft Sunseeker Manhattan Papillon 9 with fishing gear, hydraulic platform, private chef & open bar.'
});

export default BaseLayout;
