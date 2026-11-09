// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-black-yacht-sunseeker-80/layout.js
import BaseLayout, { generateMetadata as baseMetadata } from '../yachts/papillon-9/layout.js';
import { createYachtRouteMetadata } from '../../../lib/seoHelper.js';

export const generateMetadata = createYachtRouteMetadata(baseMetadata, '/luxury-yacht-charter-cabo-san-lucas-black-yacht-sunseeker-80', {
  titleEs: 'Renta del Yate Negro en Cabo San Lucas | Sunseeker 80 FT Manhattan Papillon 9',
  titleEn: 'Luxury Black Yacht Charter Cabo San Lucas | Sunseeker 80 FT Manhattan',
  descEs: 'Alquila el famoso yate negro Sunseeker 80 FT en Cabo San Lucas (Papillon 9). Chárter privado todo incluido con chef, barra libre, 4 camarotes y hasta 30 pasajeros.',
  descEn: 'Charter the iconic 80ft Black Yacht Sunseeker Manhattan in Cabo San Lucas. All-inclusive private yacht rental for up to 30 guests with private chef, open bar & water toys.'
});

export default BaseLayout;
