'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Clock, ShieldCheck, Car, Banknote, Calendar, ChevronRight, Info, Plus, CheckCircle, Users, Map, PlaneLanding, Baby 
} from 'lucide-react';
import { useCart } from '../../../../context/CartContext';
import { useBooking } from '../../../../context/BookingContext';
import TrustBadges from '../../../../components/TrustBadges';
import UrgencyBanner from '../../../../components/UrgencyBanner';
import FAQAccordion from '../../../../components/FAQAccordion';
import TrustedPartners from '../../../../components/TrustedPartners';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';
import GoogleReviewsWidget from '../../../../components/GoogleReviewsWidget';
import CustomerPhotosWidget from '../../../../components/CustomerPhotosWidget';
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
    'sjc': { '1': 160, '2': 200, '3': 220, '4': 250, '5': 320, '6': 420 },
    'corredor': { '1': 200, '2': 160, '3': 200, '4': 220, '5': 320, '6': 420 },
    'csl': { '1': 220, '2': 200, '3': 160, '4': 200, '5': 320, '6': 420 },
    'pacifico': { '1': 250, '2': 220, '3': 200, '4': 160, '5': 320, '6': 420 }
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
            <p className="mb-4 text-slate-600 text-base md:text-lg font-medium">
              {t.keyPointDesc}
            </p>
          </section>

          {/* GOOGLE REVIEWS WIDGET */}
          <GoogleReviewsWidget lang={lang} />
          <CustomerPhotosWidget lang={lang} />

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
                src={`https://maps.google.com/maps?saddr=${encodeURIComponent('Aeropuerto Internacional de Los Cabos')}&daddr=${encodeURIComponent(seoData.nombre + ' Los Cabos')}&output=embed`}
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
                    {/* NUEVO CONTENIDO SEO DE GOLF (BILINGÜE) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm mt-12 mb-10 space-y-8">
            {/* Intro */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                {lang === 'es' ? `Transporte Privado a ${seoData.nombre}` : `Private Transportation to ${seoData.nombre}`}
              </h2>
              <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                {lang === 'es' 
                  ? `Disfruta de transporte privado de lujo a ${seoData.nombre}, uno de los principales destinos de golf en Los Cabos. Ya sea que tengas un tee time temprano en la mañana o una ronda por la tarde, Ballard Tours ofrece transporte confiable, cómodo y puntual a ${seoData.nombre} desde cualquier hotel, resort, villa o residencia privada.` 
                  : `Enjoy luxury private transportation to ${seoData.nombre}, one of the premier golf destinations in Los Cabos. Whether you have an early morning tee time or an afternoon round, Ballard Tours offers reliable, comfortable, and punctual transportation to ${seoData.nombre} from any hotel, resort, villa, or private residence.`}
              </p>
              <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                {lang === 'es'
                  ? `Nuestros choferes profesionales aseguran que llegues a ${seoData.nombre} relajado, a tiempo y listo para disfrutar de una de las mejores experiencias de golf en Baja California Sur.`
                  : `Our professional chauffeurs ensure you arrive at ${seoData.nombre} relaxed, on time, and ready to enjoy one of the finest golf experiences in Baja California Sur.`}
              </p>
            </div>

            {/* Vehículos y Por qué Reservar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Transporte de Lujo a ${seoData.nombre}` : `Luxury Transportation to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Viajar a ${seoData.nombre} debe ser tan disfrutable como jugar en el campo mismo. Nuestro servicio de transporte de lujo a ${seoData.nombre} incluye SUVs premium y Mercedes Sprinter Vans diseñadas para máxima comodidad, privacidad y conveniencia.`
                    : `Traveling to ${seoData.nombre} should be as enjoyable as playing the course itself. Our luxury transportation service to ${seoData.nombre} includes premium SUVs and Mercedes Sprinter Vans designed for maximum comfort, privacy, and convenience.`}
                </p>
                <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Ya sea que viajes solo o con un grupo de golf, nuestro transporte a ${seoData.nombre} proporciona el nivel más alto de servicio.`
                    : `Whether you're traveling alone or with a golf group, our transportation to ${seoData.nombre} provides the highest level of service.`}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Transporte del Aeropuerto de Los Cabos a ${seoData.nombre}` : `Transportation from Los Cabos Airport to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `¿Necesitas transporte directamente desde el Aeropuerto Internacional de Los Cabos (SJD) a ${seoData.nombre}? Nuestro servicio de transporte del aeropuerto te permite ir directamente de tu vuelo a ${seoData.nombre} o a tu hotel antes de tu tee time programado.`
                    : `Need transportation directly from Los Cabos International Airport (SJD) to ${seoData.nombre}? Our airport transportation service allows you to go directly from your flight to ${seoData.nombre} or to your hotel before your scheduled tee time.`}
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Monitoreamos tu vuelo en tiempo real y ajustamos los tiempos de recogida si tu vuelo se retrasa, asegurando que tu transporte a ${seoData.nombre} esté siempre listo cuando llegues.`
                    : `We monitor your flight in real time and adjust pickup times if your flight is delayed, ensuring your transportation to ${seoData.nombre} is always ready when you arrive.`}
                </p>
              </div>
            </div>

            {/* Listas Inclusiones */}
            <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-slate-400" size={20}/> 
                {lang === 'es' ? `Cada viaje a ${seoData.nombre} incluye:` : `Every ride to ${seoData.nombre} includes:`}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {(lang === 'es' ? [
                  'Vehículo privado de lujo',
                  'Chofer profesional bilingüe',
                  'Transporte con aire acondicionado',
                  'Agua embotellada de cortesía',
                  'Cerveza de cortesía',
                  'Asientos espaciosos',
                  'Mucho espacio para equipaje y equipo',
                  'Servicio puerta a puerta'
                ] : [
                  'Private luxury vehicle',
                  'Professional bilingual chauffeur',
                  'Air-conditioned transportation',
                  'Complimentary bottled water',
                  'Complimentary beer',
                  'Spacious seating',
                  'Plenty of luggage space',
                  'Door-to-door service'
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Del Hotel al Golf y Viaje Redondo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Transporte de tu Hotel a ${seoData.nombre}` : `Hotel to ${seoData.nombre} Transportation`}
                </h3>
                <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Proveemos transporte privado a ${seoData.nombre} desde cada resort importante en Los Cabos, incluyendo Cabo San Lucas, San José del Cabo, el Corredor Turístico, Palmilla, Puerto Los Cabos, Diamante y East Cape.`
                    : `We provide private transportation to ${seoData.nombre} from every major resort in Los Cabos, including Cabo San Lucas, San José del Cabo, the Tourist Corridor, Palmilla, Puerto Los Cabos, Diamante, and East Cape.`}
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  {lang === 'es'
                    ? `En lugar de alquilar un auto o depender de taxis, reserva transporte privado a ${seoData.nombre} y disfruta de una experiencia sin estrés de principio a fin.`
                    : `Instead of renting a car or relying on taxis, reserve private transportation to ${seoData.nombre} and enjoy a stress-free experience from pickup to drop-off.`}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Transporte Redondo a ${seoData.nombre}` : `Round Trip Transportation to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 mb-4 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Muchos golfistas prefieren reservar transporte redondo a ${seoData.nombre}. Tu chofer te recogerá en tu hotel, te conducirá directamente a ${seoData.nombre}, y regresará a la hora programada para llevarte de vuelta después de tu ronda.`
                    : `Many golfers prefer booking round-trip transportation to ${seoData.nombre}. Your chauffeur will pick you up at your hotel, drive you directly to ${seoData.nombre}, and return at the scheduled time to take you back after your round.`}
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  {lang === 'es'
                    ? `No hay necesidad de buscar transporte después de terminar tu juego. Tu transporte de regreso desde ${seoData.nombre} ya está arreglado.`
                    : `There's no need to search for transportation after finishing your game. Your return transportation from ${seoData.nombre} is already arranged.`}
                </p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Espacio para palos de golf y grupos */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {lang === 'es' ? `Transporte para Palos de Golf` : `Golf Club Transportation`}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {lang === 'es' 
                    ? `Viajar con palos de golf requiere espacio extra y manejo cuidadoso. Nuestras SUVs de lujo y Sprinter Vans proveen muchísimo espacio para bolsas de golf, equipaje y pertenencias personales. Ya sea que viajes con una bolsa de golf o con un grupo entero de torneo, el transporte a ${seoData.nombre} es cómodo y seguro.` 
                    : `Traveling with golf clubs requires extra space and careful handling. Our luxury SUVs and Sprinter Vans provide plenty of room for golf bags, luggage, and personal belongings. Whether you're traveling with one golf bag or an entire tournament group, transportation to ${seoData.nombre} is comfortable and secure.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {lang === 'es' ? `Perfecto para Grupos de Golf` : `Perfect for Golf Groups`}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {lang === 'es' 
                    ? `Ballard Tours se especializa en transporte para grupos de golf que visitan Los Cabos. Ya sea que viajes con amigos, socios de negocios, o participando en un torneo de golf, el transporte a ${seoData.nombre} puede acomodar grupos de todo tamaño. Nuestras Mercedes Sprinter Vans son ideales para fiestas de golf grandes, mientras que nuestras SUVs de lujo son perfectas para grupos más pequeños.` 
                    : `Ballard Tours specializes in transportation for golf groups visiting Los Cabos. Whether you're traveling with friends, business partners, or participating in a golf tournament, transportation to ${seoData.nombre} can accommodate groups of every size. Our Mercedes Sprinter Vans are ideal for larger golf parties, while our luxury SUVs are perfect for smaller groups.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {lang === 'es' ? `Servicio de Chofer Profesional a ${seoData.nombre}` : `Professional Chauffeur Service to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {lang === 'es' 
                    ? `Nuestros choferes con licencia están familiarizados con cada campo de golf importante en Los Cabos, incluyendo ${seoData.nombre}. Conocen las rutas más rápidas, condiciones actuales del tráfico, y las mejores ubicaciones de recogida. Cada servicio de transporte a ${seoData.nombre} está diseñado para asegurar llegadas puntuales y que nunca pierdas tu tee time.` 
                    : `Our licensed chauffeurs are familiar with every major golf course in Los Cabos, including ${seoData.nombre}. They know the quickest routes, current traffic conditions, and the best pickup locations. Every transportation service to ${seoData.nombre} is designed to ensure punctual arrivals so you never miss your tee time.`}
                </p>
              </div>
            </div>

            {/* Puntos Avanzados SEO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Confiabilidad por la Mañana para tu Tee Time en ${seoData.nombre}` : `Early Morning Reliability for Your ${seoData.nombre} Tee Time`}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'es' 
                    ? `Muchos golfistas prefieren los primeros tee times del día para evitar el calor del mediodía en Baja y disfrutar de greens impecables. Cuando reservas transporte temprano a ${seoData.nombre}, la puntualidad absoluta no es solo un lujo; es una necesidad. Nuestros conductores profesionales llegan a tu hotel temprano, listos para cargar tus pesadas bolsas. Nunca tendrás que esperar ansiosamente un taxi a las 6:00 AM. Tu viaje privado a ${seoData.nombre} asegura que tengas mucho tiempo para registrarte en la pro shop, calentar y embocar algunos putts de práctica antes de que comience tu ronda en ${seoData.nombre}.` 
                    : `Many golfers prefer the first tee times of the day to beat the midday Baja heat and enjoy pristine greens. When you book early morning transportation to ${seoData.nombre}, absolute punctuality is not just a luxury; it is a necessity. Our professional drivers arrive at your hotel early, ready to load your heavy bags. You will never have to wait anxiously for a taxi at 6:00 AM. Your private ride to ${seoData.nombre} ensures you have plenty of time to check in at the pro shop, warm up at the driving range, and sink a few practice putts before your round at ${seoData.nombre} begins.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `La Experiencia del "Hoyo 19" y Transporte Seguro desde ${seoData.nombre}` : `The "19th Hole" Experience and Safe Transportation from ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'es' 
                    ? `Después de unos desafiantes 18 hoyos en ${seoData.nombre}, no hay nada mejor que visitar la casa club para almorzar, tomar cócteles de celebración y compartir historias. Cuando aseguras transporte redondo a ${seoData.nombre}, puedes disfrutar completamente la experiencia del "hoyo 19" de forma segura. Deja que nuestro equipo se encargue de conducir mientras tú te relajas. Tu chofer estará esperando justo afuera de la casa club de ${seoData.nombre} para llevarte de regreso a tu resort.` 
                    : `After a challenging 18 holes at ${seoData.nombre}, there is nothing better than visiting the clubhouse for lunch, celebratory cocktails, and swapping stories about your best shots. When you secure round-trip transportation to ${seoData.nombre}, you can fully enjoy the "19th hole" experience safely. Let our team handle the driving while you relax. Your chauffeur will be waiting right outside the ${seoData.nombre} clubhouse to take you back to your resort. You will never have to worry about navigating unfamiliar roads after a few drinks at ${seoData.nombre}.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Evita las Molestias de Alquilar un Auto en tu Camino a ${seoData.nombre}` : `Skip the Rental Car Hassle on Your Way to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'es' 
                    ? `Alquilar un vehículo solo para llevar a tu grupo a ${seoData.nombre} puede ser innecesariamente estresante y caro. Meter cuatro juegos de bolsas de golf en el baúl de un auto de alquiler estándar es casi imposible. Las SUVs de lujo y vans Sprinter que utilizamos para nuestro transporte a ${seoData.nombre} están diseñadas específicamente con amplio espacio de carga para manejar equipo extragrande sin esfuerzo. Evita las filas de alquiler, tarifas ocultas de seguro y dolores de cabeza de navegación. Nuestro transporte VIP a ${seoData.nombre} te deja justo en el área de entrega de bolsas de ${seoData.nombre}.` 
                    : `Renting a vehicle just to get your group to ${seoData.nombre} can be unnecessarily stressful and expensive. Fitting four sets of oversized golf bags into a standard rental car trunk is nearly impossible. The luxury SUVs and Sprinter vans used for our transportation to ${seoData.nombre} are specifically designed with ample cargo space to handle oversized equipment effortlessly. Skip the rental desk lines, hidden insurance fees, and navigation headaches. Our VIP transportation to ${seoData.nombre} drops you right at the bag drop area of ${seoData.nombre}.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Eventos Corporativos, Torneos y Grupos en ${seoData.nombre}` : `Corporate Outings, Tournaments, and Group Events at ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'es' 
                    ? `¿Estás organizando un retiro corporativo, un torneo de caridad o una gran despedida de soltero en ${seoData.nombre}? La logística de grupo puede hacer triunfar o fracasar el evento. Ballard Tours provee transporte fluido para grupos a ${seoData.nombre}. Podemos despachar múltiples Mercedes Sprinter Vans para transportar a todo tu grupo simultáneamente. Aseguramos que todo tu grupo llegue a ${seoData.nombre} al mismo tiempo, creando una experiencia unificada, profesional y sin estrés para cada jugador que asista a ${seoData.nombre}.` 
                    : `Are you organizing a corporate retreat, a charity tournament, or a large bachelor party outing at ${seoData.nombre}? Group logistics can make or break the event. Ballard Tours provides seamless group transportation to ${seoData.nombre}. We can dispatch multiple Mercedes Sprinter Vans to transport your entire roster simultaneously. We ensure your whole party arrives at ${seoData.nombre} together, creating a unified, professional, and stress-free experience for every player attending ${seoData.nombre}.`}
                </p>
              </div>
            </div>

            {/* Comparación de Opciones Table */}
            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg overflow-hidden">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">{lang === 'es' ? 'Característica' : 'Feature'}</th>
                    <th scope="col" className="px-6 py-3">{lang === 'es' ? `Viaje Privado Ballard Tours a ${seoData.nombre}` : `Ballard Tours Private Ride to ${seoData.nombre}`}</th>
                    <th scope="col" className="px-6 py-3">{lang === 'es' ? 'Taxis Estándar / Autos de Alquiler' : 'Standard Taxis / Rental Cars'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-slate-100">
                    <td className="px-6 py-4 font-bold">{lang === 'es' ? 'Espacio para Equipo' : 'Equipment Space'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{lang === 'es' ? `Espacio de baúl garantizado para bolsas de ${seoData.nombre}` : `Guaranteed oversized trunk space for ${seoData.nombre} bags`}</td>
                    <td className="px-6 py-4 text-red-700">{lang === 'es' ? 'Frecuentemente muy pequeños para acomodar múltiples bolsas de viaje de golf' : 'Often too small to fit multiple golf travel bags'}</td>
                  </tr>
                  <tr className="bg-white border-b border-slate-100">
                    <td className="px-6 py-4 font-bold">{lang === 'es' ? 'Puntualidad' : 'Punctuality'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{lang === 'es' ? `Pre-agendado para coincidir perfectamente con tu tee time en ${seoData.nombre}` : `Pre-scheduled to perfectly match your ${seoData.nombre} tee time`}</td>
                    <td className="px-6 py-4 text-red-700">{lang === 'es' ? 'Disponibilidad poco confiable, especialmente temprano por la mañana' : 'Unreliable availability, especially for early mornings'}</td>
                  </tr>
                  <tr className="bg-white border-b border-slate-100">
                    <td className="px-6 py-4 font-bold">{lang === 'es' ? 'Protocolo de Bajada' : 'Drop-off Protocol'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{lang === 'es' ? `Servicio VIP directo a la entrega de bolsas y pro shop de ${seoData.nombre}` : `Direct VIP service to the ${seoData.nombre} bag drop & pro shop`}</td>
                    <td className="px-6 py-4 text-red-700">{lang === 'es' ? 'Auto-estacionamiento y caminar largas distancias con equipo pesado' : 'Self-parking and walking long distances with heavy gear'}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-bold">{lang === 'es' ? 'Después de la Ronda' : 'After the Round'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{lang === 'es' ? `Chofer espera disponible para tu regreso de ${seoData.nombre}` : `Driver waits on standby for your return from ${seoData.nombre}`}</td>
                    <td className="px-6 py-4 text-red-700">{lang === 'es' ? 'Deberás pedir un taxi o conducir cansado después de caminar 18 hoyos' : 'Must hail a cab or drive back tired after walking 18 holes'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Por qué Elegir Transporte Privado al GOLF & Keywords */}
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-lg mt-8">
              <h3 className="text-xl font-bold mb-3">
                {lang === 'es' ? `¿Por qué Elegir Transporte Privado a ${seoData.nombre}?` : `Why Choose Private Transportation to ${seoData.nombre}?`}
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
                {lang === 'es' 
                  ? `Miles de golfistas eligen a Ballard Tours cada año para su transporte a ${seoData.nombre} debido a nuestra confiabilidad y excepcional servicio al cliente. Elegir nuestro transporte privado a ${seoData.nombre} ofrece muchas ventajas:` 
                  : `Thousands of golfers choose Ballard Tours every year for transportation to ${seoData.nombre} because of our reliability and exceptional customer service. Choosing private transportation to ${seoData.nombre} offers many advantages:`}
              </p>
              <div className="columns-2 gap-4 text-sm text-slate-300 mb-6">
                <ul className="space-y-1 font-medium">
                  {(lang === 'es' ? [
                    'Servicio directo',
                    'Sin transporte compartido',
                    'Sin esperar a otros pasajeros',
                    'Tarifas fijas',
                    'Conductores profesionales',
                    'Vehículos de lujo',
                    'Asientos cómodos',
                    'Espacio extra para palos de golf',
                    'Aire acondicionado',
                    'Bebidas de cortesía',
                    'Tiempos de recogida flexibles',
                    'Servicio personalizado'
                  ] : [
                    'Direct service',
                    'No shared transportation',
                    'No waiting for other passengers',
                    'Flat-rate pricing',
                    'Professional drivers',
                    'Luxury vehicles',
                    'Comfortable seating',
                    'Extra room for golf clubs',
                    'Air conditioning',
                    'Complimentary beverages',
                    'Flexible pickup times',
                    'Personalized service'
                  ]).map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-bold">
                {lang === 'es' 
                  ? `Además del transporte a ${seoData.nombre}, también ofrecemos traslados al aeropuerto, restaurantes y más. Reserva hoy tu transporte a ${seoData.nombre}. Permítenos mostrarte por qué somos la mejor opción para: Transportation to ${seoData.nombre}, Private transportation to ${seoData.nombre}, Golf transportation Los Cabos, Luxury transportation to ${seoData.nombre}, How to get to ${seoData.nombre}, Golf course transportation, Chauffeur service to ${seoData.nombre}, Round trip transportation to ${seoData.nombre}, Airport transportation to ${seoData.nombre}, Transportation from hotel to ${seoData.nombre}, Golf tee time transportation, y Private driver to ${seoData.nombre}.` 
                  : `Besides transportation to ${seoData.nombre}, we also offer airport transfers, restaurant rides, and more. Reserve your transportation to ${seoData.nombre} today. Let us show you why we are the top choice for: Transportation to ${seoData.nombre}, Private transportation to ${seoData.nombre}, Golf transportation Los Cabos, Luxury transportation to ${seoData.nombre}, How to get to ${seoData.nombre}, Golf course transportation, Chauffeur service to ${seoData.nombre}, Round trip transportation to ${seoData.nombre}, Airport transportation to ${seoData.nombre}, Transportation from hotel to ${seoData.nombre}, Golf tee time transportation, and Private driver to ${seoData.nombre}.`}
              </p>
            </div>
          </section>
          <FAQAccordion type="golf" locationName={seoData.nombre} lang={lang} />

        </div>

        {/* ========================================= */}
        {/* COLUMNA DERECHA: WIDGET DE RESERVA INTERACTIVO */}
        {/* ========================================= */}
        <div className="lg:col-span-1 relative order-1 lg:order-2">
          <UrgencyBanner lang={lang} locationName={seoData.nombre} />
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 sticky top-28">
            
            {/* Cabecera del Widget */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
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

            <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded-xl p-3.5 text-xs font-semibold mb-6 flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5 text-blue-700" />
              <p>{lang === 'es' ? 'El servicio de golf incluye hasta 4 horas de espera en el campo (más 1 hora de trayectos).' : 'Golf transfer service includes up to 4 hours of wait time at the course (plus 1 hour of transit).'}</p>
            </div>

            <div className="space-y-5">
              {/* SELECCIONA TU HOTEL */}
              <div className="relative">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  {lang === 'es' ? '¿De dónde sales? (Tu Hotel)' : 'Where are you departing from?'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'es' ? 'Escribe para buscar tu hotel...' : 'Type to search your hotel...'}
                  value={busquedaGolfOrigen}
                  onChange={(e) => {
                    setBusquedaGolfOrigen(e.target.value);
                    setMostrarDropdownGolf(true);
                    if (e.target.value === '') setGolfOrigen('');
                  }}
                  onFocus={() => setMostrarDropdownGolf(true)}
                  onBlur={() => setTimeout(() => setMostrarDropdownGolf(false), 200)}
                  className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 transition-colors text-sm"
                />
                {mostrarDropdownGolf && (
                  <ul className="absolute z-50 w-full bg-white border border-slate-200 shadow-xl max-h-60 overflow-y-auto rounded-xl mt-1 top-full left-0">
                    {catalogoHoteles.filter(h => (busquedaGolfOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map((hotel, idx) => (
                      <li
                        key={`${hotel.id}-${idx}`}
                        onMouseDown={() => {
                          const zona = hotel.zonaId || hotel.zona || "1";
                          setGolfOrigen(`${hotel.nombre}|${zona}`);
                          setBusquedaGolfOrigen(hotel.nombre);
                          setMostrarDropdownGolf(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-0 flex justify-between items-center"
                      >
                        <span className="truncate pr-2">{hotel.nombre}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">Zona {hotel.zonaId || hotel.zona || 1}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* TIPO DE VEHÍCULO */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  {lang === 'es' ? 'Tipo de Vehículo (Viaje Redondo)' : 'Vehicle Type (Round Trip)'}
                </label>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Opcion Luxury SUV */}
                  <button
                    type="button"
                    onClick={() => setGolfPax('1-4')}
                    className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${golfPax !== '9-10' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-start w-full mb-2">
                      <span className="font-bold text-slate-900">Luxury SUV</span>
                      <Car size={18} className={golfPax !== '9-10' ? 'text-blue-900' : 'text-slate-400'} />
                    </div>
                    <p className="text-[10px] text-slate-500 mb-4 leading-tight">
                      {lang === 'es' ? 'Espacio amplio para bolsas de golf y máximo confort.' : 'Spacious room for golf bags and maximum comfort.'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                        <Users size={12} /> {lang === 'es' ? 'MÁX 6 PAX' : 'MAX 6 PAX'}
                      </div>
                      <span className="font-black text-slate-900 text-sm">
                        ${golfOrigen && golfDestino ? Number(matrizPreciosGolf[golfDestino]?.[String(golfOrigen.split('|')[1]) || '1'] || 160) : Number(matrizPreciosGolf[golfDestino]?.[String(seoData.zona || 1)] || 160)}
                      </span>
                    </div>
                  </button>

                  {/* Opcion Van */}
                  <button
                    type="button"
                    onClick={() => setGolfPax('9-10')}
                    className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${golfPax === '9-10' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-start w-full mb-2">
                      <span className="font-bold text-slate-900">Van</span>
                      <Car size={18} className={golfPax === '9-10' ? 'text-blue-900' : 'text-slate-400'} />
                    </div>
                    <p className="text-[10px] text-slate-500 mb-4 leading-tight">
                      {lang === 'es' ? 'Ideal para grupos de golfistas con múltiples equipos.' : 'Ideal for golf groups with multiple club sets.'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                        <Users size={12} /> {lang === 'es' ? 'MÁX 10 PAX' : 'MAX 10 PAX'}
                      </div>
                      <span className="font-black text-slate-900 text-sm">
                        ${(golfOrigen && golfDestino ? Number(matrizPreciosGolf[golfDestino]?.[String(golfOrigen.split('|')[1]) || '1'] || 160) : Number(matrizPreciosGolf[golfDestino]?.[String(seoData.zona || 1)] || 160)) + 60}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* FECHA Y PASAJEROS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    {lang === 'es' ? 'Fecha de Tee Time' : 'Service Date'}
                  </label>
                  <input
                    type="date"
                    value={golfFecha}
                    onChange={(e) => setGolfFecha(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    {lang === 'es' ? 'Pasajeros' : 'Passengers'}
                  </label>
                  <select
                    value={golfPax}
                    onChange={(e) => setGolfPax(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm"
                  >
                    <option value="1-4">1 - 4 {lang === 'es' ? 'Pax' : 'Pax'}</option>
                    <option value="5-8">5 - 8 {lang === 'es' ? 'Pax' : 'Pax'}</option>
                    <option value="9-10">9 - 10 {lang === 'es' ? 'Pax' : 'Pax'}</option>
                  </select>
                </div>
              </div>

              {/* HORARIOS IDA Y REGRESO */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    {lang === 'es' ? 'Hora Ida (Hotel)' : 'Pick-up Time'}
                  </label>
                  <input
                    type="time"
                    value={golfHoraIda}
                    onChange={(e) => setGolfHoraIda(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    {lang === 'es' ? 'Hora Regreso' : 'Return Time'}
                  </label>
                  <input
                    type="time"
                    value={golfHoraRegreso}
                    onChange={(e) => setGolfHoraRegreso(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
              </div>

              {/* TARIFA Y BOTÓN DE RESERVA */}
              <div className="pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {lang === 'es' ? 'Viaje Redondo Privado' : 'Private Round-Trip Rate'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {totalPrecioGolf > 0
                        ? (lang === 'es' ? 'Impuestos y 4h espera incluidos' : 'Taxes & 4h wait time included')
                        : (lang === 'es' ? 'Selecciona tu hotel para cotizar' : 'Select your hotel for exact rate')}
                    </span>
                  </div>
                  <div className="text-right">
                    {totalPrecioGolf > 0 ? (
                      <span className="text-2xl font-black text-slate-900">${totalPrecioGolf} <span className="text-xs font-bold text-slate-500">USD</span></span>
                    ) : (
                      <span className="text-sm font-black text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 inline-block">
                        {lang === 'es' ? 'Desde $160 USD' : 'From $160 USD'}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!golfOrigen || !golfDestino || !golfFecha || !golfHoraIda || !golfHoraRegreso) {
                      alert(lang === 'es' ? 'Por favor selecciona tu hotel, fecha y horarios para continuar.' : 'Please select your hotel, date, and times to continue.');
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
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all text-base bg-blue-900 hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20"
                >
                  <Plus size={18} className="mr-2" /> {lang === 'es' ? 'Reservar Traslado de Golf' : 'Book Golf Transfer'}
                </button>
              </div>

              <TrustBadges lang={lang} showFlightMonitoring={false} />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================= */}
      {/* SECCIÓN FINAL: OTROS CAMPOS DE GOLF Y BENEFICIOS */}
      {/* ========================================= */}
      <div className="max-w-6xl mx-auto px-4 pb-16 mt-10">

        {/* OTROS CAMPOS DE GOLF EN LOS CABOS (MISMO DISEÑO DE CARDS CON IMAGEN QUE HOTELES) */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold text-blue-900 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-3">
                {lang === 'es' ? 'Golf en Los Cabos' : 'Championship Golf'}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {lang === 'es' ? 'Otros Campos de Golf en Los Cabos' : 'Other Championship Golf Courses in Los Cabos'}
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium">
                {lang === 'es'
                  ? 'Transporte privado ida y vuelta con espacio amplio para bolsas de golf y hasta 4 horas de espera en todos los campos de Los Cabos.'
                  : 'Round-trip private golf transfers with spacious room for golf clubs and up to 4 hours of wait time to every course in Los Cabos.'}
              </p>
            </div>
            <Link
              href={`/${lang}/golf`}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 shrink-0 group self-start md:self-auto"
            >
              <span>{lang === 'es' ? 'Ver todos los campos de golf' : 'View all golf courses'}</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {golfSEOData
              .filter(g => g.slug !== slug)
              .sort((a, b) => (a.zona === seoData.zona ? -1 : 1) - (b.zona === seoData.zona ? -1 : 1))
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/${lang}/golf-courses/${item.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-900/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img 
                      src={`/${item.imageHero || 'golf-sjc-hero.webp'}`} 
                      alt={`Transfer to ${item.nombre}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/suburban-airport-los-cabos-ballard.webp';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                        {item.zonaText}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-900 transition-colors line-clamp-1 mb-2">
                        {item.nombre}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-4">
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" /> {lang === 'es' ? '4 hrs espera incl.' : '4 hrs wait incl.'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" /> {item.zonaText}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900">
                      <span>{lang === 'es' ? 'Ver información y tarifas' : 'View rates & transfer'}</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

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
              ? 'Sitio web de reservación fácil en tres clics en Ballard Tours. Simplemente ingrese su hotel de origen, elija su horario de golf y haga clic en reservar. Al final del formulario, encontrará la sección de pago, donde puede seleccionar entre pagar de forma segura con tarjeta de crédito, optar por el pago a la llegada a su chofer, o usar PayPal para mayor comodidad.'
              : 'Easy three-click booking website at Ballard Tours. Simply enter your departure hotel, choose your tee time schedule, and click book. At the end of the form, you will find the payment section, where you can select from paying securely by credit card, opting for cash payment on arrival to your driver, or using PayPal for added convenience.'}
          </p>
        </div>
      </div>
    </div>
  );
}
