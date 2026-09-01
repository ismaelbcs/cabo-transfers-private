// src/app/[lang]/destinations/sjd-to-hyatt-ziva/page.js
'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, PlaneLanding, PlaneTakeoff, RefreshCcw, Compass, CheckCircle, Clock, Map, ShieldCheck, 
  Car, Users, Banknote, Calendar, Baby, ChevronRight, Star, Shield, Award, Fuel, Sparkles
} from 'lucide-react';

import { useBooking } from '../../../../context/BookingContext';
import TrustBadges from '../../../../components/TrustBadges';
import FAQAccordion from '../../../../components/FAQAccordion';
import TrustedPartners from '../../../../components/TrustedPartners';
import UrgencyBanner from '../../../../components/UrgencyBanner';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';
import GoogleReviewsWidget from '../../../../components/GoogleReviewsWidget';
import CustomerPhotosWidget from '../../../../components/CustomerPhotosWidget';

const hotelData = {
  slug: 'sjd-to-hyatt-ziva',
  nombre: 'Hyatt Ziva Los Cabos',
  zona: 1,
  zonaText: 'San José del Cabo',
  tiempo: '15-20 min',
  dist: '15 km (9.3 miles)',
  image: 'hyatt-ziva-los-cabos-airport-sjd.webp',
  desc: 'an all-inclusive luxury family and couples beachfront oasis in San José del Cabo',
  address: 'Paseo Malecón San José Lote 5, Zona Hotelera, San José del Cabo, BCS 23405'
};

const zonasPrecios = [
  { id: 1, tarifaSuburban: 80, tarifaSprinter: 110 },
  { id: 2, tarifaSuburban: 90, tarifaSprinter: 125 },
  { id: 3, tarifaSuburban: 100, tarifaSprinter: 135 },
  { id: 4, tarifaSuburban: 120, tarifaSprinter: 160 },
  { id: 5, tarifaSuburban: 155, tarifaSprinter: 195 },
];

export const hotelesBase = [
  { id: 103, nombre: 'Hyatt Ziva Los Cabos', zona: 1 },
  { id: 111, nombre: 'Alegranza Luxury Resort', zona: 1 },
  { id: 105, nombre: 'Barceló Gran Faro', zona: 1 },
  { id: 101, nombre: 'Cabo Azul Resort', zona: 1 },
  { id: 114, nombre: 'Park Royal Homestay Los Cabos', zona: 1 },
  { id: 108, nombre: 'Posada Real', zona: 1 },
  { id: 104, nombre: 'Royal Solaris', zona: 1 },
  { id: 102, nombre: 'Viceroy Los Cabos', zona: 1 },
  { id: 113, nombre: 'Royal Decameron Los Cabos', zona: 1 },
  { id: 106, nombre: 'Krystal Grand Los Cabos', zona: 1 },
  { id: 223, nombre: 'Dreams Los Cabos', zona: 2 },
  { id: 201, nombre: 'Las Ventanas al Paraíso', zona: 2 },
  { id: 202, nombre: 'One&Only Palmilla', zona: 2 },
  { id: 203, nombre: 'Grand Velas Los Cabos', zona: 2 },
  { id: 301, nombre: 'Hard Rock Hotel Los Cabos', zona: 4 },
  { id: 304, nombre: 'Breathless Cabo San Lucas', zona: 3 },
  { id: 306, nombre: 'Riu Palace Cabo San Lucas', zona: 3 },
];

export default function HyattZivaDestinationPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const router = useRouter();

  const { reserva, setReserva, setServicioSeleccionado, setPaso, setBusquedaHotelPrincipal } = useBooking();

  const hotel = hotelData;
  const tarifaVehiculo = zonasPrecios.find(z => z.id === 1) || { tarifaSuburban: 80, tarifaSprinter: 110 };

  const [searchTerm, setSearchTerm] = useState(reserva.hotelId || hotel.nombre);
  const [activeHotelName, setActiveHotelName] = useState(reserva.hotelId || hotel.nombre);
  const [activeZona, setActiveZona] = useState(reserva.zonaId || hotel.zona);
  const [showDropdown, setShowDropdown] = useState(false);
  const [vehiculo, setVehiculo] = useState(reserva.vehiculo || 'suburban');
  const [fechaLlegada, setFechaLlegada] = useState(reserva.fechaLlegada || '');
  const [pasajeros, setPasajeros] = useState(reserva.pasajeros || 1);

  const filteredHotels = hotelesBase.filter(h => 
    searchTerm.toLowerCase().split(' ').every(w => h.nombre.toLowerCase().includes(w))
  );

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
    
    router.push(`/${lang}`);
    window.scrollTo(0, 0);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://www.caboprivateairporttransfers.com/#hyatt-ziva-transfer-service",
        "name": isEs ? "Transporte Privado a Hyatt Ziva Los Cabos" : "Hyatt Ziva Los Cabos Transportation & Airport Shuttle",
        "serviceType": "Airport Shuttle & Luxury Private Transportation",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Ballard Tours Los Cabos Private Transfers",
          "telephone": "+52 624 139 3497",
          "priceRange": "$$$",
          "image": "https://www.caboprivateairporttransfers.com/hyatt-ziva-los-cabos-airport-sjd.webp",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "San José del Cabo",
            "addressRegion": "BCS",
            "addressCountry": "MX"
          }
        },
        "areaServed": [
          { "@type": "City", "name": "San José del Cabo" },
          { "@type": "Airport", "name": "Los Cabos International Airport (SJD)" }
        ],
        "offers": {
          "@type": "Offer",
          "price": "80.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "validFrom": "2026-01-01"
        },
        "description": isEs 
          ? "Servicio de transporte privado y shuttle desde el Aeropuerto SJD a Hyatt Ziva Los Cabos. Chofer bilingüe, monitoreo de vuelo, bebidas frías y sillas de bebé gratis." 
          : "Premier private airport transportation, SUV transfers, and shuttle service from SJD Airport to Hyatt Ziva Los Cabos. Flat rates, flight tracking, bilingual drivers, complimentary beer and water."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How far is Hyatt Ziva Los Cabos from SJD Airport?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hyatt Ziva Los Cabos is located approximately 15 kilometers (9.3 miles) from Los Cabos International Airport (SJD). The drive takes around 15 to 20 minutes via the fast Highway 1 toll/main corridor."
            }
          },
          {
            "@type": "Question",
            "name": "How much is private transportation from SJD Airport to Hyatt Ziva Los Cabos?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our private Luxury SUV transfer to Hyatt Ziva Los Cabos starts at $80 USD one-way for up to 6 passengers, including personalized airport greeting, cold bottled water, beers, and flight tracking."
            }
          },
          {
            "@type": "Question",
            "name": "Can I get an Uber from SJD Airport to Hyatt Ziva?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Uber pickups are restricted by airport federal zone regulations at SJD Airport. Booking a pre-arranged private shuttle with Ballard Tours guarantees seamless curbside pickup without long walks or surge pricing."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="animate-fade-in pb-10 bg-white font-sans selection:bg-slate-900 selection:text-white">
      <title>
        {isEs 
          ? "Transporte a Hyatt Ziva Los Cabos | Shuttle Privado Aeropuerto SJD" 
          : "Hyatt Ziva Los Cabos Transportation | Private SJD Airport Shuttle & Taxi"}
      </title>
      <meta 
        name="description" 
        content={isEs
          ? "Reserva tu transporte privado del Aeropuerto SJD a Hyatt Ziva Los Cabos. Tarifas fijas desde $80 USD, choferes bilingües, bebidas de cortesía y monitoreo de vuelo."
          : "Best Hyatt Ziva Los Cabos transportation & private airport shuttle from SJD Airport. Flat rates from $80 USD, Luxury SUVs, bilingual chauffeurs, cold beer & water."} 
      />
      <meta 
        name="keywords" 
        content="hyatt ziva transportation, hyatt ziva los cabos airport shuttle, sjd airport to hyatt ziva, hyatt ziva cabo transfer, private transportation to hyatt ziva san jose del cabo, shuttle from san jose del cabo airport to hyatt ziva, taxi to hyatt ziva cabo, cheap transfer hyatt ziva cabo, hyatt ziva airport car service" 
      />
      <link rel="canonical" href={`https://www.caboprivateairporttransfers.com/${lang}/destinations/sjd-to-hyatt-ziva`} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ========================================= */}
      {/* HERO DE RUTA ESPECÍFICA (Diseño Premium) */}
      {/* ========================================= */}
      <div className="relative bg-slate-950 text-white py-28 md:py-36 px-4 overflow-hidden shadow-xl rounded-b-[2.5rem] mb-12 border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src={`/${hotel.image}`} 
            alt="Hyatt Ziva Los Cabos Transportation & Airport Shuttle" 
            className="w-full h-full object-cover opacity-35" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 z-10"></div>

        <div className="relative max-w-4xl mx-auto text-center z-20">
          <div className="flex justify-center items-center gap-4 mb-6 text-slate-400">
            <PlaneLanding size={28} className="text-blue-400" />
            <span className="border-t-2 border-dashed border-slate-500 w-16"></span>
            <MapPin size={28} className="text-emerald-400" />
          </div>

          <span className="inline-block bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs md:text-sm font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {isEs ? "Traslado Oficial y Directo" : "Official Direct SJD Airport Transfer"}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight text-white drop-shadow-md">
            {isEs ? "Transporte a Hyatt Ziva Los Cabos" : "Hyatt Ziva Los Cabos Transportation"}
          </h1>

          <HeroReviewsBadge lang={lang} />

          <p className="text-lg md:text-xl text-slate-200 font-medium mt-4 max-w-2xl mx-auto">
            {isEs 
              ? "Servicio de transporte privado VIP y shuttle de lujo desde el Aeropuerto SJD hasta la puerta de Hyatt Ziva." 
              : "Private Luxury SUV & Sprinter Shuttle Service from SJD Airport directly to Hyatt Ziva Los Cabos."}
          </p>
        </div>
      </div>

      <TrustedPartners lang={lang} className="mb-12 rounded-2xl mx-4 max-w-7xl lg:mx-auto" />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ========================================= */}
        {/* COLUMNA PRINCIPAL DE CONTENIDO            */}
        {/* ========================================= */}
        <div className="lg:col-span-2 space-y-12 text-slate-700 text-lg leading-relaxed order-2 lg:order-1">

          {/* Intro SEO */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">
              {isEs 
                ? "Traslados Privados y Shuttle al Aeropuerto para Hyatt Ziva Los Cabos" 
                : "Premier Private Airport Transportation to Hyatt Ziva Los Cabos"}
            </h2>
            <p className="mb-4 text-slate-600 text-base md:text-lg">
              {isEs
                ? `¿Estás planeando tus vacaciones familiares o una escapada todo incluido en Hyatt Ziva Los Cabos? Asegurar tu transporte privado desde el Aeropuerto Internacional de Los Cabos (SJD) es el paso más importante para comenzar tu viaje sin estrés. Ubicado en el corazón de la Zona Hotelera de San José del Cabo, Hyatt Ziva ofrece una experiencia vacacional inolvidable frente al Mar de Cortés. Con Ballard Tours, te garantizamos un trayecto directo, seguro y con la máxima puntualidad.`
                : `Are you searching for the most reliable **Hyatt Ziva Los Cabos transportation**? Located along the sun-drenched shores of San José del Cabo's Hotel Zone, Hyatt Ziva is one of Cabo's premier all-inclusive luxury family resorts. Arriving at Los Cabos International Airport (SJD) can be overwhelming with crowded shared buses, taxi hustlers, and long lines. With Ballard Tours, your private chauffeur is ready the moment you land, taking you directly from SJD Airport to Hyatt Ziva in just 15 to 20 minutes.`}
            </p>
            <p className="text-slate-600 text-base md:text-lg">
              {isEs
                ? `Olvídate de hacer filas o de compartir vehículo con desconocidos. Tu camioneta privada te estará esperando con aire acondicionado a la temperatura perfecta, bebidas frías de cortesía y espacio de sobra para tu equipaje.`
                : `Our private Hyatt Ziva airport shuttle guarantees 100% private door-to-door service in late-model luxury SUVs (Chevrolet Suburban / Ford Expedition) and spacious Mercedes Sprinters for groups, complete with ice-cold Mexican beers, bottled water, and optional grocery stops.`}
            </p>
          </section>

          {/* GOOGLE REVIEWS WIDGET */}
          <GoogleReviewsWidget lang={lang} />
          <CustomerPhotosWidget lang={lang} />

          {/* KEY TAKEAWAYS */}
          <section className="bg-slate-50 border border-slate-200 p-8 rounded-2xl my-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-900"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
              {isEs ? "Puntos Clave del Servicio a Hyatt Ziva" : "Key Highlights of Our Hyatt Ziva Transportation"}
            </h3>
            <ul className="space-y-4 text-slate-700 text-sm md:text-base font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-blue-600" />
                <span>
                  {isEs 
                    ? `Tarifa fija y transparente desde $80 USD en SUV Privada de Lujo para hasta 6 pasajeros (sin tarifas dinámicas ni costos ocultos).` 
                    : `Flat transparent rate starting at $80 USD for a Private Luxury SUV (up to 6 passengers) with zero hidden fees or surge pricing.`}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-blue-600" />
                <span>
                  {isEs 
                    ? `Tiempo de traslado exprés de tan solo 15 a 20 minutos directo desde el Aeropuerto SJD hasta el lobby de Hyatt Ziva.` 
                    : `Direct express travel time of just 15 to 20 minutes from SJD Airport to the Hyatt Ziva main lobby.`}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-blue-600" />
                <span>
                  {isEs 
                    ? `Monitoreo de vuelos en vivo 24/7: Si tu vuelo se adelanta o se retrasa, tu conductor siempre te esperará a tiempo sin cargos extra.` 
                    : `24/7 real-time flight tracking: If your flight is delayed or lands early, your private driver is automatically updated with zero penalty fees.`}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-blue-600" />
                <span>
                  {isEs 
                    ? `Sillas de bebé y asientos elevadores gratis, agua purificada y cervezas frías incluidas en cada trayecto.` 
                    : `Complimentary infant car seats and booster seats upon request, plus ice-cold beers and bottled water included.`}
                </span>
              </li>
            </ul>
          </section>

          {/* TABLA COMPARATIVA DE TRANSPORTES (SEO RICH CONTENT) */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">
              {isEs 
                ? "Comparativa: Transporte Privado vs Taxis y Shuttles Compartidos" 
                : "Hyatt Ziva Transportation Comparison: Private Transfer vs. Shared Shuttle & Taxi"}
            </h2>
            <div className="overflow-x-auto my-6 border border-slate-200 rounded-2xl shadow-sm">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-900 text-white font-bold uppercase text-xs">
                  <tr>
                    <th className="p-4">{isEs ? "Tipo de Transporte" : "Transfer Option"}</th>
                    <th className="p-4">{isEs ? "Tiempo al Hotel" : "Travel Time"}</th>
                    <th className="p-4">{isEs ? "Privacidad" : "Privacy"}</th>
                    <th className="p-4">{isEs ? "Bebidas & Sillas Bebé" : "Drinks & Car Seats"}</th>
                    <th className="p-4">{isEs ? "Recomendado" : "Best For"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-blue-50/70 font-semibold text-slate-900">
                    <td className="p-4 flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-600" />
                      <strong>Ballard Tours (Private SUV)</strong>
                    </td>
                    <td className="p-4 text-emerald-700 font-bold">15 - 20 min</td>
                    <td className="p-4">{isEs ? "100% Exclusivo" : "100% Private"}</td>
                    <td className="p-4 text-emerald-700">{isEs ? "Gratis Incluidas" : "Complimentary"}</td>
                    <td className="p-4 font-bold text-blue-900">{isEs ? "Familias, Parejas y Grupos" : "Families, Couples & VIPs"}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-4 font-medium">Shared Shuttle (Van Compartida)</td>
                    <td className="p-4 text-amber-700">45 - 75 min (Varias paradas)</td>
                    <td className="p-4 text-slate-500">{isEs ? "Compartido (10-15 pax)" : "Shared with strangers"}</td>
                    <td className="p-4 text-slate-400">{isEs ? "No disponible" : "Not included"}</td>
                    <td className="p-4 text-slate-600">{isEs ? "Viajeros solos con poco equipaje" : "Solo travelers on tight budget"}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-4 font-medium">Airport Taxi (Sitio Aeropuerto)</td>
                    <td className="p-4">25 - 35 min</td>
                    <td className="p-4">{isEs ? "Privado" : "Private"}</td>
                    <td className="p-4 text-slate-400">{isEs ? "No disponible" : "Extra cost"}</td>
                    <td className="p-4 text-slate-600">{isEs ? "Llegadas sin reserva previa" : "Unplanned arrivals"}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-4 font-medium">Uber / Rideshare</td>
                    <td className="p-4 text-red-600">{isEs ? "Restringido en zona federal" : "Restricted at SJD pickup"}</td>
                    <td className="p-4">{isEs ? "Privado" : "Private"}</td>
                    <td className="p-4 text-slate-400">{isEs ? "No disponible" : "None"}</td>
                    <td className="p-4 text-slate-600">{isEs ? "Traslados dentro de la ciudad" : "In-town short rides only"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* BENEFICIOS Y FLOTA */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">
              {isEs ? "Opciones de Vehículos para tu Traslado a Hyatt Ziva" : "Our Fleet for Hyatt Ziva Airport Transportation"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-blue-900 text-white rounded-xl"><Car size={22} /></div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Luxury SUV (Suburban / Expedition)</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{isEs ? "Hasta 6 Pasajeros" : "Up to 6 Passengers"}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {isEs 
                    ? "Ideal para familias y parejas que buscan el máximo confort, asientos de piel, aire acondicionado premium y gran capacidad de maletas." 
                    : "Ideal for families and couples seeking ultimate comfort, leather seating, dual-zone AC, and generous luggage capacity."}
                </p>
                <div className="text-sm font-bold text-slate-900">
                  {isEs ? "Tarifa desde:" : "Starting at:"} <span className="text-xl font-black text-blue-900">$80 USD</span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-blue-900 text-white rounded-xl"><Users size={22} /></div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Mercedes-Benz Sprinter Van</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{isEs ? "Hasta 16 Pasajeros" : "Up to 16 Passengers"}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {isEs 
                    ? "La mejor opción para grupos de boda, eventos corporativos o familias numerosas viajando juntas hacia Hyatt Ziva." 
                    : "The premier solution for wedding parties, corporate retreats, or extended families traveling together to Hyatt Ziva."}
                </p>
                <div className="text-sm font-bold text-slate-900">
                  {isEs ? "Tarifa desde:" : "Starting at:"} <span className="text-xl font-black text-blue-900">$110 USD</span>
                </div>
              </div>
            </div>

            <div className="my-10 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
              <img 
                src="/private-transportation-sjd-airport-los-cabos-luxury.webp" 
                alt="Luxury Transportation to Hyatt Ziva Los Cabos" 
                className="w-full h-auto object-cover max-h-[420px]" 
              />
            </div>
          </section>

          {/* RUTA Y DISTANCIA MAPA */}
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm my-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
              {isEs ? "Distancia y Ruta del Aeropuerto SJD a Hyatt Ziva" : "Route & Logistics from SJD Airport to Hyatt Ziva"}
            </h3>
            <p className="text-sm md:text-base text-slate-600 mb-6">
              {isEs
                ? "El trayecto desde el Aeropuerto Internacional de Los Cabos (SJD) hacia Hyatt Ziva Los Cabos se realiza por la autopista directa a San José del Cabo, entrando por el Bulevar Mauricio Castro hacia el Paseo Malecón en la Zona Hotelera."
                : "The drive from Los Cabos International Airport (SJD) to Hyatt Ziva Los Cabos takes you south along Mexico Highway 1 directly into the San José del Cabo Hotel Zone on Paseo Malecón. It is one of the closest and fastest luxury resort transfers in all of Baja California Sur."}
            </p>

            <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-200">
              <iframe
                title="Mapa SJD a Hyatt Ziva"
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'contrast(1.05)' }} 
                loading="lazy" 
                allowFullScreen 
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?saddr=${encodeURIComponent('Aeropuerto Internacional de Los Cabos (SJD)')}&daddr=${encodeURIComponent('Hyatt Ziva Los Cabos, Paseo Malecon San Jose, Zona Hotelera, San Jose del Cabo')}&output=embed`}
              ></iframe>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <Clock className="text-blue-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Tiempo' : 'Driving Time'}</p>
                <p className="text-slate-800 font-bold text-sm">15 - 20 min</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <MapPin className="text-blue-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Distancia' : 'Distance'}</p>
                <p className="text-slate-800 font-bold text-sm">15 km (9.3 mi)</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <Map className="text-blue-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Zona' : 'Location'}</p>
                <p className="text-slate-800 font-bold text-sm">San José del Cabo</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <Fuel className="text-blue-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Tipo de Vía' : 'Highway'}</p>
                <p className="text-slate-800 font-bold text-sm">Toll Free / Express</p>
              </div>
            </div>
          </section>

          {/* GUÍA DETALLADA DE CONSEJOS SEO */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 border-b border-slate-100 pb-4 tracking-tight">
              {isEs 
                ? "Guía para tu Llegada: ¿Cómo Encontrar a tu Chofer en el Aeropuerto SJD?" 
                : "Arrival Guide: How to Meet Your Hyatt Ziva Driver at SJD Airport"}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {isEs
                ? `Al aterrizar en la Terminal 1 o Terminal 2 del Aeropuerto de Los Cabos (SJD), pasarás por migración y la zona de reclamo de equipaje. Luego cruzarás el pasillo de tiempos compartidos (también conocido como 'Shark Tank'). Te recomendamos ignorar a los vendedores de tiempos compartidos y caminar directamente hacia la salida del edificio hacia la zona de transporte pre-reservado.`
                : `When you land at SJD Airport (Terminal 1 for domestic, Terminal 2 for international flights), you will clear Mexican immigration and collect your luggage. After customs, you will walk through the timeshare sales hallway (commonly known as the 'Shark Tank'). We strongly advise you not to stop and proceed directly outside to the pre-arranged transportation umbrella area.`}
            </p>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
              <h4 className="font-bold text-blue-950 mb-2 flex items-center gap-2">
                <Award size={20} className="text-blue-600" />
                {isEs ? "Recepción VIP con Cartel Personalizado" : "VIP Meet & Greet with Personalized Sign"}
              </h4>
              <p className="text-sm text-blue-900 leading-relaxed">
                {isEs
                  ? "Tu chofer de Ballard Tours te estará esperando sosteniendo un letrero claro con tu nombre y el logotipo de la compañía. Te ayudará con todo el equipaje, te ofrecerá bebidas frías y te conducirá a tu SUV privada con aire acondicionado."
                  : "Your Ballard Tours chauffeur will be waiting outside holding a personalized banner with your name. They will handle all your luggage, offer you cold beverages, and escort you straight to your air-conditioned private vehicle."}
              </p>
            </div>
          </section>

          {/* SECCIÓN SEO ADICIONAL: PARADAS DE SUPERMERCADO Y ACTIVIDADES */}
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {isEs 
                ? "¿Deseas hacer una parada de compras camino a Hyatt Ziva?" 
                : "Add a Grocery Stop on Your Way to Hyatt Ziva Los Cabos"}
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {isEs
                ? "Aunque Hyatt Ziva es un resort todo incluido excepcional, muchos de nuestros huéspedes solicitan una breve parada de 30 o 60 minutos en supermercados locales como La Comer, Walmart o Costco en San José del Cabo para comprar botanas gourmet, protector solar biodegradable, vino selecto o artículos para bebés. Puedes solicitar tu parada de compras al reservar o por WhatsApp."
                : "Even though Hyatt Ziva is an all-inclusive resort with superb dining and drinks, many travelers love stopping for 30 to 60 minutes at local stores like **La Comer, Walmart, or Costco in San José del Cabo** to pick up specialty snacks, baby items, organic sunscreen, or fine wines. You can easily add a grocery stop during checkout or via WhatsApp."}
            </p>
          </section>

          {/* FAQ SECTION DINÁMICO */}
          <FAQAccordion type="hotel" locationName={hotel.nombre} lang={lang} />

        </div>

        {/* ========================================= */}
        {/* COLUMNA DERECHA: WIDGET DE RESERVA INTERACTIVO */}
        {/* ========================================= */}
        <div className="lg:col-span-1 relative order-1 lg:order-2">
          <UrgencyBanner lang={lang} locationName={hotel.nombre} />
          
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 sticky top-28">
            
            {/* Cabecera del Widget */}
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={24} />
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {isEs ? 'Cotizar Traslado' : 'Book Your Transfer'}
                </h3>
              </div>
              <div className="flex flex-col items-end">
                 <div className="flex items-center gap-1">
                   <ShieldCheck size={14} className="text-yellow-600" />
                   <span className="text-[10px] font-bold text-slate-600 uppercase">
                     {isEs ? 'Garantía de Precio' : 'Best Rate'}
                   </span>
                 </div>
              </div>
            </div>

            {/* SELECCIONA TU HOTEL */}
            <div className="mb-6 relative">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                {isEs ? 'Hotel o Destino' : 'Destination Resort'}
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
                placeholder={isEs ? 'Escribe tu hotel...' : 'Search your hotel...'} 
                className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 transition-colors" 
              />
              
              {/* Desplegable Autocompletado */}
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
                        className="p-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-0 font-medium"
                      >
                        {h.nombre}
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-sm text-slate-400">
                      {isEs ? 'No se encontraron hoteles' : 'No hotels found'}
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* PRECIO EN VIVO */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isEs ? 'Tarifa Sencilla Desde (1-6 pax)' : 'One-Way Private Rate (1-6 pax)'}
              </p>
              <p className="text-3xl font-black text-blue-900 tracking-tight">
                ${tarifaVehiculo.tarifaSuburban} USD
              </p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                ✓ {isEs ? 'Impuestos y peajes incluidos' : 'All taxes, tolls & drinks included'}
              </p>
            </div>

            {/* FORMULARIO RÁPIDO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  {isEs ? 'Fecha de Llegada' : 'Arrival Date'}
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
                  {isEs ? 'Pasajeros' : 'Passengers'}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none"><Users size={16} /></div>
                  <input 
                    type="number" 
                    min="1" 
                    max="16"
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
                {isEs ? 'Selecciona tipo de servicio' : 'Select trip type to proceed'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleContinue('aeropuerto_hotel')} 
                className="border border-slate-200 rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:border-blue-900 hover:bg-slate-50 transition-colors bg-white group cursor-pointer"
              >
                <PlaneLanding size={24} className="text-slate-400 mb-2 group-hover:text-blue-900 transition-colors" />
                <span className="text-xs font-bold text-slate-800 text-center">
                  {isEs ? 'Aeropuerto → Hotel' : 'Airport → Hotel'}
                </span>
              </button>
              
              <button 
                onClick={() => handleContinue('hotel_aeropuerto')} 
                className="border border-slate-200 rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:border-blue-900 hover:bg-slate-50 transition-colors bg-white group cursor-pointer"
              >
                <PlaneTakeoff size={24} className="text-slate-400 mb-2 group-hover:text-blue-900 transition-colors" />
                <span className="text-xs font-bold text-slate-800 text-center">
                  {isEs ? 'Hotel → Aeropuerto' : 'Hotel → Airport'}
                </span>
              </button>

              <button 
                onClick={() => handleContinue('redondo')} 
                className="col-span-2 border-2 border-blue-900 bg-blue-900 text-white rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:bg-blue-950 transition-all group shadow-md shadow-blue-900/20 cursor-pointer"
              >
                <RefreshCcw size={24} className="text-blue-200 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-xs font-black uppercase tracking-wider text-center">
                  {isEs ? 'Viaje Redondo (Recomendado)' : 'Round Trip (Save & Secure)'}
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
                <h3 className="text-lg font-bold text-slate-900 mb-1">{isEs ? 'Soporte 24/7' : '24 / 7 Support'}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{isEs ? 'Nos esforzamos por responder rápido. Contáctanos por WhatsApp al +52 624 139 3497 en cualquier momento.' : 'We strive to respond as quickly as possible. Reach out via WhatsApp at +52 624 139 3497 anytime.'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200"><Calendar size={24} className="text-slate-900" /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{isEs ? 'Asistencia de Itinerario' : 'Itinerary Assistance'}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{isEs ? 'Si necesitas ajustar un horario o hacer una cancelación, nuestro equipo local te asistirá de inmediato.' : 'Need to move a schedule or make a cancellation? Our local team will assist you immediately.'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200"><Baby size={24} className="text-slate-900" /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{isEs ? 'Sillas de Bebé Gratis' : 'Free Child Seats'}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{isEs ? 'La seguridad de tu familia es nuestra prioridad. Proveemos sillas para bebés y asientos elevados sin costo adicional.' : 'Family safety is our priority. We provide infant car seats and booster seats free of charge.'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200"><Banknote size={24} className="text-slate-900" /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{isEs ? 'Tarifas Transparentes' : 'Transparent Flat Rates'}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{isEs ? 'Ofrecemos tarifas fijas y claras. Reserva con confianza sin preocuparte de cargos ocultos de última hora.' : 'We offer transparent flat-rate pricing. Book with confidence without any unexpected fees or hidden charges.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="w-full flex flex-col items-center pt-8 pb-8 px-4 text-center">
          <img src="/pago-tarjetas.png" alt="Payment Methods" className="h-10 md:h-12 object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all mb-6" />
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">
            {isEs ? 'Reserva en Línea Fácil y Opciones de Pago Flexibles' : 'Easy Online Booking and Flexible Payment Options'}
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl mx-auto">
            {isEs
              ? 'Sitio web de reservación fácil en tres clics en Ballard Tours. Simplemente ingrese su destino o lugar de recogida, elija su tipo de transporte y haga clic en enviar. Al final del formulario, encontrará la sección de pago, donde puede seleccionar entre las siguientes opciones: pagar de forma segura con tarjeta de crédito, optar por el pago a la llegada a su chofer, o usar PayPal para mayor comodidad.'
              : 'Three-click easy reservation website at Ballard Tours. Simply enter your destination or pickup location, choose your shuttle type, and click submit. At the end of the form, you will find the payment section, where you can select from the following options: pay securely with a credit card, opt for payment on arrival to your driver, or use PayPal for convenience.'}
          </p>
        </div>
      </div>
    </div>
  );
}
