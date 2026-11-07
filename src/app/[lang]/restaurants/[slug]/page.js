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
import FAQAccordion from '../../../../components/FAQAccordion';
import TrustedPartners from '../../../../components/TrustedPartners';
import UrgencyBanner from '../../../../components/UrgencyBanner';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';
import GoogleReviewsWidget from '../../../../components/GoogleReviewsWidget';
import CustomerPhotosWidget from '../../../../components/CustomerPhotosWidget';
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
    'sjc': { '1': 120, '2': 140, '3': 170, '4': 250, '5': 300, '6': 400 },
    'corredor': { '1': 140, '2': 120, '3': 140, '4': 220, '5': 300, '6': 400 },
    'csl': { '1': 170, '2': 140, '3': 120, '4': 220, '5': 300, '6': 400 },
    'pacifico': { '1': 250, '2': 220, '3': 220, '4': 180, '5': 300, '6': 400 }
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
          <CustomerPhotosWidget lang={lang} />

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
                src={`https://maps.google.com/maps?saddr=${encodeURIComponent('Aeropuerto Internacional de Los Cabos')}&daddr=${encodeURIComponent(seoData.nombre + ' Los Cabos')}&output=embed`}
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
                    {/* NUEVO CONTENIDO SEO DE RESTAURANTES (BILINGÜE) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm mt-12 mb-10 space-y-8">
            {/* Intro */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                {lang === 'es' ? `Transporte Privado a ${seoData.nombre}` : `Private Transportation to ${seoData.nombre}`}
              </h2>
              <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                {lang === 'es' 
                  ? `Disfruta de un servicio de transporte privado premium a ${seoData.nombre}, uno de los destinos gastronómicos más populares en Los Cabos. Ya sea que estés celebrando una ocasión especial, planeando una cena romántica o simplemente buscando una experiencia culinaria inolvidable, Ballard Tours te ofrece transporte de lujo directo a ${seoData.nombre} con choferes profesionales y vehículos premium.` 
                  : `Enjoy a premium private transportation service to ${seoData.nombre}, one of the most popular dining destinations in Los Cabos. Whether you are celebrating a special occasion, planning a romantic dinner, or simply looking for an unforgettable culinary experience, Ballard Tours provides luxury transportation directly to ${seoData.nombre} with professional chauffeurs and premium vehicles.`}
              </p>
              <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                {lang === 'es'
                  ? `Evita las molestias de buscar estacionamiento, esperar taxis o lidiar con las restricciones de aplicaciones de viaje compartido. Nuestro transporte privado a ${seoData.nombre} garantiza una experiencia fluida, cómoda y sin preocupaciones desde el momento en que te recogemos hasta que regresas a salvo a tu hotel.`
                  : `Avoid the hassle of finding parking, waiting for taxis, or dealing with rideshare restrictions. Our private transportation to ${seoData.nombre} guarantees a smooth, comfortable, and worry-free experience from the moment we pick you up until you safely return to your hotel.`}
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
                    ? `Nuestro servicio de transporte de lujo a ${seoData.nombre} está diseñado para viajeros que valoran la comodidad, la seguridad y la puntualidad.`
                    : `Our luxury transportation service to ${seoData.nombre} is designed for travelers who value comfort, safety, and punctuality.`}
                </p>
                <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Ya sea que te hospedes en Cabo San Lucas, San José del Cabo, el Corredor Turístico, Palmilla, Puerto Los Cabos o cualquier villa privada, te llevaremos directamente a ${seoData.nombre} en una de nuestras SUVs de lujo o Mercedes Sprinter Vans.`
                    : `Whether you're staying in Cabo San Lucas, San José del Cabo, the Tourist Corridor, Palmilla, Puerto Los Cabos, or any private villa, we'll take you directly to ${seoData.nombre} in one of our luxury SUVs or Mercedes Sprinter Vans.`}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `¿Por qué Reservar Transporte a ${seoData.nombre}?` : `Why Book Transportation to ${seoData.nombre}?`}
                </h3>
                <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Cenar en ${seoData.nombre} debe ser una experiencia relajante de principio a fin. En lugar de preocuparte por direcciones, estacionamiento, tráfico o encontrar transporte después de cenar, reserva tu traslado privado a ${seoData.nombre} y déjanos encargarnos de todo.`
                    : `Dining at ${seoData.nombre} should be a relaxing experience from beginning to end. Instead of worrying about directions, parking, traffic, or finding transportation after dinner, reserve your private transfer to ${seoData.nombre} and let us handle everything.`}
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Muchos visitantes disfrutan de cócteles o vino durante la cena en ${seoData.nombre}, lo que hace que el transporte privado sea la opción más segura y conveniente.`
                    : `Many visitors enjoy cocktails or wine during dinner at ${seoData.nombre}, making private transportation the safest and most convenient option.`}
                </p>
              </div>
            </div>

            {/* Listas Inclusiones y Vehículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-slate-400" size={20}/> 
                  {lang === 'es' ? `Cada traslado a ${seoData.nombre} incluye:` : `Every transfer to ${seoData.nombre} includes:`}
                </h3>
                <ul className="space-y-2 mb-4">
                  {(lang === 'es' ? [
                    'Vehículo privado',
                    'Chofer profesional bilingüe',
                    'Aire acondicionado',
                    'Agua embotellada de cortesía',
                    'Cerveza de cortesía',
                    'Cómodos asientos de piel',
                    'Servicio al cliente con calidad de vuelo',
                    'Transporte puerta a puerta'
                  ] : [
                    'Private vehicle',
                    'Professional bilingual chauffeur',
                    'Air conditioning',
                    'Complimentary bottled water',
                    'Complimentary beer',
                    'Comfortable leather seating',
                    'Flight-quality customer service',
                    'Door-to-door transportation'
                  ]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Car className="text-slate-400" size={20}/> 
                  {lang === 'es' ? `Vehículos de Lujo` : `Luxury Vehicles`}
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                  {lang === 'es' 
                    ? `Elige de nuestra flota premium:` 
                    : `Choose from our premium fleet:`}
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    'Cadillac Escalade',
                    'Chevrolet Suburban',
                    'GMC Yukon XL',
                    'Mercedes Sprinter Vans'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-slate-600 text-sm">
                  {lang === 'es' 
                    ? `Cada vehículo utilizado para el transporte a ${seoData.nombre} es limpiado, desinfectado y mantenido profesionalmente con los más altos estándares.` 
                    : `Every vehicle used for transportation to ${seoData.nombre} is professionally cleaned, sanitized, and maintained to the highest standards.`}
                </p>
              </div>
            </div>

            {/* Viajes Redondos y Desde cualquier hotel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Transporte Redondo a ${seoData.nombre}` : `Round Trip Transportation to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 mb-3 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `La mayoría de nuestros huéspedes eligen transporte redondo a ${seoData.nombre}. Tu chofer te llevará directamente a ${seoData.nombre}, esperará cerca durante tu reservación, y te regresará a salvo a tu hotel, resort, Airbnb o residencia privada cuando estés listo.`
                    : `Most of our guests choose round-trip transportation to ${seoData.nombre}. Your chauffeur will drive you directly to ${seoData.nombre}, wait nearby during your reservation, and return you safely to your hotel, resort, Airbnb, or private residence whenever you're ready.`}
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  {lang === 'es'
                    ? `No hay necesidad de pedir otro viaje o buscar transporte tarde por la noche. Tu chofer privado ya te estará esperando después de tu cena en ${seoData.nombre}.`
                    : `There is no need to request another ride or search for transportation late at night. Your private driver will already be waiting for you after your dinner at ${seoData.nombre}.`}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Transporte Desde Cualquier Hotel a ${seoData.nombre}` : `Transportation from Any Hotel to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 mb-4 text-sm md:text-base leading-relaxed">
                  {lang === 'es'
                    ? `Brindamos transporte desde cada resort importante en Los Cabos a ${seoData.nombre}, incluyendo hoteles ubicados en:`
                    : `We provide transportation from every major resort in Los Cabos to ${seoData.nombre}, including hotels located in:`}
                </p>
                <div className="columns-2 gap-4 text-sm text-slate-700 mb-4">
                  <ul className="space-y-1">
                    {[
                      'Cabo San Lucas',
                      'San José del Cabo',
                      'Tourist Corridor',
                      'Puerto Los Cabos',
                      'Palmilla',
                      'Diamante',
                      'Quivira',
                      'East Cape'
                    ].map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  {lang === 'es'
                    ? `Sin importar dónde te hospedes, proveeremos transporte de lujo directo a ${seoData.nombre}.`
                    : `No matter where you're staying, we'll provide direct luxury transportation to ${seoData.nombre}.`}
                </p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Ocasiones Especiales y Transporte Seguro de Noche */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {lang === 'es' ? `Perfecto para Ocasiones Especiales` : `Perfect for Special Occasions`}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {lang === 'es' 
                    ? `Muchos invitados reservan transporte a ${seoData.nombre} para: Cenas románticas, Propuestas de matrimonio, Lunas de miel, Aniversarios, Cumpleaños, Cenas familiares, Cenas corporativas, Despedidas de soltero/a, o celebraciones vacacionales. Nuestros choferes profesionales hacen que la llegada a ${seoData.nombre} sea parte de la experiencia de lujo.` 
                    : `Many guests reserve transportation to ${seoData.nombre} for: Romantic dinners, Marriage proposals, Honeymoons, Wedding anniversaries, Birthday celebrations, Family dinners, Corporate dinners, Bachelor/Bachelorette parties, Vacation celebrations. Our professional chauffeurs make arriving at ${seoData.nombre} part of the luxury experience.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {lang === 'es' ? `Transporte Seguro a ${seoData.nombre} por la Noche` : `Safe Transportation to ${seoData.nombre} at Night`}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {lang === 'es' 
                    ? `El transporte nocturno en Los Cabos a veces puede ser difícil, especialmente después de que cierran los restaurantes. En lugar de buscar un taxi o esperar la disponibilidad de rideshare, tu transporte privado a ${seoData.nombre} está reservado por adelantado. Nuestros choferes con licencia saben exactamente cómo llegar a ${seoData.nombre}, monitorean el tráfico local y proveen un regreso seguro a tu destino.` 
                    : `Nighttime transportation in Los Cabos can sometimes be difficult, especially after restaurants close. Instead of searching for a taxi or waiting for rideshare availability, your private transportation to ${seoData.nombre} is reserved in advance. Our licensed drivers know exactly how to reach ${seoData.nombre}, monitor local traffic conditions, and provide safe transportation back to your destination.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {lang === 'es' ? `Servicio de Chofer Privado a ${seoData.nombre}` : `Private Chauffeur Service to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {lang === 'es' 
                    ? `Nuestro servicio de chofer ofrece mucho más que un simple viaje. Tu conductor llega a tiempo, te ayuda a abordar, brinda recomendaciones locales y se asegura de que cada traslado a ${seoData.nombre} sea cómodo y libre de estrés. Ballard Tours se ha convertido en una de las compañías de transporte preferidas para los huéspedes que visitan ${seoData.nombre} debido a nuestra confiabilidad y excepcional servicio al cliente.` 
                    : `Our chauffeur service offers much more than a simple ride. Your driver arrives on time, assists with boarding, provides local recommendations, and ensures every transfer to ${seoData.nombre} is comfortable and stress-free. Ballard Tours has become one of the preferred transportation companies for guests visiting ${seoData.nombre} because of our reliability and exceptional customer service.`}
                </p>
              </div>
            </div>

            {/* Puntos Avanzados SEO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Nunca Pierdas tu Reservación en ${seoData.nombre}` : `Never Miss Your Reservation at ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'es' 
                    ? `Asegurar una mesa en los mejores lugares gastronómicos de Los Cabos puede tomar meses de planeación. Debido a que los lugares premium hacen cumplir estrictamente sus tiempos de tolerancia, llegar tarde no es una opción. Al reservar nuestro transporte privado a ${seoData.nombre}, aseguras absoluta puntualidad. Tu chofer personal planificará la ruta más eficiente, esquivando el tráfico pesado, garantizando que llegues a las puertas de ${seoData.nombre} exactamente a tiempo para sentarte.` 
                    : `Securing a table at top Los Cabos dining spots can take months of planning. Because premium venues strictly enforce their reservation grace periods, arriving late is not an option. By booking our private transportation to ${seoData.nombre}, you ensure absolute punctuality. Your personal chauffeur will map out the most efficient route, bypassing heavy traffic and peak-hour congestion, guaranteeing you arrive at the doors of ${seoData.nombre} exactly on time to be seated.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Disfruta el Vino y la Mixología en ${seoData.nombre} con Seguridad` : `Enjoy Wine Pairings and Mixology at ${seoData.nombre} Safely`}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'es' 
                    ? `Uno de los puntos destacados de visitar ${seoData.nombre} es deleitarse con su selección de vinos de clase mundial, cócteles de autor y degustaciones de tequila. Al reservar un viaje privado a ${seoData.nombre}, estás eligiendo la forma más segura de disfrutar tu velada. Nunca te preocupes por conductores designados o manejar de noche. Tu transporte de lujo a ${seoData.nombre} permite que todos en tu grupo disfruten la experiencia en ${seoData.nombre} con total tranquilidad.` 
                    : `One of the highlights of visiting ${seoData.nombre} is indulging in their world-class wine selection, signature cocktails, and tequila tastings. When you book a private ride to ${seoData.nombre}, you are choosing the safest way to enjoy your evening. Never worry about designated drivers or navigating unfamiliar roads at night. Your luxury transportation to ${seoData.nombre} allows everyone in your party to fully enjoy the culinary experience at ${seoData.nombre} with total peace of mind.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Paradas Previas en Camino a ${seoData.nombre}` : `Pre-Dinner Stops on Your Way to ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'es' 
                    ? `¿Quieres ver el atardecer, tomar fotos panorámicas o tomar un trago rápido en un bar local antes de tu reserva en ${seoData.nombre}? Ofrecemos flexibilidad total. Al agendar tu transporte VIP a ${seoData.nombre}, puedes solicitar paradas personalizadas. Haz que tu trayecto a ${seoData.nombre} sea parte integral de la aventura.` 
                    : `Do you want to watch the sunset, take scenic photos, or grab a quick drink at a local bar before your reservation at ${seoData.nombre}? We offer complete flexibility. When you schedule your VIP transportation to ${seoData.nombre}, you can request customized stops along the way. Make your journey to ${seoData.nombre} an integral part of your evening's adventure.`}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {lang === 'es' ? `Cenas Corporativas en ${seoData.nombre}` : `Corporate Dinners at ${seoData.nombre}`}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {lang === 'es' 
                    ? `Si eres el anfitrión de clientes o ejecutivos para una cena de negocios en ${seoData.nombre}, la primera impresión cuenta. Llegar en una impecable Cadillac Escalade o Mercedes Sprinter marca un tono de profesionalismo y éxito. Proveemos transporte ejecutivo de primer nivel a ${seoData.nombre}, alineado a tus altos estándares. También ofrecemos facturación detallada para todo tu transporte corporativo a ${seoData.nombre}.` 
                    : `If you are hosting clients or executives for a business dinner at ${seoData.nombre}, first impressions matter. Arriving in a pristine Cadillac Escalade or Mercedes Sprinter Van sets a tone of professionalism and success. We provide discreet, top-tier executive transportation to ${seoData.nombre} that aligns perfectly with the high standards of your business.`}
                </p>
              </div>
            </div>

            {/* Comparación de Opciones Table */}
            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg overflow-hidden">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">{lang === 'es' ? 'Característica' : 'Feature'}</th>
                    <th scope="col" className="px-6 py-3">{lang === 'es' ? `Ballard Tours a ${seoData.nombre}` : `Ballard Tours to ${seoData.nombre}`}</th>
                    <th scope="col" className="px-6 py-3">{lang === 'es' ? `Taxis / Rideshare a ${seoData.nombre}` : `Standard Taxis to ${seoData.nombre}`}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-slate-100">
                    <td className="px-6 py-4 font-bold">{lang === 'es' ? 'Puntualidad' : 'Punctuality'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{lang === 'es' ? 'Pre-agendado, esperándote en tu hotel' : 'Pre-scheduled, waiting for you at your hotel'}</td>
                    <td className="px-6 py-4 text-red-700">{lang === 'es' ? 'Tiempos de espera impredecibles' : 'Unpredictable wait times'}</td>
                  </tr>
                  <tr className="bg-white border-b border-slate-100">
                    <td className="px-6 py-4 font-bold">{lang === 'es' ? 'Precios' : 'Pricing'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{lang === 'es' ? `Tarifa fija garantizada a ${seoData.nombre}` : `Flat-rate, guaranteed price to ${seoData.nombre}`}</td>
                    <td className="px-6 py-4 text-red-700">{lang === 'es' ? 'Tarifas dinámicas en horas pico' : 'Surge pricing during busy dinner hours'}</td>
                  </tr>
                  <tr className="bg-white border-b border-slate-100">
                    <td className="px-6 py-4 font-bold">{lang === 'es' ? 'Vehículos' : 'Vehicles'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{lang === 'es' ? 'Luxury SUVs y Sprinter Vans' : 'Luxury SUVs and Sprinter Vans'}</td>
                    <td className="px-6 py-4 text-red-700">{lang === 'es' ? 'Calidad de vehículo estándar e impredecible' : 'Standard, unpredictable vehicle quality'}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-bold">{lang === 'es' ? 'Privacidad' : 'Privacy'}</td>
                    <td className="px-6 py-4 text-green-700 font-medium">{lang === 'es' ? `100% transporte privado a ${seoData.nombre}` : `100% private transportation to ${seoData.nombre}`}</td>
                    <td className="px-6 py-4 text-red-700">{lang === 'es' ? 'Opciones compartidas' : 'Shared options or unvetted drivers'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Why Travelers Choose Ballard Tours & Keywords */}
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-lg mt-8">
              <h3 className="text-xl font-bold mb-3">
                {lang === 'es' ? `¿Por qué los viajeros eligen Ballard Tours para ir a ${seoData.nombre}?` : `Why Travelers Choose Ballard Tours for ${seoData.nombre}?`}
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
                {lang === 'es' 
                  ? `Miles de viajeros nos eligen para su transporte a ${seoData.nombre} porque ofrecemos:` 
                  : `Thousands of travelers choose Ballard Tours for transportation to ${seoData.nombre} because we offer:`}
              </p>
              <div className="columns-2 gap-4 text-sm text-slate-300 mb-6">
                <ul className="space-y-1 font-medium">
                  {(lang === 'es' ? [
                    'Transporte privado únicamente',
                    'Sin shuttles compartidos',
                    'Precios fijos',
                    'Sin tarifas dinámicas',
                    'Sin cargos ocultos',
                    'Choferes con licencia',
                    'Vehículos de lujo',
                    'Bebidas de cortesía',
                    'Soporte bilingüe',
                    'Asistencia por WhatsApp',
                    'Reservaciones fáciles en línea',
                    'Disponibilidad 24/7'
                  ] : [
                    'Private transportation only',
                    'No shared shuttles',
                    'Flat-rate pricing',
                    'No surge pricing',
                    'No hidden fees',
                    'Professional licensed drivers',
                    'Luxury vehicles',
                    'Complimentary beverages',
                    'Bilingual customer support',
                    'WhatsApp assistance',
                    'Easy online reservations',
                    '24/7 availability'
                  ]).map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-bold">
                {lang === 'es' 
                  ? `Ya sea que visites Los Cabos por primera vez o regreses de nuevo, el transporte a ${seoData.nombre} debe ser tan memorable como la experiencia culinaria misma. Asegura tu traslado de lujo a ${seoData.nombre}, transporte privado a ${seoData.nombre}, o un servicio de chofer a ${seoData.nombre} con nosotros para un viaje sin estrés desde Cabo San Lucas, San José del Cabo o cualquier hotel hasta ${seoData.nombre}.` 
                  : `Whether you're visiting Los Cabos for the first time or returning for another vacation, transportation to ${seoData.nombre} should be as memorable as the dining experience itself. Secure your luxury transportation to ${seoData.nombre}, private transportation to ${seoData.nombre}, or chauffeur service to ${seoData.nombre} with us for a stress-free ride from Cabo San Lucas, San Jose del Cabo or your hotel to ${seoData.nombre}.`}
              </p>
            </div>
          </section>
          <FAQAccordion type="restaurant" locationName={seoData.nombre} lang={lang} />

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
              <p>{lang === 'es' ? 'El servicio redondo incluye hasta 3 horas de espera en el restaurante.' : 'Round-trip service includes up to 3 hours of waiting time at the restaurant.'}</p>
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
                  value={busquedaCenaOrigen}
                  onChange={(e) => {
                    setBusquedaCenaOrigen(e.target.value);
                    setMostrarDropdownCena(true);
                    if (e.target.value === '') setCenaOrigen('');
                  }}
                  onFocus={() => setMostrarDropdownCena(true)}
                  onBlur={() => setTimeout(() => setMostrarDropdownCena(false), 200)}
                  className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 transition-colors text-sm"
                />
                {mostrarDropdownCena && (
                  <ul className="absolute z-50 w-full bg-white border border-slate-200 shadow-xl max-h-60 overflow-y-auto rounded-xl mt-1 top-full left-0">
                    {catalogoHoteles.filter(h => (busquedaCenaOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map((hotel, idx) => (
                      <li
                        key={`${hotel.id}-${idx}`}
                        onMouseDown={() => {
                          const zona = hotel.zonaId || hotel.zona || "1";
                          setCenaOrigen(`${hotel.nombre}|${zona}`);
                          setBusquedaCenaOrigen(hotel.nombre);
                          setMostrarDropdownCena(false);
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

              {/* TIPO DE VEHÍCULO (COMO EN OTRAS URLS DE RESERVA) */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  {lang === 'es' ? 'Tipo de Vehículo (Viaje Redondo)' : 'Vehicle Type (Round Trip)'}
                </label>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Opcion Luxury SUV */}
                  <button
                    type="button"
                    onClick={() => setCenaPax('1-4')}
                    className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${cenaPax !== '9-10' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-start w-full mb-2">
                      <span className="font-bold text-slate-900">Luxury SUV</span>
                      <Car size={18} className={cenaPax !== '9-10' ? 'text-blue-900' : 'text-slate-400'} />
                    </div>
                    <p className="text-[10px] text-slate-500 mb-4 leading-tight">
                      {lang === 'es' ? 'Elegancia y confort para parejas, familias o grupos pequeños.' : 'Elegance and comfort for couples, families, or small groups.'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                        <Users size={12} /> {lang === 'es' ? 'MÁX 6 PAX' : 'MAX 6 PAX'}
                      </div>
                      <span className="font-black text-slate-900 text-sm">
                        ${cenaOrigen && cenaDestino ? Number(matrizPreciosCenas[cenaDestino]?.[String(cenaOrigen.split('|')[1]) || '1'] || 120) : Number(matrizPreciosCenas[cenaDestino]?.[String(seoData.zona || 1)] || 120)}
                      </span>
                    </div>
                  </button>

                  {/* Opcion Van */}
                  <button
                    type="button"
                    onClick={() => setCenaPax('9-10')}
                    className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${cenaPax === '9-10' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-start w-full mb-2">
                      <span className="font-bold text-slate-900">Van</span>
                      <Car size={18} className={cenaPax === '9-10' ? 'text-blue-900' : 'text-slate-400'} />
                    </div>
                    <p className="text-[10px] text-slate-500 mb-4 leading-tight">
                      {lang === 'es' ? 'Amplitud y lujo en Sprinter para grupos grandes.' : 'Spaciousness and luxury in a Sprinter for large groups.'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                        <Users size={12} /> {lang === 'es' ? 'MÁX 10 PAX' : 'MAX 10 PAX'}
                      </div>
                      <span className="font-black text-slate-900 text-sm">
                        ${(cenaOrigen && cenaDestino ? Number(matrizPreciosCenas[cenaDestino]?.[String(cenaOrigen.split('|')[1]) || '1'] || 120) : Number(matrizPreciosCenas[cenaDestino]?.[String(seoData.zona || 1)] || 120)) + 45}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* FECHA Y PASAJEROS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    {lang === 'es' ? 'Fecha de Cena' : 'Dinner Date'}
                  </label>
                  <input
                    type="date"
                    value={cenaFecha}
                    onChange={(e) => setCenaFecha(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    {lang === 'es' ? 'Pasajeros' : 'Passengers'}
                  </label>
                  <select
                    value={cenaPax}
                    onChange={(e) => setCenaPax(e.target.value)}
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
                    value={cenaHora}
                    onChange={(e) => setCenaHora(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    {lang === 'es' ? 'Hora Regreso' : 'Return Time'}
                  </label>
                  <input
                    type="time"
                    value={cenaHoraRegreso}
                    onChange={(e) => setCenaHoraRegreso(e.target.value)}
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
                      {totalPrecioCena > 0
                        ? (lang === 'es' ? 'Impuestos y espera incluidos' : 'Taxes & 3h wait time included')
                        : (lang === 'es' ? 'Selecciona tu hotel para cotizar' : 'Select your hotel for exact rate')}
                    </span>
                  </div>
                  <div className="text-right">
                    {totalPrecioCena > 0 ? (
                      <span className="text-2xl font-black text-slate-900">${granTotalCena} <span className="text-xs font-bold text-slate-500">USD</span></span>
                    ) : (
                      <span className="text-sm font-black text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 inline-block">
                        {lang === 'es' ? 'Desde $120 USD' : 'From $120 USD'}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!cenaOrigen || !cenaDestino || !cenaFecha || !cenaHora || !cenaHoraRegreso) {
                      alert(lang === 'es' ? 'Por favor selecciona tu hotel, fecha y horarios para continuar.' : 'Please select your hotel, date, and times to continue.');
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
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all text-base bg-blue-900 hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20"
                >
                  <Plus size={18} className="mr-2" /> {lang === 'es' ? 'Reservar Traslado Redondo' : 'Book Round-Trip Transfer'}
                </button>
              </div>

              <TrustBadges lang={lang} showFlightMonitoring={false} />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================= */}
      {/* SECCIÓN FINAL: OTROS RESTAURANTES Y BENEFICIOS */}
      {/* ========================================= */}
      <div className="max-w-6xl mx-auto px-4 pb-16 mt-10">

        {/* OTROS RESTAURANTES POPULARES EN LOS CABOS (MISMO DISEÑO DE CARDS CON IMAGEN QUE HOTELES) */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold text-blue-900 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-3">
                {lang === 'es' ? 'Gastronomía en Los Cabos' : 'Fine Dining Destinations'}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {lang === 'es' 
                  ? 'Otros Restaurantes Populares en Los Cabos' 
                  : 'Other Popular Restaurants in Los Cabos'}
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl font-medium">
                {lang === 'es'
                  ? 'Descubre opciones de transporte privado redondo con chofer bilingüe y hasta 3 horas de espera incluida en los mejores restaurantes de Los Cabos.'
                  : 'Discover private round-trip dinner transfer options with bilingual chauffeurs and up to 3 hours of waiting time included at top restaurants in Los Cabos.'}
              </p>
            </div>
            <Link 
              href={`/${lang}/dinners`}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 shrink-0 group self-start md:self-auto"
            >
              <span>{lang === 'es' ? 'Ver todos los restaurantes' : 'View all restaurants'}</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantSEOData
              .filter(r => r.slug !== slug)
              .sort((a, b) => (a.zona === seoData.zona ? -1 : 1) - (b.zona === seoData.zona ? -1 : 1))
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/${lang}/restaurants/${item.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-900/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img 
                      src={`/${item.imageDiners || item.image || 'diners-sjc.webp'}`} 
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
                          <Clock size={13} className="text-slate-400" /> {lang === 'es' ? '3 hrs espera incl.' : '3 hrs wait incl.'}
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
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{lang === 'es' ? 'Nos esforzamos por responder rápido. Contáctanos por WhatsApp al +52 612 194 3286 en cualquier momento.' : 'We strive to respond as quickly as possible. Reach out via WhatsApp at +52 612 194 3286 anytime.'}</p>
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
              ? 'Sitio web de reservación fácil en tres clics en Ballard Tours. Simplemente ingrese su hotel de origen, elija su horario de cena y haga clic en reservar. Al final del formulario, encontrará la sección de pago, donde puede seleccionar entre pagar de forma segura con tarjeta de crédito, optar por el pago a la llegada a su chofer, o usar PayPal para mayor comodidad.'
              : 'Easy three-click booking website at Ballard Tours. Simply enter your departure hotel, choose your dinner schedule, and click book. At the end of the form, you will find the payment section, where you can select from paying securely by credit card, opting for cash payment on arrival to your driver, or using PayPal for added convenience.'}
          </p>
        </div>
      </div>
    </div>
  );
}
