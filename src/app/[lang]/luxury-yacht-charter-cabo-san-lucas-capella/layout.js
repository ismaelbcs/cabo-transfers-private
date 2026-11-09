// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-capella/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-yacht-charter-cabo-san-lucas-capella', {
  titleEs: 'Renta de Superyate en Cabo San Lucas | Capella 116 FT Azimut-Benetti',
  titleEn: 'Luxury Yacht Charter Cabo San Lucas | Capella 116 FT Azimut-Benetti Superyacht',
  descEs: 'Chárter privado de lujo en Cabo San Lucas a bordo del superyate Capella de 116 pies Azimut-Benetti con jacuzzi en cubierta, 5 camarotes, chef privado y lancha de 31 pies.',
  descEn: 'Book a luxury yacht charter in Cabo San Lucas aboard the 116ft Capella Azimut-Benetti superyacht with deck jacuzzi, 5 staterooms, private chef, open bar & 31ft tender.'
});

export default BaseLayout;
