// src/app/[lang]/tours/page.js
'use client';

import React, { useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  ChevronRight, 
  MessageCircle, 
  Phone, 
  Mail,
  Calendar,
  Baby,
  Banknote,
  Users,
  Star,
  MapPin,
  ShieldCheck
} from 'lucide-react';
// Ajusta la ruta a tu componente FAQ según tu estructura de carpetas
import { FAQSection } from '../../../components/FAQSection';

export default function ToursPage({ params }) {
  // Desenvolvemos los params para Next.js 15
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const content = {
    es: {
      seoTitle: "Tours y Excursiones en Los Cabos | Ballard Tours",
      seoDesc: "Descubre los mejores tours en Cabo San Lucas. Reserva paseos en camello, ATVs, bote transparente al arco, snorkel, nado con tiburón ballena y más.",
      title: "Explora Los Cabos.",
      subtitle: "Nuestros Mejores Tours y Actividades",
      introTitle: "La Aventura Te Espera",
      introText1: "Los Cabos es mucho más que hermosas playas y hoteles de lujo; es un paraíso de aventuras inigualables. En Ballard Tours, hemos seleccionado cuidadosamente las mejores experiencias y excursiones para que aproveches al máximo tu visita.",
      introText2: "Siente la adrenalina en nuestro Safari en Camellos o la Aventura en ATVs. Explora el océano en el Bote Transparente al Arco, el Snorkel VIP o el Tour de Snorkel en la Bahía. Para experiencias únicas, embárcate en el Nado con Tiburón Ballena o visita la Isla Espíritu Santo. Si prefieres relajarte, disfruta de nuestros atardeceres en cruceros o el famoso San José Art Walk.",
      priceFrom: "Precio desde",
      contactTitle: "Atención y Reservas Rápidas",
      contactSubtitle: "¿Tienes dudas sobre un tour o prefieres reservar por teléfono? Nuestro equipo está listo para ayudarte.",
      
      // Textos de Flota
      fleetTitle: "Nuestra Flota",
      fleetSubtitle: "Completa tu viaje con nuestro servicio de traslado de primer nivel.",
      vanTitle: "Transporte para Grupos",
      vanText1: "Viajar en grupo a Los Cabos nunca ha sido tan cómodo. Nuestras Sprinter y Hiace Vans transportan hasta 10 pasajeros con equipaje sin sacrificar comodidad.",
      vanText2: "Dividir el costo de una Van privada resulta mucho más económico. Equipadas con aire acondicionado de doble zona y asientos ergonómicos.",
      vipTitle: "Servicios Privados VIP",
      vipText1: "Para máxima exclusividad, ofrecemos nuestro Servicio VIP en SUVs de lujo como Chevrolet Suburban. Un viaje sumamente silencioso y elegante.",
      vipText2: "Recogidas directas en pistas de Aeropuertos Privados (MMSL y SJD FBO). Choferes de etiqueta con bebidas de cortesía y toallas refrescantes.",
      airbnbTitle: "Traslados a AirBnBs y Villas",
      airbnbText1: "Expertos en logística hacia Villas Privadas. Conocemos a la perfección las entradas de comunidades cerradas como Pedregal, Palmilla y Diamante.",
      airbnbText2: "Solicita una parada de compras (Grocery Stop) en Costco o Walmart y llega a tu Villa con la despensa llena y bebidas frías.",
      hotelsTitle: "Cobertura a Todos los Hoteles",
      hotelsText1: "Traslados seguros a: Nobu, Hard Rock, Diamante, Pueblo Bonito, Waldorf Astoria, Grand Velas, JW Marriott y muchos más.",
      hotelsText2: "Tomamos la ruta de cuota (Toll Road) pagada por nosotros, para garantizar el viaje más rápido. Directo del aeropuerto SJD al lobby.",

      benefitsTitle: "Beneficios de Reservar",
      faqTitle: "Preguntas Frecuentes",
      faqSubtitle: "Todo lo que necesitas saber sobre logística y servicios.",
      paymentTitle: "Reserva Fácil y Segura",
      paymentText: "Sitio web de reservación fácil en tres clics en Ballard Tours. Selecciona tu destino, elige tu transporte y reserva. Paga con tarjeta de crédito, al llegar o usa PayPal."
    },
    en: {
      seoTitle: "Best Cabo Tours & Excursions | Ballard Tours",
      seoDesc: "Discover the best tours in Cabo San Lucas. Book camel rides, ATVs, clear boat to the arch, snorkeling, whale shark swims, and more.",
      title: "Explore Los Cabos.",
      subtitle: "Our Top Rated Tours & Activities",
      introTitle: "Adventure Awaits",
      introText1: "Los Cabos is much more than beautiful beaches and luxury resorts; it is a paradise of unparalleled adventures. At Ballard Tours, we have carefully selected the absolute best experiences and excursions so you can make the most of your visit.",
      introText2: "Feel the adrenaline on our Camel Safari or the ATV Adventure. Explore the ocean on the Clear Boat to the Arch, the VIP Snorkel, or the Bay Snorkel Tour. For unique experiences, embark on the Whale Shark Swim or visit Espíritu Santo Island. If you prefer to relax, enjoy our sunset cruises or the famous San José Art Walk.",
      priceFrom: "Price from",
      contactTitle: "Quick Support & Reservations",
      contactSubtitle: "Have questions about a tour or prefer to book over the phone? Our team is ready to help.",
      
      // Fleet Texts
      fleetTitle: "Our Fleet",
      fleetSubtitle: "Complete your trip with our premium transfer service.",
      vanTitle: "Group Van Transportation",
      vanText1: "Traveling as a group to Los Cabos has never been more comfortable. Our Sprinter and Hiace Vans transport up to 10 passengers with luggage.",
      vanText2: "Splitting the cost of a private Van is much more cost-effective. Equipped with dual-zone AC and ergonomic seating.",
      vipTitle: "VIP Private Services",
      vipText1: "For maximum exclusivity, we offer our VIP Service in luxury SUVs such as the Chevrolet Suburban. An incredibly quiet and elegant ride.",
      vipText2: "Tarmac-side pickups at Private Airports (MMSL and SJD FBO). Sharply dressed chauffeurs await with complimentary drinks and refreshing towels.",
      airbnbTitle: "Transfers to AirBnBs & Villas",
      airbnbText1: "Experts in logistics for Private Villas. We perfectly know the strict security protocols of gated communities like Pedregal, Palmilla, and Diamante.",
      airbnbText2: "Request a Grocery Stop at Costco or Walmart and arrive at your Villa with a fully stocked fridge and cold drinks.",
      hotelsTitle: "Full Coverage to All Resorts",
      hotelsText1: "Safe transfers to: Nobu, Hard Rock, Diamante, Pueblo Bonito, Waldorf Astoria, Grand Velas, JW Marriott, and many more.",
      hotelsText2: "We always take the Toll Road—paid by us—to guarantee the fastest trip. Straight from the SJD airport to your hotel lobby.",

      benefitsTitle: "Benefits of Booking",
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Everything you need to know about our logistics and services.",
      paymentTitle: "Easy & Secure Booking",
      paymentText: "Three-click easy reservation website at Ballard Tours. Select your destination, choose your shuttle type, and book. Pay with credit card, on arrival, or use PayPal."
    }
  };

  const t = content[lang] || content.en;

  const toursList = [
    {
      id: 'camellos',
      slug: 'camel-safari-tour-cabo-san-lucas',
      image: 'camello4.webp',
      duration: { es: '2 horas', en: '2 hours' },
      title: { es: 'Safari en Camellos', en: 'Camel Safari' },
      desc: { 
        es: 'Descubre un paseo único en camellos en nuestro Centro de Conservación de Fauna Silvestre. Tu guía te llevará en un safari por el desierto...', 
        en: 'Discover a unique camel ride at our Wildlife Conservation Center. Your guide will take you on a desert safari to our sanctuary...' 
      },
      price: 190
    },
    {
      id: 'atv',
      slug: 'atv-off-road-adventure-cabo',
      image: '2.webp',
      duration: { es: '3 horas', en: '3 hours' },
      title: { es: 'Aventura en ATVs', en: 'ATV Adventure' },
      desc: { 
        es: 'Siente la adrenalina pura recorriendo cañones, arroyos secos y hermosas playas en vehículos todo terreno.', 
        en: 'Feel pure adrenaline exploring canyons, dry streams, and beautiful beaches on all-terrain vehicles.' 
      },
      price: 190
    },
    {
      id: 'arco',
      slug: 'clear-boat-tour-cabo-arch',
      image: 'B7.webp',
      duration: { es: '45 minutos', en: '45 minutes' },
      title: { es: 'Bote Transparente al Arco', en: 'Clear Boat al Arco' },
      desc: { 
        es: 'Navega hacia el icónico Arco, la Playa del Amor y la colonia de leones marinos en nuestra famosa embarcación transparente.', 
        en: 'Sail to the iconic Arch, Lover\'s Beach, and the sea lion colony in our famous clear boat.' 
      },
      price: 100
    },
    {
      id: 'snorkeling-adventure-cabo',
      slug: 'vip-snorkeling-sea-scooter-cabo-san-lucas',
      image: 'snorkeling-trip-cabo-san-lucas.webp',
      duration: { es: '3 horas', en: '3 hours' },
      title: { es: 'Snorkel VIP con Scooters', en: 'VIP Snorkeling with Sea Scooters' },
      desc: { 
        es: '¡Haz snorkel en la costa de Baja en Cabo como un profesional! Deslízate junto a tortugas marinas, peces cirujanos y mantarrayas.', 
        en: 'Snorkel the Baja coast like a pro! Glide alongside sea turtles, surgeonfish, and manta rays in Chileno Bay.' 
      },
      price: 180
    },
    {
      id: 'artwalk',
      slug: 'san-jose-del-cabo-art-walk-tour',
      image: 'downtown-san-jose-del-cabo-art-walk-los-cabos.webp',
      duration: { es: '3 horas', en: '3 hours' },
      title: { es: 'San José Art Walk', en: 'San José Art Walk' },
      desc: { 
        es: 'Sumérgete en la magia y el encanto de las calles empedradas de San José del Cabo admirando impresionantes galerías de arte.', 
        en: 'Immerse yourself in the magic and charm of the cobblestone streets of San José del Cabo admiring stunning art galleries.' 
      },
      price: 180
    },
    {
      id: 'tiburon_ballena',
      slug: 'swim-with-whale-sharks-la-paz-cabo',
      image: 'swimming-whale-shark-la-paz.webp',
      duration: { es: '2.5 horas', en: '2.5 hours' },
      title: { es: 'Nado con Tiburón Ballena', en: 'Whale Shark Swim' },
      desc: { 
        es: 'Vive una de las experiencias más conmovedoras de la naturaleza nadando junto al gentil gigante del océano en La Paz.', 
        en: 'Live one of nature\'s most moving experiences swimming alongside the gentle giant of the ocean in La Paz.' 
      },
      price: 330
    },
    {
      id: 'isla_espiritu_santo',
      slug: 'espiritu-santo-island-tour-from-la-paz',
      image: 'espiritu-santo-island-tour-la-paz-baja.webp',
      duration: { es: '5 horas', en: '5 hours' },
      title: { es: 'Isla Espíritu Santo', en: 'Espíritu Santo Island' },
      desc: { 
        es: 'Descubre la joya del Mar de Cortés. Disfrutarás de paisajes prístinos, aguas turquesa y nado con lobos marinos.', 
        en: 'Discover the jewel of the Sea of Cortez. Enjoy pristine landscapes, turquoise waters, and swimming with sea lions.' 
      },
      price: 330
    },
    {
      id: 'sunset_fajita_cruise',
      slug: 'sunset-fajita-cruise-cabo',
      image: 'Sunset-Fajitas-1.webp',
      duration: { es: '2 Horas', en: '2 Hours' },
      title: { es: 'Crucero Sunset Fajitas', en: 'Sunset Fajita Cruise' },
      desc: { 
        es: 'Zarpa a bordo de Cabo Escape para una animada experiencia al atardecer. Disfruta de fajitas recién hechas y barra libre.', 
        en: 'Set sail aboard Cabo Escape for a lively sunset experience. Enjoy freshly prepared fajitas and a bottomless open bar.' 
      },
      price: 150
    },
    {
      id: 'sunset_sessions',
      slug: 'sunset-sessions-cabo-cruise',
      image: 'Sunset-Sessions-5.webp',
      duration: { es: '2 Horas', en: '2 Hours' },
      title: { es: 'Crucero Sunset Sessions', en: 'Sunset Sessions Cruise' },
      desc: { 
        es: 'Saborea un buffet mexicano, cócteles internacionales y música en vivo mientras el cielo se transforma sobre el Fin de la Tierra.', 
        en: 'Savor a Mexican buffet, international cocktails, and live music as the sky transforms over Land’s End.' 
      },
      price: 150
    },
    {
      id: 'pirate_show_cruise',
      slug: 'pirate-ship-sunset-tour-cabo',
      image: 'Yo-Ho-Ho-Sunset-Dinner-&-Pirate-Show-Cruise-4.webp',
      duration: { es: '2 Horas', en: '2 Hours' },
      title: { es: 'Crucero y Show Pirata', en: 'Yo Ho Ho Pirate Show' },
      desc: { 
        es: '¡Zarpa en el Buccaneer Queen! Disfruta de una cena BBQ antes de que el barco se transforme en un espectacular Show Pirata.', 
        en: 'Set sail on the Buccaneer Queen! Enjoy a BBQ dinner before the ship transforms into an immersive Pirate Show.' 
      },
      price: 150
    },
    {
      id: 'snorkeling_cabo_bay',
      slug: 'cabo-san-lucas-snorkel-tour',
      image: 'Cabo-San-Lucas-Snorkel-Tour-2.webp',
      duration: { es: '3.5 Horas', en: '3.5 Hours' },
      title: { es: 'Tour de Snorkel en Cabo', en: 'Cabo Snorkel Tour' },
      desc: { 
        es: 'Disfruta de snorkel guiado en aguas cristalinas, seguido de tacos ilimitados de fajitas y barra libre fría.', 
        en: 'Enjoy guided snorkeling in crystal-clear waters, followed by unlimited fajitas and an ice-cold open bar.' 
      },
      price: 140
    }
  ];

  // Helper limpio para Next.js
  const getImageUrl = (img) => {
    const cleanImg = img.startsWith('/') ? img.substring(1) : img;
    return `/${cleanImg}`;
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-24 font-sans selection:bg-slate-900 selection:text-white">
      <title>{t.seoTitle}</title>
      <meta name="description" content={t.seoDesc} />

      {/* HERO SECTION (Emil Kowalski Style) */}
      <div className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
          {t.title}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-16">
        
        {/* TEXTO INTRODUCTORIO (Estilo Minimalista) */}
        <div className="max-w-4xl mx-auto text-center px-4 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight">{t.introTitle}</h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-4 font-medium">
            {t.introText1}
          </p>
          <p className="text-slate-500 text-lg leading-relaxed font-medium">
            {t.introText2}
          </p>
        </div>

        {/* =========================================
            CATÁLOGO DE TOURS (Bento Grid Style)
            ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toursList.map((tour) => (
            <Link 
              key={tour.id} 
              href={`/${lang}/tours/${tour.slug}`} 
              className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col group transition-transform duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            >
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img 
                  src={getImageUrl(tour.image)} 
                  alt={tour.title[lang]} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute bottom-4 left-4 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Clock size={14} /> {tour.duration[lang]}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-slate-600 transition-colors">
                  {tour.title[lang]}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-8 flex-grow leading-relaxed font-medium">
                  {tour.desc[lang]}
                </p>
                
                <div className="flex justify-between items-center mt-auto border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t.priceFrom}</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">
                      ${tour.price} <span className="text-xs font-bold text-slate-500">USD</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* =========================================
            BOTONES DE CONTACTO (Clean Cards)
            ========================================= */}
        <div className="mt-20 border-t border-slate-200 pt-16">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{t.contactTitle}</h2>
            <p className="text-slate-500 font-medium">{t.contactSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="https://wa.me/526241393497" target="_blank" rel="noopener noreferrer" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 flex items-start gap-4 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors"><MessageCircle size={20} /></div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">WhatsApp (Reservations)</h4>
                <p className="text-slate-500 text-xs mt-1">+52 (624) 139-3497</p>
              </div>
            </a>
            <a href="https://wa.me/526121943286" target="_blank" rel="noopener noreferrer" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 flex items-start gap-4 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors"><MessageCircle size={20} /></div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">WhatsApp (Support)</h4>
                <p className="text-slate-500 text-xs mt-1">+52 (612) 194-3286</p>
              </div>
            </a>
            <a href="tel:+526241393497" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 flex items-start gap-4 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Phone size={20} /></div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Call Us Directly</h4>
                <p className="text-slate-500 text-xs mt-1">+52 (624) 139-3497</p>
              </div>
            </a>
            <a href="mailto:reservationballard@gmail.com" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 flex items-start gap-4 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-slate-800 group-hover:text-white transition-colors"><Mail size={20} /></div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-900 text-sm">Email Us</h4>
                <p className="text-slate-500 text-xs mt-1 truncate">reservationballard@gmail.com</p>
              </div>
            </a>
          </div>
        </div>

        {/* =========================================
            SECCIÓN DE FLOTAS (Alineada al estilo FleetPage)
            ========================================= */}
        <div className="pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{t.fleetTitle}</h2>
            <p className="text-slate-500 font-medium">{t.fleetSubtitle}</p>
          </div>
          
          <div className="space-y-12">
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row group transition-transform duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="w-full lg:w-1/2 h-64 lg:h-[350px] relative overflow-hidden">
                <img src="/hiace-airport-los-cabos-ballard.webp" alt="Van Transportation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest mb-6 w-max"><Users size={14} /> Group Travel</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{t.vanTitle}</h3>
                <p className="text-slate-500 mb-4 leading-relaxed font-medium">{t.vanText1}</p>
                <p className="text-slate-500 leading-relaxed font-medium">{t.vanText2}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row-reverse group transition-transform duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="w-full lg:w-1/2 h-64 lg:h-[350px] relative overflow-hidden">
                <img src="/suburban-airport-los-cabos-ballard.webp" alt="Private VIP FBO" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest mb-6 w-max"><Star size={14} /> VIP Service</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{t.vipTitle}</h3>
                <p className="text-slate-500 mb-4 leading-relaxed font-medium">{t.vipText1}</p>
                <p className="text-slate-500 leading-relaxed font-medium">{t.vipText2}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row group transition-transform duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="w-full lg:w-1/2 h-64 lg:h-[350px] relative overflow-hidden">
                <img src="/suburban-airport-los-cabos-ballard-sjd.webp" alt="AirBnB Transfers" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest mb-6 w-max"><MapPin size={14} /> Door-to-Door</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{t.airbnbTitle}</h3>
                <p className="text-slate-500 mb-4 leading-relaxed font-medium">{t.airbnbText1}</p>
                <p className="text-slate-500 leading-relaxed font-medium">{t.airbnbText2}</p>
              </div>
            </div>

            <div className="text-center pt-8">
              <Link href={`/${lang}/fleet`} className="inline-flex bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full transition-all text-sm tracking-wide">
                {lang === 'es' ? 'Ver Detalles de la Flota' : 'View Full Fleet Details'}
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================
            SECCIONES FINALES (BENEFICIOS, FAQ, PAGOS) 
            ========================================= */}
        <div className="mb-10 mt-20 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.benefitsTitle}</h2>
        </div>
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Clock size={20} /></div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{lang === 'es' ? 'Soporte en Línea 24/7' : '24 / 7 Online Support'}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{lang === 'es' ? 'Respondemos de inmediato. Contáctanos por WhatsApp en cualquier momento.' : 'We respond instantly. Reach out via WhatsApp anytime.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Calendar size={20} /></div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{lang === 'es' ? 'Asistencia de Itinerario' : 'Itinerary Assistance'}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{lang === 'es' ? 'Si necesitas ajustar horarios o cancelar, nuestro equipo te asistirá rápidamente.' : 'Need to move a schedule or cancel? Our local team will assist you quickly.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Baby size={20} /></div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{lang === 'es' ? 'Sillas de Seguridad Gratis' : 'Free Child Seats'}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{lang === 'es' ? 'Proveemos sillas para bebés y asientos elevados sin costo al solicitar.' : 'We provide infant car seats and boosters free of charge when requested.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Banknote size={20} /></div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{lang === 'es' ? 'Tarifas Claras' : 'Affordable Rates'}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{lang === 'es' ? 'Ofrecemos tarifas fijas y transparentes. Sin cargos ocultos.' : 'We offer transparent flat-rate pricing without any hidden charges.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FAQ */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 mt-12">
          <FAQSection lang={lang} />
        </div>

        {/* 3. MÉTODOS DE PAGO */}
        <div className="w-full flex flex-col items-center pt-12 pb-8 px-4 text-center">
          <img src="/pago-tarjetas.png" alt="Métodos de Pago" className="h-10 md:h-12 object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 mb-6" />
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            {t.paymentTitle}
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
            {t.paymentText}
          </p>
        </div>

      </div>
    </div>
  );
}