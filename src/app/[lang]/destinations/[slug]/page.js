// src/app/[lang]/destinations/[slug]/page.js
'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, PlaneLanding, CheckCircle, Clock, Map, ShieldCheck, 
  Car, Users, Banknote, Calendar, Baby, ChevronRight 
} from 'lucide-react';

// 1. IMPORTAMOS EL CONTEXTO (Ajusta los '../' si tu carpeta context está a otro nivel)
import { useBooking } from '../../../../context/BookingContext';

// =========================================================
// 🏨 BASE DE DATOS DE HOTELES (LANDING PAGES SEO)
// =========================================================
export const landingPagesSEO = [
  // ================= ZONA 1 =================
  { slug: 'sjd-to-hyatt-ziva', nombre: 'Hyatt Ziva Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'hyatt-ziva-los-cabos-airport-sjd.webp', desc: 'the perfect family oasis in San Jose' },
  { slug: 'sjd-to-cabo-azul', nombre: 'Cabo Azul Resort', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '16 km', image: 'cabo-azul-los-cabos-to-airport-sjd.webp', desc: 'an elegant coastal retreat' },
  { slug: 'sjd-to-royal-solaris', nombre: 'Royal Solaris', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'royal-solaris-los-cabos-airport-sjd.webp', desc: 'an all-inclusive family paradise' },
  { slug: 'sjd-to-park-royal', nombre: 'Park Royal Homestay Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'park-royal-homestay-los-cabos-sjd-airport.webp', desc: 'your home away from home' },
  { slug: 'sjd-to-el-encanto-inn', nombre: 'El Encanto Inn & Suites', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '14 km', image: 'el-encanto-inn-los-cabos-airport-sjd.webp', desc: 'a charming boutique hotel' },
  { slug: 'sjd-to-royal-decameron', nombre: 'Royal Decameron Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '16 km', image: 'royal-decameron-los-cabos-airport-sjd.webp', desc: 'an amazing all-inclusive experience' },
  { slug: 'sjd-to-viceroy', nombre: 'Viceroy Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'viceroy-los-cabos-airport-sjd.webp', desc: 'a modern architectural masterpiece' },
  { slug: 'sjd-to-barcelo-gran-faro', nombre: 'Barceló Gran Faro', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '16 km', image: 'barcelo-gran-faro-airport-sjd.webp', desc: 'a magnificent all-inclusive resort' },
  { slug: 'sjd-to-krystal-grand', nombre: 'Krystal Grand Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'krystal-grand-airport-sjd.webp', desc: 'a vibrant escape by the sea' },
  { slug: 'sjd-to-holiday-inn-resort', nombre: 'Holiday Inn Resort', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '14 km', image: 'holiday-inn-resort-airport-sjd.webp', desc: 'comfort and fun for the whole family' },
  { slug: 'sjd-to-posada-real', nombre: 'Posada Real', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'posada-real-airport-sjd.webp', desc: 'a traditional Mexican beach resort' },
  { slug: 'sjd-to-casa-natalia', nombre: 'Casa Natalia', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '13 km', image: 'casa-natalia-airport-sjd.webp', desc: 'an intimate boutique oasis' },
  { slug: 'sjd-to-alegranza', nombre: 'Alegranza Luxury Resort', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '14 km', image: 'alegranza-airport-sjd.webp', desc: 'premier luxury living' },
  { slug: 'sjd-to-las-mananitas', nombre: 'Las Mañanitas', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'las-mananitas-airport-sjd.webp', desc: 'beachfront elegance in San Jose' },
  { slug: 'sjd-to-gr-solaris-lighthouse', nombre: 'GR Solaris Lighthouse Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'gr-solaris-lighthouse-airport-sjd.webp', desc: 'a scenic all-inclusive getaway' },
  // NUEVOS ZONA 1
  { slug: 'sjd-to-mykonos-los-cabos', nombre: 'Mykonos Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'mykonos-los-cabos-airport-transportation-shuttle-ballard-taxi.webp', desc: 'beautiful beachfront condos' },
  { slug: 'sjd-to-casa-costa-azul', nombre: 'Hotel Casa Costa Azul', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'casa-costa-azul-los-cabos-airport-transportation-private-ballard.webp', desc: 'boutique oceanfront retreat' },
  { slug: 'sjd-to-soleado-resort', nombre: 'Soleado Resort', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'soleado-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'relaxing resort getaway' },
  { slug: 'sjd-to-las-olas-condominiums', nombre: 'Las Olas Condominiums, Lets Do Mexico', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'las-olas-condominiums-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'premier beachfront living' },
  { slug: 'sjd-to-cabo-surf-hotel', nombre: 'Cabo Surf Hotel & Spa', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'cabo-surf-hotel-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'a surfer paradise' },
  { slug: 'sjd-to-ocean-residence', nombre: 'OCEAN RESIDENCE', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'ocean-residence-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'exclusive coastal residence' },
  { slug: 'sjd-to-querencia', nombre: 'Querencia', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'querencia-los-cabos-cover-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'private golf community' },
  { slug: 'sjd-to-villa-vista-del-mar', nombre: 'Villa Vista del Mar', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'exterior-villa-vista-al-mar-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'stunning ocean view villa' },
  { slug: 'sjd-to-ocean-spirits', nombre: 'Ocean Spirits', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'ocean-spirits-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'tranquil coastal stay' },
  { slug: 'sjd-to-tropical-oasis', nombre: 'Tropical oasis', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'san-jose-del-cabo-tropical-oasis-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'lush tropical getaway' },
  { slug: 'sjd-to-mariamar-suites', nombre: 'MariaMar Suites', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'mariamar-suites-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'comfortable coastal suites' },

  // ================= ZONA 2 =================
  { slug: 'sjd-to-grand-velas', nombre: 'Grand Velas Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '35 km', image: 'panoramic-grand-velas-los-cabos-velas-resorts-airport-sjd-san-jose-del-cabo.jpg', desc: 'ultra-luxury all-inclusive living' },
  { slug: 'sjd-to-la-pacifica', nombre: 'La Pacifica by Hilton', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'Hilton-los-cabos-airport-sjd.webp', desc: 'a premier luxury vacation club' },
  { slug: 'sjd-to-garza-blanca', nombre: 'Garza Blanca Resort', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'garza-blanca-resort-spa-los-cabos-airport-sjd.webp', desc: 'contemporary elegance by the sea' },
  { slug: 'sjd-to-dreams-los-cabos', nombre: 'Dreams Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '32 km', image: 'dreams-los-cabos-sjd-airport.webp', desc: 'a limitless beachfront escape' },
  { slug: 'sjd-to-hilton-los-cabos', nombre: 'Hilton Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'Hilton-los-cabos-airport-sjd.webp', desc: 'a premier golf and beach resort' },
  { slug: 'sjd-to-solaz', nombre: 'Solaz Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '33 km', image: 'solaz-los-cabos-sjd-airport-ballard.webp', desc: 'an architectural masterpiece' },
  { slug: 'sjd-to-villa-la-valencia', nombre: 'Villa La Valencia', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '32 km', image: 'villa-la-valencia-los-cabos-sjd-airport.webp', desc: 'the ultimate luxury family getaway' },
  { slug: 'sjd-to-marquis', nombre: 'Marquis Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'Marquis-los-cabos-airport-sjd-ballard.webp', desc: 'an adults-only sanctuary' },
  { slug: 'sjd-to-las-ventanas-al-paraiso', nombre: 'Las Ventanas al Paraíso (A Rosewood Resort)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '31 km', image: 'Extetrior3Tout-LasVentanasalParaiso-Mexico-los-cabos-airport.webp', desc: 'the pinnacle of Cabo luxury' },
  { slug: 'sjd-to-secrets-puerto-los-cabos', nombre: 'Secrets Puerto Los Cabos Golf & Spa Resort', zona: 2, zonaText: 'San José (Puerto Los Cabos)', tiempo: '30-35 min', dist: '22 km', image: 'secrets-los-cabos-to-airport-san-jose-del-cabo.webp', desc: 'an adults-only haven' },
  { slug: 'sjd-to-jw-marriott', nombre: 'JW Marriott Los Cabos Beach Resort & Spa', zona: 2, zonaText: 'San José (Puerto Los Cabos)', tiempo: '30-35 min', dist: '23 km', image: 'jw-marriott-los-cabos-airport-sjd.webp', desc: 'where luxury meets the sea' },
  { slug: 'sjd-to-one-and-only-palmilla', nombre: 'One&Only Palmilla', zona: 2, zonaText: 'Tourist Corridor', tiempo: '25-30 min', dist: '25 km', image: 'one-and-only-palmilla-los-cabos-airport-sjd.webp', desc: 'a legendary luxury retreat' },
  { slug: 'sjd-to-el-ganzo', nombre: 'Hotel El Ganzo', zona: 2, zonaText: 'San José (Puerto Los Cabos)', tiempo: '30-35 min', dist: '20 km', image: 'hotel-el-ganzo-los-cabos-airport-sjd.webp', desc: 'an artistic and boutique escape' },
  { slug: 'sjd-to-paradisus', nombre: 'Paradisus', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '28 km', image: 'paradisus-los-cabos-airport-sjd.webp', desc: 'a stunning all-inclusive oasis' },
  { slug: 'sjd-to-casa-del-mar-zoetry', nombre: 'Casa del Mar / Zoëtry', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '31 km', image: 'casa-del-mar-zoetry-los-cabos-airport-sjd.webp', desc: 'a boutique hacienda paradise' },
  { slug: 'sjd-to-le-blanc', nombre: 'Le Blanc Spa Resort', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '32 km', image: 'le-blanc-airport-sjd.webp', desc: 'an exquisite adults-only oasis' },
  { slug: 'sjd-to-mar-del-cabo', nombre: 'Mar del Cabo', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'mar-del-cabo-airport-sjd.webp', desc: 'a classic boutique experience' },
  { slug: 'sjd-to-las-residencias', nombre: 'Las Residencias Golf & Beach Club', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '31 km', image: 'las-residencias-airport-sjd.webp', desc: 'luxury villas on the sea' },
  { slug: 'sjd-to-zadun', nombre: 'Zadún (A Ritz-Carlton Reserve)', zona: 2, zonaText: 'San José (Puerto Los Cabos)', tiempo: '30-35 min', dist: '24 km', image: 'zadun-airport-sjd.webp', desc: 'a striking natural retreat' },
  // NUEVOS ZONA 2
  { slug: 'sjd-to-solaz-resort', nombre: 'Solaz Resort', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '33 km', image: 'solaz-los-cabos-transportation-airport-private-taxi.webp', desc: 'a luxury collection resort' },
  { slug: 'sjd-to-villa-la-valencia-resort', nombre: 'Villa La Valencia', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '32 km', image: 'step-into-luxury-at-villa-la-valencia-los-cabos-resort-transportation-airport-private-taxi.webp', desc: 'luxury family escape' },
  { slug: 'sjd-to-cabo-real', nombre: 'Cabo Real', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'cabo-real-golf-los-cabos-transportation-airport-shuttle-taxi-uber.webp', desc: 'premier golf resort' },
  { slug: 'sjd-to-hampton-inn', nombre: 'Hampton Inn & Suites by Hilton Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '28 km', image: 'hampton-inn-los-cabos-airport-transportation-private-taxi-uber.webp', desc: 'comfort and convenience' },
  { slug: 'sjd-to-sol-de-cabo', nombre: 'Sol de Cabo', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'sol-de-cabo-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'beautiful coastal views' },
  { slug: 'sjd-to-casa-cielo', nombre: 'Casa Cielo', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: '1-Casa-Cielo-Pedregal-Los-Cabos-Aerial-airport-transportation-taxi-uber-cabo-ballard.webp', desc: 'exclusive cliffside retreat' },
  { slug: 'sjd-to-villa-del-mar', nombre: 'Villa Del Mar', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'villa-del-mar-los-cabos-airport-transportation-shuttle-ballard.webp', desc: 'luxury private living' },
  { slug: 'sjd-to-club-regina', nombre: 'Club Regina Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '28 km', image: 'club-regina-los-cabos-airport-transportation-taxi-uber-ballard.webp', desc: 'striking architecture on the coast' },
  { slug: 'sjd-to-dorado', nombre: 'Dorado', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'El-Dorado-los-cabos-airport-ballard-transportation-private-cabo.webp', desc: 'exclusive golf and beach club' },
  { slug: 'sjd-to-westin-los-cabos', nombre: 'The Westin Los Cabos Resort Villas - Baja Point', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '28 km', image: 'the-westin-los-cabos-airport-private-transportation-ballard-taxi-uber.webp', desc: 'iconic coastal luxury' },
  { slug: 'sjd-to-las-gardenias-condominiums', nombre: 'Las Gardenias Condominiums', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'gardenias-los-cabos-airport-private-transportation-ballard-taxi-uber.webp', desc: 'exclusive private condos' },
  { slug: 'sjd-to-ty-warner-mansion', nombre: 'Ty Warner Mansion', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '31 km', image: 'rosewood-ventanas-ty-warner-villa-mansion-cabo-airport-los-cabos-ballard-taxi-uber-transportation.webp', desc: 'the ultimate luxury estate' },
  { slug: 'sjd-to-grand-velas-boutique', nombre: 'Grand Velas Boutique Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '35 km', image: 'grand-velas-boutique-los-cabos-airport-transportation-private-ballard-taxi-uber.webp', desc: 'intimate luxury resort' },
  { slug: 'sjd-to-chileno-bay-resort', nombre: 'Chileno Bay Resort & Residences, Auberge Collection', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '38 km', image: 'chileno-bay-resort-residences-los-cabos-airport-transportation-ballard-taxi.webp', desc: 'modern beachfront sanctuary' },

  // ================= ZONA 3 =================
  { slug: 'sjd-to-waldorf-astoria', nombre: 'Waldorf Astoria Los Cabos Pedregal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-55 min', dist: '48 km', image: 'waldorf-astoria-los-cabos-pedregal-to-airport-sjd.webp', desc: 'exclusive elegance beyond the tunnel' },
  { slug: 'sjd-to-grand-solmar', nombre: 'Grand Solmar Land\'s End', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-55 min', dist: '47 km', image: 'grand-solmar-land-s-end-los-cabos-airport-sjd.webp', desc: 'a spectacular resort at Land\'s End' },
  { slug: 'sjd-to-chileno-bay', nombre: 'Chileno Bay Resort & Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '38 km', image: 'chileno-bay-resort-residences-los-cabos-airport.webp', desc: 'modern luxury on a swimmable beach' },
  { slug: 'sjd-to-montage', nombre: 'Montage Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '40 km', image: 'montage-los-cabos-airport-sjd-ballard.webp', desc: 'serene luxury at Santa Maria Bay' },
  { slug: 'sjd-to-grand-fiesta-americana', nombre: 'Grand Fiesta Americana', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '42 km', image: 'grand-fiesta-americana-los-cabos-airport-sjd.webp', desc: 'a classic grand resort experience' },
  { slug: 'sjd-to-pueblo-bonito-rose', nombre: 'Pueblo Bonito Rose', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'pueblo-bonito-rose-los-cabos-airport-sjd.webp', desc: 'Mediterranean elegance on Medano Beach' },
  { slug: 'sjd-to-riu-santa-fe', nombre: 'Riu Santa Fe', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '43 km', image: 'riu-santa-fe-los-cabos-airport-sjd.webp', desc: 'the ultimate party and family resort' },
  { slug: 'sjd-to-villa-del-arco', nombre: 'Villa del Arco Beach Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'villa-del-arco-los-cabos-sjd-airport.webp', desc: 'a premium family-friendly destination' },
  { slug: 'sjd-to-villa-la-estancia', nombre: 'Villa La Estancia Beach Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'optimizada_Villa-La-Estancia-Los-Cabos-sjd-airport.webp', desc: 'luxury and comfort combined' },
  { slug: 'sjd-to-villa-del-palmar', nombre: 'Villa del Palmar Beach Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'villa-del-palmar-los-cabos-sjd-airport.webp', desc: 'an iconic beach resort' },
  { slug: 'sjd-to-riu-palace-baja-california', nombre: 'Riu Palace Baja California', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '43 km', image: 'Hotel-Review-Riu-Palace-Baja-California-los-cabos-sirport-sjd.webp', desc: 'adults-only luxury and fun' },
  { slug: 'sjd-to-riu-palace', nombre: 'Riu Palace Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '43 km', image: 'riu-palace-los-cabos-airport-sjd.webp', desc: 'stunning views and premium service' },
  { slug: 'sjd-to-pueblo-bonito-blanco', nombre: 'Pueblo Bonito Blanco (Los Cabos Beach Resort)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'pueblo-bonito-blanco-los-cabos-airport-sjd.webp', desc: 'the original Medano Beach classic' },
  { slug: 'sjd-to-breathless', nombre: 'Breathless Cabo San Lucas Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '46 km', image: 'BREATHLESS-II-scaled-1-los-cabos-airport-sjd-ballard.webp', desc: 'vibrant energy by the marina' },
  { slug: 'sjd-to-playa-grande', nombre: 'Playa Grande Resort', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-55 min', dist: '47 km', image: 'playa-grande-los-cabos-airport-sjd.webp', desc: 'a hacienda-style escape' },
  { slug: 'sjd-to-fairfield', nombre: 'Fairfield Inn by Marriott Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '43 km', image: 'fairfield-los-cabos-airport-sjd.webp', desc: 'comfort and convenience' },
  { slug: 'sjd-to-hacienda-del-mar', nombre: 'Hacienda del Mar Los Cabos Resort', zona: 3, zonaText: 'Cabo San Lucas (Cabo del Sol)', tiempo: '40-45 min', dist: '41 km', image: 'private-transportation-sjd-airport-los-cabos-luxury.webp', desc: 'a traditional Mexican oasis' },
  { slug: 'sjd-to-park-hyatt', nombre: 'Park Hyatt Los Cabos at Cabo del Sol', zona: 3, zonaText: 'Cabo San Lucas (Cabo del Sol)', tiempo: '40-45 min', dist: '41 km', image: 'park-hyatt-airport-sjd.webp', desc: 'refined luxury at Cabo del Sol' },
  { slug: 'sjd-to-villas-cabo-del-sol', nombre: 'Villas de Cabo del Sol', zona: 3, zonaText: 'Cabo San Lucas (Cabo del Sol)', tiempo: '40-45 min', dist: '41 km', image: 'villas-cabo-del-sol-airport-sjd.webp', desc: 'exclusive villas with golf views' },
  { slug: 'sjd-to-corazon-cabo', nombre: 'Corazón Cabo Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'corazon-cabo-airport-sjd.webp', desc: 'the heart of Medano Beach' },
  { slug: 'sjd-to-me-cabo', nombre: 'ME Cabo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'me-cabo-airport-sjd.webp', desc: 'chic and vibrant beachfront living' },
  { slug: 'sjd-to-marina-fiesta', nombre: 'Marina Fiesta Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '45 km', image: 'marina-fiesta-airport-sjd.webp', desc: 'stay right on the marina' },
  { slug: 'sjd-to-bahia-hotel', nombre: 'Bahía Hotel & Beach House', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'bahia-hotel-airport-sjd.webp', desc: 'an urban chic beach getaway' },
  { slug: 'sjd-to-los-milagros', nombre: 'Los Milagros Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '45 km', image: 'los-milagros-airport-sjd.webp', desc: 'a hidden gem in downtown' },
  { slug: 'sjd-to-the-bungalows', nombre: 'The Bungalows Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '46 km', image: 'the-bungalows-airport-sjd.webp', desc: 'a cozy and intimate stay' },
  { slug: 'sjd-to-cabo-vista', nombre: 'Cabo Vista Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '45 km', image: 'cabo-vista-airport-sjd.webp', desc: 'comfort close to the action' },
  { slug: 'sjd-to-siesta-suites', nombre: 'Siesta Suites', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '46 km', image: 'siesta-suites-airport-sjd.webp', desc: 'affordable downtown convenience' },
  { slug: 'sjd-to-city-express-plus', nombre: 'City Express Plus by Marriott Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '40 km', image: 'city-express-plus-airport-sjd.webp', desc: 'modern business and leisure comfort' },
  { slug: 'sjd-to-holiday-inn-express-csl', nombre: 'Holiday Inn Express Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'holiday-inn-express-csl-airport-sjd.webp', desc: 'reliable and convenient lodging' },
  { slug: 'sjd-to-el-tezal', nombre: 'El Tezal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '40 km', image: 'el-tezal-airport-sjd.webp', desc: 'residential tranquility near the city' },
  { slug: 'sjd-to-villas-del-tezal', nombre: 'Villas del Tezal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '40 km', image: 'villas-del-tezal-airport-sjd.webp', desc: 'beautiful villas with ocean views' },
  { slug: 'sjd-to-casas-de-pedregal', nombre: 'Casas de Pedregal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '50-55 min', dist: '48 km', image: 'casas-de-pedregal-airport-sjd.webp', desc: 'exclusive cliffside residences' },
  { slug: 'sjd-to-villas-de-pedregal', nombre: 'Villas de Pedregal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '50-55 min', dist: '48 km', image: 'villas-de-pedregal-airport-sjd.webp', desc: 'luxury private villas' },
  { slug: 'sjd-to-the-cape', nombre: 'The Cape, a Thompson Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '42 km', image: 'the-cape-airport-sjd.webp', desc: 'a boutique luxury hotel' },
  { slug: 'sjd-to-misiones-del-cabo', nombre: 'Misiones del Cabo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '42 km', image: 'misiones-del-cabo-airport-sjd.webp', desc: 'cliffside serenity' },
  { slug: 'sjd-to-cabo-bello', nombre: 'Cabo Bello', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'cabo-bello-airport-sjd.webp', desc: 'private beach community' },
  { slug: 'sjd-to-villas-de-cabo-bello', nombre: 'Villas de Cabo Bello', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'villas-de-cabo-bello-airport-sjd.webp', desc: 'charming community living' },
  { slug: 'sjd-to-sirena-del-mar', nombre: 'Sirena del Mar (Hyatt Vacation Club)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '42 km', image: 'sirena-del-mar-airport-sjd.webp', desc: 'cliffside resort overlooking the sea' },
  { slug: 'sjd-to-esperanza', nombre: 'Esperanza, Auberge Resorts Collection', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'esperanza-airport-sjd.webp', desc: 'a world-renowned luxury retreat' },
  { slug: 'sjd-to-hacienda-encantada', nombre: 'Hacienda Encantada Resort & Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'hacienda-encantada-airport-sjd.webp', desc: 'Mexican tradition meets luxury' },
  { slug: 'sjd-to-vista-encantada', nombre: 'Vista Encantada Spa Resort & Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'vista-encantada-airport-sjd.webp', desc: 'unparalleled views and relaxation' },
  { slug: 'sjd-to-villas-hacienda-encantada', nombre: 'Villas de Hacienda Encantada', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'villas-hacienda-encantada-airport-sjd.webp', desc: 'spacious private luxury' },

  // ================= ZONA 4 =================
  { slug: 'sjd-to-pueblo-bonito-sunset', nombre: 'Pueblo Bonito Sunset Beach', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'pueblo-bonito-sunset-to-airport-sjd.webp', desc: 'a secluded resort on the Pacific bluff' },
  { slug: 'sjd-to-hard-rock', nombre: 'Hard Rock Hotel Los Cabos', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '55 km', image: 'hard-rock-los-cabos-airport-sjd.webp', desc: 'where luxury rocks on the Pacific coast' },
  { slug: 'sjd-to-nobu-hotel', nombre: 'Nobu Hotel Los Cabos', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '56 km', image: 'nobu-los-cabos-airport-sjd-ballard.webp', desc: 'Japanese minimalism meets Cabo luxury' },
  { slug: 'sjd-to-diamante', nombre: 'Diamante Cabo San Lucas', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '55 km', image: 'diamante-los-cabos-airport-sjd.webp', desc: 'a world-class golf and beach paradise' },
  { slug: 'sjd-to-pueblo-bonito-pacifica', nombre: 'Pueblo Bonito Pacífica (y The Towers)', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'pueblo-bonito-pacifica-airport-sjd.webp', desc: 'an adults-only tranquil escape' },
  { slug: 'sjd-to-grand-solmar-pacific-dunes', nombre: 'Grand Solmar Pacific Dunes', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '55 km', image: 'grand-solmar-pacific-dunes-airport-sjd.webp', desc: 'luxury surrounded by dramatic dunes' },
  { slug: 'sjd-to-montecristo-estates', nombre: 'Montecristo Estates Luxury Villas', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'montecristo-estates-airport-sjd.webp', desc: 'opulent cliffside villas' },
  { slug: 'sjd-to-quivira-novaispania', nombre: 'Quivira Novaispania Residences', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '51 km', image: 'quivira-novaispania-airport-sjd.webp', desc: 'exclusive residential luxury' },
  { slug: 'sjd-to-st-regis-los-cabos', nombre: 'The St. Regis Los Cabos at Quivira', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '52 km', image: 'st-regis-los-cabos-airport-sjd.webp', desc: 'unrivaled luxury and bespoke service' },
  // NUEVOS ZONA 4
  { slug: 'sjd-to-pueblo-bonito-pacifica-towers', nombre: 'Pueblo Bonito Pacífica (y The Towers)', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'pueblo-bonito-pacifica-airport-sjd.webp', desc: 'an adults-only tranquil escape' }
];

// Matriz de precios simplificada por Zona
const zonasPrecios = [
  { id: 1, tarifaSuburban: 80, tarifaSprinter: 110 },
  { id: 2, tarifaSuburban: 90, tarifaSprinter: 120 },
  { id: 3, tarifaSuburban: 110, tarifaSprinter: 140 },
  { id: 4, tarifaSuburban: 140, tarifaSprinter: 160 }
];

export default function DestinationPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en'; // Inglés como principal por tu solicitud
  const slug = resolvedParams?.slug || '';
  const router = useRouter();

  // 2. OBTENEMOS LAS FUNCIONES DEL CONTEXTO
  const { setReserva, setServicioSeleccionado, setPaso, setBusquedaHotelPrincipal } = useBooking();

  // Buscamos la info del hotel en la base de datos
  const hotel = landingPagesSEO.find(h => h.slug === slug);

  // Si alguien escribe una URL que no existe
  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{lang === 'es' ? 'Hotel no encontrado' : 'Hotel not found'}</h1>
        <Link href={`/${lang}`} className="text-blue-600 font-bold hover:underline">
          {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </Link>
      </div>
    );
  }

  // Precios dinámicos basados en la zona del hotel
  const tarifaVehiculo = zonasPrecios.find(z => z.id === hotel.zona) || { tarifaSuburban: 80, tarifaSprinter: 110 };

  return (
    <div className="animate-fade-in pb-10 bg-white font-sans selection:bg-slate-900 selection:text-white">
      <title>Private Transportation from SJD Airport to {hotel.nombre}</title>
      <meta name="description" content={`Book your private luxury transportation from SJD Airport to ${hotel.nombre}. Flat rates, bilingual drivers, and 100% private VIP service.`} />
      {/* Añadido SEO Json-LD de la otra versión */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Private Transportation to ${hotel.nombre}`,
        "provider": {
          "@type": "LocalBusiness",
          "name": "Ballard Tours"
        },
        "areaServed": "Los Cabos, Baja California Sur",
        "description": `Premium private airport transfer from SJD to ${hotel.nombre}.`
      })}} />

      {/* ========================================= */}
      {/* HERO DE RUTA ESPECÍFICA (Diseño Premium) */}
      {/* ========================================= */}
      <div className="relative bg-slate-950 text-white py-28 md:py-36 px-4 overflow-hidden shadow-xl rounded-b-[2.5rem] mb-12 border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img src={`/${hotel.image}`} alt={`Airport transfer to ${hotel.nombre}`} className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10"></div>

        <div className="relative max-w-4xl mx-auto text-center z-20">
          <div className="flex justify-center items-center gap-4 mb-6 text-slate-400">
            <PlaneLanding size={28} />
            <span className="border-t border-dashed border-slate-500 w-16"></span>
            <MapPin size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight text-white drop-shadow-md">
            {lang === 'es' ? `Transporte Privado a ${hotel.nombre}` : `SJD Airport Transportation to ${hotel.nombre}`}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium">
            {lang === 'es' ? 'Servicio Exclusivo en Luxury SUV y Sprinter' : 'Exclusive Private Transportation & Luxury SUV Service'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ========================================= */}
        {/* COLUMNA PRINCIPAL DE CONTENIDO            */}
        {/* ========================================= */}
        <div className="lg:col-span-2 space-y-12 text-slate-700 text-lg leading-relaxed">

          {/* Intro */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">
              {lang === 'es' ? `Traslados VIP hacia ${hotel.nombre}` : `Cabo Airport Transportation to ${hotel.nombre}`}
            </h2>
            <p className="mb-4 text-slate-600 text-base md:text-lg">
              {lang === 'es'
                ? `¿Planeando un viaje a Cabo San Lucas o San José del Cabo? Asegurar un traslado sin contratiempos desde el Aeropuerto Internacional SJD hasta tu hotel es crucial. Cuando consideras el transporte hacia ${hotel.nombre}, un resort de primer nivel en la zona de ${hotel.zonaText}, no puedes dejar las cosas al azar. Tu lujosa estadía espera por ti.`
                : `Planning a trip to Cabo San Lucas or San Jose del Cabo? Ensuring smooth airport transportation from Cabo Airport to your hotel is crucial. When considering Cabo Airport transportation to ${hotel.nombre}, a top resort located in ${hotel.zonaText}, you shouldn't leave logistics to chance. Your luxurious stay and ${hotel.desc} awaits your arrival.`}
            </p>
          </section>

          {/* KEY TAKEAWAYS (Diseño limpio y moderno) */}
          <section className="bg-slate-50 border border-slate-200 p-8 rounded-2xl my-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">{lang === 'es' ? 'Puntos Clave' : 'Key Takeaways'}</h3>
            <ul className="space-y-4 text-slate-700 text-sm md:text-base font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-slate-900" />
                <span>{lang === 'es' ? `El servicio directo ofrece viajes 100% privados desde $${tarifaVehiculo.tarifaSuburban} USD.` : `Shuttle service offers 100% private, direct rides starting at $${tarifaVehiculo.tarifaSuburban} USD.`}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-slate-900" />
                <span>{lang === 'es' ? `Reservar con anticipación en Ballard Tours garantiza puntualidad, bebidas de cortesía y cero tiempos de espera.` : `Pre-booking at Ballard Tours guarantees your ${hotel.nombre} shuttle with timely service, complimentary beverages, and smooth transfers.`}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-slate-900" />
                <span>{lang === 'es' ? `La flota incluye SUVs de Lujo y Sprinter Vans para asegurar la máxima comodidad VIP.` : `Transportation options focus on Private Transfers, including Luxury SUVs and Sprinter Vans, catering to comfort and VIP needs.`}</span>
              </li>
            </ul>
          </section>

          {/* Beneficios */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">
              {lang === 'es' ? `Tarifas y Beneficios Exclusivos` : `Exclusive Private Transfers & Rates`}
            </h2>
            <ul className="list-disc pl-5 space-y-3 mb-8 text-slate-700 text-sm md:text-base">
              <li>{lang === 'es' ? `Traslado exclusivo y directo desde el aeropuerto SJD a ${hotel.nombre} servicio puerta a puerta profesional.` : `Exclusive, non‑stop transfer directly from SJD airport to ${hotel.nombre} door to door professional service.`}</li>
              <li>{lang === 'es' ? 'Salida flexible—tu horario, tu traslado.' : 'Flexible departure—your schedule, your transfer.'}</li>
              <li>{lang === 'es' ? 'Vehículos modernos con choferes bilingües y bebidas de cortesía incluidas.' : 'Modern, comfortable vehicles with licensed bilingual drivers, beverages included.'}</li>
              <li>{lang === 'es' ? 'Viaja en vehículos lujosos, espaciosos y desinfectados.' : 'Travel in spacious, sanitized, and air-conditioned luxury vehicles.'}</li>
              <li>{lang === 'es' ? 'Precio garantizado—sin tarifas ocultas ni tarifas dinámicas.' : 'Guaranteed pricing—no hidden fees, toll charges, or surge rates.'}</li>
            </ul>

            <div className="my-10 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
              <img src="/private-transportation-sjd-airport-los-cabos-luxury.webp" alt="Luxury Cabo Transportation" className="w-full h-auto object-cover max-h-[400px]" />
            </div>

            <p className="mb-4 text-slate-600 text-sm md:text-base">
              {lang === 'es'
                ? `Una de las mejores partes de organizar un traslado desde el Aeropuerto a ${hotel.nombre} con anticipación es asegurar una tarifa accesible. Nuestro servicio ofrece una tarifa fija de $${tarifaVehiculo.tarifaSuburban} USD (Sencillo) para un vehículo SUV (hasta 6 pax).`
                : `One of the best parts of organizing a shuttle from Cabo Airport to ${hotel.nombre} in advance is locking in an affordable rate. Our private service offers a flat rate of $${tarifaVehiculo.tarifaSuburban} USD for a one-way trip covering a Luxury SUV (up to 6 pax).`}
            </p>
            <p className="mb-4 text-slate-600 text-sm md:text-base">
              {lang === 'es'
                ? `Si reservas un viaje redondo, ahorras dinero en tu viaje de regreso y te aseguras de que tu traslado al aeropuerto al final de tu estadía esté preorganizado. ¡Reserva hoy en nuestra plataforma en línea o envíanos un WhatsApp!`
                : `If you book a round-trip transfer, you save money on your return journey and ensure your ride back to the airport at the end of your stay is pre-arranged. Reserve today through our online platform or send us a WhatsApp!`}
            </p>
          </section>

          {/* MAPA Y DATA */}
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm my-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
              {lang === 'es' ? `Ruta de Viaje y Logística` : `Travel Route & Logistics`}
            </h3>
            <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-200">
              <iframe
                title="Mapa de ubicación" width="100%" height="100%" style={{ border: 0, filter: 'contrast(1.1) grayscale(0.2)' }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.nombre + ' Los Cabos')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <Clock className="text-slate-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{lang === 'es' ? 'Tiempo' : 'Time'}</p>
                <p className="text-slate-800 font-semibold text-sm">{hotel.tiempo}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <MapPin className="text-slate-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{lang === 'es' ? 'Distancia' : 'Distance'}</p>
                <p className="text-slate-800 font-semibold text-sm">{hotel.dist}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <Map className="text-slate-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{lang === 'es' ? 'Zona' : 'Zone'}</p>
                <p className="text-slate-800 font-semibold text-sm text-center leading-tight">{hotel.zonaText}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <ShieldCheck className="text-green-600 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{lang === 'es' ? 'Servicio' : 'Service'}</p>
                <p className="text-slate-800 font-semibold text-sm">{lang === 'es' ? '100% Privado' : '100% Private'}</p>
              </div>
            </div>
          </section>

          {/* Opciones */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">
              {lang === 'es' ? 'Comparando Opciones en Cabo' : 'Overview of Cabo Transportation Options'}
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">{lang === 'es' ? 'Recomendado' : 'Recommended'}</div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2"><Car size={20} className="text-slate-500" /> {lang === 'es' ? 'Traslados Privados VIP' : 'Private VIP Transfers'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'Servicio directo y personalizado hasta el lobby. Sin esperas, bebidas incluidas y privacidad total.' : 'Direct, personalized service to your lobby. No wait times, complimentary drinks, and ultimate privacy.'}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-2"><Users size={20} className="text-slate-400" /> {lang === 'es' ? 'Shuttles Compartidos' : 'Shared Shuttles'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'Requieren esperar en el aeropuerto hasta que la van se llene, y hacer paradas en múltiples hoteles.' : 'Require waiting at the airport for other passengers and making multiple stops before reaching your destination.'}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-2"><Banknote size={20} className="text-slate-400" /> {lang === 'es' ? 'Taxis de Aeropuerto' : 'Airport Taxis'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'Disponibles al momento, pero las tarifas son impredecibles y suelen ser más costosas que los servicios pre-reservados. No garantizan un vehículo de lujo.' : 'Readily available, but fares can be unpredictable, dynamic, and potentially much higher than pre-booked services. No guarantee of a luxury vehicle.'}</p>
              </div>
            </div>
          </section>

          {/* Consejos para Reservar y Reseñas de Viajeros */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 mt-12 tracking-tight">
              {lang === 'es' ? 'Consejos para Reservar y Reseñas de Viajeros' : 'Tips for Booking and Traveler Reviews'}
            </h2>
            <p className="mb-6 text-sm md:text-base text-slate-600">
              {lang === 'es'
                ? `Reservar el transporte desde el Aeropuerto de Cabo a ${hotel.nombre} es muy fácil si tomas el enfoque correcto. Se aconseja reservar en línea, especialmente en temporada alta, para evitar estrés.`
                : `Booking transportation from Cabo Airport to ${hotel.nombre} can be simple with the right approach. Pre-booking online is highly advised, especially in peak seasons.`}
            </p>

            <div className="my-8 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
              <img src={`/${hotel.image}`} alt={hotel.nombre} className="w-full h-auto object-cover max-h-[400px]" />
            </div>

            <ul className="list-disc pl-5 space-y-3 text-slate-700 text-sm md:text-base mb-8">
              <li><strong>{lang === 'es' ? 'Credenciales:' : 'Credentials:'}</strong> {lang === 'es' ? 'Asegúrate de que la compañía tenga licencia federal, lo que les permite cargar dentro del aeropuerto.' : 'Ensure the company is federally licensed, which allows them to pick up inside the airport terminal.'}</li>
              <li><strong>{lang === 'es' ? 'Reseñas:' : 'Reviews:'}</strong> {lang === 'es' ? 'Busca opiniones de transporte en Cabo para ver la fiabilidad.' : 'Search for Cabo airport transportation reviews to see real traveler feedback before you book.'}</li>
              <li><strong>{lang === 'es' ? 'Solicitudes Especiales:' : 'Special Requests:'}</strong> {lang === 'es' ? 'Solicita sillas de bebé (gratis con nosotros) o añade una parada de compras al supermercado antes de llegar.' : 'Ask for infant car seats (free with us) or add a grocery shopping stop before reaching the resort.'}</li>
            </ul>

            <div className="bg-amber-50 p-6 rounded-2xl border-l-4 border-amber-500">
              <p className="text-sm md:text-base text-amber-900 italic font-medium">
                {lang === 'es'
                  ? `Los huéspedes que se alojan en ${hotel.nombre} también pueden estar interesados en transporte privado hacia otros resorts populares en Los Cabos para cenar, o incluso reservar excursiones y tours. Ballard Tours ofrece traslados confiables y cómodos a todas partes.`
                  : `Guests staying at ${hotel.nombre} may also be interested in private transportation to other popular resorts in Los Cabos for dinner reservations, or booking exciting excursions. Ballard Tours offers reliable, door-to-door transfers anywhere you need to go.`}
              </p>
            </div>
          </section>

        </div>

        {/* ========================================= */}
        {/* COLUMNA DERECHA: WIDGET DE RESERVA FIJO   */}
        {/* ========================================= */}
        <div className="lg:col-span-1 relative">
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 sticky top-28">
            <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
              {lang === 'es' ? 'Reserva esta Ruta' : 'Book This Route'}
            </h3>
            <p className="text-slate-500 mb-6 text-xs font-semibold uppercase tracking-wider">
              {lang === 'es' ? `Vehículos para ${hotel.nombre}` : `Vehicles for ${hotel.nombre}`}
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center transition-colors">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Luxury Suburban</p>
                  <p className="text-xs text-slate-500 font-medium">{lang === 'es' ? 'Hasta 6 pax' : 'Up to 6 pax'}</p>
                </div>
                <span className="font-black text-slate-900 text-xl">${tarifaVehiculo.tarifaSuburban}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center transition-colors">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Sprinter Van</p>
                  <p className="text-xs text-slate-500 font-medium">{lang === 'es' ? 'Hasta 10 pax' : 'Up to 10 pax'}</p>
                </div>
                <span className="font-black text-slate-900 text-xl">${tarifaVehiculo.tarifaSprinter}</span>
              </div>
            </div>

            <button
              onClick={() => {
                // 3. INYECTAMOS LA LÓGICA DE PRE-LLENADO
                if (setServicioSeleccionado) setServicioSeleccionado('aeropuerto_hotel');
                if (setReserva) {
                  setReserva(prev => ({ 
                    ...prev, 
                    hotelId: hotel.nombre, 
                    zonaId: hotel.zona 
                  }));
                }
                if (setBusquedaHotelPrincipal) setBusquedaHotelPrincipal(hotel.nombre);
                if (setPaso) setPaso(2); // Avanza directamente al paso 2 si tu app lo requiere
                
                // Redirige y sube el scroll hasta arriba
                router.push(`/${lang}`);
                window.scrollTo(0, 0);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              {lang === 'es' ? 'Cotizar y Reservar' : 'Select Details & Book'} <ChevronRight size={18} />
            </button>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <CheckCircle size={14} className="text-slate-900" /> {lang === 'es' ? 'Confirmación Instantánea' : 'Instant Confirmation'}
              </p>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <CheckCircle size={14} className="text-slate-900" /> {lang === 'es' ? 'Bebidas de Cortesía' : 'Complimentary Drinks'}
              </p>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <CheckCircle size={14} className="text-slate-900" /> {lang === 'es' ? 'Seguimiento de Vuelo Incluido' : 'Flight Tracking Included'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================= */}
      {/* SECCIÓN FINAL: BENEFICIOS Y PAGOS         */}
      {/* ========================================= */}
      <div className="max-w-6xl mx-auto px-4 pb-16 mt-10">
        
        {/* Beneficios Footer */}
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200"><Clock size={24} className="text-slate-900" /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{lang === 'es' ? 'Soporte 24/7' : '24 / 7 Support'}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{lang === 'es' ? 'Nos esforzamos por responder rápido. Contáctanos por WhatsApp al +52 624 139 3497 en cualquier momento.' : 'We strive to respond as quickly as possible. Reach out via WhatsApp at +52 624 139 3497 anytime.'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200"><Calendar size={24} className="text-slate-900" /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{lang === 'es' ? 'Asistencia de Itinerario' : 'Itinerary Assistance'}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{lang === 'es' ? 'Si necesitas ajustar un horario o hacer una cancelación, nuestro equipo local te asistirá de inmediato.' : 'Need to move a schedule or make a cancellation? Our local team will assist you immediately.'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200"><Baby size={24} className="text-slate-900" /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{lang === 'es' ? 'Sillas de Bebé Gratis' : 'Free Child Seats'}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{lang === 'es' ? 'La seguridad de tu familia es nuestra prioridad. Proveemos sillas para bebés y asientos elevados sin costo adicional.' : 'Family safety is our priority. We provide infant car seats and booster seats free of charge.'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200"><Banknote size={24} className="text-slate-900" /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{lang === 'es' ? 'Tarifas Transparentes' : 'Transparent Flat Rates'}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{lang === 'es' ? 'Ofrecemos tarifas fijas y claras. Reserva con confianza sin preocuparte de cargos ocultos de última hora.' : 'We offer transparent flat-rate pricing. Book with confidence without any unexpected fees or hidden charges.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="w-full flex flex-col items-center pt-8 pb-8 px-4 text-center">
          <img src="/pago-tarjetas.png" alt="Métodos de Pago" className="h-10 md:h-12 object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all mb-6" />
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">
            {lang === 'es' ? 'Reserva en Línea Fácil y Opciones de Pago Flexibles' : 'Easy Online Booking and Flexible Payment Options'}
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl mx-auto">
            {lang === 'es'
              ? 'Sitio web de reservación fácil en tres clics en Ballard Tours. Simplemente ingrese su destino o lugar de recogida, elija su tipo de transporte y haga clic en enviar. Al final del formulario, encontrará la sección de pago, donde puede seleccionar entre las siguientes opciones: pagar de forma segura con tarjeta de crédito, optar por el pago a la llegada a su chofer, o usar PayPal para mayor comodidad.'
              : 'Three-click easy reservation website at Ballard Tours. Simply enter your destination or pickup location, choose your shuttle type, and click submit. At the end of the form, you will find the payment section, where you can select from the following options: pay securely with a credit card, opt for payment on arrival to your driver, or use PayPal for convenience.'}
          </p>
        </div>
      </div>
    </div>
  );
}