// src/app/[lang]/luxury-sportfishing-yacht-charter-cabo-sovereign/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/sovereign/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-sportfishing-yacht-charter-cabo-sovereign', {
  titleEs: 'Superyate de Pesca Deportiva en Cabo | Sovereign 130 FT (Torneos y Marlin)',
  titleEn: 'Luxury Sportfishing Yacht Charter Cabo | Sovereign 130 FT Tournament Superyacht',
  descEs: 'Pesca de altura nivel torneo en Cabo San Lucas a bordo del superyate Sovereign de 130 pies con 20 carretes Shimano Talica, silla de pelea profesional y 5 camarotes.',
  descEn: 'Tournament-ready luxury sportfishing yacht charter in Cabo aboard the 130ft Sovereign. Equipped with 20 Custom Shimano Talica reels, fighting chair, and 5 staterooms.'
});

export default BaseLayout;
