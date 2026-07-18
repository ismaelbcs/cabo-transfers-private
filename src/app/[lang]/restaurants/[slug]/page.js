'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Clock, ShieldCheck, Car, Banknote, Calendar, ChevronRight, Info, Plus, CheckCircle, Users, Map, PlaneLanding 
} from 'lucide-react';
import { useCart } from '../../../../context/CartContext';
import { useBooking } from '../../../../context/BookingContext';
import TrustBadges from '../../../../components/TrustBadges';
import FAQAccordion from '../../../../components/FAQAccordion';
import TrustedPartners from '../../../../components/TrustedPartners';
import UrgencyBanner from '../../../../components/UrgencyBanner';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';
import GoogleReviewsWidget from '../../../../components/GoogleReviewsWidget';
import { restaurantSEOData } from '../../../../data/restaurantSEOData';
import { catalogoHoteles } from '../../../../data/seoData';

export default function RestaurantSeoPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang || 'en';
  const slug = resolvedParams.slug;
  const router = useRouter();

  const { agregarAlCombo } = useCart();
  const { setServicioSeleccionado, setPaso, reserva } = useBooking();

  const seoData = restaurantSEOData.find(item => item.slug === slug);

  const [cenaOrigen, setCenaOrigen] = useState('');
  const [busquedaCenaOrigen, setBusquedaCenaOrigen] = useState('');
  const [mostrarDropdownCena, setMostrarDropdownCena] = useState(false);
  const [cenaRestauranteNombre, setCenaRestauranteNombre] = useState(seoData ? seoData.nombre : '');
  const [cenaDestino, setCenaDestino] = useState(seoData ? (seoData.zona === 1 ? 'sjc' : seoData.zona === 2 ? 'corredor' : seoData.zona === 3 ? 'csl' : 'pacifico') : '');
  const [cenaFecha, setCenaFecha] = useState('');
  const [cenaPax, setCenaPax] = useState('1-4');
  const [cenaHora, setCenaHora] = useState('');
  const [cenaHoraRegreso, setCenaHoraRegreso] = useState('');
  const [reservaLocal, setReservaLocal] = useState({
    rosas: false,
    vino: false,
    vinoEspumoso: false
  });

  if (!seoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{lang === 'es' ? 'Restaurante no encontrado' : 'Restaurant not found'}</h1>
          <Link href={`/${lang}`} className="text-blue-600 hover:underline">
            {lang === 'es' ? 'Volver al inicio' : 'Return to home'}
          </Link>
        </div>
      </div>
    );
  }

  // Precios form
  const matrizPreciosCenas = {
    'sjc': { '1': 120, '2': 140, '3': 170, '4': 250 },
    'corredor': { '1': 140, '2': 120, '3': 140, '4': 220 },
    'csl': { '1': 170, '2': 140, '3': 120, '4': 220 },
    'pacifico': { '1': 250, '2': 220, '3': 220, '4': 180 }
  };
  const recargoCenas = { '1-4': 0, '5-8': 30, '9-10': 45 };

  let totalPrecioCena = 0;
  if (cenaOrigen && cenaDestino) {
    const zonaSeleccionada = String(cenaOrigen.split('|')[1]) || "1";
    const precioBase = Number(matrizPreciosCenas[cenaDestino]?.[zonaSeleccionada] || 0);
    totalPrecioCena = precioBase + Number(recargoCenas[cenaPax] || 0);
  }

  const costoExtras = (reservaLocal.rosas ? 50 : 0) + (reservaLocal.vino ? 70 : 0) + (reservaLocal.vinoEspumoso ? 70 : 0);
  const granTotalCena = totalPrecioCena > 0 ? totalPrecioCena + costoExtras : 0;

  // SEO Content Variables
  const t = {
    title: lang === 'es' 
      ? `Traslados Privados a ${seoData.nombre}` 
      : `Private Transfers to ${seoData.nombre}`,
    subtitle: lang === 'es' 
      ? `Reserva transporte de lujo, seguro y confiable a ${seoData.nombre} en ${seoData.zonaText}. Evita Ubers y taxis. ¡Reserva en línea!` 
      : `Book safe, reliable luxury transportation to ${seoData.nombre} in ${seoData.zonaText}. Avoid Ubers and taxis. Book online!`,
    keyPointTitle: lang === 'es' ? 'Puntos Clave' : 'Key Takeaways',
    keyPointDesc: lang === 'es' 
      ? `Disfruta de ${seoData.desc} en ${seoData.nombre} sin preocuparte por el viaje. Nuestro transporte privado en Cabo te lleva directamente desde tu resort o villa, asegurando una velada perfecta de principio a fin.` 
      : `Enjoy ${seoData.desc} at ${seoData.nombre} without worrying about the ride. Our Cabo private transfers take you directly from your resort or villa, ensuring a perfect evening from start to finish.`,
    ratesTitle: lang === 'es' ? 'Tarifas y Beneficios Exclusivos' : 'Exclusive Rates and Benefits',
    ratesDesc: lang === 'es'
      ? `Ofrecemos tarifas fijas para traslados privados a ${seoData.nombre}. A diferencia de los taxis o Uber en Cabo que pueden cambiar sus precios, nosotros garantizamos el mejor transporte de lujo en Los Cabos.`
      : `We offer flat rates for private transfers to ${seoData.nombre}. Unlike Cabo taxis or Uber which might change pricing, we guarantee the finest luxury transportation in Los Cabos.`,
    routeTitle: lang === 'es' ? 'Ruta de Viaje y Logística' : 'Route and Logistics',
    routeDesc: lang === 'es'
      ? `Viajar a ${seoData.zonaText} es cómodo y escénico. Nuestros chóferes conocen la ruta perfecta hacia ${seoData.nombre} y te estarán esperando hasta 3 horas para regresarte con la misma comodidad.`
      : `Traveling to ${seoData.zonaText} is comfortable and scenic. Our chauffeurs know the perfect route to ${seoData.nombre} and will wait up to 3 hours to take you back in complete comfort.`,
    compareTitle: lang === 'es' ? 'Comparando Opciones en Cabo' : 'Comparing Options in Cabo',
    compareDesc: lang === 'es'
      ? `Los taxis regulares en Cabo suelen ser costosos y los Ubers no siempre pueden ingresar a ciertas áreas como ${seoData.nombre}. Nuestros traslados privados en Los Cabos son la opción confiable y lujosa para que disfrutes sin preocupaciones.`
      : `Regular Cabo taxis are often overpriced, and Ubers face restrictions entering exclusive areas like ${seoData.nombre}. Our private transfers in Cabo San Jose and Cabo San Lucas are the reliable, luxury choice for a worry-free experience.`,
    tipsTitle: lang === 'es' ? 'Consejos para Reservar y Reseñas de Viajeros' : 'Booking Tips & Traveler Reviews',
    tipsDesc: lang === 'es'
      ? `Reserva tu transporte a ${seoData.nombre} con anticipación. Miles de viajeros recomiendan Ballard Tours por encima de los shuttles tradicionales por nuestra puntualidad y vehículos premium.`
      : `Book your transportation to ${seoData.nombre} in advance. Thousands of travelers recommend Ballard Tours over traditional shuttles due to our punctuality and premium vehicles.`,
    bookingTitle: lang === 'es' ? 'Reserva en Línea Fácil' : 'Easy Online Booking',
    bookingDesc: lang === 'es'
      ? `Utiliza nuestro formulario a continuación para asegurar tu traslado de lujo a ${seoData.nombre}. Aceptamos opciones de pago flexibles.`
      : `Use our form below to secure your luxury transfer to ${seoData.nombre}. We accept flexible payment options.`
  };

  return (
    <div className="animate-fade-in pb-10 bg-white font-sans selection:bg-slate-900 selection:text-white">
      
      {/* 1. HERO SECTION (Premium Design) */}
      <div className="relative bg-slate-950 text-white py-28 md:py-36 px-4 overflow-hidden shadow-xl rounded-b-[2.5rem] mb-12 border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img src={`/${seoData.image}`} alt={`${seoData.nombre} Logo`} className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center z-20">
          <div className="flex justify-center items-center gap-4 mb-6 text-slate-400">
            <Car size={28} />
            <span className="border-t border-dashed border-slate-500 w-16"></span>
            <MapPin size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight text-white drop-shadow-md">
            {t.title}
          </h1>
          <HeroReviewsBadge lang={lang} />
          <p className="text-lg md:text-xl text-slate-300 font-medium mt-4">
            {lang === 'es' ? 'Servicio Exclusivo en Luxury SUV y Sprinter' : 'Exclusive Private Transportation & Luxury SUV Service'}
          </p>
        </div>
      </div>

      <TrustedPartners lang={lang} className="mb-12 rounded-2xl mx-4 max-w-7xl lg:mx-auto" />

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
        {/* LEFT: SEO CONTENT */}
        <div className="lg:col-span-2 space-y-12 text-slate-700 text-lg leading-relaxed order-2 lg:order-1">
            
          {/* Intro */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">
              {lang === 'es' ? `Traslados VIP hacia ${seoData.nombre}` : `VIP Transportation to ${seoData.nombre}`}
            </h2>
            <p className="mb-4 text-slate-600 text-base md:text-lg">
              {t.subtitle}
            </p>
            <p className="mb-4 text-slate-600 text-base md:text-lg">
              {t.keyPointDesc}
            </p>
          </section>

          {/* GOOGLE REVIEWS WIDGET */}
          <GoogleReviewsWidget lang={lang} />

          {/* KEY TAKEAWAYS (Diseño limpio y moderno) */}
          <section className="bg-slate-50 border border-slate-200 p-8 rounded-2xl my-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">{t.keyPointTitle}</h3>
            <ul className="space-y-4 text-slate-700 text-sm md:text-base font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-slate-900" />
                <span>{lang === 'es' ? `El servicio directo ofrece viajes 100% privados hacia ${seoData.nombre}.` : `Service offers 100% private, direct rides to ${seoData.nombre}.`}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-slate-900" />
                <span>{lang === 'es' ? `Reservar con anticipación en Ballard Tours garantiza puntualidad, bebidas de cortesía y cero tiempos de espera.` : `Pre-booking at Ballard Tours guarantees timely service, complimentary beverages, and zero wait times.`}</span>
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
              {t.ratesTitle}
            </h2>
            <ul className="list-disc pl-5 space-y-3 mb-8 text-slate-700 text-sm md:text-base">
              <li>{lang === 'es' ? `Traslado exclusivo y directo hacia ${seoData.nombre} servicio puerta a puerta profesional.` : `Exclusive, non‑stop transfer directly to ${seoData.nombre} door to door professional service.`}</li>
              <li>{lang === 'es' ? 'Salida flexible—tu horario, tu traslado.' : 'Flexible departure—your schedule, your transfer.'}</li>
              <li>{lang === 'es' ? 'Vehículos modernos con choferes bilingües y bebidas de cortesía incluidas.' : 'Modern, comfortable vehicles with licensed bilingual drivers, beverages included.'}</li>
              <li>{lang === 'es' ? 'Viaja en vehículos lujosos, espaciosos y desinfectados.' : 'Travel in spacious, sanitized, and air-conditioned luxury vehicles.'}</li>
              <li>{lang === 'es' ? 'Precio garantizado—sin tarifas ocultas ni tarifas dinámicas.' : 'Guaranteed pricing—no hidden fees or surge rates.'}</li>
            </ul>

            <div className="my-10 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
              <img src="/hard-rock-lobby-van.webp" alt="Luxury Cabo Transportation" className="w-full h-auto object-cover max-h-[400px]" />
            </div>
            
            <p className="mb-4 text-slate-600 text-sm md:text-base">
              {t.ratesDesc}
            </p>
          </section>

          {/* MAPA Y DATA */}
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm my-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
              {t.routeTitle}
            </h3>
            <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-200">
              <iframe
                title="Mapa de ubicación" width="100%" height="100%" style={{ border: 0, filter: 'contrast(1.1) grayscale(0.2)' }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(seoData.nombre + ' Los Cabos')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <Clock className="text-slate-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{lang === 'es' ? 'Tiempo' : 'Time'}</p>
                <p className="text-slate-800 font-semibold text-sm">{lang === 'es' ? 'Variable' : 'Variable'}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <MapPin className="text-slate-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{lang === 'es' ? 'Distancia' : 'Distance'}</p>
                <p className="text-slate-800 font-semibold text-sm">{lang === 'es' ? 'Ruta Directa' : 'Direct Route'}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <Map className="text-slate-900 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{lang === 'es' ? 'Zona' : 'Zone'}</p>
                <p className="text-slate-800 font-semibold text-sm text-center leading-tight">{seoData.zonaText}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-slate-100 flex flex-col items-center justify-center">
                <ShieldCheck className="text-green-600 mb-2" size={20} />
                <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{lang === 'es' ? 'Servicio' : 'Service'}</p>
                <p className="text-slate-800 font-semibold text-sm">{lang === 'es' ? '100% Privado' : '100% Private'}</p>
              </div>
            </div>
            
            <p className="mt-6 text-slate-600 text-sm md:text-base">
              {t.routeDesc}
            </p>
          </section>

          {/* Opciones */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 tracking-tight">
              {t.compareTitle}
            </h2>
            <p className="mb-6 text-slate-600 text-sm md:text-base">{t.compareDesc}</p>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">{lang === 'es' ? 'Recomendado' : 'Recommended'}</div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2"><Car size={20} className="text-slate-500" /> {lang === 'es' ? 'Traslados Privados VIP' : 'Private VIP Transfers'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'Servicio directo y personalizado hasta el lobby del restaurante. Sin esperas, privacidad total, y chofer esperándote.' : 'Direct, personalized service to the restaurant. No wait times, total privacy, and chauffeur waiting for you.'}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-2"><Users size={20} className="text-slate-400" /> {lang === 'es' ? 'Shuttles Compartidos' : 'Shared Shuttles'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'No suelen ofrecer servicios de cena a restaurantes específicos, o limitan mucho los horarios.' : 'Do not usually offer specific restaurant dinner services, or heavily limit schedules.'}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-2"><Banknote size={20} className="text-slate-400" /> {lang === 'es' ? 'Taxis y Uber' : 'Taxis and Uber'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'Disponibles al momento, pero las tarifas son impredecibles. Los Ubers frecuentemente no tienen acceso a comunidades cerradas donde se encuentran restaurantes exclusivos.' : 'Readily available, but fares can be unpredictable. Ubers frequently face restrictions entering gated resort communities where exclusive restaurants are located.'}</p>
              </div>
            </div>
          </section>

          {/* Consejos para Reservar y Reseñas de Viajeros */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 mt-12 tracking-tight">
              {t.tipsTitle}
            </h2>
            <p className="mb-6 text-sm md:text-base text-slate-600">
              {t.tipsDesc}
            </p>

            <div className="my-8 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100">
              <img src={`/${seoData.imageDiners}`} alt={`Diners at ${seoData.nombre}`} className="w-full h-auto object-cover max-h-[400px]" />
            </div>
          </section>
          
          <section className="bg-slate-50 rounded-[2rem] p-8 md:p-12 mb-16 mt-16 text-center border border-slate-200 shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{t.bookingTitle}</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">{t.bookingDesc}</p>
            <div className="flex justify-center mb-6">
              <img src="/pago-tarjetas.png" alt="Payment Methods" className="h-10 object-contain hover:scale-105 transition-transform duration-300" />
            </div>
          </section>

          {/* FAQ SECTION */}
          <FAQAccordion type="restaurant" locationName={seoData.nombre} lang={lang} />

        </div>

        {/* RIGHT: BOOKING WIDGET */}
        <div className="lg:col-span-1 relative order-1 lg:order-2">
          <UrgencyBanner lang={lang} locationName={seoData.nombre} />
          <div className="bg-slate-100 border border-slate-300 rounded-[2rem] shadow-2xl p-5 md:p-6 sticky top-28 max-w-[380px] mx-auto lg:ml-auto lg:mr-0 lg:max-w-[350px] w-full">
            
            {/* Cabecera del Widget (Seguridad) */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={24} />
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  {lang === 'es' ? 'Detalles de tu Reserva' : 'Booking Details'}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <img src="/datos-seguros.png" alt="Pago Seguro" className="h-6 object-contain" />
                <div className="h-6 w-px bg-slate-300"></div>
                <img src="/pago-tarjetas.png" alt="Tarjetas Aceptadas" className="h-5 object-contain" />
              </div>
            </div>

            <div className="bg-blue-100 border border-blue-200 text-blue-900 rounded-xl p-4 text-xs font-semibold mb-6 flex items-start gap-2 shadow-sm">
              <Info size={16} className="shrink-0 mt-0.5 text-blue-700" />
              <p>{lang === 'es' ? 'El servicio incluye un máximo de 3 horas de espera.' : 'The service includes a maximum of 3 hours of waiting time.'}</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? '¿De dónde sales?' : 'Where are you departing from?'}</label>
                <input type="text" placeholder={lang === 'es' ? 'Busca tu hotel...' : 'Search your hotel...'} value={busquedaCenaOrigen} onChange={(e) => { setBusquedaCenaOrigen(e.target.value); setMostrarDropdownCena(true); if (e.target.value === '') setCenaOrigen(''); }} onFocus={() => setMostrarDropdownCena(true)} onBlur={() => setTimeout(() => setMostrarDropdownCena(false), 200)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition font-medium text-slate-800" />
                {mostrarDropdownCena && (
                  <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 top-[68px] max-h-48 overflow-y-auto text-sm font-medium">
                    {catalogoHoteles.filter(h => (busquedaCenaOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map((hotel, idx) => (
                      <li key={`${hotel.id}-${idx}`} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setCenaOrigen(`${hotel.nombre}|${zona}`); setBusquedaCenaOrigen(`${hotel.nombre} (Zona ${zona})`); setMostrarDropdownCena(false); }} className="p-3 hover:bg-slate-100 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 transition flex justify-between">
                        <span>{hotel.nombre}</span><span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded ml-2">Zona {hotel.zonaId || hotel.zona || 1}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Área del restaurante' : 'Restaurant area'}</label>
                <select value={cenaDestino} onChange={(e) => setCenaDestino(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white font-medium text-slate-800">
                  <option value="" disabled>{lang === 'es' ? 'Selecciona una opción...' : 'Select an option...'}</option>
                  <option value="sjc">San José del Cabo</option>
                  <option value="corredor">{lang === 'es' ? 'Corredor Turístico' : 'Tourist Corridor'}</option>
                  <option value="csl">Cabo San Lucas</option>
                  <option value="pacifico">{lang === 'es' ? 'Sitio Pacífico' : 'Pacific Site'}</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Nombre Exacto' : 'Exact Restaurant Name'}</label>
                <input type="text" value={cenaRestauranteNombre} onChange={(e) => setCenaRestauranteNombre(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition font-medium text-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Fecha' : 'Date'}</label>
                  <input type="date" value={cenaFecha} onChange={(e) => setCenaFecha(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Pasajeros' : 'Passengers'}</label>
                  <select value={cenaPax} onChange={(e) => setCenaPax(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white font-medium text-slate-800">
                    <option value="1-4">1 a 4 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                    <option value="5-8">5 a 8 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                    <option value="9-10">9 a 10 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Ida' : 'Pick-up'}</label>
                  <input type="time" value={cenaHora} onChange={(e) => setCenaHora(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Regreso' : 'Return'}</label>
                  <input type="time" value={cenaHoraRegreso} onChange={(e) => setCenaHoraRegreso(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800" />
                </div>
              </div>

              {/* Add to Combo Button */}
              <div className="mt-8 bg-slate-950 rounded-[1.5rem] p-6 text-white flex flex-col justify-between shadow-lg">
                <div className="mb-4">
                  <p className="text-slate-400 text-sm mb-1 font-medium">{lang === 'es' ? 'Costo del Servicio (USD)' : 'Service Cost (USD)'}</p>
                  {totalPrecioCena > 0 ? (
                    <p className="text-4xl font-black">${granTotalCena}</p>
                  ) : (
                    <p className="text-2xl font-bold text-slate-700">---</p>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    if (!cenaOrigen || !cenaDestino || !cenaFecha || !cenaHora || !cenaHoraRegreso) {
                      alert(lang === 'es' ? 'Por favor completa todos los campos' : 'Please fill all fields');
                      return;
                    }
                    const zonaSeleccionada = String(cenaOrigen.split('|')[1]) || "1";
                    const hotelNombre = cenaOrigen.split('|')[0];
                    const newComboItem = {
                      id: Date.now().toString(),
                      tipoEspecial: 'cena',
                      titulo: lang === 'es' ? `Traslado a Cena: ${cenaRestauranteNombre}` : `Dinner Transport: ${cenaRestauranteNombre}`,
                      subtitulo: `${hotelNombre} ↔ ${cenaRestauranteNombre} (${cenaPax} pax) | Fecha: ${cenaFecha} | ${cenaHora} - ${cenaHoraRegreso}`,
                      precio: granTotalCena,
                      detalles: {
                        origen: hotelNombre,
                        zonaOrigen: zonaSeleccionada,
                        destino: cenaDestino,
                        restaurante: cenaRestauranteNombre,
                        fecha: cenaFecha,
                        pasajeros: cenaPax,
                        horaIda: cenaHora,
                        horaRegreso: cenaHoraRegreso,
                        extras: reservaLocal
                      }
                    };
                    agregarAlCombo(newComboItem);
                    setServicioSeleccionado('especiales');
                    setPaso(2);
                    router.push(`/${lang}/checkout`);
                  }}
                  disabled={totalPrecioCena === 0}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all text-lg ${totalPrecioCena > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                  <Plus size={20} className="mr-2" /> {lang === 'es' ? 'Reservar Ahora' : 'Book Now'}
                </button>
              </div>

              <TrustBadges lang={lang} showFlightMonitoring={false} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
