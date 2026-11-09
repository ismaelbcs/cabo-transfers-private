// src/app/[lang]/cabo-yacht-charters-aquaholic/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/aquaholic/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/cabo-yacht-charters-aquaholic', {
  titleEs: 'Chárter de Yate en Cabo Aquaholic 110 FT | Renta Todo Incluido para 30 Personas',
  titleEn: 'Cabo Yacht Charters Aquaholic 110 FT Horizon | All-Inclusive Charter for 30 Guests',
  descEs: 'Alquila el yate Aquaholic de 110 pies en Cabo San Lucas con servicio todo incluido para hasta 30 pasajeros, chef privado, mixólogo, barra libre y juguetes acuáticos.',
  descEn: 'Book Cabo Yacht Charters aboard the 110ft Horizon Aquaholic. Private all-inclusive Los Cabos yacht charter for up to 30 guests with chef, mixologist, open bar & water toys.'
});

export default BaseLayout;
