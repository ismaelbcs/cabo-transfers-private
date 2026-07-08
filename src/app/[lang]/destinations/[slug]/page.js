// src/app/[lang]/destinations/[slug]/page.js
'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, PlaneLanding, PlaneTakeoff, RefreshCcw, Compass, CheckCircle, Clock, Map, ShieldCheck, 
  Car, Users, Banknote, Calendar, Baby, ChevronRight 
} from 'lucide-react';

// 1. IMPORTAMOS EL CONTEXTO
import { useBooking } from '../../../../context/BookingContext';
import TrustBadges from '../../../../components/TrustBadges';
import UrgencyBanner from '../../../../components/UrgencyBanner';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';

// =========================================================
// 🏨 BASE DE DATOS DE HOTELES (LANDING PAGES SEO)
// =========================================================
export const landingPagesSEO = [
  // ================= ZONA 1 =================
  { slug: 'sjd-to-alegranza', nombre: 'Alegranza Luxury Resort', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '14 km', image: 'alegranza-airport-sjd.webp', desc: 'premier luxury living' },
  { slug: 'sjd-to-barcelo-gran-faro', nombre: 'Barceló Gran Faro', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '16 km', image: 'barcelo-gran-faro-airport-sjd.webp', desc: 'a magnificent all-inclusive resort' },
  { slug: 'sjd-to-boutique-hotel-casa-san-jose', nombre: 'Boutique Hotel Casa San José', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-boutique-hotel-casa-san-jose.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-cabo-azul', nombre: 'Cabo Azul Resort', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '16 km', image: 'cabo-azul-los-cabos-to-airport-sjd.webp', desc: 'an elegant coastal retreat' },
  { slug: 'sjd-to-cabo-colorado', nombre: 'Cabo Colorado', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-cabo-colorado.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-cabo-surf-hotel', nombre: 'Cabo Surf Hotel & Spa', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'cabo-surf-hotel-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'a surfer paradise' },
  { slug: 'sjd-to-canadas-querencia', nombre: 'Cañadas (Querencia)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-canadas-querencia.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-casa-don-luis', nombre: 'Casa Don Luis', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-casa-don-luis.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-casa-natalia', nombre: 'Casa Natalia', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '13 km', image: 'casa-natalia-airport-sjd.webp', desc: 'an intimate boutique oasis' },
  { slug: 'sjd-to-city-express-by-marriott-san-jose-del-cabo', nombre: 'City Express by Marriott San José del Cabo', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-city-express-by-marriott-san-jose-del-cabo.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-club-campestre-san-jose-residencial', nombre: 'Club Campestre San José (Residencial)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-club-campestre-san-jose-residencial.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-club-villas-querencia', nombre: 'Club Villas (Querencia)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-club-villas-querencia.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-condominios-la-jolla', nombre: 'Condominios La Jolla', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-condominios-la-jolla.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-drift-san-jose-del-cabo', nombre: 'Drift San José del Cabo', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-drift-san-jose-del-cabo.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-el-encanto-inn', nombre: 'El Encanto Inn & Suites', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '14 km', image: 'el-encanto-inn-los-cabos-airport-sjd.webp', desc: 'a charming boutique hotel' },
  { slug: 'sjd-to-el-zalate-condominiums-costa-azul', nombre: 'El Zalate Condominiums (Costa Azul)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-el-zalate-condominiums-costa-azul.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-flamboyan-hotel-residences', nombre: 'Flamboyan Hotel & Residences', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-flamboyan-hotel-residences.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-fonatur-residencial-san-jose', nombre: 'Fonatur Residencial (San José)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-fonatur-residencial-san-jose.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-gaviota-condominiums', nombre: 'Gaviota Condominiums', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-gaviota-condominiums.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-gr-solaris-lighthouse', nombre: 'GR Solaris Lighthouse Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'gr-solaris-lighthouse-airport-sjd.webp', desc: 'a scenic all-inclusive getaway' },
  { slug: 'sjd-to-gringo-hill-residencial', nombre: 'Gringo Hill Residencial', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-gringo-hill-residencial.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-hacienda-los-cabos', nombre: 'Hacienda Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-hacienda-los-cabos.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-holiday-inn-resort', nombre: 'Holiday Inn Resort', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '14 km', image: 'holiday-inn-resort-airport-sjd.webp', desc: 'comfort and fun for the whole family' },
  { slug: 'sjd-to-hotel-aeropuerto-los-cabos', nombre: 'Hotel Aeropuerto Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-hotel-aeropuerto-los-cabos.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-casa-costa-azul', nombre: 'Hotel Casa Costa Azul', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'casa-costa-azul-los-cabos-airport-transportation-private-ballard.webp', desc: 'boutique oceanfront retreat' },
  { slug: 'sjd-to-hotel-colli', nombre: 'Hotel Colli', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-hotel-colli.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-hotel-posada-senor-manana', nombre: 'Hotel Posada Señor Mañana', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-hotel-posada-senor-manana.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-hyatt-ziva', nombre: 'Hyatt Ziva Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'hyatt-ziva-los-cabos-airport-sjd.webp', desc: 'the perfect family oasis in San Jose' },
  { slug: 'sjd-to-krystal-grand', nombre: 'Krystal Grand Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'krystal-grand-airport-sjd.webp', desc: 'a vibrant escape by the sea' },
  { slug: 'sjd-to-la-costa-condominiums', nombre: 'La Costa Condominiums', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-la-costa-condominiums.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-la-jolla-de-los-cabos', nombre: 'La Jolla de Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-la-jolla-de-los-cabos.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-ladera-san-jose', nombre: 'Ladera San José', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-ladera-san-jose.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-laderas-querencia', nombre: 'Laderas (Querencia)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-laderas-querencia.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-las-cabanas-querencia', nombre: 'Las Cabañas (Querencia)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-las-cabanas-querencia.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-las-entradas-querencia', nombre: 'Las Entradas (Querencia)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-las-entradas-querencia.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-las-mananitas', nombre: 'Las Mañanitas', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'las-mananitas-airport-sjd.webp', desc: 'beachfront elegance in San Jose' },
  { slug: 'sjd-to-las-olas-condominiums', nombre: 'Las Olas Condominiums, Lets Do Mexico', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'las-olas-condominiums-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'premier beachfront living' },
  { slug: 'sjd-to-las-palmas-de-san-jose', nombre: 'Las Palmas de San José', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-las-palmas-de-san-jose.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-las-residencias-club-campestre', nombre: 'Las Residencias (Club Campestre)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-las-residencias-club-campestre.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-lomas-de-costa-azul', nombre: 'Lomas de Costa Azul', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-lomas-de-costa-azul.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-lomas-de-la-jolla', nombre: 'Lomas de La Jolla', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-lomas-de-la-jolla.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-magisterial-residencial', nombre: 'Magisterial Residencial', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-magisterial-residencial.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-mariamar-suites', nombre: 'MariaMar Suites', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'mariamar-suites-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'comfortable coastal suites' },
  { slug: 'sjd-to-marisol-boutique-hotel', nombre: 'Marisol Boutique Hotel', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-marisol-boutique-hotel.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-mira-vista-condominiums-costa-azul', nombre: 'Mira Vista Condominiums (Costa Azul)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-mira-vista-condominiums-costa-azul.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-mistiq-san-jose-del-cabo', nombre: 'Mistiq San José del Cabo', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-mistiq-san-jose-del-cabo.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-mykonos-los-cabos', nombre: 'Mykonos Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'mykonos-los-cabos-airport-transportation-shuttle-ballard-taxi.webp', desc: 'beautiful beachfront condos' },
  { slug: 'sjd-to-ocean-residence', nombre: 'OCEAN RESIDENCE', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'ocean-residence-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'exclusive coastal residence' },
  { slug: 'sjd-to-ocean-spirits', nombre: 'Ocean Spirits', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'ocean-spirits-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'tranquil coastal stay' },
  { slug: 'sjd-to-park-royal', nombre: 'Park Royal Homestay Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'park-royal-homestay-los-cabos-sjd-airport.webp', desc: 'your home away from home' },
  { slug: 'sjd-to-posada-real', nombre: 'Posada Real', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'posada-real-airport-sjd.webp', desc: 'a traditional Mexican beach resort' },
  { slug: 'sjd-to-pueblo-pueblo-san-jose', nombre: 'Pueblo Pueblo (San José)', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-pueblo-pueblo-san-jose.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-punta-vista-residencial', nombre: 'Punta Vista Residencial', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-punta-vista-residencial.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-querencia', nombre: 'Querencia', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'querencia-los-cabos-cover-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'private golf community' },
  { slug: 'sjd-to-rancho-cerro-colorado', nombre: 'Rancho Cerro Colorado', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-rancho-cerro-colorado.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-residencial-lomas-de-san-jose', nombre: 'Residencial Lomas de San José', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-residencial-lomas-de-san-jose.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-royal-decameron', nombre: 'Royal Decameron Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '16 km', image: 'royal-decameron-los-cabos-airport-sjd.webp', desc: 'an amazing all-inclusive experience' },
  { slug: 'sjd-to-royal-solaris', nombre: 'Royal Solaris', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'royal-solaris-los-cabos-airport-sjd.webp', desc: 'an all-inclusive family paradise' },
  { slug: 'sjd-to-six-two-four-urban-beach-hotel', nombre: 'Six Two Four Urban Beach Hotel', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-six-two-four-urban-beach-hotel.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-soleado-resort', nombre: 'Soleado Resort', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'soleado-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'relaxing resort getaway' },
  { slug: 'sjd-to-the-grand-bliss-los-cabos', nombre: 'The Grand Bliss Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-the-grand-bliss-los-cabos.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-the-grand-mayan-los-cabos', nombre: 'The Grand Mayan Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-the-grand-mayan-los-cabos.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-tortuga-bay-condominiums', nombre: 'Tortuga Bay Condominiums', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-tortuga-bay-condominiums.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-tropical-oasis', nombre: 'Tropical oasis', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'san-jose-del-cabo-tropical-oasis-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'lush tropical getaway' },
  { slug: 'sjd-to-tropicana-inn', nombre: 'Tropicana Inn', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-tropicana-inn.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-viceroy', nombre: 'Viceroy Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'viceroy-los-cabos-airport-sjd.webp', desc: 'a modern architectural masterpiece' },
  { slug: 'sjd-to-vidanta-los-cabos', nombre: 'Vidanta Los Cabos', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-vidanta-los-cabos.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-villa-vista-del-mar', nombre: 'Villa Vista del Mar', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'exterior-villa-vista-al-mar-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'stunning ocean view villa' },
  { slug: 'sjd-to-villas-at-club-campestre', nombre: 'Villas at Club Campestre', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-villas-at-club-campestre.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-villas-de-costa-azul', nombre: 'Villas de Costa Azul', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-villas-de-costa-azul.webp', desc: 'a charming retreat in San Jose' },
  { slug: 'sjd-to-viva-condos-san-jose-del-cabo', nombre: 'Viva Condos San José del Cabo', zona: 1, zonaText: 'San José del Cabo', tiempo: '20-25 min', dist: '15 km', image: 'sjd-to-viva-condos-san-jose-del-cabo.webp', desc: 'a charming retreat in San Jose' },
  // ================= ZONA 2 =================
  { slug: 'sjd-to-altura-puerto-los-cabos', nombre: 'Altura (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-altura-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-bugambilias-cabo-real', nombre: 'Bugambilias (Cabo Real)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-bugambilias-cabo-real.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-cabo-real', nombre: 'Cabo Real', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'cabo-real-golf-los-cabos-transportation-airport-shuttle-taxi-uber.webp', desc: 'premier golf resort' },
  { slug: 'sjd-to-cabo-real-estates', nombre: 'Cabo Real Estates', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-cabo-real-estates.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-alegre-palmilla', nombre: 'Casa Alegre (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-alegre-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-bahia-chileno', nombre: 'Casa Bahía (Chileno)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-bahia-chileno.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-buena-vida-palmilla', nombre: 'Casa Buena Vida (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-buena-vida-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-caleta-palmilla', nombre: 'Casa Caleta (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-caleta-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-cielo', nombre: 'Casa Cielo', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: '1-Casa-Cielo-Pedregal-Los-Cabos-Aerial-airport-transportation-taxi-uber-cabo-ballard.webp', desc: 'exclusive cliffside retreat' },
  { slug: 'sjd-to-casa-de-la-paz-palmilla', nombre: 'Casa de la Paz (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-de-la-paz-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-de-las-brisas-cabo-real', nombre: 'Casa de las Brisas (Cabo Real)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-de-las-brisas-cabo-real.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-del-mar-zoetry', nombre: 'Casa del Mar / Zoëtry', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '31 km', image: 'casa-del-mar-zoetry-los-cabos-airport-sjd.webp', desc: 'a boutique hacienda paradise' },
  { slug: 'sjd-to-casa-del-mar-residences', nombre: 'Casa del Mar Residences', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-del-mar-residences.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-edwards-palmilla', nombre: 'Casa Edwards (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-edwards-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-estrella-puerto-los-cabos', nombre: 'Casa Estrella (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-estrella-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-fryzer-villas-del-mar', nombre: 'Casa Fryzer (Villas del Mar)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-fryzer-villas-del-mar.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-koll-palmilla', nombre: 'Casa Koll (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-koll-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-la-laguna-puerto-los-cabos', nombre: 'Casa La Laguna (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-la-laguna-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-moka-puerto-los-cabos', nombre: 'Casa Moka (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-moka-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-oliver-fundadores', nombre: 'Casa Oliver (Fundadores)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-oliver-fundadores.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-roca-palmilla', nombre: 'Casa Roca (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-roca-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-casa-tierra-puerto-los-cabos', nombre: 'Casa Tierra (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-casa-tierra-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-chileno-bay-brisas', nombre: 'Chileno Bay Brisas', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-chileno-bay-brisas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-chileno-bay-haciendas', nombre: 'Chileno Bay Haciendas', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-chileno-bay-haciendas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-chileno-bay-resort', nombre: 'Chileno Bay Resort & Residences, Auberge Collection', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '38 km', image: 'chileno-bay-resort-residences-los-cabos-airport-transportation-ballard-taxi.webp', desc: 'modern beachfront sanctuary' },
  { slug: 'sjd-to-chileno-point-villas', nombre: 'Chileno Point Villas', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-chileno-point-villas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-club-regina', nombre: 'Club Regina Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '28 km', image: 'club-regina-los-cabos-airport-transportation-taxi-uber-ballard.webp', desc: 'striking architecture on the coast' },
  { slug: 'sjd-to-condominios-casa-del-mar', nombre: 'Condominios Casa del Mar', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-condominios-casa-del-mar.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-condominios-el-encanto', nombre: 'Condominios El Encanto', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-condominios-el-encanto.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-condominios-las-gardenias-ii', nombre: 'Condominios Las Gardenias II', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-condominios-las-gardenias-ii.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-cuenca-cabo-real', nombre: 'Cuenca (Cabo Real)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-cuenca-cabo-real.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-dorado', nombre: 'Dorado', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'El-Dorado-los-cabos-airport-ballard-transportation-private-cabo.webp', desc: 'exclusive golf and beach club' },
  { slug: 'sjd-to-dreams-los-cabos', nombre: 'Dreams Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '32 km', image: 'dreams-los-cabos-sjd-airport.webp', desc: 'a limitless beachfront escape' },
  { slug: 'sjd-to-el-dorado-beach-villas', nombre: 'El Dorado Beach Villas', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-el-dorado-beach-villas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-el-dorado-casitas', nombre: 'El Dorado Casitas', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-el-dorado-casitas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-el-dorado-villas', nombre: 'El Dorado Villas', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-el-dorado-villas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-el-encanto-de-la-laguna', nombre: 'El Encanto de la Laguna', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-el-encanto-de-la-laguna.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-espiritu-estate-palmilla', nombre: 'Espíritu Estate (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-espiritu-estate-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-fundadores-puerto-los-cabos', nombre: 'Fundadores (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-fundadores-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-garza-blanca-residences', nombre: 'Garza Blanca Residences', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-garza-blanca-residences.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-grand-velas-boutique', nombre: 'Grand Velas Boutique Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '35 km', image: 'grand-velas-boutique-los-cabos-airport-transportation-private-ballard-taxi-uber.webp', desc: 'intimate luxury resort' },
  { slug: 'sjd-to-garza-blanca', nombre: 'Grand Velas Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'garza-blanca-resort-spa-los-cabos-airport-sjd.webp', desc: 'contemporary elegance by the sea' },
  { slug: 'sjd-to-hampton-inn', nombre: 'Hampton Inn & Suites by Hilton Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '28 km', image: 'hampton-inn-los-cabos-airport-transportation-private-taxi-uber.webp', desc: 'comfort and convenience' },
  { slug: 'sjd-to-hilton-los-cabos', nombre: 'Hilton Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'Hilton-los-cabos-airport-sjd.webp', desc: 'a premier golf and beach resort' },
  { slug: 'sjd-to-el-ganzo', nombre: 'Hotel El Ganzo', zona: 2, zonaText: 'San José (Puerto Los Cabos)', tiempo: '30-35 min', dist: '20 km', image: 'hotel-el-ganzo-los-cabos-airport-sjd.webp', desc: 'an artistic and boutique escape' },
  { slug: 'sjd-to-jw-marriott', nombre: 'JW Marriott Los Cabos Beach Resort & Spa', zona: 2, zonaText: 'San José (Puerto Los Cabos)', tiempo: '30-35 min', dist: '23 km', image: 'jw-marriott-los-cabos-airport-sjd.webp', desc: 'where luxury meets the sea' },
  { slug: 'sjd-to-la-loretana-palmilla', nombre: 'La Loretana (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-la-loretana-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-la-noria-puerto-los-cabos', nombre: 'La Noria (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-la-noria-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-la-pacifica', nombre: 'La Pacifica by Hilton', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'Hilton-los-cabos-airport-sjd.webp', desc: 'a premier luxury vacation club' },
  { slug: 'sjd-to-las-gardenias-condominiums', nombre: 'Las Gardenias Condominiums', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'gardenias-los-cabos-airport-private-transportation-ballard-taxi-uber.webp', desc: 'exclusive private condos' },
  { slug: 'sjd-to-las-majadas-palmilla', nombre: 'Las Majadas (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-las-majadas-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-las-margaritas-cabo-real', nombre: 'Las Margaritas (Cabo Real)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-las-margaritas-cabo-real.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-las-playas-cabo-real', nombre: 'Las Playas (Cabo Real)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-las-playas-cabo-real.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-las-residencias', nombre: 'Las Residencias Golf & Beach Club', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '31 km', image: 'las-residencias-airport-sjd.webp', desc: 'luxury villas on the sea' },
  { slug: 'sjd-to-las-ventanas-al-paraiso', nombre: 'Las Ventanas al Paraíso (A Rosewood Resort)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '31 km', image: 'Extetrior3Tout-LasVentanasalParaiso-Mexico-los-cabos-airport.webp', desc: 'the pinnacle of Cabo luxury' },
  { slug: 'sjd-to-le-blanc', nombre: 'Le Blanc Spa Resort', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '32 km', image: 'le-blanc-airport-sjd.webp', desc: 'an exquisite adults-only oasis' },
  { slug: 'sjd-to-los-cielos-puerto-los-cabos', nombre: 'Los Cielos (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-los-cielos-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-mar-del-cabo', nombre: 'Mar del Cabo', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'mar-del-cabo-airport-sjd.webp', desc: 'a classic boutique experience' },
  { slug: 'sjd-to-marquis', nombre: 'Marquis Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'Marquis-los-cabos-airport-sjd-ballard.webp', desc: 'an adults-only sanctuary' },
  { slug: 'sjd-to-misiones-de-cabo-real', nombre: 'Misiones de Cabo Real', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-misiones-de-cabo-real.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-ocean-estates-at-villas-del-mar', nombre: 'Ocean Estates at Villas del Mar', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-ocean-estates-at-villas-del-mar.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-one-and-only-palmilla', nombre: 'One&Only Palmilla', zona: 2, zonaText: 'Tourist Corridor', tiempo: '25-30 min', dist: '25 km', image: 'one-and-only-palmilla-los-cabos-airport-sjd.webp', desc: 'a legendary luxury retreat' },
  { slug: 'sjd-to-oneonly-private-homes', nombre: 'One&Only Private Homes', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-oneonly-private-homes.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-palmilla-canyons', nombre: 'Palmilla Canyons', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-palmilla-canyons.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-palmilla-dunes', nombre: 'Palmilla Dunes', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-palmilla-dunes.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-palmilla-fairways', nombre: 'Palmilla Fairways', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-palmilla-fairways.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-paradisus', nombre: 'Paradisus', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '28 km', image: 'paradisus-los-cabos-airport-sjd.webp', desc: 'a stunning all-inclusive oasis' },
  { slug: 'sjd-to-remanso-palmilla', nombre: 'Remanso (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-remanso-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-residencias-grand-velas', nombre: 'Residencias Grand Velas', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-residencias-grand-velas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-ritz-carlton-reserve-residences', nombre: 'Ritz-Carlton Reserve Residences', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-ritz-carlton-reserve-residences.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-rosewood-residences-las-ventanas', nombre: 'Rosewood Residences (Las Ventanas)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-rosewood-residences-las-ventanas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-secrets-puerto-los-cabos', nombre: 'Secrets Puerto Los Cabos Golf & Spa Resort', zona: 2, zonaText: 'San José (Puerto Los Cabos)', tiempo: '30-35 min', dist: '22 km', image: 'secrets-los-cabos-to-airport-san-jose-del-cabo.webp', desc: 'an adults-only haven' },
  { slug: 'sjd-to-sol-de-cabo', nombre: 'Sol de Cabo', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'sol-de-cabo-transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd.webp', desc: 'beautiful coastal views' },
  { slug: 'sjd-to-solaz', nombre: 'Solaz Los Cabos', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '33 km', image: 'solaz-los-cabos-sjd-airport-ballard.webp', desc: 'an architectural masterpiece' },
  { slug: 'sjd-to-solaz-resort', nombre: 'Solaz Resort', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '33 km', image: 'solaz-los-cabos-transportation-airport-private-taxi.webp', desc: 'a luxury collection resort' },
  { slug: 'sjd-to-solaz-signature-suites', nombre: 'Solaz Signature Suites', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-solaz-signature-suites.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-solaz-the-residences', nombre: 'Solaz The Residences', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-solaz-the-residences.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-the-enclaves-at-a-ritz-carlton-reserve', nombre: 'The Enclaves at a Ritz-Carlton Reserve', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-the-enclaves-at-a-ritz-carlton-reserve.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-westin-los-cabos', nombre: 'The Westin Los Cabos Resort Villas - Baja Point', zona: 2, zonaText: 'Tourist Corridor', tiempo: '30-35 min', dist: '28 km', image: 'the-westin-los-cabos-airport-private-transportation-ballard-taxi-uber.webp', desc: 'iconic coastal luxury' },
  { slug: 'sjd-to-ty-warner-mansion', nombre: 'Ty Warner Mansion', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '31 km', image: 'rosewood-ventanas-ty-warner-villa-mansion-cabo-airport-los-cabos-ballard-taxi-uber-transportation.webp', desc: 'the ultimate luxury estate' },
  { slug: 'sjd-to-villa-bella-palmilla', nombre: 'Villa Bella (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-bella-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-captiva-fundadores', nombre: 'Villa Captiva (Fundadores)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-captiva-fundadores.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-celeste-fundadores', nombre: 'Villa Celeste (Fundadores)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-celeste-fundadores.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-cielito-chileno', nombre: 'Villa Cielito (Chileno)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-cielito-chileno.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-cristina-palmilla', nombre: 'Villa Cristina (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-cristina-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-de-los-pinos-palmilla', nombre: 'Villa de los Pinos (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-de-los-pinos-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-del-mar', nombre: 'Villa Del Mar', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '30 km', image: 'villa-del-mar-los-cabos-airport-transportation-shuttle-ballard.webp', desc: 'luxury private living' },
  { slug: 'sjd-to-villa-del-mar-el-dorado', nombre: 'Villa del Mar (El Dorado)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-del-mar-el-dorado.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-la-valencia-resort', nombre: 'Villa La Valencia', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '32 km', image: 'step-into-luxury-at-villa-la-valencia-los-cabos-resort-transportation-airport-private-taxi.webp', desc: 'luxury family escape' },
  { slug: 'sjd-to-villa-la-valencia-residences', nombre: 'Villa La Valencia Residences', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-la-valencia-residences.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-oasis-palmilla', nombre: 'Villa Oasis (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-oasis-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-pelicanos-palmilla', nombre: 'Villa Pelicanos (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-pelicanos-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-tranquila-fundadores', nombre: 'Villa Tranquila (Fundadores)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-tranquila-fundadores.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villa-velero-puerto-los-cabos', nombre: 'Villa Velero (Puerto Los Cabos)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villa-velero-puerto-los-cabos.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villas-de-cabo-real', nombre: 'Villas de Cabo Real', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villas-de-cabo-real.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villas-de-la-montana-palmilla', nombre: 'Villas de la Montaña (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villas-de-la-montana-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villas-de-oro-ii-palmilla', nombre: 'Villas de Oro II (Palmilla)', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villas-de-oro-ii-palmilla.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-villas-del-mar-casitas', nombre: 'Villas del Mar Casitas', zona: 2, zonaText: 'Tourist Corridor', tiempo: '35-40 min', dist: '34 km', image: 'sjd-to-villas-del-mar-casitas.webp', desc: 'a luxury escape on the Corridor' },
  { slug: 'sjd-to-zadun', nombre: 'Zadún (A Ritz-Carlton Reserve)', zona: 2, zonaText: 'San José (Puerto Los Cabos)', tiempo: '30-35 min', dist: '24 km', image: 'zadun-airport-sjd.webp', desc: 'a striking natural retreat' },
  // ================= ZONA 3 =================
  { slug: 'sjd-to-altamira-residencial', nombre: 'Altamira Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-altamira-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-bahia-hotel', nombre: 'Bahía Hotel & Beach House', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'bahia-hotel-airport-sjd.webp', desc: 'an urban chic beach getaway' },
  { slug: 'sjd-to-baja-inn-suites', nombre: 'Baja Inn Suites', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-baja-inn-suites.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-bajas-cactus-hostel', nombre: 'Baja\'s Cactus Hostel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-bajas-cactus-hostel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-blue-net-hospitals-condos-zona-medica', nombre: 'Blue Net Hospitals Condos (Zona Médica)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-blue-net-hospitals-condos-zona-medica.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-breathless', nombre: 'Breathless Cabo San Lucas Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '46 km', image: 'BREATHLESS-II-scaled-1-los-cabos-airport-sjd-ballard.webp', desc: 'vibrant energy by the marina' },
  { slug: 'sjd-to-brisas-del-mar-condos', nombre: 'Brisas del Mar Condos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-brisas-del-mar-condos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-bello', nombre: 'Cabo Bello', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'cabo-bello-airport-sjd.webp', desc: 'private beach community' },
  { slug: 'sjd-to-cabo-bello-estates', nombre: 'Cabo Bello Estates', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-bello-estates.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-cush-hotel', nombre: 'Cabo Cush Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-cush-hotel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-del-mar-village-condos', nombre: 'Cabo del Mar (Village & Condos)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-del-mar-village-condos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-fino', nombre: 'Cabo Fino', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-fino.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-inn-hotel', nombre: 'Cabo Inn Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-inn-hotel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-lindo-condos', nombre: 'Cabo Lindo Condos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-lindo-condos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-paraiso-condominiums', nombre: 'Cabo Paraíso Condominiums', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-paraiso-condominiums.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-pedregal-hotel', nombre: 'Cabo Pedregal Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-pedregal-hotel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-san-lucas-country-club-villas', nombre: 'Cabo San Lucas Country Club Villas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-san-lucas-country-club-villas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-tortuga-hotel-boutique', nombre: 'Cabo Tortuga Hotel Boutique', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-tortuga-hotel-boutique.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-village', nombre: 'Cabo Village', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cabo-village.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-cabo-vista', nombre: 'Cabo Vista Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '45 km', image: 'cabo-vista-airport-sjd.webp', desc: 'comfort close to the action' },
  { slug: 'sjd-to-casa-bella-boutique-hotel', nombre: 'Casa Bella Boutique Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-bella-boutique-hotel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-de-la-familia-pedregal', nombre: 'Casa de la Familia (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-de-la-familia-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-de-la-playa-cabo-bello', nombre: 'Casa de la Playa (Cabo Bello)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-de-la-playa-cabo-bello.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-de-los-angeles-pedregal', nombre: 'Casa de los Ángeles (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-de-los-angeles-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-del-cielo-pedregal', nombre: 'Casa del Cielo (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-del-cielo-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-del-sol-cabo-bello', nombre: 'Casa del Sol (Cabo Bello)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-del-sol-cabo-bello.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-dorada-los-cabos-resort-spa', nombre: 'Casa Dorada Los Cabos Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-dorada-los-cabos-resort-spa.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-flamingo-pedregal', nombre: 'Casa Flamingo (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-flamingo-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-gran-vista-pedregal', nombre: 'Casa Gran Vista (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-gran-vista-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-linda-pedregal', nombre: 'Casa Linda (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-linda-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-mia-pedregal', nombre: 'Casa Mia (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-mia-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-pablito-bed-breakfast', nombre: 'Casa Pablito Bed & Breakfast', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-pablito-bed-breakfast.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-roca-de-los-amantes-pedregal', nombre: 'Casa Roca de los Amantes (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-roca-de-los-amantes-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-sirena-misiones-del-cabo', nombre: 'Casa Sirena (Misiones del Cabo)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-sirena-misiones-del-cabo.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-stella-pedregal', nombre: 'Casa Stella (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-stella-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-tezal', nombre: 'Casa Tezal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-tezal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-theodore-pedregal', nombre: 'Casa Theodore (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-theodore-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casa-tres-mares-pedregal', nombre: 'Casa Tres Mares (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-casa-tres-mares-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-casas-de-pedregal', nombre: 'Casas de Pedregal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '50-55 min', dist: '48 km', image: 'casas-de-pedregal-airport-sjd.webp', desc: 'exclusive cliffside residences' },
  { slug: 'sjd-to-chileno-bay', nombre: 'Chileno Bay Resort & Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '38 km', image: 'chileno-bay-resort-residences-los-cabos-airport.webp', desc: 'modern luxury on a swimmable beach' },
  { slug: 'sjd-to-city-express-plus', nombre: 'City Express Plus by Marriott Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '40 km', image: 'city-express-plus-airport-sjd.webp', desc: 'modern business and leisure comfort' },
  { slug: 'sjd-to-club-cascadas-de-baja', nombre: 'Club Cascadas de Baja', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-club-cascadas-de-baja.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-buena-vista', nombre: 'Condominios Buena Vista', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-buena-vista.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-cabo-san-lucas', nombre: 'Condominios Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-cabo-san-lucas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-el-dorado', nombre: 'Condominios El Dorado', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-el-dorado.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-el-pedregal', nombre: 'Condominios El Pedregal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-el-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-el-portillo', nombre: 'Condominios El Portillo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-el-portillo.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-la-marina', nombre: 'Condominios La Marina', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-la-marina.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-la-vista', nombre: 'Condominios La Vista', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-la-vista.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-los-patios', nombre: 'Condominios Los Patios', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-los-patios.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-marina-cabo-plaza', nombre: 'Condominios Marina Cabo Plaza', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-marina-cabo-plaza.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-pedregalito', nombre: 'Condominios Pedregalito', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-pedregalito.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-condominios-portofino', nombre: 'Condominios Portofino', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-condominios-portofino.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-copacabana-condominiums', nombre: 'Copacabana Condominiums', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-copacabana-condominiums.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-corazon-cabo', nombre: 'Corazón Cabo Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'corazon-cabo-airport-sjd.webp', desc: 'the heart of Medano Beach' },
  { slug: 'sjd-to-cresta-del-mar-residencial', nombre: 'Cresta del Mar Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-cresta-del-mar-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-duara-ocean-view-villas-condos', nombre: 'Duara Ocean View Villas & Condos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-duara-ocean-view-villas-condos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-el-ameyal-hotel-wellness-center', nombre: 'El Ameyal Hotel & Wellness Center', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-el-ameyal-hotel-wellness-center.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-el-cielito-residencial-tezal', nombre: 'El Cielito Residencial (Tezal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-el-cielito-residencial-tezal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-el-pedregal-heights', nombre: 'El Pedregal Heights', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-el-pedregal-heights.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-el-tezal', nombre: 'El Tezal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '40 km', image: 'el-tezal-airport-sjd.webp', desc: 'residential tranquility near the city' },
  { slug: 'sjd-to-esperanza-private-residences', nombre: 'Esperanza Private Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-esperanza-private-residences.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-esperanza', nombre: 'Esperanza, Auberge Resorts Collection', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'esperanza-airport-sjd.webp', desc: 'a world-renowned luxury retreat' },
  { slug: 'sjd-to-estancia-real-los-cabos', nombre: 'Estancia Real Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-estancia-real-los-cabos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-fairfield', nombre: 'Fairfield Inn by Marriott Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '43 km', image: 'fairfield-los-cabos-airport-sjd.webp', desc: 'comfort and convenience' },
  { slug: 'sjd-to-grand-fiesta-americana', nombre: 'Grand Fiesta Americana', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '42 km', image: 'grand-fiesta-americana-los-cabos-airport-sjd.webp', desc: 'a classic grand resort experience' },
  { slug: 'sjd-to-grand-solmar', nombre: 'Grand Solmar Land\'s End', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-55 min', dist: '47 km', image: 'grand-solmar-land-s-end-los-cabos-airport-sjd.webp', desc: 'a spectacular resort at Land\'s End' },
  { slug: 'sjd-to-grand-solmar-lands-end-resort-spa', nombre: 'Grand Solmar Land\'s End Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-grand-solmar-lands-end-resort-spa.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hacienda-beach-club-residences', nombre: 'Hacienda Beach Club & Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hacienda-beach-club-residences.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hacienda-beach-club-villas-el-medano', nombre: 'Hacienda Beach Club Villas (El Médano)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hacienda-beach-club-villas-el-medano.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hacienda-del-mar', nombre: 'Hacienda del Mar Los Cabos Resort', zona: 3, zonaText: 'Cabo San Lucas (Cabo del Sol)', tiempo: '40-45 min', dist: '41 km', image: 'private-transportation-sjd-airport-los-cabos-luxury.webp', desc: 'a traditional Mexican oasis' },
  { slug: 'sjd-to-hacienda-encantada', nombre: 'Hacienda Encantada Resort & Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'hacienda-encantada-airport-sjd.webp', desc: 'Mexican tradition meets luxury' },
  { slug: 'sjd-to-hacienda-penthouse-residences-el-medano', nombre: 'Hacienda Penthouse Residences (El Médano)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hacienda-penthouse-residences-el-medano.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hermitage-residencial', nombre: 'Hermitage Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hermitage-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-holiday-inn-express-csl', nombre: 'Holiday Inn Express Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'holiday-inn-express-csl-airport-sjd.webp', desc: 'reliable and convenient lodging' },
  { slug: 'sjd-to-hotel-colonos', nombre: 'Hotel Colonos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hotel-colonos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hotel-del-angel', nombre: 'Hotel del Ángel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hotel-del-angel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hotel-dos-mares', nombre: 'Hotel Dos Mares', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hotel-dos-mares.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hotel-mar-de-cortez', nombre: 'Hotel Mar de Cortez', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hotel-mar-de-cortez.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hotel-oasis-de-cabo', nombre: 'Hotel Oasis de Cabo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hotel-oasis-de-cabo.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hotel-plaza-los-arcos', nombre: 'Hotel Plaza Los Arcos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hotel-plaza-los-arcos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hotel-real-dorado', nombre: 'Hotel Real Dorado', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hotel-real-dorado.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-hotel-santa-fe-cabo-san-lucas', nombre: 'Hotel Santa Fe Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-hotel-santa-fe-cabo-san-lucas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-la-cima-residencial', nombre: 'La Cima Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-la-cima-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-la-jolla-residential', nombre: 'La Jolla Residential', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-la-jolla-residential.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-la-ribera-condominios', nombre: 'La Ribera Condominios', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-la-ribera-condominios.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-las-casonas-at-waldorf-astoria', nombre: 'Las Casonas at Waldorf Astoria', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-las-casonas-at-waldorf-astoria.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-las-estrellas-punta-ballena', nombre: 'Las Estrellas (Punta Ballena)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-las-estrellas-punta-ballena.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-las-haciendas', nombre: 'Las Haciendas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-las-haciendas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-las-palmas-suites', nombre: 'Las Palmas Suites', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-las-palmas-suites.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-las-residencias-at-punta-ballena', nombre: 'Las Residencias at Punta Ballena', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-las-residencias-at-punta-ballena.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-lomas-del-tezal', nombre: 'Lomas del Tezal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-lomas-del-tezal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-los-cabos-golf-resort-trademark-collection-by-wyndham', nombre: 'Los Cabos Golf Resort, Trademark Collection by Wyndham', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-los-cabos-golf-resort-trademark-collection-by-wyndham.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-los-milagros', nombre: 'Los Milagros Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '45 km', image: 'los-milagros-airport-sjd.webp', desc: 'a hidden gem in downtown' },
  { slug: 'sjd-to-los-patios-hotel', nombre: 'Los Patios Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-los-patios-hotel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-lumina-at-cabo-san-lucas', nombre: 'Lumina at Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-lumina-at-cabo-san-lucas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-lush-hostel', nombre: 'Lush Hostel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-lush-hostel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-maranatha-residencial', nombre: 'Maranatha Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-maranatha-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-maria-elena-hotel', nombre: 'Maria Elena Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-maria-elena-hotel.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-marina-fiesta', nombre: 'Marina Fiesta Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '45 km', image: 'marina-fiesta-airport-sjd.webp', desc: 'stay right on the marina' },
  { slug: 'sjd-to-marina-sol-resort', nombre: 'Marina Sol Resort', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-marina-sol-resort.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-mayan-monkey-los-cabos', nombre: 'Mayan Monkey Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-mayan-monkey-los-cabos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-me-cabo', nombre: 'ME Cabo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'me-cabo-airport-sjd.webp', desc: 'chic and vibrant beachfront living' },
  { slug: 'sjd-to-medano-hotel-and-suites', nombre: 'Medano Hotel and Suites', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-medano-hotel-and-suites.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-misiones-del-cabo', nombre: 'Misiones del Cabo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '42 km', image: 'misiones-del-cabo-airport-sjd.webp', desc: 'cliffside serenity' },
  { slug: 'sjd-to-mistiq-los-cabos', nombre: 'Mistiq Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-mistiq-los-cabos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-montage', nombre: 'Montage Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '40 km', image: 'montage-los-cabos-airport-sjd-ballard.webp', desc: 'serene luxury at Santa Maria Bay' },
  { slug: 'sjd-to-montage-residences-santa-maria', nombre: 'Montage Residences (Santa María)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-montage-residences-santa-maria.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-morgan-residences', nombre: 'Morgan Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-morgan-residences.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-norman-diegos-the-mexican-inn', nombre: 'Norman Diego\'s The Mexican Inn', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-norman-diegos-the-mexican-inn.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-oasis-de-la-campana-tezal', nombre: 'Oasis de la Campana (Tezal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-oasis-de-la-campana-tezal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-ocean-meadows-cabo-del-sol', nombre: 'Ocean Meadows (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-ocean-meadows-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-park-hyatt', nombre: 'Park Hyatt Los Cabos at Cabo del Sol', zona: 3, zonaText: 'Cabo San Lucas (Cabo del Sol)', tiempo: '40-45 min', dist: '41 km', image: 'park-hyatt-airport-sjd.webp', desc: 'refined luxury at Cabo del Sol' },
  { slug: 'sjd-to-pedregal-manor', nombre: 'Pedregal Manor', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-pedregal-manor.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-playa-grande', nombre: 'Playa Grande Resort', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-55 min', dist: '47 km', image: 'playa-grande-los-cabos-airport-sjd.webp', desc: 'a hacienda-style escape' },
  { slug: 'sjd-to-plaza-del-rey-residencial', nombre: 'Plaza del Rey Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-plaza-del-rey-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-plaza-nautica-condominiums', nombre: 'Plaza Náutica Condominiums', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-plaza-nautica-condominiums.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-portales-de-cabo', nombre: 'Portales de Cabo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-portales-de-cabo.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-privada-misiones', nombre: 'Privada Misiones', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-privada-misiones.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-pueblo-bonito-blanco', nombre: 'Pueblo Bonito Blanco (Los Cabos Beach Resort)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'pueblo-bonito-blanco-los-cabos-airport-sjd.webp', desc: 'the original Medano Beach classic' },
  { slug: 'sjd-to-pueblo-bonito-rose', nombre: 'Pueblo Bonito Rose', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'pueblo-bonito-rose-los-cabos-airport-sjd.webp', desc: 'Mediterranean elegance on Medano Beach' },
  { slug: 'sjd-to-pueblo-bonito-rose-resort-spa', nombre: 'Pueblo Bonito Rosé Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-pueblo-bonito-rose-resort-spa.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-puerta-de-hierro-cabo', nombre: 'Puerta de Hierro Cabo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-puerta-de-hierro-cabo.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-puerta-del-sol-cabo-del-sol', nombre: 'Puerta del Sol (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-puerta-del-sol-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-punta-arenas-condominios', nombre: 'Punta Arenas Condominios', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-punta-arenas-condominios.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-punta-ballena-residences', nombre: 'Punta Ballena Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-punta-ballena-residences.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-punta-carmela', nombre: 'Punta Carmela', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-punta-carmela.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-punta-del-este-condominiums', nombre: 'Punta del Este Condominiums', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-punta-del-este-condominiums.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-quinta-del-sol-by-solmar', nombre: 'Quinta del Sol by Solmar', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-quinta-del-sol-by-solmar.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-rancho-paraiso-estates', nombre: 'Rancho Paraíso Estates', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-rancho-paraiso-estates.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-residencial-cabo-san-lucas', nombre: 'Residencial Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-residencial-cabo-san-lucas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-residencial-cumbres-del-tezal', nombre: 'Residencial Cumbres del Tezal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-residencial-cumbres-del-tezal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-residencial-el-bordo', nombre: 'Residencial El Bordo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-residencial-el-bordo.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-residencial-la-joya-cabo-san-lucas', nombre: 'Residencial La Joya (Cabo San Lucas)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-residencial-la-joya-cabo-san-lucas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-residencial-las-garzas', nombre: 'Residencial Las Garzas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-residencial-las-garzas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-residencial-san-lazaro', nombre: 'Residencial San Lázaro', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-residencial-san-lazaro.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-riu-palace-baja-california', nombre: 'Riu Palace Baja California', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '43 km', image: 'Hotel-Review-Riu-Palace-Baja-California-los-cabos-sirport-sjd.webp', desc: 'adults-only luxury and fun' },
  { slug: 'sjd-to-riu-palace', nombre: 'Riu Palace Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '43 km', image: 'riu-palace-los-cabos-airport-sjd.webp', desc: 'stunning views and premium service' },
  { slug: 'sjd-to-riu-santa-fe', nombre: 'Riu Santa Fe', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '43 km', image: 'riu-santa-fe-los-cabos-airport-sjd.webp', desc: 'the ultimate party and family resort' },
  { slug: 'sjd-to-riviera-villas-cabo-del-sol', nombre: 'Riviera Villas (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-riviera-villas-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-sandos-finisterra-los-cabos', nombre: 'Sandos Finisterra Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-sandos-finisterra-los-cabos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-santa-carmela', nombre: 'Santa Carmela', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-santa-carmela.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-santa-cruz-residencial', nombre: 'Santa Cruz Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-santa-cruz-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-seven-crown-express-suites-cabo-san-lucas', nombre: 'Seven Crown Express & Suites Cabo San Lucas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-seven-crown-express-suites-cabo-san-lucas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-siesta-suites', nombre: 'Siesta Suites', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '46 km', image: 'siesta-suites-airport-sjd.webp', desc: 'affordable downtown convenience' },
  { slug: 'sjd-to-sirena-del-mar', nombre: 'Sirena del Mar (Hyatt Vacation Club)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '42 km', image: 'sirena-del-mar-airport-sjd.webp', desc: 'cliffside resort overlooking the sea' },
  { slug: 'sjd-to-sofia-hostel-cabo', nombre: 'Sofia Hostel Cabo', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-sofia-hostel-cabo.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-solmar-resort', nombre: 'Solmar Resort', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-solmar-resort.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-suites-las-palmas', nombre: 'Suites Las Palmas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-suites-las-palmas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-sunrock-hotel-suites', nombre: 'Sunrock Hotel & Suites', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-sunrock-hotel-suites.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-terranova-residencial', nombre: 'Terranova Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-terranova-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-terrasol-beach-resort', nombre: 'Terrasol Beach Resort', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-terrasol-beach-resort.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-tesoro-los-cabos', nombre: 'Tesoro Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-tesoro-los-cabos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-the-bungalows', nombre: 'The Bungalows Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '46 km', image: 'the-bungalows-airport-sjd.webp', desc: 'a cozy and intimate stay' },
  { slug: 'sjd-to-the-cape-residences', nombre: 'The Cape Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-the-cape-residences.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-the-cape', nombre: 'The Cape, a Thompson Hotel', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '42 km', image: 'the-cape-airport-sjd.webp', desc: 'a boutique luxury hotel' },
  { slug: 'sjd-to-the-paraiso-residences', nombre: 'The Paraiso Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-the-paraiso-residences.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-the-residences-at-la-vista-pedregal', nombre: 'The Residences at La Vista (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-the-residences-at-la-vista-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-the-ridge-at-playa-grande', nombre: 'The Ridge at Playa Grande', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-the-ridge-at-playa-grande.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-tramonti-los-cabos', nombre: 'Tramonti Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-tramonti-los-cabos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-velamar-los-cabos', nombre: 'Velamar Los Cabos', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-velamar-los-cabos.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-ventanas-al-paraiso-residencial', nombre: 'Ventanas al Paraíso Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-ventanas-al-paraiso-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-ventanas-fase-2', nombre: 'Ventanas Fase 2', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-ventanas-fase-2.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-ventanas-fase-3', nombre: 'Ventanas Fase 3', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-ventanas-fase-3.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-alegria-pedregal', nombre: 'Villa Alegría (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-alegria-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-andaluza-pedregal', nombre: 'Villa Andaluza (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-andaluza-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-bellissima-pedregal', nombre: 'Villa Bellissima (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-bellissima-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-buena-vida-cabo-del-sol', nombre: 'Villa Buena Vida (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-buena-vida-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-caleta-pedregal', nombre: 'Villa Caleta (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-caleta-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-canto-del-mar-pedregal', nombre: 'Villa Canto del Mar (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-canto-del-mar-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-castillo-pedregal', nombre: 'Villa Castillo (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-castillo-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-cielito-pedregal', nombre: 'Villa Cielito (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-cielito-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-colina-pedregal', nombre: 'Villa Colina (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-colina-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-contempo-pedregal', nombre: 'Villa Contempo (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-contempo-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-corona-pedregal', nombre: 'Villa Corona (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-corona-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-de-la-luna-pedregal', nombre: 'Villa de la Luna (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-de-la-luna-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-de-la-luz-pedregal', nombre: 'Villa de la Luz (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-de-la-luz-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-de-la-mina-pedregal', nombre: 'Villa de la Mina (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-de-la-mina-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-de-la-vida-cabo-del-sol', nombre: 'Villa de la Vida (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-de-la-vida-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-de-las-olas-pedregal', nombre: 'Villa de las Olas (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-de-las-olas-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-de-las-palmas-cabo-del-sol', nombre: 'Villa de las Palmas (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-de-las-palmas-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-de-los-faros-cabo-del-sol', nombre: 'Villa de los Faros (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-de-los-faros-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-de-los-suenos-pedregal', nombre: 'Villa de los Sueños (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-de-los-suenos-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-del-arco', nombre: 'Villa del Arco Beach Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'villa-del-arco-los-cabos-sjd-airport.webp', desc: 'a premium family-friendly destination' },
  { slug: 'sjd-to-villa-del-corazon-punta-ballena', nombre: 'Villa del Corazón (Punta Ballena)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-del-corazon-punta-ballena.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-del-mar-cabo-del-sol', nombre: 'Villa del Mar (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-del-mar-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-del-palmar', nombre: 'Villa del Palmar Beach Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'villa-del-palmar-los-cabos-sjd-airport.webp', desc: 'an iconic beach resort' },
  { slug: 'sjd-to-villa-del-toro-rojo-pedregal', nombre: 'Villa del Toro Rojo (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-del-toro-rojo-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-descanso-pedregal', nombre: 'Villa Descanso (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-descanso-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-dorada-pedregal', nombre: 'Villa Dorada (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-dorada-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-dos-mares-pedregal', nombre: 'Villa Dos Mares (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-dos-mares-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-eduardo-punta-ballena', nombre: 'Villa Eduardo (Punta Ballena)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-eduardo-punta-ballena.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-fiesta-pedregal', nombre: 'Villa Fiesta (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-fiesta-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-finisterra-pedregal', nombre: 'Villa Finisterra (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-finisterra-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-firenze-pedregal', nombre: 'Villa Firenze (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-firenze-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-gran-escalera-pedregal', nombre: 'Villa Gran Escalera (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-gran-escalera-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-la-estancia', nombre: 'Villa La Estancia Beach Resort & Spa', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'optimizada_Villa-La-Estancia-Los-Cabos-sjd-airport.webp', desc: 'luxury and comfort combined' },
  { slug: 'sjd-to-villa-la-estancia-penthouses-villas', nombre: 'Villa La Estancia Penthouses & Villas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-la-estancia-penthouses-villas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-la-paloma', nombre: 'Villa La Paloma', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-la-paloma.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-la-roca-pedregal', nombre: 'Villa La Roca (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-la-roca-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-la-zafiro-pedregal', nombre: 'Villa La Zafiro (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-la-zafiro-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-las-flores-pedregal', nombre: 'Villa Las Flores (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-las-flores-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-las-palmas-pedregal', nombre: 'Villa Las Palmas (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-las-palmas-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-las-penas-punta-ballena', nombre: 'Villa Las Penas (Punta Ballena)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-las-penas-punta-ballena.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-leonetti-pedregal', nombre: 'Villa Leonetti (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-leonetti-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-los-agaves-cabo-del-sol', nombre: 'Villa Los Agaves (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-los-agaves-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-marcella-pedregal', nombre: 'Villa Marcella (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-marcella-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-marena-pedregal', nombre: 'Villa Marena (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-marena-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-maria-pedregal', nombre: 'Villa Maria (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-maria-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-mariposa-cabo-del-sol', nombre: 'Villa Mariposa (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-mariposa-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-miguel-cabo-del-sol', nombre: 'Villa Miguel (Cabo del Sol)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-miguel-cabo-del-sol.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-paraiso-pedregal', nombre: 'Villa Paraíso (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-paraiso-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-penasco-pedregal', nombre: 'Villa Peñasco (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-penasco-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-perla-pedregal', nombre: 'Villa Perla (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-perla-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-pescadores-pedregal', nombre: 'Villa Pescadores (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-pescadores-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-pez-vela-pedregal', nombre: 'Villa Pez Vela (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-pez-vela-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-piedra-blanca-pedregal', nombre: 'Villa Piedra Blanca (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-piedra-blanca-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-renata-pedregal', nombre: 'Villa Renata (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-renata-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-serena', nombre: 'Villa Serena', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-serena.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-sirena-punta-ballena', nombre: 'Villa Sirena (Punta Ballena)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-sirena-punta-ballena.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-sol-y-luna-pedregal', nombre: 'Villa Sol y Luna (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-sol-y-luna-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-stella-pedregal', nombre: 'Villa Stella (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-stella-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-susana-pedregal', nombre: 'Villa Susana (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-susana-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-turquesa-pedregal', nombre: 'Villa Turquesa (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-turquesa-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villa-vista-ballena-pedregal', nombre: 'Villa Vista Ballena (Pedregal)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villa-vista-ballena-pedregal.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villas-de-cabo-bello', nombre: 'Villas de Cabo Bello', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'villas-de-cabo-bello-airport-sjd.webp', desc: 'charming community living' },
  { slug: 'sjd-to-villas-cabo-del-sol', nombre: 'Villas de Cabo del Sol', zona: 3, zonaText: 'Cabo San Lucas (Cabo del Sol)', tiempo: '40-45 min', dist: '41 km', image: 'villas-cabo-del-sol-airport-sjd.webp', desc: 'exclusive villas with golf views' },
  { slug: 'sjd-to-villas-hacienda-encantada', nombre: 'Villas de Hacienda Encantada', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'villas-hacienda-encantada-airport-sjd.webp', desc: 'spacious private luxury' },
  { slug: 'sjd-to-villas-de-la-montana', nombre: 'Villas de la Montaña', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villas-de-la-montana.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villas-de-las-misiones', nombre: 'Villas de Las Misiones', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villas-de-las-misiones.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villas-de-pedregal', nombre: 'Villas de Pedregal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '50-55 min', dist: '48 km', image: 'villas-de-pedregal-airport-sjd.webp', desc: 'luxury private villas' },
  { slug: 'sjd-to-villas-del-arco-residencial', nombre: 'Villas del Arco Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villas-del-arco-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villas-del-faro', nombre: 'Villas del Faro', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villas-del-faro.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villas-del-medano', nombre: 'Villas del Médano', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-villas-del-medano.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-villas-del-tezal', nombre: 'Villas del Tezal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '40 km', image: 'villas-del-tezal-airport-sjd.webp', desc: 'beautiful villas with ocean views' },
  { slug: 'sjd-to-vista-encantada', nombre: 'Vista Encantada Spa Resort & Residences', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '40-45 min', dist: '41 km', image: 'vista-encantada-airport-sjd.webp', desc: 'unparalleled views and relaxation' },
  { slug: 'sjd-to-vista-vela-ii', nombre: 'Vista Vela II', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-vista-vela-ii.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-vista-vela-iii', nombre: 'Vista Vela III', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-vista-vela-iii.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-vista-velas', nombre: 'Vista Velas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-vista-velas.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-vistabella-residencial', nombre: 'Vistabella Residencial', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-vistabella-residencial.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-vistalagos-residencial-country-club', nombre: 'Vistalagos Residencial (Country Club)', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-vistalagos-residencial-country-club.webp', desc: 'a spectacular resort in Cabo' },
  { slug: 'sjd-to-waldorf-astoria', nombre: 'Waldorf Astoria Los Cabos Pedregal', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-55 min', dist: '48 km', image: 'waldorf-astoria-los-cabos-pedregal-to-airport-sjd.webp', desc: 'exclusive elegance beyond the tunnel' },
  { slug: 'sjd-to-waldorf-astoria-private-villas', nombre: 'Waldorf Astoria Private Villas', zona: 3, zonaText: 'Cabo San Lucas', tiempo: '45-50 min', dist: '44 km', image: 'sjd-to-waldorf-astoria-private-villas.webp', desc: 'a spectacular resort in Cabo' },
  // ================= ZONA 4 =================
  { slug: 'sjd-to-alvar-at-quivira', nombre: 'Alvar at Quivira', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-alvar-at-quivira.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-copala-at-quivira', nombre: 'Copala at Quivira', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-copala-at-quivira.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-copala-casas', nombre: 'Copala Casas', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-copala-casas.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-copala-condominiums', nombre: 'Copala Condominiums', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-copala-condominiums.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-coronado-at-quivira', nombre: 'Coronado at Quivira', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-coronado-at-quivira.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-diamante-beach-estates', nombre: 'Diamante Beach Estates', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-diamante-beach-estates.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-diamante', nombre: 'Diamante Cabo San Lucas', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '55 km', image: 'diamante-los-cabos-airport-sjd.webp', desc: 'a world-class golf and beach paradise' },
  { slug: 'sjd-to-diamante-casitas', nombre: 'Diamante Casitas', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-diamante-casitas.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-diamante-crystal-lagoon-suites', nombre: 'Diamante Crystal Lagoon Suites', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-diamante-crystal-lagoon-suites.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-diamante-golf-villas', nombre: 'Diamante Golf Villas', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-diamante-golf-villas.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-diamante-lagoon-penthouses', nombre: 'Diamante Lagoon Penthouses', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-diamante-lagoon-penthouses.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-diamante-ocean-club-residences', nombre: 'Diamante Ocean Club Residences', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-diamante-ocean-club-residences.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-diamante-sunset-hill-estates', nombre: 'Diamante Sunset Hill Estates', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-diamante-sunset-hill-estates.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-diamante-the-woods', nombre: 'Diamante The Woods', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-diamante-the-woods.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-grand-solmar-pacific-dunes', nombre: 'Grand Solmar Pacific Dunes', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '55 km', image: 'grand-solmar-pacific-dunes-airport-sjd.webp', desc: 'luxury surrounded by dramatic dunes' },
  { slug: 'sjd-to-hard-rock', nombre: 'Hard Rock Hotel Los Cabos', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '55 km', image: 'hard-rock-los-cabos-airport-sjd.webp', desc: 'where luxury rocks on the Pacific coast' },
  { slug: 'sjd-to-hard-rock-residences-los-cabos', nombre: 'Hard Rock Residences Los Cabos', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-hard-rock-residences-los-cabos.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-las-estancias-at-diamante', nombre: 'Las Estancias at Diamante', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-las-estancias-at-diamante.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-mavila-at-quivira', nombre: 'Mavila at Quivira', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-mavila-at-quivira.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-mavila-towers', nombre: 'Mavila Towers', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-mavila-towers.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-montecristo-estates', nombre: 'Montecristo Estates Luxury Villas', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'montecristo-estates-airport-sjd.webp', desc: 'opulent cliffside villas' },
  { slug: 'sjd-to-montecristo-penthouses', nombre: 'Montecristo Penthouses', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-montecristo-penthouses.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-nobu-hotel', nombre: 'Nobu Hotel Los Cabos', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '56 km', image: 'nobu-los-cabos-airport-sjd-ballard.webp', desc: 'Japanese minimalism meets Cabo luxury' },
  { slug: 'sjd-to-nobu-residences-los-cabos', nombre: 'Nobu Residences Los Cabos', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-nobu-residences-los-cabos.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-norman-estates-at-rancho-san-lucas', nombre: 'Norman Estates at Rancho San Lucas', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-norman-estates-at-rancho-san-lucas.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-novaispania-villas-y-custom-estates', nombre: 'Novaispania Villas y Custom Estates', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-novaispania-villas-y-custom-estates.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-old-lighthouse-club-quivira', nombre: 'Old Lighthouse Club (Quivira)', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-old-lighthouse-club-quivira.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-pueblo-bonito-pacifica-towers', nombre: 'Pueblo Bonito Pacífica (y The Towers)', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'pueblo-bonito-pacifica-airport-sjd.webp', desc: 'an adults-only tranquil escape' },
  { slug: 'sjd-to-pueblo-bonito-sunset', nombre: 'Pueblo Bonito Sunset Beach', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'pueblo-bonito-sunset-to-airport-sjd.webp', desc: 'a secluded resort on the Pacific bluff' },
  { slug: 'sjd-to-quivira-novaispania', nombre: 'Quivira Novaispania Residences', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '51 km', image: 'quivira-novaispania-airport-sjd.webp', desc: 'exclusive residential luxury' },
  { slug: 'sjd-to-rancho-san-lucas-private-estates', nombre: 'Rancho San Lucas Private Estates', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-rancho-san-lucas-private-estates.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-rolling-hills-estates', nombre: 'Rolling Hills Estates', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-rolling-hills-estates.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-the-residences-at-grand-solmar-pacific-dunes', nombre: 'The Residences at Grand Solmar Pacific Dunes', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-the-residences-at-grand-solmar-pacific-dunes.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-st-regis-los-cabos', nombre: 'The St. Regis Los Cabos at Quivira', zona: 4, zonaText: 'Pacific Zone', tiempo: '55-65 min', dist: '52 km', image: 'st-regis-los-cabos-airport-sjd.webp', desc: 'unrivaled luxury and bespoke service' },
  { slug: 'sjd-to-the-st-regis-residences-los-cabos', nombre: 'The St. Regis Residences Los Cabos', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-the-st-regis-residences-los-cabos.webp', desc: 'a serene oasis on the Pacific' },
  { slug: 'sjd-to-the-villas-at-rancho-san-lucas', nombre: 'The Villas at Rancho San Lucas', zona: 4, zonaText: 'Pacific Zone', tiempo: '50-60 min', dist: '50 km', image: 'sjd-to-the-villas-at-rancho-san-lucas.webp', desc: 'a serene oasis on the Pacific' },


];

// Base completa de hoteles para el buscador interactivo
export const hotelesBase = [
  // ZONA 1: SAN JOSÉ DEL CABO
  { id: 111, nombre: 'Alegranza Luxury Resort', zona: 1 },
  { id: 105, nombre: 'Barceló Gran Faro', zona: 1 },
  { id: 157, nombre: 'Boutique Hotel Casa San José', zona: 1 },
  { id: 101, nombre: 'Cabo Azul Resort', zona: 1 },
  { id: 152, nombre: 'Cabo Colorado', zona: 1 },
  { id: 120, nombre: 'Cabo Surf Hotel & Spa', zona: 1 },
  { id: 169, nombre: 'Cañadas (Querencia)', zona: 1 },
  { id: 158, nombre: 'Casa Don Luis', zona: 1 },
  { id: 109, nombre: 'Casa Natalia', zona: 1 },
  { id: 128, nombre: 'City Express by Marriott San José del Cabo', zona: 1 },
  { id: 142, nombre: 'Club Campestre San José (Residencial)', zona: 1 },
  { id: 170, nombre: 'Club Villas (Querencia)', zona: 1 },
  { id: 159, nombre: 'Condominios La Jolla', zona: 1 },
  { id: 129, nombre: 'Drift San José del Cabo', zona: 1 },
  { id: 110, nombre: 'El Encanto Inn & Suites', zona: 1 },
  { id: 137, nombre: 'El Zalate Condominiums (Costa Azul)', zona: 1 },
  { id: 136, nombre: 'Flamboyan Hotel & Residences', zona: 1 },
  { id: 156, nombre: 'Fonatur Residencial (San José)', zona: 1 },
  { id: 149, nombre: 'Gaviota Condominiums', zona: 1 },
  { id: 115, nombre: 'GR Solaris Lighthouse Los Cabos', zona: 1 },
  { id: 163, nombre: 'Gringo Hill Residencial', zona: 1 },
  { id: 165, nombre: 'Hacienda Los Cabos', zona: 1 },
  { id: 107, nombre: 'Holiday Inn Resort', zona: 1 },
  { id: 127, nombre: 'Hotel Aeropuerto Los Cabos', zona: 1 },
  { id: 117, nombre: 'Hotel Casa Costa Azul', zona: 1 },
  { id: 162, nombre: 'Hotel Colli', zona: 1 },
  { id: 161, nombre: 'Hotel Posada Señor Mañana', zona: 1 },
  { id: 103, nombre: 'Hyatt Ziva Los Cabos', zona: 1 },
  { id: 106, nombre: 'Krystal Grand Los Cabos', zona: 1 },
  { id: 171, nombre: 'La Costa Condominiums', zona: 1 },
  { id: 140, nombre: 'La Jolla de Los Cabos', zona: 1 },
  { id: 144, nombre: 'Ladera San José', zona: 1 },
  { id: 168, nombre: 'Laderas (Querencia)', zona: 1 },
  { id: 167, nombre: 'Las Cabañas (Querencia)', zona: 1 },
  { id: 166, nombre: 'Las Entradas (Querencia)', zona: 1 },
  { id: 112, nombre: 'Las Mañanitas', zona: 1 },
  { id: 119, nombre: 'Las Olas Condominiums, Lets Do Mexico', zona: 1 },
  { id: 150, nombre: 'Las Palmas de San José', zona: 1 },
  { id: 153, nombre: 'Las Residencias (Club Campestre)', zona: 1 },
  { id: 148, nombre: 'Lomas de Costa Azul', zona: 1 },
  { id: 141, nombre: 'Lomas de La Jolla', zona: 1 },
  { id: 155, nombre: 'Magisterial Residencial', zona: 1 },
  { id: 126, nombre: 'MariaMar Suites', zona: 1 },
  { id: 134, nombre: 'Marisol Boutique Hotel', zona: 1 },
  { id: 138, nombre: 'Mira Vista Condominiums (Costa Azul)', zona: 1 },
  { id: 145, nombre: 'Mistiq San José del Cabo', zona: 1 },
  { id: 116, nombre: 'Mykonos Los Cabos', zona: 1 },
  { id: 121, nombre: 'OCEAN RESIDENCE', zona: 1 },
  { id: 124, nombre: 'Ocean Spirits', zona: 1 },
  { id: 114, nombre: 'Park Royal Homestay Los Cabos', zona: 1 },
  { id: 108, nombre: 'Posada Real', zona: 1 },
  { id: 154, nombre: 'Pueblo Pueblo (San José)', zona: 1 },
  { id: 181, nombre: 'Punta Bella', zona: 1 },
  { id: 164, nombre: 'Punta Vista Residencial', zona: 1 },
  { id: 122, nombre: 'Querencia', zona: 1 },
  { id: 151, nombre: 'Rancho Cerro Colorado', zona: 1 },
  { id: 147, nombre: 'Residencial Lomas de San José', zona: 1 },
  { id: 113, nombre: 'Royal Decameron Los Cabos', zona: 1 },
  { id: 104, nombre: 'Royal Solaris', zona: 1 },
  { id: 135, nombre: 'Six Two Four Urban Beach Hotel', zona: 1 },
  { id: 118, nombre: 'Soleado Resort', zona: 1 },
  { id: 133, nombre: 'The Grand Bliss Los Cabos', zona: 1 },
  { id: 131, nombre: 'The Grand Mayan Los Cabos', zona: 1 },
  { id: 139, nombre: 'Tortuga Bay Condominiums', zona: 1 },
  { id: 125, nombre: 'Tropical oasis', zona: 1 },
  { id: 130, nombre: 'Tropicana Inn', zona: 1 },
  { id: 102, nombre: 'Viceroy Los Cabos', zona: 1 },
  { id: 132, nombre: 'Vidanta Los Cabos', zona: 1 },
  { id: 123, nombre: 'Villa Vista del Mar', zona: 1 },
  { id: 143, nombre: 'Villas at Club Campestre', zona: 1 },
  { id: 160, nombre: 'Villas de Costa Azul', zona: 1 },
  { id: 146, nombre: 'Viva Condos San José del Cabo', zona: 1 },
  // ZONA 2: TOURIST CORRIDOR
  { id: 237, nombre: 'Altura (Puerto Los Cabos)', zona: 2 },
  { id: 259, nombre: 'Bugambilias (Cabo Real)', zona: 2 },
  { id: 209, nombre: 'Cabo Real', zona: 2 },
  { id: 258, nombre: 'Cabo Real Estates', zona: 2 },
  { id: 290, nombre: 'Casa Alegre (Palmilla)', zona: 2 },
  { id: 284, nombre: 'Casa Bahía (Chileno)', zona: 2 },
  { id: 269, nombre: 'Casa Buena Vida (Palmilla)', zona: 2 },
  { id: 287, nombre: 'Casa Caleta (Palmilla)', zona: 2 },
  { id: 213, nombre: 'Casa Cielo', zona: 2 },
  { id: 242, nombre: 'Casa de la Paz (Palmilla)', zona: 2 },
  { id: 297, nombre: 'Casa de las Brisas (Cabo Real)', zona: 2 },
  { id: 225, nombre: 'Casa del Mar / Zoëtry', zona: 2 },
  { id: 293, nombre: 'Casa del Mar Residences', zona: 2 },
  { id: 278, nombre: 'Casa Edwards (Palmilla)', zona: 2 },
  { id: 292, nombre: 'Casa Estrella (Puerto Los Cabos)', zona: 2 },
  { id: 241, nombre: 'Casa Fryzer (Villas del Mar)', zona: 2 },
  { id: 279, nombre: 'Casa Koll (Palmilla)', zona: 2 },
  { id: 273, nombre: 'Casa La Laguna (Puerto Los Cabos)', zona: 2 },
  { id: 266, nombre: 'Casa Moka (Puerto Los Cabos)', zona: 2 },
  { id: 280, nombre: 'Casa Oliver (Fundadores)', zona: 2 },
  { id: 286, nombre: 'Casa Roca (Palmilla)', zona: 2 },
  { id: 267, nombre: 'Casa Tierra (Puerto Los Cabos)', zona: 2 },
  { id: 295, nombre: 'Chileno Bay Brisas', zona: 2 },
  { id: 282, nombre: 'Chileno Bay Haciendas', zona: 2 },
  { id: 205, nombre: 'Chileno Bay Resort & Residences', zona: 2 },
  { id: 221, nombre: 'Chileno Bay Resort & Residences, Auberge Collection', zona: 2 },
  { id: 265, nombre: 'Chileno Point Villas', zona: 2 },
  { id: 215, nombre: 'Club Regina Los Cabos', zona: 2 },
  { id: 263, nombre: 'Condominios Casa del Mar', zona: 2 },
  { id: 240, nombre: 'Condominios El Encanto', zona: 2 },
  { id: 300, nombre: 'Condominios Las Gardenias II', zona: 2 },
  { id: 261, nombre: 'Cuenca (Cabo Real)', zona: 2 },
  { id: 216, nombre: 'Dorado', zona: 2 },
  { id: 223, nombre: 'Dreams Los Cabos', zona: 2 },
  { id: 294, nombre: 'El Dorado Beach Villas', zona: 2 },
  { id: 256, nombre: 'El Dorado Casitas', zona: 2 },
  { id: 257, nombre: 'El Dorado Villas', zona: 2 },
  { id: 239, nombre: 'El Encanto de la Laguna', zona: 2 },
  { id: 245, nombre: 'Espíritu Estate (Palmilla)', zona: 2 },
  { id: 235, nombre: 'Fundadores (Puerto Los Cabos)', zona: 2 },
  { id: 255, nombre: 'Garza Blanca Residences', zona: 2 },
  { id: 224, nombre: 'Garza Blanca Resort', zona: 2 },
  { id: 220, nombre: 'Grand Velas Boutique Los Cabos', zona: 2 },
  { id: 203, nombre: 'Grand Velas Los Cabos', zona: 2 },
  { id: 210, nombre: 'Hampton Inn & Suites by Hilton Los Cabos', zona: 2 },
  { id: 222, nombre: 'Hilton Los Cabos', zona: 2 },
  { id: 231, nombre: 'Hotel El Ganzo', zona: 2 },
  { id: 229, nombre: 'JW Marriott Los Cabos Beach Resort & Spa', zona: 2 },
  { id: 285, nombre: 'La Loretana (Palmilla)', zona: 2 },
  { id: 238, nombre: 'La Noria (Puerto Los Cabos)', zona: 2 },
  { id: 218, nombre: 'Las Gardenias Condominiums', zona: 2 },
  { id: 247, nombre: 'Las Majadas (Palmilla)', zona: 2 },
  { id: 260, nombre: 'Las Margaritas (Cabo Real)', zona: 2 },
  { id: 262, nombre: 'Las Playas (Cabo Real)', zona: 2 },
  { id: 201, nombre: 'Las Ventanas al Paraíso (A Rosewood Resort)', zona: 2 },
  { id: 206, nombre: 'Le Blanc Spa Resort', zona: 2 },
  { id: 236, nombre: 'Los Cielos (Puerto Los Cabos)', zona: 2 },
  { id: 226, nombre: 'Mar del Cabo', zona: 2 },
  { id: 211, nombre: 'Marquis Los Cabos', zona: 2 },
  { id: 299, nombre: 'Misiones de Cabo Real', zona: 2 },
  { id: 246, nombre: 'Ocean Estates at Villas del Mar', zona: 2 },
  { id: 202, nombre: 'One&Only Palmilla', zona: 2 },
  { id: 251, nombre: 'One&Only Private Homes', zona: 2 },
  { id: 249, nombre: 'Palmilla Canyons', zona: 2 },
  { id: 276, nombre: 'Palmilla Dunes', zona: 2 },
  { id: 250, nombre: 'Palmilla Fairways', zona: 2 },
  { id: 232, nombre: 'Paradisus', zona: 2 },
  { id: 248, nombre: 'Remanso (Palmilla)', zona: 2 },
  { id: 271, nombre: 'Residencias Grand Velas', zona: 2 },
  { id: 234, nombre: 'Ritz-Carlton Reserve Residences', zona: 2 },
  { id: 252, nombre: 'Rosewood Residences (Las Ventanas)', zona: 2 },
  { id: 230, nombre: 'Secrets Puerto Los Cabos Golf & Spa Resort', zona: 2 },
  { id: 212, nombre: 'Sol de Cabo', zona: 2 },
  { id: 207, nombre: 'Solaz Resort', zona: 2 },
  { id: 254, nombre: 'Solaz Signature Suites', zona: 2 },
  { id: 253, nombre: 'Solaz The Residences', zona: 2 },
  { id: 233, nombre: 'The Enclaves at a Ritz-Carlton Reserve', zona: 2 },
  { id: 217, nombre: 'The Westin Los Cabos Resort Villas - Baja Point', zona: 2 },
  { id: 219, nombre: 'Ty Warner Mansion', zona: 2 },
  { id: 296, nombre: 'Villa Bella (Palmilla)', zona: 2 },
  { id: 281, nombre: 'Villa Captiva (Fundadores)', zona: 2 },
  { id: 298, nombre: 'Villa Celeste (Fundadores)', zona: 2 },
  { id: 283, nombre: 'Villa Cielito (Chileno)', zona: 2 },
  { id: 274, nombre: 'Villa Cristina (Palmilla)', zona: 2 },
  { id: 270, nombre: 'Villa de los Pinos (Palmilla)', zona: 2 },
  { id: 214, nombre: 'Villa Del Mar', zona: 2 },
  { id: 275, nombre: 'Villa del Mar (El Dorado)', zona: 2 },
  { id: 208, nombre: 'Villa La Valencia', zona: 2 },
  { id: 264, nombre: 'Villa La Valencia Residences', zona: 2 },
  { id: 244, nombre: 'Villa Oasis (Palmilla)', zona: 2 },
  { id: 243, nombre: 'Villa Pelicanos (Palmilla)', zona: 2 },
  { id: 268, nombre: 'Villa Tranquila (Fundadores)', zona: 2 },
  { id: 291, nombre: 'Villa Velero (Puerto Los Cabos)', zona: 2 },
  { id: 272, nombre: 'Villas de Cabo Real', zona: 2 },
  { id: 277, nombre: 'Villas de la Montaña (Palmilla)', zona: 2 },
  { id: 289, nombre: 'Villas de Oro II (Palmilla)', zona: 2 },
  { id: 288, nombre: 'Villas del Mar Casitas', zona: 2 },
  { id: 228, nombre: 'Zadún (A Ritz-Carlton Reserve)', zona: 2 },
  // ZONA 3: CABO SAN LUCAS
  { id: 402, nombre: 'Altamira Residencial', zona: 3 },
  { id: 310, nombre: 'Bahía Hotel & Beach House', zona: 3 },
  { id: 526, nombre: 'Baja Inn Suites', zona: 3 },
  { id: 375, nombre: 'Baja\'s Cactus Hostel', zona: 3 },
  { id: 407, nombre: 'Blue Net Hospitals Condos (Zona Médica)', zona: 3 },
  { id: 304, nombre: 'Breathless Cabo San Lucas Resort & Spa', zona: 3 },
  { id: 405, nombre: 'Brisas del Mar Condos', zona: 3 },
  { id: 330, nombre: 'Cabo Bello', zona: 3 },
  { id: 534, nombre: 'Cabo Bello Estates', zona: 3 },
  { id: 466, nombre: 'Cabo Cush Hotel', zona: 3 },
  { id: 406, nombre: 'Cabo del Mar (Village & Condos)', zona: 3 },
  { id: 403, nombre: 'Cabo Fino', zona: 3 },
  { id: 354, nombre: 'Cabo Inn Hotel', zona: 3 },
  { id: 523, nombre: 'Cabo Lindo Condos', zona: 3 },
  { id: 386, nombre: 'Cabo Paraíso Condominiums', zona: 3 },
  { id: 359, nombre: 'Cabo Pedregal Hotel', zona: 3 },
  { id: 365, nombre: 'Cabo San Lucas Country Club Villas', zona: 3 },
  { id: 361, nombre: 'Cabo Tortuga Hotel Boutique', zona: 3 },
  { id: 500, nombre: 'Cabo Village', zona: 3 },
  { id: 313, nombre: 'Cabo Vista Hotel', zona: 3 },
  { id: 374, nombre: 'Casa Bella Boutique Hotel', zona: 3 },
  { id: 488, nombre: 'Casa de la Familia (Pedregal)', zona: 3 },
  { id: 495, nombre: 'Casa de la Playa (Cabo Bello)', zona: 3 },
  { id: 434, nombre: 'Casa de los Ángeles (Pedregal)', zona: 3 },
  { id: 515, nombre: 'Casa del Cielo (Pedregal)', zona: 3 },
  { id: 494, nombre: 'Casa del Sol (Cabo Bello)', zona: 3 },
  { id: 338, nombre: 'Casa Dorada Los Cabos Resort & Spa', zona: 3 },
  { id: 514, nombre: 'Casa Flamingo (Pedregal)', zona: 3 },
  { id: 433, nombre: 'Casa Gran Vista (Pedregal)', zona: 3 },
  { id: 505, nombre: 'Casa Linda (Pedregal)', zona: 3 },
  { id: 486, nombre: 'Casa Mia (Pedregal)', zona: 3 },
  { id: 520, nombre: 'Casa Pablito Bed & Breakfast', zona: 3 },
  { id: 485, nombre: 'Casa Roca de los Amantes (Pedregal)', zona: 3 },
  { id: 529, nombre: 'Casa Sirena (Misiones del Cabo)', zona: 3 },
  { id: 487, nombre: 'Casa Stella (Pedregal)', zona: 3 },
  { id: 498, nombre: 'Casa Tezal', zona: 3 },
  { id: 513, nombre: 'Casa Theodore (Pedregal)', zona: 3 },
  { id: 479, nombre: 'Casa Tres Mares (Pedregal)', zona: 3 },
  { id: 326, nombre: 'Casas de Pedregal', zona: 3 },
  { id: 318, nombre: 'City Express Plus by Marriott Cabo San Lucas', zona: 3 },
  { id: 347, nombre: 'Club Cascadas de Baja', zona: 3 },
  { id: 522, nombre: 'Condominios Buena Vista', zona: 3 },
  { id: 535, nombre: 'Condominios Cabo San Lucas', zona: 3 },
  { id: 410, nombre: 'Condominios El Dorado', zona: 3 },
  { id: 395, nombre: 'Condominios El Pedregal', zona: 3 },
  { id: 499, nombre: 'Condominios El Portillo', zona: 3 },
  { id: 517, nombre: 'Condominios La Marina', zona: 3 },
  { id: 391, nombre: 'Condominios La Vista', zona: 3 },
  { id: 532, nombre: 'Condominios Los Patios', zona: 3 },
  { id: 476, nombre: 'Condominios Marina Cabo Plaza', zona: 3 },
  { id: 477, nombre: 'Condominios Pedregalito', zona: 3 },
  { id: 381, nombre: 'Condominios Portofino', zona: 3 },
  { id: 475, nombre: 'Copacabana Condominiums', zona: 3 },
  { id: 305, nombre: 'Corazón Cabo Resort & Spa', zona: 3 },
  { id: 501, nombre: 'Cresta del Mar Residencial', zona: 3 },
  { id: 369, nombre: 'Duara Ocean View Villas & Condos', zona: 3 },
  { id: 465, nombre: 'El Ameyal Hotel & Wellness Center', zona: 3 },
  { id: 503, nombre: 'El Cielito Residencial (Tezal)', zona: 3 },
  { id: 525, nombre: 'El Pedregal Heights', zona: 3 },
  { id: 324, nombre: 'El Tezal', zona: 3 },
  { id: 450, nombre: 'Esperanza Private Residences', zona: 3 },
  { id: 333, nombre: 'Esperanza, Auberge Resorts Collection', zona: 3 },
  { id: 355, nombre: 'Estancia Real Los Cabos', zona: 3 },
  { id: 320, nombre: 'Fairfield Inn by Marriott Los Cabos', zona: 3 },
  { id: 303, nombre: 'Grand Fiesta Americana', zona: 3 },
  { id: 343, nombre: 'Grand Solmar Land\'s End Resort & Spa', zona: 3 },
  { id: 340, nombre: 'Hacienda Beach Club & Residences', zona: 3 },
  { id: 457, nombre: 'Hacienda Beach Club Villas (El Médano)', zona: 3 },
  { id: 337, nombre: 'Hacienda del Mar Los Cabos Resort', zona: 3 },
  { id: 334, nombre: 'Hacienda Encantada Resort & Residences', zona: 3 },
  { id: 458, nombre: 'Hacienda Penthouse Residences (El Médano)', zona: 3 },
  { id: 384, nombre: 'Hermitage Residencial', zona: 3 },
  { id: 319, nombre: 'Holiday Inn Express Cabo San Lucas', zona: 3 },
  { id: 362, nombre: 'Hotel Colonos', zona: 3 },
  { id: 390, nombre: 'Hotel del Ángel', zona: 3 },
  { id: 358, nombre: 'Hotel Dos Mares', zona: 3 },
  { id: 353, nombre: 'Hotel Mar de Cortez', zona: 3 },
  { id: 527, nombre: 'Hotel Oasis de Cabo', zona: 3 },
  { id: 377, nombre: 'Hotel Plaza Los Arcos', zona: 3 },
  { id: 519, nombre: 'Hotel Real Dorado', zona: 3 },
  { id: 357, nombre: 'Hotel Santa Fe Cabo San Lucas', zona: 3 },
  { id: 502, nombre: 'La Cima Residencial', zona: 3 },
  { id: 409, nombre: 'La Jolla Residential', zona: 3 },
  { id: 537, nombre: 'La Ribera Condominios', zona: 3 },
  { id: 440, nombre: 'Las Casonas at Waldorf Astoria', zona: 3 },
  { id: 455, nombre: 'Las Estrellas (Punta Ballena)', zona: 3 },
  { id: 371, nombre: 'Las Haciendas', zona: 3 },
  { id: 389, nombre: 'Las Palmas Suites', zona: 3 },
  { id: 451, nombre: 'Las Residencias at Punta Ballena', zona: 3 },
  { id: 380, nombre: 'Las Residencias Golf & Beach Club', zona: 3 },
  { id: 398, nombre: 'Lomas del Tezal', zona: 3 },
  { id: 364, nombre: 'Los Cabos Golf Resort, Trademark Collection by Wyndham', zona: 3 },
  { id: 311, nombre: 'Los Milagros Hotel', zona: 3 },
  { id: 351, nombre: 'Los Patios Hotel', zona: 3 },
  { id: 379, nombre: 'Lumina at Cabo San Lucas', zona: 3 },
  { id: 393, nombre: 'Lush Hostel', zona: 3 },
  { id: 394, nombre: 'Maranatha Residencial', zona: 3 },
  { id: 378, nombre: 'Maria Elena Hotel', zona: 3 },
  { id: 308, nombre: 'Marina Fiesta Resort & Spa', zona: 3 },
  { id: 348, nombre: 'Marina Sol Resort', zona: 3 },
  { id: 352, nombre: 'Mayan Monkey Los Cabos', zona: 3 },
  { id: 306, nombre: 'ME Cabo', zona: 3 },
  { id: 346, nombre: 'Medano Hotel and Suites', zona: 3 },
  { id: 329, nombre: 'Misiones del Cabo', zona: 3 },
  { id: 504, nombre: 'Mistiq Los Cabos', zona: 3 },
  { id: 204, nombre: 'Montage Los Cabos', zona: 3 },
  { id: 459, nombre: 'Montage Residences (Santa María)', zona: 3 },
  { id: 360, nombre: 'Morgan Residences', zona: 3 },
  { id: 356, nombre: 'Norman Diego\'s The Mexican Inn', zona: 3 },
  { id: 539, nombre: 'Oasis de la Campana (Tezal)', zona: 3 },
  { id: 449, nombre: 'Ocean Meadows (Cabo del Sol)', zona: 3 },
  { id: 301, nombre: 'Park Hyatt Los Cabos at Cabo del Sol', zona: 3 },
  { id: 387, nombre: 'Pedregal Manor', zona: 3 },
  { id: 309, nombre: 'Playa Grande Resort', zona: 3 },
  { id: 408, nombre: 'Plaza del Rey Residencial', zona: 3 },
  { id: 474, nombre: 'Plaza Náutica Condominiums', zona: 3 },
  { id: 497, nombre: 'Portales de Cabo', zona: 3 },
  { id: 400, nombre: 'Privada Misiones', zona: 3 },
  { id: 307, nombre: 'Pueblo Bonito Blanco (Los Cabos Beach Resort)', zona: 3 },
  { id: 339, nombre: 'Pueblo Bonito Rosé Resort & Spa', zona: 3 },
  { id: 399, nombre: 'Puerta de Hierro Cabo', zona: 3 },
  { id: 370, nombre: 'Puerta del Sol (Cabo del Sol)', zona: 3 },
  { id: 401, nombre: 'Punta Arenas Condominios', zona: 3 },
  { id: 373, nombre: 'Punta Ballena Residences', zona: 3 },
  { id: 383, nombre: 'Punta Carmela', zona: 3 },
  { id: 530, nombre: 'Punta del Este Condominiums', zona: 3 },
  { id: 350, nombre: 'Quinta del Sol by Solmar', zona: 3 },
  { id: 472, nombre: 'Rancho Paraíso Estates', zona: 3 },
  { id: 404, nombre: 'Residencial Cabo San Lucas', zona: 3 },
  { id: 397, nombre: 'Residencial Cumbres del Tezal', zona: 3 },
  { id: 540, nombre: 'Residencial El Bordo', zona: 3 },
  { id: 531, nombre: 'Residencial La Joya (Cabo San Lucas)', zona: 3 },
  { id: 524, nombre: 'Residencial Las Garzas', zona: 3 },
  { id: 518, nombre: 'Residencial San Lázaro', zona: 3 },
  { id: 316, nombre: 'Riu Palace Baja California', zona: 3 },
  { id: 315, nombre: 'Riu Palace Cabo San Lucas', zona: 3 },
  { id: 317, nombre: 'Riu Santa Fe', zona: 3 },
  { id: 448, nombre: 'Riviera Villas (Cabo del Sol)', zona: 3 },
  { id: 342, nombre: 'Sandos Finisterra Los Cabos', zona: 3 },
  { id: 372, nombre: 'Santa Carmela', zona: 3 },
  { id: 496, nombre: 'Santa Cruz Residencial', zona: 3 },
  { id: 349, nombre: 'Seven Crown Express & Suites Cabo San Lucas', zona: 3 },
  { id: 314, nombre: 'Siesta Suites', zona: 3 },
  { id: 332, nombre: 'Sirena del Mar (Hyatt Vacation Club)', zona: 3 },
  { id: 376, nombre: 'Sofia Hostel Cabo', zona: 3 },
  { id: 344, nombre: 'Solmar Resort', zona: 3 },
  { id: 538, nombre: 'Suites Las Palmas', zona: 3 },
  { id: 463, nombre: 'Sunrock Hotel & Suites', zona: 3 },
  { id: 382, nombre: 'Terranova Residencial', zona: 3 },
  { id: 464, nombre: 'Terrasol Beach Resort', zona: 3 },
  { id: 341, nombre: 'Tesoro Los Cabos', zona: 3 },
  { id: 312, nombre: 'The Bungalows Hotel', zona: 3 },
  { id: 460, nombre: 'The Cape Residences', zona: 3 },
  { id: 328, nombre: 'The Cape, a Thompson Hotel', zona: 3 },
  { id: 462, nombre: 'The Paraiso Residences', zona: 3 },
  { id: 478, nombre: 'The Residences at La Vista (Pedregal)', zona: 3 },
  { id: 363, nombre: 'The Ridge at Playa Grande', zona: 3 },
  { id: 366, nombre: 'Tramonti Los Cabos', zona: 3 },
  { id: 467, nombre: 'Velamar Los Cabos', zona: 3 },
  { id: 367, nombre: 'Ventanas al Paraíso Residencial', zona: 3 },
  { id: 470, nombre: 'Ventanas Fase 2', zona: 3 },
  { id: 471, nombre: 'Ventanas Fase 3', zona: 3 },
  { id: 489, nombre: 'Villa Alegría (Pedregal)', zona: 3 },
  { id: 506, nombre: 'Villa Andaluza (Pedregal)', zona: 3 },
  { id: 411, nombre: 'Villa Bellissima (Pedregal)', zona: 3 },
  { id: 445, nombre: 'Villa Buena Vida (Cabo del Sol)', zona: 3 },
  { id: 484, nombre: 'Villa Caleta (Pedregal)', zona: 3 },
  { id: 490, nombre: 'Villa Canto del Mar (Pedregal)', zona: 3 },
  { id: 432, nombre: 'Villa Castillo (Pedregal)', zona: 3 },
  { id: 420, nombre: 'Villa Cielito (Pedregal)', zona: 3 },
  { id: 421, nombre: 'Villa Colina (Pedregal)', zona: 3 },
  { id: 438, nombre: 'Villa Contempo (Pedregal)', zona: 3 },
  { id: 431, nombre: 'Villa Corona (Pedregal)', zona: 3 },
  { id: 516, nombre: 'Villa de la Luna (Pedregal)', zona: 3 },
  { id: 423, nombre: 'Villa de la Luz (Pedregal)', zona: 3 },
  { id: 507, nombre: 'Villa de la Mina (Pedregal)', zona: 3 },
  { id: 444, nombre: 'Villa de la Vida (Cabo del Sol)', zona: 3 },
  { id: 483, nombre: 'Villa de las Olas (Pedregal)', zona: 3 },
  { id: 443, nombre: 'Villa de las Palmas (Cabo del Sol)', zona: 3 },
  { id: 442, nombre: 'Villa de los Faros (Cabo del Sol)', zona: 3 },
  { id: 417, nombre: 'Villa de los Sueños (Pedregal)', zona: 3 },
  { id: 321, nombre: 'Villa del Arco Beach Resort & Spa', zona: 3 },
  { id: 454, nombre: 'Villa del Corazón (Punta Ballena)', zona: 3 },
  { id: 493, nombre: 'Villa del Mar (Cabo del Sol)', zona: 3 },
  { id: 322, nombre: 'Villa del Palmar Beach Resort & Spa', zona: 3 },
  { id: 419, nombre: 'Villa del Toro Rojo (Pedregal)', zona: 3 },
  { id: 428, nombre: 'Villa Descanso (Pedregal)', zona: 3 },
  { id: 436, nombre: 'Villa Dorada (Pedregal)', zona: 3 },
  { id: 430, nombre: 'Villa Dos Mares (Pedregal)', zona: 3 },
  { id: 452, nombre: 'Villa Eduardo (Punta Ballena)', zona: 3 },
  { id: 422, nombre: 'Villa Fiesta (Pedregal)', zona: 3 },
  { id: 426, nombre: 'Villa Finisterra (Pedregal)', zona: 3 },
  { id: 416, nombre: 'Villa Firenze (Pedregal)', zona: 3 },
  { id: 435, nombre: 'Villa Gran Escalera (Pedregal)', zona: 3 },
  { id: 323, nombre: 'Villa La Estancia Beach Resort & Spa', zona: 3 },
  { id: 461, nombre: 'Villa La Estancia Penthouses & Villas', zona: 3 },
  { id: 385, nombre: 'Villa La Paloma', zona: 3 },
  { id: 415, nombre: 'Villa La Roca (Pedregal)', zona: 3 },
  { id: 481, nombre: 'Villa La Zafiro (Pedregal)', zona: 3 },
  { id: 491, nombre: 'Villa Las Flores (Pedregal)', zona: 3 },
  { id: 425, nombre: 'Villa Las Palmas (Pedregal)', zona: 3 },
  { id: 456, nombre: 'Villa Las Penas (Punta Ballena)', zona: 3 },
  { id: 508, nombre: 'Villa Leonetti (Pedregal)', zona: 3 },
  { id: 447, nombre: 'Villa Los Agaves (Cabo del Sol)', zona: 3 },
  { id: 412, nombre: 'Villa Marcella (Pedregal)', zona: 3 },
  { id: 512, nombre: 'Villa Marena (Pedregal)', zona: 3 },
  { id: 429, nombre: 'Villa Maria (Pedregal)', zona: 3 },
  { id: 441, nombre: 'Villa Mariposa (Cabo del Sol)', zona: 3 },
  { id: 446, nombre: 'Villa Miguel (Cabo del Sol)', zona: 3 },
  { id: 510, nombre: 'Villa Paraíso (Pedregal)', zona: 3 },
  { id: 414, nombre: 'Villa Peñasco (Pedregal)', zona: 3 },
  { id: 482, nombre: 'Villa Perla (Pedregal)', zona: 3 },
  { id: 437, nombre: 'Villa Pescadores (Pedregal)', zona: 3 },
  { id: 509, nombre: 'Villa Pez Vela (Pedregal)', zona: 3 },
  { id: 492, nombre: 'Villa Piedra Blanca (Pedregal)', zona: 3 },
  { id: 480, nombre: 'Villa Renata (Pedregal)', zona: 3 },
  { id: 388, nombre: 'Villa Serena', zona: 3 },
  { id: 453, nombre: 'Villa Sirena (Punta Ballena)', zona: 3 },
  { id: 427, nombre: 'Villa Sol y Luna (Pedregal)', zona: 3 },
  { id: 418, nombre: 'Villa Stella (Pedregal)', zona: 3 },
  { id: 511, nombre: 'Villa Susana (Pedregal)', zona: 3 },
  { id: 413, nombre: 'Villa Turquesa (Pedregal)', zona: 3 },
  { id: 424, nombre: 'Villa Vista Ballena (Pedregal)', zona: 3 },
  { id: 331, nombre: 'Villas de Cabo Bello', zona: 3 },
  { id: 302, nombre: 'Villas de Cabo del Sol', zona: 3 },
  { id: 336, nombre: 'Villas de Hacienda Encantada', zona: 3 },
  { id: 521, nombre: 'Villas de la Montaña', zona: 3 },
  { id: 533, nombre: 'Villas de Las Misiones', zona: 3 },
  { id: 327, nombre: 'Villas de Pedregal', zona: 3 },
  { id: 536, nombre: 'Villas del Arco Residencial', zona: 3 },
  { id: 528, nombre: 'Villas del Faro', zona: 3 },
  { id: 396, nombre: 'Villas del Médano', zona: 3 },
  { id: 325, nombre: 'Villas del Tezal', zona: 3 },
  { id: 335, nombre: 'Vista Encantada Spa Resort & Residences', zona: 3 },
  { id: 468, nombre: 'Vista Vela II', zona: 3 },
  { id: 469, nombre: 'Vista Vela III', zona: 3 },
  { id: 368, nombre: 'Vista Velas', zona: 3 },
  { id: 392, nombre: 'Vistabella Residencial', zona: 3 },
  { id: 473, nombre: 'Vistalagos Residencial (Country Club)', zona: 3 },
  { id: 439, nombre: 'Waldorf Astoria Private Villas', zona: 3 },
  // ZONA 4: PACIFIC ZONE
  { id: 414, nombre: 'Alvar at Quivira', zona: 4 },
  { id: 411, nombre: 'Copala at Quivira', zona: 4 },
  { id: 434, nombre: 'Copala Casas', zona: 4 },
  { id: 433, nombre: 'Copala Condominiums', zona: 4 },
  { id: 412, nombre: 'Coronado at Quivira', zona: 4 },
  { id: 421, nombre: 'Diamante Beach Estates', zona: 4 },
  { id: 407, nombre: 'Diamante Cabo San Lucas', zona: 4 },
  { id: 423, nombre: 'Diamante Casitas', zona: 4 },
  { id: 437, nombre: 'Diamante Crystal Lagoon Suites', zona: 4 },
  { id: 419, nombre: 'Diamante Golf Villas', zona: 4 },
  { id: 435, nombre: 'Diamante Lagoon Penthouses', zona: 4 },
  { id: 422, nombre: 'Diamante Ocean Club Residences', zona: 4 },
  { id: 420, nombre: 'Diamante Sunset Hill Estates', zona: 4 },
  { id: 424, nombre: 'Diamante The Woods', zona: 4 },
  { id: 406, nombre: 'Grand Solmar Pacific Dunes', zona: 4 },
  { id: 403, nombre: 'Hard Rock Hotel Los Cabos', zona: 4 },
  { id: 418, nombre: 'Hard Rock Residences Los Cabos', zona: 4 },
  { id: 425, nombre: 'Las Estancias at Diamante', zona: 4 },
  { id: 413, nombre: 'Mavila at Quivira', zona: 4 },
  { id: 432, nombre: 'Mavila Towers', zona: 4 },
  { id: 408, nombre: 'Montecristo Estates Luxury Villas', zona: 4 },
  { id: 430, nombre: 'Montecristo Penthouses', zona: 4 },
  { id: 402, nombre: 'Nobu Hotel Los Cabos', zona: 4 },
  { id: 417, nombre: 'Nobu Residences Los Cabos', zona: 4 },
  { id: 426, nombre: 'Norman Estates at Rancho San Lucas', zona: 4 },
  { id: 431, nombre: 'Novaispania Villas y Custom Estates', zona: 4 },
  { id: 415, nombre: 'Old Lighthouse Club (Quivira)', zona: 4 },
  { id: 405, nombre: 'Pueblo Bonito Pacífica (y The Towers)', zona: 4 },
  { id: 404, nombre: 'Pueblo Bonito Sunset Beach', zona: 4 },
  { id: 409, nombre: 'Quivira Novaispania Residences', zona: 4 },
  { id: 436, nombre: 'Rancho San Lucas Private Estates', zona: 4 },
  { id: 429, nombre: 'Rolling Hills Estates', zona: 4 },
  { id: 428, nombre: 'The Residences at Grand Solmar Pacific Dunes', zona: 4 },
  { id: 410, nombre: 'The St. Regis Los Cabos at Quivira', zona: 4 },
  { id: 416, nombre: 'The St. Regis Residences Los Cabos', zona: 4 },
  { id: 427, nombre: 'The Villas at Rancho San Lucas', zona: 4 },
  { id: 401, nombre: 'Waldorf Astoria Los Cabos Pedregal', zona: 4 },


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
  const lang = resolvedParams?.lang || 'en'; // Inglés como principal por defecto
  const slug = resolvedParams?.slug || '';
  const router = useRouter();

  // 2. OBTENEMOS LAS FUNCIONES DEL CONTEXTO
  const { setReserva, setServicioSeleccionado, setPaso, setBusquedaHotelPrincipal } = useBooking();

  // 3. BUSCAMOS EL HOTEL INICIAL BASADO EN LA URL
  const hotel = landingPagesSEO.find(h => h.slug === slug);

  // 4. ESTADOS LOCALES PARA EL FORMULARIO
  const [searchTerm, setSearchTerm] = useState(hotel?.nombre || '');
  const [activeHotelName, setActiveHotelName] = useState(hotel?.nombre || '');
  const [activeZona, setActiveZona] = useState(hotel?.zona || 1);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [pasajeros, setPasajeros] = useState(1);

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

  // Precios dinámicos basados en la zona ACTIVA (por si el usuario cambia el hotel en el buscador)
  const tarifaVehiculo = zonasPrecios.find(z => z.id === activeZona) || { tarifaSuburban: 80, tarifaSprinter: 110 };

  // Filtrado de hoteles para el buscador interactivo
  const filteredHotels = hotelesBase.filter(h => searchTerm.toLowerCase().split(' ').every(w => h.nombre.toLowerCase().includes(w)));

  // Manejador para continuar al paso 2
  const handleContinue = (servicio) => {
    if (setServicioSeleccionado) setServicioSeleccionado(servicio);
    if (setReserva) {
      setReserva(prev => ({ 
        ...prev, 
        hotelId: activeHotelName, 
        zonaId: activeZona,       
        tipoVehiculo: vehiculoSeleccionado,
        fechaLlegada: fechaLlegada,
        pasajeros: pasajeros
      }));
    }
    if (setBusquedaHotelPrincipal) setBusquedaHotelPrincipal(activeHotelName);
    if (setPaso) setPaso(2); 
    
    // Redirige y sube el scroll hasta arriba
    router.push(`/${lang}`);
    window.scrollTo(0, 0);
  };

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
          <HeroReviewsBadge lang={lang} />
          <p className="text-lg md:text-xl text-slate-300 font-medium mt-4">
            {lang === 'es' ? 'Servicio Exclusivo en Luxury SUV y Sprinter' : 'Exclusive Private Transportation & Luxury SUV Service'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ========================================= */}
        {/* COLUMNA PRINCIPAL DE CONTENIDO            */}
        {/* ========================================= */}
        <div className="lg:col-span-2 space-y-12 text-slate-700 text-lg leading-relaxed order-2 lg:order-1">

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
        {/* COLUMNA DERECHA: WIDGET DE RESERVA INTERACTIVO INTERNACIONALIZADO */}
        {/* ========================================= */}
        <div className="lg:col-span-1 relative order-1 lg:order-2">
          <UrgencyBanner lang={lang} locationName={hotel.nombre} />
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 sticky top-28">
            
            {/* Cabecera del Widget */}
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={24} />
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {lang === 'es' ? 'Detalles de tu Reserva' : 'Booking Details'}
                </h3>
              </div>
              <div className="flex flex-col items-end">
                 <div className="flex items-center gap-1">
                   <ShieldCheck size={14} className="text-yellow-600" />
                   <span className="text-[10px] font-bold text-slate-600 uppercase">
                     {lang === 'es' ? 'Pago Seguro' : 'Secure Payment'}
                   </span>
                 </div>
              </div>
            </div>

            {/* SELECCIONA TU HOTEL (BUSCADOR INTERACTIVO) */}
            <div className="mb-6 relative">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                {lang === 'es' ? 'Selecciona tu hotel' : 'Select your hotel'}
              </label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} 
                placeholder={lang === 'es' ? 'Escribe para buscar tu hotel...' : 'Type to search your hotel...'} 
                className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 transition-colors" 
              />
              
              {/* Lista desplegable de Autocompletado */}
              {showDropdown && searchTerm && (
                <ul className="absolute z-50 w-full bg-white border border-slate-200 shadow-xl max-h-60 overflow-y-auto rounded-xl mt-1 top-full left-0">
                  {filteredHotels.length > 0 ? (
                    filteredHotels.map(h => (
                      <li 
                        key={h.id} 
                        onMouseDown={() => {
                          setSearchTerm(h.nombre);
                          setActiveHotelName(h.nombre);
                          setActiveZona(h.zona); 
                          setShowDropdown(false);
                        }} 
                        className="p-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-0"
                      >
                        {h.nombre}
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-sm text-slate-400">
                      {lang === 'es' ? 'No se encontraron hoteles' : 'No hotels found'}
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* TIPO DE VEHÍCULO */}
            <div className="mb-6">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                {lang === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type'}
              </label>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                
                {/* Opcion Luxury SUV */}
                <button 
                  onClick={() => setVehiculoSeleccionado('suv')} 
                  className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${vehiculoSeleccionado === 'suv' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex justify-between items-start w-full mb-2">
                    <span className="font-bold text-slate-900">Luxury SUV</span>
                    <Car size={18} className={vehiculoSeleccionado === 'suv' ? 'text-blue-900' : 'text-slate-400'} />
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4 leading-tight">
                    {lang === 'es' ? 'Elegancia y confort para familias o grupos pequeños.' : 'Elegance and comfort for families or small groups.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                      <Users size={12} /> {lang === 'es' ? 'MÁX 6 PAX' : 'MAX 6 PAX'}
                    </div>
                    <span className="font-black text-slate-900 text-sm">${tarifaVehiculo.tarifaSuburban}</span>
                  </div>
                </button>

                {/* Opcion Van */}
                <button 
                  onClick={() => setVehiculoSeleccionado('van')} 
                  className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${vehiculoSeleccionado === 'van' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex justify-between items-start w-full mb-2">
                    <span className="font-bold text-slate-900">Van</span>
                    <Car size={18} className={vehiculoSeleccionado === 'van' ? 'text-blue-900' : 'text-slate-400'} />
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4 leading-tight">
                    {lang === 'es' ? 'Amplitud y lujo para grupos grandes.' : 'Spaciousness and luxury for large groups.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                      <Users size={12} /> {lang === 'es' ? 'MÁX 10 PAX' : 'MAX 10 PAX'}
                    </div>
                    <span className="font-black text-slate-900 text-sm">${tarifaVehiculo.tarifaSprinter}</span>
                  </div>
                </button>

              </div>
            </div>

            {/* FECHA Y PASAJEROS */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  {lang === 'es' ? 'Fecha de Llegada' : 'Arrival Date'}
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={fechaLlegada}
                    onChange={(e) => setFechaLlegada(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  {lang === 'es' ? 'Pasajeros' : 'Passengers'}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none"><Users size={16} /></div>
                  <input 
                    type="number" 
                    min="1" 
                    value={pasajeros}
                    onChange={(e) => setPasajeros(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 pl-12 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* BOTONES DE CONTINUAR */}
            <div className="text-center mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {lang === 'es' ? 'Elige un servicio para continuar' : 'Choose a service to continue'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleContinue('aeropuerto_hotel')} 
                className="border border-slate-200 rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:border-blue-900 hover:bg-slate-50 transition-colors bg-white group"
              >
                <PlaneLanding size={24} className="text-slate-400 mb-2 group-hover:text-blue-900 transition-colors" />
                <span className="text-xs font-bold text-slate-800 text-center">
                  {lang === 'es' ? 'Aeropuerto → Hotel' : 'Airport → Hotel'}
                </span>
              </button>
              
              <button 
                onClick={() => handleContinue('hotel_aeropuerto')} 
                className="border border-slate-200 rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:border-blue-900 hover:bg-slate-50 transition-colors bg-white group"
              >
                <PlaneTakeoff size={24} className="text-slate-400 mb-2 group-hover:text-blue-900 transition-colors" />
                <span className="text-xs font-bold text-slate-800 text-center">
                  {lang === 'es' ? 'Hotel → Aeropuerto' : 'Hotel → Airport'}
                </span>
              </button>

              <button 
                onClick={() => handleContinue('viaje_redondo')} 
                className="border border-slate-200 rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:border-blue-900 hover:bg-slate-50 transition-colors bg-white group"
              >
                <RefreshCcw size={24} className="text-slate-400 mb-2 group-hover:text-blue-900 transition-colors" />
                <span className="text-xs font-bold text-slate-800 text-center">
                  {lang === 'es' ? 'Viaje Redondo' : 'Round Trip'}
                </span>
              </button>

              <button 
                onClick={() => handleContinue('tours')} 
                className="bg-[#0f172a] rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:bg-slate-800 transition-colors shadow-lg group"
              >
                <Compass size={24} className="text-slate-300 mb-2 group-hover:text-white transition-colors" />
                <span className="text-xs font-bold text-white text-center">
                  {lang === 'es' ? 'Tours y Especiales' : 'Tours & Specials'}
                </span>
              </button>
            </div>

            <TrustBadges lang={lang} showFlightMonitoring={true} />
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