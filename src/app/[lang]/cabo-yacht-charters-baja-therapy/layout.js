// src/app/[lang]/cabo-yacht-charters-baja-therapy/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/baja-therapy/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/cabo-yacht-charters-baja-therapy', {
  titleEs: 'Chárter en Cabo Baja Therapy 30 FT | Pontón de Lujo Doble Piso con Tobogán',
  titleEn: 'Cabo Yacht Charters Baja Therapy 30 FT | Double-Deck Party Pontoon with Slide',
  descEs: 'Reserva el pontón de doble piso Baja Therapy de 30 pies en Cabo San Lucas. Ideal para fiestas y grupos de hasta 20 invitados con barra libre, tobogán y snorkel.',
  descEn: 'Book Cabo Yacht Charters aboard the 30ft Baja Therapy double-deck pontoon in Cabo San Lucas. Up to 20 guests with water slide, open bar, snorkel gear & paddleboard.'
});

export default BaseLayout;
