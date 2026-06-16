import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Calendar, Baby, Banknote, MapPin } from 'lucide-react';

export async function generateMetadata({ params }) {
  const lang = params?.lang || 'en';

  if (lang === 'es') {
    return {
      title: 'Cabo Airport SUV Service | Transporte Privado de Lujo en SJD',
      description: 'Reserva tu Cabo Airport SUV Service. Camionetas Suburban y Escalade de lujo para tu traslado desde el Aeropuerto SJD hasta tu hotel. Privado, seguro y cómodo.',
      keywords: 'Cabo Airport SUV Service, Camionetas aeropuerto Los Cabos, Transporte SUV Cabo San Lucas, Suburban Aeropuerto SJD, Luxury SUV Cabo',
    };
  }

  return {
    title: 'Premium Cabo Airport SUV Service | SJD Luxury Transfers',
    description: 'Book your exclusive Cabo Airport SUV Service. Travel in luxury Suburbans and Escalades from SJD Airport to your resort. Private, safe, and spacious.',
    keywords: 'Cabo Airport SUV Service, SJD Airport SUV, Luxury Suburban Los Cabos, Cabo San Lucas SUV Transfer, Premium transportation Cabo',
  };
}

export default function CaboSuvServicePage({ params }) {
  const lang = params?.lang || 'en';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-200">
      
      {/* 1. HEADER SECTION */}
      <header className="px-6 py-24 mx-auto max-w-5xl text-center md:py-32">
        <div className="inline-flex items-center px-3 py-1 mb-8 text-xs font-medium rounded-full text-neutral-600 bg-neutral-100 border border-neutral-200">
          ✨ {lang === 'es' ? 'El Mejor Servicio SUV en Los Cabos' : 'Top Rated SUV Service in Los Cabos'}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-neutral-900 mb-6">
          Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-900">
            Cabo Airport SUV Service
          </span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-600 max-w-2xl mx-auto">
          {lang === 'es' 
            ? 'Llega a Los Cabos con la elegancia y el espacio que mereces. Nuestro exclusivo Cabo Airport SUV Service garantiza un viaje seguro, lujoso y sin estrés desde el Aeropuerto (SJD) directamente a tu resort.'
            : "Arrive in Los Cabos with the elegance and space you deserve. Our exclusive Cabo Airport SUV Service guarantees a seamless, luxurious, and completely stress-free journey from SJD Airport directly to your resort."}
        </p>
        
        {/* ACTION BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/${lang}/`} className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 bg-neutral-900 rounded-full hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-[0.98] w-full sm:w-auto">
            {lang === 'es' ? 'Reservar SUV Ahora' : 'Book Your SUV Now'}
            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link href={`/${lang}/tours`} className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-neutral-900 transition-all duration-300 bg-white border border-neutral-200/80 rounded-full shadow-sm hover:shadow-md hover:bg-neutral-50 hover:border-neutral-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto">
            {lang === 'es' ? 'Ver Tours y Servicios' : 'View Tours & Services'}
          </Link>
        </div>
      </header>

      <main className="px-6 mx-auto max-w-4xl pb-24">
        
        {/* TEXTO SEO ADAPTADO A SUV */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
            {lang === 'es' ? 'Viaja con Estilo: Nuestro Servicio Privado en SUV' : 'Travel in Style: Our Private SUV Service'}
          </h2>
          <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
            <p className="mb-6">
              {lang === 'es' 
                ? 'Cuando aterrizas en Baja California Sur, la comodidad de tu transporte marca la pauta de tus vacaciones. Nuestro Cabo Airport SUV Service está diseñado para aquellos que no se conforman con un transporte ordinario. Evita las filas de taxis y disfruta del espacio, la privacidad y el aire acondicionado de nuestras Chevrolet Suburbans y Ford Expeditions.'
                : 'When you land in Baja California Sur, the comfort of your transportation sets the tone for your vacation. Our Cabo Airport SUV Service is designed for those who do not settle for ordinary rides. Skip the taxi lines and enjoy the space, privacy, and pristine air conditioning of our modern Chevrolet Suburbans and Ford Expeditions.'}
            </p>
            <p className="mb-6">
              {lang === 'es'
                ? 'Nuestras SUV de lujo son la opción perfecta para familias, ejecutivos o pequeños grupos de amigos que llevan equipaje extra, palos de golf o simplemente desean viajar con el mayor nivel de confort en Los Cabos. Además, te recibimos con bebidas frías de cortesía en el interior.'
                : 'Our luxury SUVs are the perfect choice for families, executives, or small groups of friends carrying extra luggage, golf clubs, or simply wishing to travel with the highest level of comfort in Los Cabos. Plus, we welcome you with complimentary icy cold beverages inside.'}
            </p>
          </div>
        </section>

        {/* IMAGEN 1: SUBURBAN BALLARD SJD */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] mb-24 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group">
          <Image 
            src="/suburban-airport-los-cabos-ballard-sjd.webp" 
            alt="Chevrolet Suburban waiting at SJD Airport for Los Cabos Transportation" 
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="font-semibold text-xl tracking-tight mb-1">{lang === 'es' ? 'Flota de SUV de Lujo' : 'Luxury SUV Fleet at SJD'}</p>
          </div>
        </div>

        {/* SJD AIRPORT TAXI BANNER (Dark Theme) */}
        <section className="mb-24">
          <div className="bg-[#0F172A] text-white rounded-[2rem] p-10 md:p-14 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
              {lang === 'es' ? '¿Taxi o Servicio de SUV? Conoce la diferencia.' : 'Regular Taxi vs. Private SUV Service.'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-base md:text-lg leading-relaxed">
              <p>
                {lang === 'es' 
                  ? 'Si bien hay taxis disponibles en el aeropuerto, la mayoría son vehículos compactos sin suficiente espacio para grupos o equipaje voluminoso. Nuestro servicio de SUV te asegura un vehículo de tamaño completo solo para ti.'
                  : 'While regular taxis are available, most are compact vehicles lacking the space needed for groups or bulky luggage. Our SUV service ensures a full-size, premium vehicle dedicated entirely to your party.'}
              </p>
              <p>
                {lang === 'es'
                  ? 'Garantizamos una tarifa fija sin taxímetros, interiores de piel y un chofer bilingüe. Sáltate la larga fila y asegura tu SUV con Ballard Tours.'
                  : 'We guarantee a flat rate with no running meters, plush leather interiors, and a bilingual chauffeur. Skip the long lines and secure your SUV with Ballard Tours.'}
              </p>
            </div>
          </div>
        </section>

        {/* POPULAR ROUTES */}
        <section className="mb-24">
          <div className="flex items-center mb-8">
            <MapPin className="w-8 h-8 text-slate-700 mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              {lang === 'es' ? 'Rutas Populares en SUV' : 'Popular SUV Transfer Routes'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 bg-white border border-neutral-200 rounded-[2rem] p-8 md:p-10 shadow-sm">
            {/* Columna Izquierda */}
            <ul className="space-y-4">
              {[
                { name: "Airport SJD to Nobu Hotel Los Cabos", path: `/${lang}/destinations/sjd-to-nobu-hotel` },
                { name: "Airport SJD to Riu Palace Baja California", path: `/${lang}/destinations/sjd-to-riu-palace` },
                { name: "Airport SJD to Grand Velas Los Cabos", path: `/${lang}/destinations/sjd-to-grand-velas` },
                { name: "Airport SJD to Marquis Los Cabos", path: `/${lang}/destinations/sjd-to-marquis` },
                { name: "Airport SJD to Hilton Los Cabos", path: `/${lang}/destinations/sjd-to-hilton-los-cabos` },
                { name: "Airport SJD to Dreams Los Cabos", path: `/${lang}/destinations/sjd-to-dreams-los-cabos` },
                { name: "Airport SJD to Pueblo Bonito Sunset", path: `/${lang}/destinations/sjd-to-pueblo-bonito-sunset` },
                { name: "Airport SJD to Garza Blanca", path: `/${lang}/destinations/sjd-to-garza-blanca` }
              ].map((route, i) => (
                <li key={`left-${i}`}>
                  <Link href={route.path} className="flex items-start group">
                    <CheckCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors mr-3 shrink-0 mt-0.5" />
                    <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors font-medium">{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Columna Derecha */}
            <ul className="space-y-4">
              {[
                { name: "Airport SJD to Hard Rock Hotel Los Cabos", path: `/${lang}/destinations/sjd-to-hard-rock` },
                { name: "Airport SJD to Riu Santa Fe", path: `/${lang}/destinations/sjd-to-riu-santa-fe` },
                { name: "Airport SJD to Waldorf Astoria", path: `/${lang}/destinations/sjd-to-waldorf-astoria` },
                { name: "Airport SJD to Secrets Puerto Los Cabos", path: `/${lang}/destinations/sjd-to-secrets-puerto-los-cabos` },
                { name: "Airport SJD to Hyatt Ziva Los Cabos", path: `/${lang}/destinations/sjd-to-hyatt-ziva` },
                { name: "Airport SJD to Breathless Cabo San Lucas", path: `/${lang}/destinations/sjd-to-breathless` },
                { name: "Airport SJD to Pueblo Bonito Pacifica", path: `/${lang}/destinations/sjd-to-pueblo-bonito-pacifica` },
              ].map((route, i) => (
                <li key={`right-${i}`}>
                  <Link href={route.path} className="flex items-start group">
                    <CheckCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors mr-3 shrink-0 mt-0.5" />
                    <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors font-medium">{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* IMAGEN 2: EXPEDITION AT NOBU */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] mb-24 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group">
          <Image 
            src="/private-transportation-nobu-hotel-los-cabos.webp" 
            alt="Private SUV Transportation at Nobu Hotel Los Cabos" 
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="font-semibold text-xl tracking-tight mb-1">{lang === 'es' ? 'Llegadas a Hoteles de Lujo' : 'Luxury Resort Arrivals'}</p>
          </div>
        </div>

        {/* 2x2 GRID OF BENEFITS */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-neutral-200 rounded-[2rem] p-8 shadow-sm">
            {/* 1. 24/7 Support */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-3 rounded-xl shrink-0">
                <Clock className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg mb-1">{lang === 'es' ? 'Soporte en línea 24 / 7' : '24 / 7 Online Support'}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {lang === 'es' ? 'Respondemos lo más rápido posible. Contáctanos vía WhatsApp al +52 624 139 3497 en cualquier momento.' : 'We respond as quickly as possible. Reach out via WhatsApp at +52 624 139 3497 anytime.'}
                </p>
              </div>
            </div>

            {/* 2. Itinerary Assistance */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-3 rounded-xl shrink-0">
                <Calendar className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg mb-1">{lang === 'es' ? 'Asistencia de Itinerario' : 'Itinerary Assistance'}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {lang === 'es' ? 'Si necesitas mover un horario o realizar una cancelación, nuestro equipo te asistirá sin complicaciones.' : 'If you need to move a schedule or make a cancellation, our team will assist you.'}
                </p>
              </div>
            </div>

            {/* 3. Child Safety Seats */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-3 rounded-xl shrink-0">
                <Baby className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg mb-1">{lang === 'es' ? 'Asientos para Niños (Sillas)' : 'Child Safety Seats'}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {lang === 'es' ? 'Proporcionamos asientos infantiles y elevados completamente gratis para viajes familiares seguros.' : 'We provide infant car seats and booster seats completely free of charge upon request.'}
                </p>
              </div>
            </div>

            {/* 4. Affordable Rates */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-3 rounded-xl shrink-0">
                <Banknote className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg mb-1">{lang === 'es' ? 'Tarifas Accesibles y Fijas' : 'Affordable Rates'}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {lang === 'es' ? 'Ofrecemos precios fijos transparentes sin tarifas inesperadas ni cargos ocultos de último minuto.' : 'We offer transparent flat-rate pricing without any unexpected fees or hidden charges.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EASY BOOKING & FLEXIBLE PAYMENT (DISCRETO Y PEQUEÑO) */}
        <section className="mb-24 text-center max-w-xl mx-auto py-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
          <div className="flex justify-center items-center mb-4">
             <Image 
               src="/pago-tarjetas.png" 
               alt="Visa, MasterCard, American Express, PayPal" 
               width={160} 
               height={40} 
               className="object-contain"
             />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-2 tracking-tight">
            {lang === 'es' ? 'Reserva Fácil y Pago Flexible.' : 'Easy Booking & Flexible Payment.'}
          </h3>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
            {lang === 'es'
              ? 'Paga de forma segura con tarjeta de crédito en línea, optar por pagar en efectivo a la llegada, o usar PayPal.'
              : 'Pay securely online with a credit card, opt for cash on arrival, or use PayPal to secure your booking.'}
          </p>
        </section>

      </main>
      
      {/* FINAL CTA FOOTER */}
      <footer className="bg-neutral-900 py-20 px-6 border-t border-neutral-800 text-center text-white">
        <h2 className="text-3xl font-semibold tracking-tight mb-8">
          {lang === 'es' ? 'Comienza tu Viaje en Cabo San Lucas' : 'Begin Your Cabo Adventure'}
        </h2>
        <Link href={`/${lang}/`} className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold text-neutral-900 transition-all duration-300 bg-white rounded-full hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98]">
          {lang === 'es' ? 'Obtener Precio y Reservar' : 'Get Instant Pricing & Book'}
        </Link>
      </footer>
    </div>
  );
}