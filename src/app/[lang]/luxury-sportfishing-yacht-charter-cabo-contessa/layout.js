// src/app/[lang]/luxury-sportfishing-yacht-charter-cabo-contessa/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/contessa/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-sportfishing-yacht-charter-cabo-contessa', {
  titleEs: 'Yate de Pesca Deportiva de Lujo en Cabo | Contessa 85 FT Her Shine Marine',
  titleEn: 'Luxury Sportfishing Yacht Charter Cabo | Contessa 85 FT Offshore Fishing',
  descEs: 'Reserva pesca deportiva de altura en Cabo San Lucas a bordo del yate Contessa de 85 pies con tangones, vivero de carnada viva, equipo profesional, chef y barra libre.',
  descEn: 'Book a luxury sportfishing yacht charter in Cabo San Lucas aboard the 85ft Contessa. Outriggers, live bait well, offshore marlin gear, private chef & open bar.'
});

export default BaseLayout;
