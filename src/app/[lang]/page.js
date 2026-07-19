// src/app/[lang]/page.js
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle,
  ChevronRight,
  MapPin,
  Map as MapIcon,
  Search,
  Check,
  Clock,
  Calendar,
  Baby,
  Banknote,
  Compass,
  Briefcase, // <-- Agrega este
  Heart      // <-- ¡Este es el que está causando el error!
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import FeaturedTours from '../../components/FeaturedTours';
import HeroBooking from '../../components/HeroBooking';
import TransportBookingForm from '../../components/TransportBookingForm';
import TourBookingForm from '../../components/TourBookingForm';
import TrustAndReviews from '../../components/TrustAndReviews';
import ExperienceSelector from '../../components/ExperienceSelector';
import SpecialServices from '../../components/SpecialServices';
import { FAQSection } from '../../components/FAQSection'; // Asegúrate de la ruta
import TrustedPartners from '../../components/TrustedPartners';
import GoogleReviews from '../../components/GoogleReviews';
import CustomerPhotosWidget from '../../components/CustomerPhotosWidget';
import UrgencyBanner from '../../components/UrgencyBanner';
import { dict } from '../../locales/dict';

export default function Home() {
  const params = useParams();
  const lang = params?.lang || 'en';
  const t = dict[lang] || dict['en'];

  const { paso, servicioSeleccionado, subCategoria, setSubCategoria, reserva, setServicioSeleccionado } = useBooking();

  // Estado para el buscador de Zonas
  const [busquedaHotel, setBusquedaHotel] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [paso, subCategoria, reserva.tourId, servicioSeleccionado]);

  const esServicioTransporte = ['aeropuerto_hotel', 'hotel_aeropuerto', 'redondo'].includes(servicioSeleccionado);

  // =========================================================
  // MOCK DATA PARA EL DIRECTORIO DE ZONAS Y HOTELES
  // =========================================================
  const zonasBase = [
    { id: 1, nombre: 'San José del Cabo', tarifaSuburban: 80, tarifaSprinter: 110 },
    { id: 2, nombre: 'Tourist Corridor', tarifaSuburban: 90, tarifaSprinter: 120 },
    { id: 3, nombre: 'Cabo San Lucas', tarifaSuburban: 110, tarifaSprinter: 140 },
    { id: 4, nombre: 'Pacific Zone', tarifaSuburban: 140, tarifaSprinter: 160 }
  ];

  const hotelesBase = [
    // ZONA 1: SAN JOSÉ DEL CABO
    { id: 101, nombre: 'Cabo Azul Resort', zona: 1 },
    { id: 102, nombre: 'Viceroy Los Cabos', zona: 1 },
    { id: 103, nombre: 'Hyatt Ziva Los Cabos', zona: 1 },
    { id: 104, nombre: 'Royal Solaris', zona: 1 },
    { id: 105, nombre: 'Barceló Gran Faro', zona: 1 },
    { id: 106, nombre: 'Krystal Grand Los Cabos', zona: 1 },
    { id: 107, nombre: 'Holiday Inn Resort', zona: 1 },
    { id: 108, nombre: 'Posada Real', zona: 1 },
    { id: 109, nombre: 'Casa Natalia', zona: 1 },
    { id: 110, nombre: 'El Encanto Inn & Suites', zona: 1 },
    { id: 111, nombre: 'Alegranza Luxury Resort', zona: 1 },
    { id: 112, nombre: 'Las Mañanitas', zona: 1 },
    { id: 113, nombre: 'Royal Decameron Los Cabos', zona: 1 },
    { id: 114, nombre: 'Park Royal Homestay Los Cabos', zona: 1 },
    { id: 115, nombre: 'GR Solaris Lighthouse Los Cabos', zona: 1 },
    { id: 116, nombre: 'Mykonos Los Cabos', zona: 1 },
    { id: 117, nombre: 'Hotel Casa Costa Azul', zona: 1 },
    { id: 118, nombre: 'Soleado Resort', zona: 1 },
    { id: 119, nombre: 'Las Olas Condominiums, Lets Do Mexico', zona: 1 },
    { id: 120, nombre: 'Cabo Surf Hotel & Spa', zona: 1 },
    { id: 121, nombre: 'OCEAN RESIDENCE', zona: 1 },
    { id: 122, nombre: 'Querencia', zona: 1 },
    { id: 123, nombre: 'Villa Vista del Mar', zona: 1 },
    { id: 124, nombre: 'Ocean Spirits', zona: 1 },
    { id: 125, nombre: 'Tropical oasis', zona: 1 },
    { id: 126, nombre: 'MariaMar Suites', zona: 1 },
    { id: 127, nombre: 'Hotel Aeropuerto Los Cabos', zona: 1 },
    { id: 128, nombre: 'City Express by Marriott San José del Cabo', zona: 1 },
    { id: 129, nombre: 'Drift San José del Cabo', zona: 1 },
    { id: 130, nombre: 'Tropicana Inn', zona: 1 },
    { id: 131, nombre: 'The Grand Mayan Los Cabos', zona: 1 },
    { id: 132, nombre: 'Vidanta Los Cabos', zona: 1 },
    { id: 133, nombre: 'The Grand Bliss Los Cabos', zona: 1 },
    { id: 134, nombre: 'Marisol Boutique Hotel', zona: 1 },
    { id: 135, nombre: 'Six Two Four Urban Beach Hotel', zona: 1 },
    { id: 136, nombre: 'Flamboyan Hotel & Residences', zona: 1 },
    { id: 137, nombre: 'El Zalate Condominiums (Costa Azul)', zona: 1 },
    { id: 138, nombre: 'Mira Vista Condominiums (Costa Azul)', zona: 1 },
    { id: 139, nombre: 'Tortuga Bay Condominiums', zona: 1 },
    { id: 140, nombre: 'La Jolla de Los Cabos', zona: 1 },
    { id: 141, nombre: 'Lomas de La Jolla', zona: 1 },
    { id: 142, nombre: 'Club Campestre San José (Residencial)', zona: 1 },
    { id: 143, nombre: 'Villas at Club Campestre', zona: 1 },
    { id: 144, nombre: 'Ladera San José', zona: 1 },
    { id: 145, nombre: 'Mistiq San José del Cabo', zona: 1 },
    { id: 146, nombre: 'Viva Condos San José del Cabo', zona: 1 },
    { id: 147, nombre: 'Residencial Lomas de San José', zona: 1 },
    { id: 148, nombre: 'Lomas de Costa Azul', zona: 1 },
    { id: 149, nombre: 'Gaviota Condominiums', zona: 1 },
    { id: 150, nombre: 'Las Palmas de San José', zona: 1 },
    { id: 151, nombre: 'Rancho Cerro Colorado', zona: 1 },
    { id: 152, nombre: 'Cabo Colorado', zona: 1 },
    { id: 153, nombre: 'Las Residencias (Club Campestre)', zona: 1 },
    { id: 154, nombre: 'Pueblo Pueblo (San José)', zona: 1 },
    { id: 155, nombre: 'Magisterial Residencial', zona: 1 },
    { id: 156, nombre: 'Fonatur Residencial (San José)', zona: 1 },
    { id: 157, nombre: 'Boutique Hotel Casa San José', zona: 1 },
    { id: 158, nombre: 'Casa Don Luis', zona: 1 },
    { id: 159, nombre: 'Condominios La Jolla', zona: 1 },
    { id: 160, nombre: 'Villas de Costa Azul', zona: 1 },
    { id: 161, nombre: 'Hotel Posada Señor Mañana', zona: 1 },
    { id: 162, nombre: 'Hotel Colli', zona: 1 },
    { id: 163, nombre: 'Gringo Hill Residencial', zona: 1 },
    { id: 164, nombre: 'Punta Vista Residencial', zona: 1 },
    { id: 165, nombre: 'Hacienda Los Cabos', zona: 1 },
    { id: 166, nombre: 'Las Entradas (Querencia)', zona: 1 },
    { id: 167, nombre: 'Las Cabañas (Querencia)', zona: 1 },
    { id: 168, nombre: 'Laderas (Querencia)', zona: 1 },
    { id: 169, nombre: 'Cañadas (Querencia)', zona: 1 },
    { id: 170, nombre: 'Club Villas (Querencia)', zona: 1 },
    { id: 171, nombre: 'La Costa Condominiums', zona: 1 },
    { id: 181, nombre: 'Punta Bella', zona: 1 },


    // ZONA 2: TOURIST CORRIDOR (Corredor Turístico)
    { id: 201, nombre: 'Las Ventanas al Paraíso (A Rosewood Resort)', zona: 2 },
    { id: 202, nombre: 'One&Only Palmilla', zona: 2 },
    { id: 203, nombre: 'Grand Velas Los Cabos', zona: 2 },
    { id: 205, nombre: 'Chileno Bay Resort & Residences', zona: 2 },
    { id: 206, nombre: 'Le Blanc Spa Resort', zona: 2 },
    { id: 207, nombre: 'Solaz Resort', zona: 2 },
    { id: 208, nombre: 'Villa La Valencia', zona: 2 },
    { id: 209, nombre: 'Cabo Real', zona: 2 },
    { id: 210, nombre: 'Hampton Inn & Suites by Hilton Los Cabos', zona: 2 },
    { id: 211, nombre: 'Marquis Los Cabos', zona: 2 },
    { id: 212, nombre: 'Sol de Cabo', zona: 2 },
    { id: 213, nombre: 'Casa Cielo', zona: 2 },
    { id: 214, nombre: 'Villa Del Mar', zona: 2 },
    { id: 215, nombre: 'Club Regina Los Cabos', zona: 2 },
    { id: 216, nombre: 'Dorado', zona: 2 },
    { id: 217, nombre: 'The Westin Los Cabos Resort Villas - Baja Point', zona: 2 },
    { id: 218, nombre: 'Las Gardenias Condominiums', zona: 2 },
    { id: 219, nombre: 'Ty Warner Mansion', zona: 2 },
    { id: 220, nombre: 'Grand Velas Boutique Los Cabos', zona: 2 },
    { id: 221, nombre: 'Chileno Bay Resort & Residences, Auberge Collection', zona: 2 },
    { id: 222, nombre: 'Hilton Los Cabos', zona: 2 },
    { id: 223, nombre: 'Dreams Los Cabos', zona: 2 },
    { id: 224, nombre: 'Garza Blanca Resort', zona: 2 },
    { id: 225, nombre: 'Casa del Mar / Zoëtry', zona: 2 },
    { id: 226, nombre: 'Mar del Cabo', zona: 2 },
    { id: 227, nombre: 'Las Residencias Golf & Beach Club', zona: 2 },
    { id: 228, nombre: 'Zadún (A Ritz-Carlton Reserve)', zona: 2 },
    { id: 229, nombre: 'JW Marriott Los Cabos Beach Resort & Spa', zona: 2 },
    { id: 230, nombre: 'Secrets Puerto Los Cabos Golf & Spa Resort', zona: 2 },
    { id: 231, nombre: 'Hotel El Ganzo', zona: 2 },
    { id: 232, nombre: 'Paradisus', zona: 2 },
    { id: 233, nombre: 'The Enclaves at a Ritz-Carlton Reserve', zona: 2 },
    { id: 234, nombre: 'Ritz-Carlton Reserve Residences', zona: 2 },
    { id: 235, nombre: 'Fundadores (Puerto Los Cabos)', zona: 2 },
    { id: 236, nombre: 'Los Cielos (Puerto Los Cabos)', zona: 2 },
    { id: 237, nombre: 'Altura (Puerto Los Cabos)', zona: 2 },
    { id: 238, nombre: 'La Noria (Puerto Los Cabos)', zona: 2 },
    { id: 239, nombre: 'El Encanto de la Laguna', zona: 2 },
    { id: 240, nombre: 'Condominios El Encanto', zona: 2 },
    { id: 241, nombre: 'Casa Fryzer (Villas del Mar)', zona: 2 },
    { id: 242, nombre: 'Casa de la Paz (Palmilla)', zona: 2 },
    { id: 243, nombre: 'Villa Pelicanos (Palmilla)', zona: 2 },
    { id: 244, nombre: 'Villa Oasis (Palmilla)', zona: 2 },
    { id: 245, nombre: 'Espíritu Estate (Palmilla)', zona: 2 },
    { id: 246, nombre: 'Ocean Estates at Villas del Mar', zona: 2 },
    { id: 247, nombre: 'Las Majadas (Palmilla)', zona: 2 },
    { id: 248, nombre: 'Remanso (Palmilla)', zona: 2 },
    { id: 249, nombre: 'Palmilla Canyons', zona: 2 },
    { id: 250, nombre: 'Palmilla Fairways', zona: 2 },
    { id: 251, nombre: 'One&Only Private Homes', zona: 2 },
    { id: 252, nombre: 'Rosewood Residences (Las Ventanas)', zona: 2 },
    { id: 253, nombre: 'Solaz The Residences', zona: 2 },
    { id: 254, nombre: 'Solaz Signature Suites', zona: 2 },
    { id: 255, nombre: 'Garza Blanca Residences', zona: 2 },
    { id: 256, nombre: 'El Dorado Casitas', zona: 2 },
    { id: 257, nombre: 'El Dorado Villas', zona: 2 },
    { id: 258, nombre: 'Cabo Real Estates', zona: 2 },
    { id: 259, nombre: 'Bugambilias (Cabo Real)', zona: 2 },
    { id: 260, nombre: 'Las Margaritas (Cabo Real)', zona: 2 },
    { id: 261, nombre: 'Cuenca (Cabo Real)', zona: 2 },
    { id: 262, nombre: 'Las Playas (Cabo Real)', zona: 2 },
    { id: 263, nombre: 'Condominios Casa del Mar', zona: 2 },
    { id: 264, nombre: 'Villa La Valencia Residences', zona: 2 },
    { id: 265, nombre: 'Chileno Point Villas', zona: 2 },
    { id: 266, nombre: 'Casa Moka (Puerto Los Cabos)', zona: 2 },
    { id: 267, nombre: 'Casa Tierra (Puerto Los Cabos)', zona: 2 },
    { id: 268, nombre: 'Villa Tranquila (Fundadores)', zona: 2 },
    { id: 269, nombre: 'Casa Buena Vida (Palmilla)', zona: 2 },
    { id: 270, nombre: 'Villa de los Pinos (Palmilla)', zona: 2 },
    { id: 271, nombre: 'Residencias Grand Velas', zona: 2 },
    { id: 272, nombre: 'Villas de Cabo Real', zona: 2 },
    { id: 273, nombre: 'Casa La Laguna (Puerto Los Cabos)', zona: 2 },
    { id: 274, nombre: 'Villa Cristina (Palmilla)', zona: 2 },
    { id: 275, nombre: 'Villa del Mar (El Dorado)', zona: 2 },
    { id: 276, nombre: 'Palmilla Dunes', zona: 2 },
    { id: 277, nombre: 'Villas de la Montaña (Palmilla)', zona: 2 },
    { id: 278, nombre: 'Casa Edwards (Palmilla)', zona: 2 },
    { id: 279, nombre: 'Casa Koll (Palmilla)', zona: 2 },
    { id: 280, nombre: 'Casa Oliver (Fundadores)', zona: 2 },
    { id: 281, nombre: 'Villa Captiva (Fundadores)', zona: 2 },
    { id: 282, nombre: 'Chileno Bay Haciendas', zona: 2 },
    { id: 283, nombre: 'Villa Cielito (Chileno)', zona: 2 },
    { id: 284, nombre: 'Casa Bahía (Chileno)', zona: 2 },
    { id: 285, nombre: 'La Loretana (Palmilla)', zona: 2 },
    { id: 286, nombre: 'Casa Roca (Palmilla)', zona: 2 },
    { id: 287, nombre: 'Casa Caleta (Palmilla)', zona: 2 },
    { id: 288, nombre: 'Villas del Mar Casitas', zona: 2 },
    { id: 289, nombre: 'Villas de Oro II (Palmilla)', zona: 2 },
    { id: 290, nombre: 'Casa Alegre (Palmilla)', zona: 2 },
    { id: 291, nombre: 'Villa Velero (Puerto Los Cabos)', zona: 2 },
    { id: 292, nombre: 'Casa Estrella (Puerto Los Cabos)', zona: 2 },
    { id: 293, nombre: 'Casa del Mar Residences', zona: 2 },
    { id: 294, nombre: 'El Dorado Beach Villas', zona: 2 },
    { id: 295, nombre: 'Chileno Bay Brisas', zona: 2 },
    { id: 296, nombre: 'Villa Bella (Palmilla)', zona: 2 },
    { id: 297, nombre: 'Casa de las Brisas (Cabo Real)', zona: 2 },
    { id: 298, nombre: 'Villa Celeste (Fundadores)', zona: 2 },
    { id: 299, nombre: 'Misiones de Cabo Real', zona: 2 },
    { id: 300, nombre: 'Condominios Las Gardenias II', zona: 2 },

    // ZONA 3: CABO SAN LUCAS
    { id: 301, nombre: 'Park Hyatt Los Cabos at Cabo del Sol', zona: 3 },
    { id: 302, nombre: 'Villas de Cabo del Sol', zona: 3 },
    { id: 303, nombre: 'Grand Fiesta Americana', zona: 3 },
    { id: 304, nombre: 'Breathless Cabo San Lucas Resort & Spa', zona: 3 },
    { id: 305, nombre: 'Corazón Cabo Resort & Spa', zona: 3 },
    { id: 306, nombre: 'ME Cabo', zona: 3 },
    { id: 307, nombre: 'Pueblo Bonito Blanco (Los Cabos Beach Resort)', zona: 3 },
    { id: 308, nombre: 'Marina Fiesta Resort & Spa', zona: 3 },
    { id: 309, nombre: 'Playa Grande Resort', zona: 3 },
    { id: 310, nombre: 'Bahía Hotel & Beach House', zona: 3 },
    { id: 311, nombre: 'Los Milagros Hotel', zona: 3 },
    { id: 312, nombre: 'The Bungalows Hotel', zona: 3 },
    { id: 313, nombre: 'Cabo Vista Hotel', zona: 3 },
    { id: 314, nombre: 'Siesta Suites', zona: 3 },
    { id: 204, nombre: 'Montage Los Cabos', zona: 3 },
    { id: 315, nombre: 'Riu Palace Cabo San Lucas', zona: 3 },
    { id: 316, nombre: 'Riu Palace Baja California', zona: 3 },
    { id: 317, nombre: 'Riu Santa Fe', zona: 3 },
    { id: 318, nombre: 'City Express Plus by Marriott Cabo San Lucas', zona: 3 },
    { id: 319, nombre: 'Holiday Inn Express Cabo San Lucas', zona: 3 },
    { id: 320, nombre: 'Fairfield Inn by Marriott Los Cabos', zona: 3 },
    { id: 321, nombre: 'Villa del Arco Beach Resort & Spa', zona: 3 },
    { id: 322, nombre: 'Villa del Palmar Beach Resort & Spa', zona: 3 },
    { id: 323, nombre: 'Villa La Estancia Beach Resort & Spa', zona: 3 },
    { id: 324, nombre: 'El Tezal', zona: 3 },
    { id: 325, nombre: 'Villas del Tezal', zona: 3 },
    { id: 326, nombre: 'Casas de Pedregal', zona: 3 },
    { id: 327, nombre: 'Villas de Pedregal', zona: 3 },
    { id: 328, nombre: 'The Cape, a Thompson Hotel', zona: 3 },
    { id: 329, nombre: 'Misiones del Cabo', zona: 3 },
    { id: 330, nombre: 'Cabo Bello', zona: 3 },
    { id: 331, nombre: 'Villas de Cabo Bello', zona: 3 },
    { id: 332, nombre: 'Sirena del Mar (Hyatt Vacation Club)', zona: 3 },
    { id: 333, nombre: 'Esperanza, Auberge Resorts Collection', zona: 3 },
    { id: 334, nombre: 'Hacienda Encantada Resort & Residences', zona: 3 },
    { id: 335, nombre: 'Vista Encantada Spa Resort & Residences', zona: 3 },
    { id: 336, nombre: 'Villas de Hacienda Encantada', zona: 3 },
    { id: 337, nombre: 'Hacienda del Mar Los Cabos Resort', zona: 3 },
    { id: 363, nombre: 'The Ridge at Playa Grande', zona: 3 },
    { id: 364, nombre: 'Los Cabos Golf Resort, Trademark Collection by Wyndham', zona: 3 },
    { id: 365, nombre: 'Cabo San Lucas Country Club Villas', zona: 3 },
    { id: 366, nombre: 'Tramonti Los Cabos', zona: 3 },
    { id: 367, nombre: 'Ventanas al Paraíso Residencial', zona: 3 },
    { id: 368, nombre: 'Vista Velas', zona: 3 },
    { id: 369, nombre: 'Duara Ocean View Villas & Condos', zona: 3 },
    { id: 370, nombre: 'Puerta del Sol (Cabo del Sol)', zona: 3 },
    { id: 371, nombre: 'Las Haciendas', zona: 3 },
    { id: 372, nombre: 'Santa Carmela', zona: 3 },
    { id: 373, nombre: 'Punta Ballena Residences', zona: 3 },
    { id: 374, nombre: 'Casa Bella Boutique Hotel', zona: 3 },
    { id: 375, nombre: 'Baja\'s Cactus Hostel', zona: 3 },
    { id: 376, nombre: 'Sofia Hostel Cabo', zona: 3 },
    { id: 377, nombre: 'Hotel Plaza Los Arcos', zona: 3 },
    { id: 378, nombre: 'Maria Elena Hotel', zona: 3 },
    { id: 379, nombre: 'Lumina at Cabo San Lucas', zona: 3 },
    { id: 380, nombre: 'Las Residencias Golf & Beach Club', zona: 3 },
    { id: 381, nombre: 'Condominios Portofino', zona: 3 },
    { id: 382, nombre: 'Terranova Residencial', zona: 3 },
    { id: 383, nombre: 'Punta Carmela', zona: 3 },
    { id: 384, nombre: 'Hermitage Residencial', zona: 3 },
    { id: 385, nombre: 'Villa La Paloma', zona: 3 },
    { id: 386, nombre: 'Cabo Paraíso Condominiums', zona: 3 },
    { id: 387, nombre: 'Pedregal Manor', zona: 3 },
    { id: 388, nombre: 'Villa Serena', zona: 3 },
    { id: 389, nombre: 'Las Palmas Suites', zona: 3 },
    { id: 390, nombre: 'Hotel del Ángel', zona: 3 },
    { id: 391, nombre: 'Condominios La Vista', zona: 3 },
    { id: 392, nombre: 'Vistabella Residencial', zona: 3 },
    { id: 393, nombre: 'Lush Hostel', zona: 3 },
    { id: 394, nombre: 'Maranatha Residencial', zona: 3 },
    { id: 395, nombre: 'Condominios El Pedregal', zona: 3 },
    { id: 396, nombre: 'Villas del Médano', zona: 3 },
    { id: 397, nombre: 'Residencial Cumbres del Tezal', zona: 3 },
    { id: 398, nombre: 'Lomas del Tezal', zona: 3 },
    { id: 399, nombre: 'Puerta de Hierro Cabo', zona: 3 },
    { id: 400, nombre: 'Privada Misiones', zona: 3 },
    { id: 401, nombre: 'Punta Arenas Condominios', zona: 3 },
    { id: 402, nombre: 'Altamira Residencial', zona: 3 },
    { id: 403, nombre: 'Cabo Fino', zona: 3 },
    { id: 404, nombre: 'Residencial Cabo San Lucas', zona: 3 },
    { id: 405, nombre: 'Brisas del Mar Condos', zona: 3 },
    { id: 406, nombre: 'Cabo del Mar (Village & Condos)', zona: 3 },
    { id: 407, nombre: 'Blue Net Hospitals Condos (Zona Médica)', zona: 3 },
    { id: 408, nombre: 'Plaza del Rey Residencial', zona: 3 },
    { id: 409, nombre: 'La Jolla Residential', zona: 3 },
    { id: 410, nombre: 'Condominios El Dorado', zona: 3 },
    { id: 411, nombre: 'Villa Bellissima (Pedregal)', zona: 3 },
    { id: 412, nombre: 'Villa Marcella (Pedregal)', zona: 3 },
    { id: 413, nombre: 'Villa Turquesa (Pedregal)', zona: 3 },
    { id: 414, nombre: 'Villa Peñasco (Pedregal)', zona: 3 },
    { id: 415, nombre: 'Villa La Roca (Pedregal)', zona: 3 },
    { id: 416, nombre: 'Villa Firenze (Pedregal)', zona: 3 },
    { id: 417, nombre: 'Villa de los Sueños (Pedregal)', zona: 3 },
    { id: 418, nombre: 'Villa Stella (Pedregal)', zona: 3 },
    { id: 419, nombre: 'Villa del Toro Rojo (Pedregal)', zona: 3 },
    { id: 420, nombre: 'Villa Cielito (Pedregal)', zona: 3 },
    { id: 421, nombre: 'Villa Colina (Pedregal)', zona: 3 },
    { id: 422, nombre: 'Villa Fiesta (Pedregal)', zona: 3 },
    { id: 423, nombre: 'Villa de la Luz (Pedregal)', zona: 3 },
    { id: 424, nombre: 'Villa Vista Ballena (Pedregal)', zona: 3 },
    { id: 425, nombre: 'Villa Las Palmas (Pedregal)', zona: 3 },
    { id: 426, nombre: 'Villa Finisterra (Pedregal)', zona: 3 },
    { id: 427, nombre: 'Villa Sol y Luna (Pedregal)', zona: 3 },
    { id: 428, nombre: 'Villa Descanso (Pedregal)', zona: 3 },
    { id: 429, nombre: 'Villa Maria (Pedregal)', zona: 3 },
    { id: 430, nombre: 'Villa Dos Mares (Pedregal)', zona: 3 },
    { id: 431, nombre: 'Villa Corona (Pedregal)', zona: 3 },
    { id: 432, nombre: 'Villa Castillo (Pedregal)', zona: 3 },
    { id: 433, nombre: 'Casa Gran Vista (Pedregal)', zona: 3 },
    { id: 434, nombre: 'Casa de los Ángeles (Pedregal)', zona: 3 },
    { id: 435, nombre: 'Villa Gran Escalera (Pedregal)', zona: 3 },
    { id: 436, nombre: 'Villa Dorada (Pedregal)', zona: 3 },
    { id: 437, nombre: 'Villa Pescadores (Pedregal)', zona: 3 },
    { id: 438, nombre: 'Villa Contempo (Pedregal)', zona: 3 },
    { id: 439, nombre: 'Waldorf Astoria Private Villas', zona: 3 },
    { id: 440, nombre: 'Las Casonas at Waldorf Astoria', zona: 3 },
    { id: 441, nombre: 'Villa Mariposa (Cabo del Sol)', zona: 3 },
    { id: 442, nombre: 'Villa de los Faros (Cabo del Sol)', zona: 3 },
    { id: 443, nombre: 'Villa de las Palmas (Cabo del Sol)', zona: 3 },
    { id: 444, nombre: 'Villa de la Vida (Cabo del Sol)', zona: 3 },
    { id: 445, nombre: 'Villa Buena Vida (Cabo del Sol)', zona: 3 },
    { id: 446, nombre: 'Villa Miguel (Cabo del Sol)', zona: 3 },
    { id: 447, nombre: 'Villa Los Agaves (Cabo del Sol)', zona: 3 },
    { id: 448, nombre: 'Riviera Villas (Cabo del Sol)', zona: 3 },
    { id: 449, nombre: 'Ocean Meadows (Cabo del Sol)', zona: 3 },
    { id: 450, nombre: 'Esperanza Private Residences', zona: 3 },
    { id: 451, nombre: 'Las Residencias at Punta Ballena', zona: 3 },
    { id: 452, nombre: 'Villa Eduardo (Punta Ballena)', zona: 3 },
    { id: 453, nombre: 'Villa Sirena (Punta Ballena)', zona: 3 },
    { id: 454, nombre: 'Villa del Corazón (Punta Ballena)', zona: 3 },
    { id: 455, nombre: 'Las Estrellas (Punta Ballena)', zona: 3 },
    { id: 456, nombre: 'Villa Las Penas (Punta Ballena)', zona: 3 },
    { id: 457, nombre: 'Hacienda Beach Club Villas (El Médano)', zona: 3 },
    { id: 458, nombre: 'Hacienda Penthouse Residences (El Médano)', zona: 3 },
    { id: 459, nombre: 'Montage Residences (Santa María)', zona: 3 },
    { id: 460, nombre: 'The Cape Residences', zona: 3 },
    { id: 461, nombre: 'Villa La Estancia Penthouses & Villas', zona: 3 },
    { id: 462, nombre: 'The Paraiso Residences', zona: 3 },
    { id: 463, nombre: 'Sunrock Hotel & Suites', zona: 3 },
    { id: 464, nombre: 'Terrasol Beach Resort', zona: 3 },
    { id: 465, nombre: 'El Ameyal Hotel & Wellness Center', zona: 3 },
    { id: 466, nombre: 'Cabo Cush Hotel', zona: 3 },
    { id: 467, nombre: 'Velamar Los Cabos', zona: 3 },
    { id: 468, nombre: 'Vista Vela II', zona: 3 },
    { id: 469, nombre: 'Vista Vela III', zona: 3 },
    { id: 470, nombre: 'Ventanas Fase 2', zona: 3 },
    { id: 471, nombre: 'Ventanas Fase 3', zona: 3 },
    { id: 472, nombre: 'Rancho Paraíso Estates', zona: 3 },
    { id: 473, nombre: 'Vistalagos Residencial (Country Club)', zona: 3 },
    { id: 474, nombre: 'Plaza Náutica Condominiums', zona: 3 },
    { id: 475, nombre: 'Copacabana Condominiums', zona: 3 },
    { id: 476, nombre: 'Condominios Marina Cabo Plaza', zona: 3 },
    { id: 477, nombre: 'Condominios Pedregalito', zona: 3 },
    { id: 478, nombre: 'The Residences at La Vista (Pedregal)', zona: 3 },
    { id: 479, nombre: 'Casa Tres Mares (Pedregal)', zona: 3 },
    { id: 480, nombre: 'Villa Renata (Pedregal)', zona: 3 },
    { id: 481, nombre: 'Villa La Zafiro (Pedregal)', zona: 3 },
    { id: 482, nombre: 'Villa Perla (Pedregal)', zona: 3 },
    { id: 483, nombre: 'Villa de las Olas (Pedregal)', zona: 3 },
    { id: 484, nombre: 'Villa Caleta (Pedregal)', zona: 3 },
    { id: 485, nombre: 'Casa Roca de los Amantes (Pedregal)', zona: 3 },
    { id: 486, nombre: 'Casa Mia (Pedregal)', zona: 3 },
    { id: 487, nombre: 'Casa Stella (Pedregal)', zona: 3 },
    { id: 488, nombre: 'Casa de la Familia (Pedregal)', zona: 3 },
    { id: 489, nombre: 'Villa Alegría (Pedregal)', zona: 3 },
    { id: 490, nombre: 'Villa Canto del Mar (Pedregal)', zona: 3 },
    { id: 491, nombre: 'Villa Las Flores (Pedregal)', zona: 3 },
    { id: 492, nombre: 'Villa Piedra Blanca (Pedregal)', zona: 3 },
    { id: 493, nombre: 'Villa del Mar (Cabo del Sol)', zona: 3 },
    { id: 494, nombre: 'Casa del Sol (Cabo Bello)', zona: 3 },
    { id: 495, nombre: 'Casa de la Playa (Cabo Bello)', zona: 3 },
    { id: 496, nombre: 'Santa Cruz Residencial', zona: 3 },
    { id: 497, nombre: 'Portales de Cabo', zona: 3 },
    { id: 498, nombre: 'Casa Tezal', zona: 3 },
    { id: 499, nombre: 'Condominios El Portillo', zona: 3 },
    { id: 500, nombre: 'Cabo Village', zona: 3 },
    { id: 501, nombre: 'Cresta del Mar Residencial', zona: 3 },
    { id: 502, nombre: 'La Cima Residencial', zona: 3 },
    { id: 503, nombre: 'El Cielito Residencial (Tezal)', zona: 3 },
    { id: 504, nombre: 'Mistiq Los Cabos', zona: 3 },
    { id: 505, nombre: 'Casa Linda (Pedregal)', zona: 3 },
    { id: 506, nombre: 'Villa Andaluza (Pedregal)', zona: 3 },
    { id: 507, nombre: 'Villa de la Mina (Pedregal)', zona: 3 },
    { id: 508, nombre: 'Villa Leonetti (Pedregal)', zona: 3 },
    { id: 509, nombre: 'Villa Pez Vela (Pedregal)', zona: 3 },
    { id: 510, nombre: 'Villa Paraíso (Pedregal)', zona: 3 },
    { id: 511, nombre: 'Villa Susana (Pedregal)', zona: 3 },
    { id: 512, nombre: 'Villa Marena (Pedregal)', zona: 3 },
    { id: 513, nombre: 'Casa Theodore (Pedregal)', zona: 3 },
    { id: 514, nombre: 'Casa Flamingo (Pedregal)', zona: 3 },
    { id: 515, nombre: 'Casa del Cielo (Pedregal)', zona: 3 },
    { id: 516, nombre: 'Villa de la Luna (Pedregal)', zona: 3 },
    { id: 517, nombre: 'Condominios La Marina', zona: 3 },
    { id: 518, nombre: 'Residencial San Lázaro', zona: 3 },
    { id: 519, nombre: 'Hotel Real Dorado', zona: 3 },
    { id: 520, nombre: 'Casa Pablito Bed & Breakfast', zona: 3 },
    { id: 521, nombre: 'Villas de la Montaña', zona: 3 },
    { id: 522, nombre: 'Condominios Buena Vista', zona: 3 },
    { id: 523, nombre: 'Cabo Lindo Condos', zona: 3 },
    { id: 524, nombre: 'Residencial Las Garzas', zona: 3 },
    { id: 525, nombre: 'El Pedregal Heights', zona: 3 },
    { id: 526, nombre: 'Baja Inn Suites', zona: 3 },
    { id: 527, nombre: 'Hotel Oasis de Cabo', zona: 3 },
    { id: 528, nombre: 'Villas del Faro', zona: 3 },
    { id: 529, nombre: 'Casa Sirena (Misiones del Cabo)', zona: 3 },
    { id: 530, nombre: 'Punta del Este Condominiums', zona: 3 },
    { id: 531, nombre: 'Residencial La Joya (Cabo San Lucas)', zona: 3 },
    { id: 532, nombre: 'Condominios Los Patios', zona: 3 },
    { id: 533, nombre: 'Villas de Las Misiones', zona: 3 },
    { id: 534, nombre: 'Cabo Bello Estates', zona: 3 },
    { id: 535, nombre: 'Condominios Cabo San Lucas', zona: 3 },
    { id: 536, nombre: 'Villas del Arco Residencial', zona: 3 },
    { id: 537, nombre: 'La Ribera Condominios', zona: 3 },
    { id: 538, nombre: 'Suites Las Palmas', zona: 3 },
    { id: 539, nombre: 'Oasis de la Campana (Tezal)', zona: 3 },
    { id: 540, nombre: 'Residencial El Bordo', zona: 3 },

    // ZONA 4: PACIFIC ZONE (Lado del Pacífico)
    { id: 401, nombre: 'Waldorf Astoria Los Cabos Pedregal', zona: 4 },
    { id: 402, nombre: 'Nobu Hotel Los Cabos', zona: 4 },
    { id: 403, nombre: 'Hard Rock Hotel Los Cabos', zona: 4 },
    { id: 404, nombre: 'Pueblo Bonito Sunset Beach', zona: 4 },
    { id: 405, nombre: 'Pueblo Bonito Pacífica (y The Towers)', zona: 4 },
    { id: 406, nombre: 'Grand Solmar Pacific Dunes', zona: 4 },
    { id: 407, nombre: 'Diamante Cabo San Lucas', zona: 4 },
    { id: 408, nombre: 'Montecristo Estates Luxury Villas', zona: 4 },
    { id: 409, nombre: 'Quivira Novaispania Residences', zona: 4 },
    { id: 410, nombre: 'The St. Regis Los Cabos at Quivira', zona: 4 },
    { id: 411, nombre: 'Copala at Quivira', zona: 4 },
    { id: 412, nombre: 'Coronado at Quivira', zona: 4 },
    { id: 413, nombre: 'Mavila at Quivira', zona: 4 },
    { id: 414, nombre: 'Alvar at Quivira', zona: 4 },
    { id: 415, nombre: 'Old Lighthouse Club (Quivira)', zona: 4 },
    { id: 416, nombre: 'The St. Regis Residences Los Cabos', zona: 4 },
    { id: 417, nombre: 'Nobu Residences Los Cabos', zona: 4 },
    { id: 418, nombre: 'Hard Rock Residences Los Cabos', zona: 4 },
    { id: 419, nombre: 'Diamante Golf Villas', zona: 4 },
    { id: 420, nombre: 'Diamante Sunset Hill Estates', zona: 4 },
    { id: 421, nombre: 'Diamante Beach Estates', zona: 4 },
    { id: 422, nombre: 'Diamante Ocean Club Residences', zona: 4 },
    { id: 423, nombre: 'Diamante Casitas', zona: 4 },
    { id: 424, nombre: 'Diamante The Woods', zona: 4 },
    { id: 425, nombre: 'Las Estancias at Diamante', zona: 4 },
    { id: 426, nombre: 'Norman Estates at Rancho San Lucas', zona: 4 },
    { id: 427, nombre: 'The Villas at Rancho San Lucas', zona: 4 },
    { id: 428, nombre: 'The Residences at Grand Solmar Pacific Dunes', zona: 4 },
    { id: 429, nombre: 'Rolling Hills Estates', zona: 4 },
    { id: 430, nombre: 'Montecristo Penthouses', zona: 4 },
    { id: 431, nombre: 'Novaispania Villas y Custom Estates', zona: 4 },
    { id: 432, nombre: 'Mavila Towers', zona: 4 },
    { id: 433, nombre: 'Copala Condominiums', zona: 4 },
    { id: 434, nombre: 'Copala Casas', zona: 4 },
    { id: 435, nombre: 'Diamante Lagoon Penthouses', zona: 4 },
    { id: 436, nombre: 'Rancho San Lucas Private Estates', zona: 4 },
    { id: 437, nombre: 'Diamante Crystal Lagoon Suites', zona: 4 }
  ];

  const hotelesFiltrados = hotelesBase.filter(h => busquedaHotel.toLowerCase().split(' ').every(w => h.nombre.toLowerCase().includes(w)));
  const zonasVisibles = zonasBase.filter(z => hotelesFiltrados.some(h => h.zona === z.id));

  return (
    <div className="w-full font-sans selection:bg-slate-900 selection:text-white">

      {/* ===== PASO 1: WIDGET HERO CON VIDEO DE FONDO ===== */}
      {paso === 1 && (
        <section className="relative pt-32 pb-16 px-4 flex flex-col justify-start animate-fade-in bg-white">
          <div className="absolute top-0 left-0 w-full h-[60vh] bg-slate-950 overflow-hidden z-0 rounded-b-3xl md:rounded-b-[4rem]">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
              <source src="/private-luxury-transfers-cabo-san-lucas.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/50 to-transparent z-10"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center mb-8 relative z-20 mt-4 md:mt-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tighter leading-normal pb-2 drop-shadow-lg" style={{ letterSpacing: '-0.03em' }}>
              {lang === 'es' ? 'TRANSPORTE PRIVADO Y SHUTTLES EN LOS CABOS.' : <><span className="text-white">PREMIUM CABO AIRPORT SHUTTLE</span> & PRIVATE TOURS.</>}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              {lang === 'es' ? 'Reserva tu traslado seguro, sin filas y puerta a puerta en el Aeropuerto SJD.' : 'Reliable, safe, and private transportation from SJD Airport to your resort. Skip the taxi lines.'}
            </p>
          </div>

          {/* ===== CONTENEDOR HERO + PANEL LATERAL DE SERVICIOS ===== */}
          <div className="relative z-30 w-full max-w-[85rem] mx-auto flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 px-4">

            {/* El recuadro blanco original (HeroBooking) */}
            <div className="w-full max-w-5xl mx-auto">
              <HeroBooking t={t} lang={lang} />
            </div>
          </div>
        </section>
      )}

      {/* ===== PARTNERS LOGOS (SÓLO VISIBLES EN EL PASO 1) ===== */}
      {paso === 1 && (
        <TrustedPartners lang={lang} />
      )}

      {/* ===== GOOGLE REVIEWS Y FOTOS (SÓLO VISIBLES EN EL PASO 1) ===== */}
      {paso === 1 && (
        <>
          <GoogleReviews lang={lang} />
          <div className="max-w-7xl mx-auto px-4 w-full">
            <CustomerPhotosWidget lang={lang} />
          </div>
        </>
      )}

      {/* ===== PASO 2: FLUJO DE TRANSPORTE ===== */}
      {paso === 2 && esServicioTransporte && (
        <section className="pt-24 pb-16 bg-slate-50 min-h-screen animate-fade-in">
          <TransportBookingForm lang={lang} />
        </section>
      )}

      {/* ===== PASO 2: FLUJO DE TOURS Y ESPECIALES ===== */}
      {paso === 2 && servicioSeleccionado === 'tours' && (
        <section className="pt-24 pb-16 bg-slate-50 min-h-screen animate-fade-in">
          {reserva.tourId ? (
            <TourBookingForm lang={lang} />
          ) : (
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* COLUMNA IZQUIERDA: TARJETA BLANCA DE CONTENIDO */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] p-6 md:p-10 shadow-sm">

                {/* HEADER UNIVERSAL (Título de Brújula y Botón Atrás) */}
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Compass className="text-blue-900" size={28} />
                    {lang === 'es' ? 'Selecciona una Experiencia' : 'Select an Experience'}
                  </h2>
                  {!subCategoria ? (
                    <button onClick={() => { setServicioSeleccionado(''); setPaso(1); window.scrollTo(0, 0); }} className="text-blue-600 font-bold text-sm hover:text-blue-800 transition flex items-center gap-1 w-max">
                      &larr; {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
                    </button>
                  ) : (
                    <button onClick={() => setSubCategoria('')} className="text-blue-600 font-bold text-sm hover:text-blue-800 transition flex items-center gap-1 w-max">
                      &larr; {lang === 'es' ? 'Volver a Categorías' : 'Back to Categories'}
                    </button>
                  )}
                </div>

                {/* RENDERIZADO DEL CONTENIDO DENTRO DE LA TARJETA BLANCA */}
                {!subCategoria && <ExperienceSelector lang={lang} />}
                {subCategoria === 'especiales' && <SpecialServices lang={lang} />}
                {subCategoria === 'tours' && (
                  <div className="-mt-8"> {/* Empuja los tours un poco hacia arriba para que se vean bien en la caja */}
                    <FeaturedTours t={t} lang={lang} />
                  </div>
                )}
              </div>

              {/* COLUMNA DERECHA: SIDEBAR NEGRO (Resumen de Cotización) */}
              <div className="lg:col-span-4 sticky top-28">
                <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white shadow-xl">
                  <h3 className="text-xl font-black mb-6 border-b border-slate-700 pb-4">
                    {lang === 'es' ? 'Resumen de Cotización' : 'Quote Summary'}
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">
                      <span>{lang === 'es' ? 'TOURS / ESPECIALES' : 'TOURS / SPECIALS'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">{lang === 'es' ? 'Pasajeros:' : 'Passengers:'}</span>
                      <span className="font-bold">{reserva?.pasajeros || 1}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6 mb-8">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                      {lang === 'es' ? 'Subtotal del Servicio (USD)' : 'Service Subtotal (USD)'}
                    </p>
                    <p className="text-4xl font-black">$0.00</p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center font-medium gap-1">
                      <Check size={14} className="text-green-500" /> {lang === 'es' ? 'Impuestos incluidos' : 'Taxes included'}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        if (subCategoria) setSubCategoria('');
                        else { setServicioSeleccionado(''); setPaso(1); window.scrollTo(0, 0); }
                      }}
                      className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition flex-shrink-0"
                    >
                      &lt; {lang === 'es' ? 'Atrás' : 'Back'}
                    </button>
                    <button className="flex-1 py-4 bg-slate-800 text-slate-500 cursor-not-allowed rounded-xl font-bold transition flex items-center justify-center">
                      {lang === 'es' ? 'Añadir a mi combo +' : 'Add to combo +'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </section>
      )}
      {/* ==============================================================
          SECCIONES DE CONTENIDO Y SEO (SÓLO VISIBLES EN EL PASO 1)
          ============================================================== */}
      {paso === 1 && (
        <div className="pt-12 pb-24 bg-slate-50 relative z-20 space-y-20">

          <FeaturedTours t={t} lang={lang} />

          {/* 🌟 SECCIÓN SEO 1: TEXTO + IMAGEN DERECHA 🌟 */}
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                <div className="flex-1 space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-tight" style={{ letterSpacing: '-0.03em' }}>
                    {lang === 'es' ? 'Transporte al Aeropuerto de Cabo San Lucas.' : 'Cabo Airport Shuttle & Private Transfers.'}
                  </h2>
                  <div className="text-slate-500 text-lg leading-relaxed space-y-6 font-medium">
                    <p>
                      {lang === 'es' ? 'El transporte desde el Aeropuerto de Cabo puede ser una experiencia abrumadora para quienes nos visitan por primera vez. Con tantas opciones disponibles, elegir la correcta es crucial para empezar bien tu viaje.' : 'Cabo Airport transportation can be a daunting experience for first-time visitors. With so many options available, choosing the right one is crucial.'}
                    </p>
                    <p>
                      {lang === 'es' ? 'Ya sea que te dirijas a ' : 'Whether you’re heading to '}
                      <Link href={`/${lang}/destinations/sjd-to-nobu-hotel`} className="text-slate-900 font-bold hover:text-slate-600 transition-colors underline decoration-slate-300 underline-offset-4">Nobu Hotel</Link>
                      {lang === 'es' ? ', ' : ', '}
                      <Link href={`/${lang}/destinations/sjd-to-grand-solmar`} className="text-slate-900 font-bold hover:text-slate-600 transition-colors underline decoration-slate-300 underline-offset-4">Grand Solmar</Link>
                      {lang === 'es' ? ', o ' : ', or '}
                      <Link href={`/${lang}/destinations/sjd-to-hard-rock`} className="text-slate-900 font-bold hover:text-slate-600 transition-colors underline decoration-slate-300 underline-offset-4">Hard Rock Hotel</Link>
                      {lang === 'es' ? ', planificar con anticipación es la clave.' : ', planning ahead is key.'}
                    </p>
                    <p>
                      {lang === 'es' ? <>Cuando viajes, confía en <strong className="text-slate-900">Ballard Tours</strong> para un traslado profesional puerta a puerta. Reservar en línea o llamar al <strong className="text-slate-900">+52 624 139 3497</strong> te garantiza un viaje sin estrés y total tranquilidad desde que aterrizas.</> : <>When you travel, consider <strong className="text-slate-900">Ballard Tours</strong> and the convenience of a professional door-to-door service. Pre-booking online or calling toll-free at <strong className="text-slate-900">+52 624 139 3497</strong> ensures a smooth journey and absolute peace of mind.</>}
                    </p>
                  </div>
                </div>
                <div className="w-full lg:w-5/12 h-72 md:h-[450px] rounded-[2rem] overflow-hidden shadow-lg shrink-0 relative group bg-slate-100">
                  <Image src="/private-transportation-sjd-airport-los-cabos-luxury.webp" alt="Private Cabo Airport Shuttle Service" fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
              </div>
            </div>
          </div>

          <TrustAndReviews lang={lang} />

          {/* 🌟 SECCIÓN SEO 2: OPCIONES DE TRANSPORTE (2 COLUMNAS) 🌟 */}
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tighter" style={{ letterSpacing: '-0.03em' }}>
                {lang === 'es' ? 'Tipos de Transporte en Cabo.' : 'Types of Cabo Transportation.'}
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                {lang === 'es' ? 'Ya sea que busques una opción económica para tu grupo o un servicio VIP altamente personalizado, tenemos la opción perfecta para ti.' : 'Whether you’re seeking a budget-friendly option for your group or a highly personalized VIP service, we have the perfect fit.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tarjeta 1: Vans / Shuttles */}
              <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col group">
                <div className="h-72 overflow-hidden relative bg-slate-100">
                  <img src="/private-airport-transfer-sjd-pueblo-bonito-sunset-cabo.webp" alt="Private Cabo Airport Shuttle Service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Cabo Shuttle Services</h3>
                  <p className="text-slate-500 mb-8 flex-grow font-medium leading-relaxed">
                    {lang === 'es' ? 'Un servicio rentable ideal para grupos que desean viajar juntos sin gastar de más. Al compartir los costos en una Van privada, ahorras dinero mientras disfrutas de máxima comodidad.' : 'A cost-effective option for groups who want to travel together. Private shuttles offer great value for budget-conscious families and friends.'}
                  </p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-sm text-slate-700 font-bold"><CheckCircle className="text-slate-900" size={18} /> {lang === 'es' ? 'Ahorra entre 40% y 50% vs taxis.' : 'Cheap Cabo Shuttle Saves 40/50%.'}</li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 font-bold"><CheckCircle className="text-slate-900" size={18} /> {lang === 'es' ? 'Más espacio y lugar para equipaje.' : 'More Space, Seats, and Luggage Space.'}</li>
                    <li className="flex items-center gap-3 text-sm text-slate-700 font-bold"><CheckCircle className="text-slate-900" size={18} /> {lang === 'es' ? 'Ideal para Viajes Grupales o Bodas.' : 'Ideal for Group Travel or Weddings.'}</li>
                  </ul>
                  <button onClick={() => { setServicioSeleccionado('aeropuerto_hotel'); window.scrollTo(0, 0); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-xl transition-colors tracking-wide">
                    {lang === 'es' ? 'Reservar Shuttle / Van' : 'Book Sprinter Van'}
                  </button>
                </div>
              </div>

              {/* Tarjeta 2: Luxury SUV */}
              <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col group">
                <div className="h-72 overflow-hidden relative bg-slate-100">
                  <img src="/private-transportation-nobu-hotel-los-cabos.webp" alt="Private Cabo Airport Shuttle Service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-8 md:p-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Private VIP Transportation</h3>
                  <p className="text-slate-500 mb-8 flex-grow font-medium leading-relaxed">
                    {lang === 'es' ? 'Nuestro servicio insignia ofrece una experiencia personalizada y lujosa, con rutas directas y rápidas desde la terminal hasta el lobby de tu resort en vehículos premium.' : 'Our flagship Private airport transfers offer a personalized and luxurious transportation experience with direct routes from the terminal to your hotel lobby.'}
                  </p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-start gap-3 text-sm text-slate-700 font-bold"><CheckCircle className="text-slate-900 shrink-0 mt-0.5" size={18} /> <span>{lang === 'es' ? 'Cero Esperas: Salta las filas del aeropuerto.' : 'No Waiting: Skip the lines and go direct.'}</span></li>
                    <li className="flex items-start gap-3 text-sm text-slate-700 font-bold"><CheckCircle className="text-slate-900 shrink-0 mt-0.5" size={18} /> <span>{lang === 'es' ? 'Parada de Compras: Disponibles con reserva previa.' : 'Grocery Stop: Available upon prior request.'}</span></li>
                    <li className="flex items-start gap-3 text-sm text-slate-700 font-bold"><CheckCircle className="text-slate-900 shrink-0 mt-0.5" size={18} /> <span>{lang === 'es' ? 'Lujo Exclusivo: Chofer bilingüe y bebidas.' : 'Exclusive Luxury: Bilingual chauffeur & drinks.'}</span></li>
                  </ul>
                  <button onClick={() => { setServicioSeleccionado('aeropuerto_hotel'); window.scrollTo(0, 0); }} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors tracking-wide">
                    {lang === 'es' ? 'Reservar Transporte VIP' : 'Book Luxury SUV'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 SECCIÓN SEO 3: GUÍA DE RESERVAS Y COMPARACIÓN 🌟 */}
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
            <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tighter border-b border-slate-100 pb-6">
                {lang === 'es' ? 'Consejos para Reservar tu Transporte' : 'Tips for Booking the Best Transportation'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{lang === 'es' ? '¿Por qué reservar online vs. en el sitio?' : 'Online vs. On-Site Booking'}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    {lang === 'es'
                      ? 'Reservar online con anticipación ahorra tiempo, asegura tarifas más bajas y garantiza disponibilidad en temporadas altas. Al comparar opciones aseguras elegir proveedores recomendados que destacan por su puntualidad.'
                      : 'Booking online in advance saves time, secures lower prices, and guarantees availability during peak times. Compare services and check reviews to ensure reliability and punctuality.'}
                  </p>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">{lang === 'es' ? 'Elegir el Transporte Adecuado' : 'Choosing Your Transportation'}</h3>
                  <ul className="space-y-4 text-slate-500 font-medium">
                    <li><strong className="text-slate-900">{lang === 'es' ? 'Comparación de Costos:' : 'Cost Comparison:'}</strong> {lang === 'es' ? 'Revisa tarifas fijas para evitar cargos sorpresa.' : 'Find fixed prices to avoid unexpected charges.'}</li>
                    <li><strong className="text-slate-900">{lang === 'es' ? 'Eficiencia de Tiempo:' : 'Time Efficiency:'}</strong> {lang === 'es' ? 'Los traslados privados ofrecen rutas directas, reduciendo tiempos.' : 'Private transfers provide direct routes, reducing travel time.'}</li>
                    <li><strong className="text-slate-900">{lang === 'es' ? 'Necesidades del Grupo:' : 'Group Needs:'}</strong> {lang === 'es' ? 'Identifica si priorizas privacidad o espacio para equipaje.' : 'Identify your group’s requirements for space and privacy.'}</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
                  <div className="w-full h-48 bg-slate-200 rounded-xl mb-8 overflow-hidden">
                    <img src="/Cabo-San-Lucas-Snorkel-Tour-3.webp" alt="Cabo Tours and Activities" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-900 mb-3 tracking-tight">{lang === 'es' ? 'Aprovecha al máximo tu visita' : 'Make the most of your visit'}</h4>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    {lang === 'es' ? 'Además de tu transporte al hotel, no olvides planificar tus actividades. Tener todo listo te asegura unas vacaciones perfectas.' : 'Besides your airport transfer, do not forget to plan your activities. Check out our guided tours to complete your adventure.'}
                  </p>
                  <div className="flex flex-col gap-4">
                    <Link href={`/${lang}/tours`} className="text-slate-900 font-bold hover:text-slate-600 transition-colors flex items-center gap-1 underline decoration-slate-300 underline-offset-4"><ChevronRight size={18} /> {lang === 'es' ? 'Ver Catálogo de Tours' : 'View All Tours'}</Link>
                    <Link href={`/${lang}/blog`} className="text-slate-900 font-bold hover:text-slate-600 transition-colors flex items-center gap-1 underline decoration-slate-300 underline-offset-4"><ChevronRight size={18} /> {lang === 'es' ? 'Leer el Blog Oficial' : 'Read our Travel Blog'}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 SECCIÓN SEO 4: DIRECTORIO DE LINKS A HOTELES Y TOURS 🌟 */}
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
            <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center tracking-tighter" style={{ letterSpacing: '-0.03em' }}>
                {lang === 'es' ? 'Rutas Populares y Destinos' : 'Popular Routes & Destinations'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2"><MapPin size={20} className="text-slate-400" /> {lang === 'es' ? 'Hoteles (A-M)' : 'Hotels (A-M)'}</h3>
                  <ul className="space-y-4 text-sm font-medium">
                    <li><Link href={`/${lang}/destinations/sjd-to-breathless`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Breathless Cabo San Lucas</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-grand-solmar`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Grand Solmar</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-hacienda-del-mar`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Hacienda del Mar</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-hard-rock`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Hard Rock Hotel</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-jw-marriott`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to JW Marriott</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-montage`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Montage Los Cabos</Link></li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2"><MapPin size={20} className="text-slate-400" /> {lang === 'es' ? 'Hoteles (N-Z)' : 'Hotels (N-Z)'}</h3>
                  <ul className="space-y-4 text-sm font-medium">
                    <li><Link href={`/${lang}/destinations/sjd-to-nobu-hotel`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Nobu Hotel</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-secrets-puerto-los-cabos`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Secrets Puerto Los Cabos</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-hyatt-ziva`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Hyatt Ziva</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-la-pacifica`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to La Pacifica</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-playa-grande`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Playa Grande Resort</Link></li>
                    <li><Link href={`/${lang}/destinations/sjd-to-riu-palace`} className="text-slate-500 hover:text-slate-900 transition-colors">SJD to Riu Palace</Link></li>
                  </ul>
                </div>

                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-white">
                  <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2"><Compass size={20} className="text-slate-400" /> {lang === 'es' ? 'Tours y Excursiones' : 'Best Cabo Tours'}</h3>
                  <ul className="space-y-4 text-sm font-medium">
                    <li><Link href={`/${lang}/tours/atv-off-road-adventure-cabo`} className="text-slate-400 hover:text-white transition-colors">ATV Off-Road Adventure</Link></li>
                    <li><Link href={`/${lang}/tours/cabo-san-lucas-snorkel-tour`} className="text-slate-400 hover:text-white transition-colors">Cabo Snorkel Tour</Link></li>
                    <li><Link href={`/${lang}/tours/camel-safari-tour-cabo-san-lucas`} className="text-slate-400 hover:text-white transition-colors">Camel Safari Tour</Link></li>
                    <li><Link href={`/${lang}/tours/clear-boat-tour-cabo-san-lucas-arch`} className="text-slate-400 hover:text-white transition-colors">Clear Boat to the Arch</Link></li>
                    <li><Link href={`/${lang}/tours/espiritu-santo-island-tour-from-cabo`} className="text-slate-400 hover:text-white transition-colors">Espiritu Santo Island Tour</Link></li>
                    <li><Link href={`/${lang}/tours/swim-with-whale-sharks-la-paz-cabo`} className="text-slate-400 hover:text-white transition-colors">Swim with Whale Sharks</Link></li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          {/* 🌟 NUEVA SECCIÓN SEO 5: SJD TAXI Y TRASLADOS 🌟 */}
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
            <div className="bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-12 lg:p-16 text-center md:text-left text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter" style={{ letterSpacing: '-0.03em' }}>
                  {lang === 'es' ? '¿Taxi en el Aeropuerto SJD? Conoce tus Opciones.' : 'SJD Airport Taxi? Know Your Options.'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-slate-300 font-medium leading-relaxed text-lg">
                  <p>
                    {lang === 'es'
                      ? 'Al llegar a Los Cabos, muchos viajeros buscan un "taxi de aeropuerto en SJD" (SJD airport taxi) para llegar rápidamente a su hotel. Aunque los taxis locales están disponibles afuera de la terminal, optar por un traslado privado pre-reservado ofrece ventajas incomparables en costo y seguridad.'
                      : 'Upon arriving in Los Cabos, many travelers look for an "SJD airport taxi" to quickly reach their resort. While local taxis are available right outside the terminal, choosing a pre-booked airport transfer offers unmatched advantages in cost and safety.'}
                  </p>
                  <p>
                    {lang === 'es'
                      ? 'A diferencia de un taxi regular, nuestros servicios garantizan una tarifa fija sin taxímetros sorpresa, vehículos de lujo totalmente climatizados y un chofer esperándote directamente en tu llegada. Evita las filas bajo el sol y asegura tu transporte con Ballard Tours.'
                      : 'Unlike a regular taxi, our private transfer service guarantees a flat rate with no hidden meter fees, fully air-conditioned luxury vehicles, and a bilingual chauffeur waiting for you. Skip the long taxi lines and secure your transportation with Ballard Tours.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DIRECTORIO DE ZONAS (Con Buscador) */}
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
            <div id="zonas" className="bg-white border border-slate-200/60 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <MapIcon className="w-12 h-12 text-slate-900 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">{t?.step1?.directory_title || (lang === 'es' ? 'Directorio de Zonas y Tarifas' : 'Zones & Rates Directory')}</h2>
                <div className="relative max-w-md mx-auto mt-6">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder={t?.step1?.search_placeholder || (lang === 'es' ? 'Buscar mi hotel...' : 'Search your hotel...')}
                    value={busquedaHotel}
                    onChange={(e) => setBusquedaHotel(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 font-medium text-slate-900 focus:border-slate-900 focus:bg-white focus:ring-0 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {zonasVisibles.length > 0 ? (
                  zonasVisibles.map(zona => (
                    <div key={zona.id} className="bg-slate-50 rounded-[1.5rem] p-8 border border-slate-100 h-full flex flex-col hover:border-slate-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 mb-6 gap-6">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 tracking-tight"><MapPin className="text-slate-400" size={24} /> {zona.nombre}</h3>
                        <div className="flex gap-3 text-sm text-right shrink-0">
                          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Suburban (1-6)</p><p className="font-black text-slate-900">${zona.tarifaSuburban} <span className="font-bold text-[10px] text-slate-500">USD</span></p></div>
                          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sprinter (1-10)</p><p className="font-black text-slate-900">${zona.tarifaSprinter} <span className="font-bold text-[10px] text-slate-500">USD</span></p></div>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t?.step1?.hotels_in_zone || (lang === 'es' ? 'Hoteles en esta zona:' : 'Hotels in this zone:')}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-600 font-medium">
                          {hotelesFiltrados.filter(h => h.zona === zona.id).map((hotel, idx) => (
                            <li key={`${hotel.id}-${idx}`} className="flex items-start gap-2.5">
                              <Check size={16} className="text-slate-900 mt-0.5 shrink-0" />
                              <span className={busquedaHotel && hotel.nombre.toLowerCase().includes(busquedaHotel.toLowerCase()) ? 'font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded' : ''}>{hotel.nombre}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium text-lg">{t?.step1?.not_found || 'No encontramos ese hotel. Intenta buscar de nuevo.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🔥 4 BENEFICIOS (ENTRE ZONAS Y FAQ) 🔥 */}
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
            <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-900"><Clock size={28} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{lang === 'es' ? 'Soporte en Línea 24/7' : '24 / 7 Online Support'}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{lang === 'es' ? 'Respondemos lo más rápido posible. Contáctanos por WhatsApp al +52 624 139 3497 en cualquier momento.' : 'We respond as quickly as possible. Reach out via WhatsApp at +52 624 139 3497 anytime.'}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-900"><Calendar size={28} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{lang === 'es' ? 'Asistencia de Itinerario' : 'Itinerary Assistance'}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{lang === 'es' ? 'Si necesitas ajustar un horario o hacer una cancelación, nuestro equipo local te asistirá de inmediato.' : 'If you need to move a schedule or make a cancellation, our team will assist you.'}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-900"><Baby size={28} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{lang === 'es' ? 'Sillas de Seguridad' : 'Child Safety Seats'}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{lang === 'es' ? 'Proveemos sillas para bebés y asientos elevados sin costo adicional al reservar.' : 'We provide infant car seats and booster seats completely free of charge upon request.'}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-900"><Banknote size={28} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{lang === 'es' ? 'Tarifas Transparentes' : 'Affordable Rates'}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{lang === 'es' ? 'Ofrecemos tarifas fijas y claras. Reserva con confianza sin preocuparte de cargos ocultos.' : 'We offer transparent flat-rate pricing without any unexpected fees or hidden charges.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 PREGUNTAS FRECUENTES (FAQ) 🌟 */}
          <div className="max-w-7xl mx-auto px-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-12 lg:p-16">
              <FAQSection lang={lang} />
            </div>
          </div>

          {/* LOGOS DE PAGO Y TEXTO BILINGÜE AL FINAL */}
          <div className="w-full flex flex-col items-center pt-8 px-4 max-w-4xl mx-auto text-center animate-fade-in">
            <img src="/pago-tarjetas.png" alt="Métodos de Pago" className="h-10 md:h-12 object-contain mb-8" />
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">
              {lang === 'es' ? 'Reserva Fácil y Opciones Flexibles.' : 'Easy Booking & Flexible Payment.'}
            </h3>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              {lang === 'es'
                ? 'Sitio web de reservación fácil en tres clics. Ingresa tu destino, elige tu transporte y da clic en enviar. Al final del formulario encontrarás opciones para pagar de forma segura con tarjeta, optar por pago a la llegada, o usar PayPal.'
                : 'Three-click easy reservation website. Enter your destination, choose your shuttle type, and click submit. You can select from paying securely with a credit card, opting for payment on arrival, or using PayPal.'}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
              <a href="https://www.caboprivateairporttransfers.com/en" className="hover:text-slate-600 transition-colors">LOS CABOS AIRPORT</a> - 
              <a href="https://www.caboprivateairporttransfers.com/en" className="hover:text-slate-600 transition-colors">LOS CABOS AIRPORT TRANSFERS</a> - 
              <a href="https://www.caboprivateairporttransfers.com/en" className="hover:text-slate-600 transition-colors">LOS CABOS AIRPORT TRANSPORTATION</a> - 
              <a href="https://www.caboprivateairporttransfers.com/en" className="hover:text-slate-600 transition-colors">CABO TRANSPORTATION</a> - 
              <a href="https://www.caboprivateairporttransfers.com/en" className="hover:text-slate-600 transition-colors">CABO AIRPORT TRANSFERS</a> - 
              <a href="https://www.caboprivateairporttransfers.com/en" className="hover:text-slate-600 transition-colors">CABO AIRPORT TRANSPORTATION</a> - 
              <a href="https://www.caboprivateairporttransfers.com/en" className="hover:text-slate-600 transition-colors">LOS CABOS TRANSFERS</a> - 
              <a href="https://www.caboprivateairporttransfers.com/en" className="hover:text-slate-600 transition-colors">LOS CABOS TRANSPORTATION</a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}