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
import UrgencyBanner from '../../../../components/UrgencyBanner';
import FAQAccordion from '../../../../components/FAQAccordion';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';
import { golfSEOData } from '../../../../data/golfSEOData';
import { catalogoHoteles } from '../../../../data/seoData';

export default function GolfCourseSeoPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang || 'en';
  const slug = resolvedParams.slug;
  const router = useRouter();

  const { agregarAlCombo } = useCart();
  const { setServicioSeleccionado, setPaso, reserva } = useBooking();

  const seoData = golfSEOData.find(item => item.slug === slug);

  const [golfOrigen, setGolfOrigen] = useState('');
  const [busquedaGolfOrigen, setBusquedaGolfOrigen] = useState('');
  const [mostrarDropdownGolf, setMostrarDropdownGolf] = useState(false);
  const [golfCourseNombre, setGolfCourseNombre] = useState(seoData ? seoData.nombre : '');
  const [golfDestino, setGolfDestino] = useState(seoData ? (seoData.zona === 1 ? 'sjc' : seoData.zona === 2 ? 'corredor' : seoData.zona === 3 ? 'csl' : 'pacifico') : '');
  const [golfFecha, setGolfFecha] = useState('');
  const [golfPax, setGolfPax] = useState('1-4');
  const [golfHoraIda, setGolfHoraIda] = useState('');
  const [golfHoraRegreso, setGolfHoraRegreso] = useState('');

  if (!seoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{lang === 'es' ? 'Campo de golf no encontrado' : 'Golf course not found'}</h1>
          <Link href={`/${lang}`} className="text-blue-600 hover:underline">
            {lang === 'es' ? 'Volver al inicio' : 'Return to home'}
          </Link>
        </div>
      </div>
    );
  }

  // Precios form para Golf
  // Zonas de hotel: 1 (SJC), 2 (Corredor), 3 (CSL), 4 (Pacifico)
  const matrizPreciosGolf = {
    'sjc': { '1': 160, '2': 200, '3': 220, '4': 250 },
    'corredor': { '1': 200, '2': 160, '3': 200, '4': 220 },
    'csl': { '1': 220, '2': 200, '3': 160, '4': 200 },
    'pacifico': { '1': 250, '2': 220, '3': 200, '4': 160 }
  };
  
  const recargoGolf = { '1-4': 0, '5-8': 40, '9-10': 60 };

  let totalPrecioGolf = 0;
  if (golfOrigen && golfDestino) {
    const zonaSeleccionada = String(golfOrigen.split('|')[1]) || "1";
    const precioBase = Number(matrizPreciosGolf[golfDestino]?.[zonaSeleccionada] || 0);
    totalPrecioGolf = precioBase + Number(recargoGolf[golfPax] || 0);
  }

  // SEO Text (Heavily injected with keywords)
  const t = {
    title: lang === 'es'
      ? `Traslados Privados a ${seoData.nombre}`
      : `Private Transfers to ${seoData.nombre}`,
    subtitle: lang === 'es'
      ? `Reserva transporte de lujo, seguro y confiable a ${seoData.nombre}. Evita Ubers y taxis. ¡Los mejores traslados privados en Los Cabos!`
      : `Book safe, reliable luxury transportation to ${seoData.nombre}. Avoid unreliable Ubers and expensive taxis. The finest private transfers in Los Cabos!`,
    keyPointTitle: lang === 'es' ? 'Puntos Clave' : 'Key Takeaways',
    keyPointDesc: lang === 'es'
      ? `Experimenta ${seoData.desc}. Nuestros traslados de lujo en Los Cabos garantizan que tu única preocupación sea tu swing. Si buscas traslados privados en San Jose del Cabo o Cabo San Lucas, somos tu mejor opción frente a los inseguros taxis y shuttles compartidos.`
      : `Experience ${seoData.desc}. Our luxury transportation in Los Cabos ensures your only focus is your golf swing. If you are looking for Los Cabos airport transfers or private transfers Cabo San Lucas, we are your premium choice over unreliable Ubers and crowded shuttles.`,
    ratesTitle: lang === 'es' ? 'Tarifas y Beneficios Exclusivos' : 'Exclusive Rates and Benefits',
    ratesDesc: lang === 'es'
      ? `Disfruta de tarifas fijas y transparentes para nuestros traslados privados a ${seoData.nombre}. A diferencia de los Taxis que suben sus precios sin avisar, o los shuttles que te hacen esperar, nuestros traslados de lujo en San Jose del Cabo y Cabo San Lucas te dan paz mental.`
      : `Enjoy flat, transparent rates for your private transfers to ${seoData.nombre}. Unlike Taxis that spike prices without warning, or slow shared shuttles, our luxury transportation in Cabo San Lucas and San Jose del Cabo gives you ultimate peace of mind.`,
    routeTitle: lang === 'es' ? 'Ruta de Viaje y Logística' : 'Route and Logistics',
    routeDesc: lang === 'es'
      ? `Nuestra ruta directa asegura que llegues a ${seoData.zonaText} a tiempo para tu tee time. Los traslados en los cabos nunca fueron tan fáciles.`
      : `Our direct route ensures you arrive at ${seoData.zonaText} perfectly on time for your tee time. Los Cabos airport transfers and local rides have never been smoother.`,
    compareTitle: lang === 'es' ? 'Comparando Opciones en Cabo' : 'Overview of Cabo Transportation Options',
    compareDesc: lang === 'es'
      ? `No te la juegues con Taxis y Uber. Los Ubers suelen tener problemas para acceder a campos de golf privados como ${seoData.nombre}. Elige traslados de lujo en Los Cabos.`
      : `Don't gamble your tee time with Taxis and Uber. Ubers often face strict restrictions at exclusive gated golf clubs like ${seoData.nombre}. Choose premium private transfers in Los Cabos.`,
    tipsTitle: lang === 'es' ? 'Consejos para Reservar y Reseñas de Viajeros' : 'Booking Tips & Traveler Reviews',
    tipsDesc: lang === 'es'
      ? `Para jugar en ${seoData.nombre}, reserva tus traslados privados en Los Cabos con anticipación. Las reseñas confirman que los taxis normales y Ubers no ofrecen el espacio necesario para tus palos de golf, mientras que nuestras vans sí.`
      : `To play at ${seoData.nombre}, book your private transfers in Los Cabos well in advance. Reviews consistently note that regular Taxis and Ubers lack the space for golf clubs, while our luxury transportation in Los Cabos accommodates your gear perfectly.`,
    bookingTitle: lang === 'es' ? 'Reserva en Línea Fácil' : 'Easy Online Booking',
    bookingDesc: lang === 'es'
      ? `Usa el formulario para reservar tu transporte de golf. Aceptamos pagos seguros. Recuerda, somos la opción #1 para traslados privados en San Jose del Cabo y Cabo San Lucas.`
      : `Use the form to book your Golf Course Transportation Booking. We offer secure payments. Remember, we are the #1 choice for luxury transportation in San Jose del Cabo and private transfers Cabo San Lucas.`
  };

  return (
    <div className="animate-fade-in pb-10 bg-white font-sans selection:bg-slate-900 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-slate-950 text-white py-28 md:py-26 px-4 overflow-hidden shadow-xl rounded-b-[2.5rem] mb-12 border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img src={`/${seoData.imageHero}`} alt={`${seoData.nombre} Golf Course`} className="w-full h-full object-cover opacity-40" />
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
            <p className="mb-4 text-slate-600 text-base md:text-lg font-medium">
              {t.keyPointDesc}
            </p>
          </section>

          {/* KEY TAKEAWAYS */}
          <section className="bg-slate-50 border border-slate-200 p-8 rounded-2xl my-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">{t.keyPointTitle}</h3>
            <ul className="space-y-4 text-slate-700 text-sm md:text-base font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-slate-900" />
                <span>{lang === 'es' ? `El servicio directo ofrece viajes 100% privados hacia ${seoData.nombre}, perfecto para grupos de golf.` : `Service offers 100% private, direct rides to ${seoData.nombre}, perfect for golf groups.`}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-slate-900" />
                <span>{lang === 'es' ? `Reservar con anticipación garantiza espacio suficiente para tus palos de golf, algo que los Taxis y Ubers no aseguran.` : `Pre-booking guarantees ample space for your golf clubs, something Taxis and Ubers cannot guarantee.`}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-slate-900" />
                <span>{lang === 'es' ? `Nuestra flota incluye SUVs de Lujo y Sprinter Vans para asegurar la máxima comodidad VIP.` : `Transportation options focus on Private Transfers, including Luxury SUVs and Sprinter Vans for maximum VIP comfort.`}</span>
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
              <li>{lang === 'es' ? 'Espacio garantizado para tu equipo de golf sin cargos extra.' : 'Guaranteed space for your golf gear at no extra charge.'}</li>
              <li>{lang === 'es' ? 'Vehículos modernos con choferes bilingües y bebidas de cortesía incluidas.' : 'Modern, comfortable vehicles with licensed bilingual drivers, beverages included.'}</li>
              <li>{lang === 'es' ? 'Evita las tarifas dinámicas impredecibles de Uber.' : 'Avoid the unpredictable surge pricing of Uber.'}</li>
            </ul>

            <div className="my-10 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 relative group">
              <img src="/private-transportation-sjd-airport-los-cabos-luxury.webp" alt="Luxury Cabo Transportation at One&Only" className="w-full h-auto object-cover max-h-[450px] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 shadow-lg">One&Only Palmilla Luxury Transfer</div>
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
                <p className="text-slate-800 font-semibold text-sm">{lang === 'es' ? 'A tiempo' : 'On Time'}</p>
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
            <div className="space-y-3">
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">{lang === 'es' ? 'Recomendado' : 'Recommended'}</div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2"><Car size={20} className="text-slate-500" /> {lang === 'es' ? 'Traslados Privados VIP (Nosotros)' : 'Private VIP Transfers (Us)'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'Espacio para tus palos de golf, servicio directo, chofer bilingüe y vehículos impecables. La mejor opción en Los Cabos.' : 'Space for your golf clubs, direct service, bilingual chauffeur, and immaculate vehicles. The best choice in Los Cabos.'}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-2"><Users size={20} className="text-slate-400" /> {lang === 'es' ? 'Shuttles Compartidos' : 'Shared Shuttles'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'Lentos, saturados y a menudo te cobrarán extra (o te negarán el acceso) por llevar tu equipo de golf voluminoso.' : 'Slow, crowded, and often charge extra (or deny access) for bringing bulky golf equipment.'}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-2"><Banknote size={20} className="text-slate-400" /> {lang === 'es' ? 'Taxis y Uber' : 'Taxis and Uber'}</h4>
                <p className="text-sm text-slate-600 font-medium">{lang === 'es' ? 'Taxis cobran precios exorbitantes y los Ubers regulares (autos pequeños) no tienen cajuela para tus bolsas de golf. Además, no pueden entrar a fraccionamientos privados.' : 'Taxis charge exorbitant prices and regular Ubers (small cars) lack trunk space for your golf bags. Plus, they face severe access restrictions at private resorts.'}</p>
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

            <div className="my-8 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 relative group">
              <img src={`/${seoData.imagePlayer}`} alt={`Golfer at ${seoData.nombre}`} className="w-full h-auto object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/30"></div>
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
          <FAQAccordion type="golf" locationName={seoData.nombre} lang={lang} />

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
                  {lang === 'es' ? 'Detalles de Reserva' : 'Booking Details'}
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
              <p>{lang === 'es' ? 'El servicio de golf incluye un máximo de 4 horas de espera en el campo (más 1 hora de trayectos).' : 'The Golf transfer service includes a maximum of 4 hours of wait time at the course (plus 1 hour of transit).'}</p>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-4">{lang === 'es' ? 'Reserva de Campo de Golf' : 'Golf Course Transportation Booking'}</h3>

            <div className="space-y-4">
              <div className="flex flex-col relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? '¿De dónde sales?' : 'Where are you departing from?'}</label>
                <input type="text" placeholder={lang === 'es' ? 'Busca tu hotel...' : 'Type to search your hotel...'} value={busquedaGolfOrigen} onChange={(e) => { setBusquedaGolfOrigen(e.target.value); setMostrarDropdownGolf(true); if (e.target.value === '') setGolfOrigen(''); }} onFocus={() => setMostrarDropdownGolf(true)} onBlur={() => setTimeout(() => setMostrarDropdownGolf(false), 200)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition font-medium text-slate-800" />
                {mostrarDropdownGolf && (
                  <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 top-[68px] max-h-48 overflow-y-auto text-sm font-medium">
                    {catalogoHoteles.filter(h => (busquedaGolfOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map((hotel, idx) => (
                      <li key={`${hotel.id}-${idx}`} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setGolfOrigen(`${hotel.nombre}|${zona}`); setBusquedaGolfOrigen(`${hotel.nombre} (Zona ${zona})`); setMostrarDropdownGolf(false); }} className="p-3 hover:bg-slate-100 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 transition flex justify-between">
                        <span>{hotel.nombre}</span><span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded ml-2">Zona {hotel.zonaId || hotel.zona || 1}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Área del campo de golf' : 'Golf Course Area'}</label>
                <select value={golfDestino} onChange={(e) => setGolfDestino(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white font-medium text-slate-800">
                  <option value="" disabled>{lang === 'es' ? 'Selecciona una opción...' : 'Select an option...'}</option>
                  <option value="sjc">San José del Cabo</option>
                  <option value="corredor">{lang === 'es' ? 'Corredor Turístico' : 'Tourist Corridor'}</option>
                  <option value="csl">Cabo San Lucas</option>
                  <option value="pacifico">{lang === 'es' ? 'Sitio Pacífico' : 'Pacific Site'}</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Nombre Exacto' : 'Exact Golf Course Name'}</label>
                <input type="text" value={golfCourseNombre} onChange={(e) => setGolfCourseNombre(e.target.value)} placeholder="E.g. Quivira, Diamante, etc." className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition font-medium text-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Fecha' : 'Service Date'}</label>
                  <input type="date" value={golfFecha} onChange={(e) => setGolfFecha(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Pasajeros' : 'Number of Passengers'}</label>
                  <select value={golfPax} onChange={(e) => setGolfPax(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white font-medium text-slate-800">
                    <option value="1-4">1 a 4 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                    <option value="5-8">5 a 8 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                    <option value="9-10">9 a 10 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Ida' : 'Pick-up time (Hotel)'}</label>
                  <input type="time" value={golfHoraIda} onChange={(e) => setGolfHoraIda(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{lang === 'es' ? 'Regreso' : 'Pick-up time (Golf return)'}</label>
                  <input type="time" value={golfHoraRegreso} onChange={(e) => setGolfHoraRegreso(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800" />
                </div>
              </div>

              {/* Add to Combo Button */}
              <div className="mt-8 bg-slate-950 rounded-[1.5rem] p-6 text-white flex flex-col justify-between shadow-lg">
                <div className="mb-4">
                  <p className="text-slate-400 text-sm mb-1 font-medium">{lang === 'es' ? 'Costo del Servicio (USD)' : 'Service Cost (USD)'}</p>
                  {totalPrecioGolf > 0 ? (
                    <p className="text-4xl font-black">${totalPrecioGolf}</p>
                  ) : (
                    <p className="text-xl font-bold text-amber-500">{lang === 'es' ? 'Selecciona origen y destino' : 'Select origin and destination'}</p>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    if (!golfOrigen || !golfDestino || !golfFecha || !golfHoraIda || !golfHoraRegreso) {
                      alert(lang === 'es' ? 'Por favor completa todos los campos' : 'Please fill all fields');
                      return;
                    }
                    const zonaSeleccionada = String(golfOrigen.split('|')[1]) || "1";
                    const hotelNombre = golfOrigen.split('|')[0];
                    const newComboItem = {
                      id: Date.now().toString(),
                      tipoEspecial: 'golf',
                      titulo: lang === 'es' ? `Traslado a Golf: ${golfCourseNombre}` : `Golf Transport: ${golfCourseNombre}`,
                      subtitulo: `${hotelNombre} ↔ ${golfCourseNombre} (${golfPax} pax) | Fecha: ${golfFecha} | ${golfHoraIda} - ${golfHoraRegreso}`,
                      precio: totalPrecioGolf,
                      detalles: {
                        origen: hotelNombre,
                        zonaOrigen: zonaSeleccionada,
                        destino: golfDestino,
                        campoGolf: golfCourseNombre,
                        fecha: golfFecha,
                        pasajeros: golfPax,
                        horaIda: golfHoraIda,
                        horaRegreso: golfHoraRegreso
                      }
                    };
                    agregarAlCombo(newComboItem);
                    setServicioSeleccionado('especiales');
                    setPaso(2);
                    router.push(`/${lang}/checkout`);
                  }}
                  disabled={totalPrecioGolf === 0}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all text-lg ${totalPrecioGolf > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                  <Plus size={20} className="mr-2" /> {lang === 'es' ? 'Agregar al Combo' : 'Add to Combo'}
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
