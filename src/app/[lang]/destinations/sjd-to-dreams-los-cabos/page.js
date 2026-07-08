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
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';

// =========================================================
// 🏨 BASE DE DATOS DE HOTELES (LANDING PAGES SEO)
// =========================================================


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
  const slug = 'sjd-to-dreams-los-cabos';
  const router = useRouter();

  // 2. OBTENEMOS LAS FUNCIONES DEL CONTEXTO
  const { reserva, setReserva, setServicioSeleccionado, setPaso, setBusquedaHotelPrincipal } = useBooking();

  // 3. DATOS DE ESTE HOTEL (ESTÁTICOS)
  const hotel = {
    "slug": "sjd-to-dreams-los-cabos",
    "nombre": "Dreams Los Cabos",
    "zona": 2,
    "zonaText": "Tourist Corridor",
    "tiempo": "35-40 min",
    "dist": "32 km",
    "image": "hotel/dreams-los-cabos-sjd-airport.webp",
    "desc": "a limitless beachfront escape"
  };

  // 4. ESTADOS LOCALES PARA EL FORMULARIO
  const [searchTerm, setSearchTerm] = useState(reserva.hotelId || hotel?.nombre || '');
  const [activeHotelName, setActiveHotelName] = useState(reserva.hotelId || hotel?.nombre || '');
  const [activeZona, setActiveZona] = useState(reserva.zonaId || hotel?.zona || 1);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [vehiculo, setVehiculo] = useState(reserva.vehiculo || 'suburban');
  const [fechaLlegada, setFechaLlegada] = useState(reserva.fechaLlegada || '');
  const [pasajeros, setPasajeros] = useState(reserva.pasajeros || 1);

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
        vehiculo: vehiculo,
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
                src={`https://maps.google.com/maps?q=${encodeURIComponent('Dreams Los Cabos')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
                  onClick={() => setVehiculo('suburban')} 
                  className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${vehiculo === 'suburban' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex justify-between items-start w-full mb-2">
                    <span className="font-bold text-slate-900">Luxury SUV</span>
                    <Car size={18} className={vehiculo === 'suburban' ? 'text-blue-900' : 'text-slate-400'} />
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
                  onClick={() => setVehiculo('sprinter')} 
                  className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${vehiculo === 'sprinter' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex justify-between items-start w-full mb-2">
                    <span className="font-bold text-slate-900">Van</span>
                    <Car size={18} className={vehiculo === 'sprinter' ? 'text-blue-900' : 'text-slate-400'} />
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
                onClick={() => handleContinue('redondo')} 
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