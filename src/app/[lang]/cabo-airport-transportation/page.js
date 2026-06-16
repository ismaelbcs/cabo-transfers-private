import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Calendar, Baby, Banknote, CreditCard, MapPin } from 'lucide-react';

export async function generateMetadata({ params }) {
  // Desempaquetamos params (compatible con Next.js 15 si es necesario)
  const lang = params?.lang || 'en';

  if (lang === 'es') {
    return {
      title: 'Transporte Premium en Aeropuerto de Los Cabos | Cabo Shuttle',
      description: 'Reserva tu transporte privado y shuttle en el Aeropuerto de Los Cabos (SJD). Traslados seguros, sin filas de taxi, a hoteles como Hyatt Ziva, Nobu y Hard Rock.',
      keywords: 'Transporte Aeropuerto Los Cabos, Shuttle Los Cabos, Taxi Aeropuerto SJD, Transporte privado Cabo San Lucas, Traslados SJD a hotel',
    };
  }

  return {
    title: 'Premium Cabo Airport Transportation & Shuttle Services',
    description: 'Experience seamless Cabo Airport Transportation and Cabo Airport Shuttle services. Book your private transportation from SJD Airport to Hyatt Ziva, Paradisus, Nobu, and more.',
    keywords: 'Cabo Airport Transportation, Cabo Airport Shuttle, SJD Airport Taxi, Private Transportation Cabo, Cabo San Lucas Airport Transfers',
  };
}

export default function CaboTransportationPage({ params }) {
  const lang = params?.lang || 'en';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-200">
      
      {/* 1. HEADER SECTION (Botones ajustados a tus rutas) */}
      <header className="px-6 py-24 mx-auto max-w-5xl text-center md:py-32">
        <div className="inline-flex items-center px-3 py-1 mb-8 text-xs font-medium rounded-full text-neutral-600 bg-neutral-100 border border-neutral-200">
          ✨ {lang === 'es' ? 'Clasificado #1 en Traslados de Los Cabos' : 'Rated #1 in Los Cabos Transfers'}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-neutral-900 mb-6">
          Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-900">
            {lang === 'es' ? 'Transporte en Aeropuerto SJD' : 'Cabo Airport Transportation'}
          </span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-600 max-w-2xl mx-auto">
          {lang === 'es' 
            ? 'Llega a Los Cabos con la tranquilidad que mereces. Nuestro servicio de clase mundial garantiza un viaje seguro, lujoso y sin estrés desde el Aeropuerto Internacional de San José del Cabo (SJD) directamente al lobby de tu resort.'
            : "Arrive in Los Cabos with the peace of mind you deserve. Our world-class Cabo Airport Transportation guarantees a seamless, luxurious, and completely stress-free journey from San Jose del Cabo International Airport (SJD) directly to your resort's lobby."}
        </p>
        
        {/* ACTION BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/${lang}/`} className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 bg-neutral-900 rounded-full hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-[0.98] w-full sm:w-auto">
            {lang === 'es' ? 'Reservar Transporte Ahora' : 'Book Your Transfer Now'}
            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <Link href={`/${lang}/tours`} className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-neutral-900 transition-all duration-300 bg-white border border-neutral-200/80 rounded-full shadow-sm hover:shadow-md hover:bg-neutral-50 hover:border-neutral-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto">
            {lang === 'es' ? 'Ver Tours y Servicios Especiales' : 'View Tours & Special Services'}
          </Link>
        </div>
      </header>

      <main className="px-6 mx-auto max-w-4xl pb-24">
        
        {/* TEXTO SEO EXTENSO (Contenido Original + SEO Extra) */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
            {lang === 'es' ? 'El Mejor Shuttle y Transporte Privado de Cabo' : 'The Ultimate Cabo Airport Shuttle & Private Transport'}
          </h2>
          <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
            <p className="mb-6">
              {lang === 'es' 
                ? 'Cuando aterrizas en Baja California Sur, lo último de lo que quieres preocuparte es de navegar por redes de transporte local. Ya sea que viajes para una escapada romántica, un retiro corporativo o unas vacaciones familiares, nuestras soluciones de Shuttle y traslados privados están hechas a tu medida. Evitamos las caóticas filas de taxis afuera del aeropuerto SJD, ofreciéndote una experiencia de bienvenida personalizada.'
                : 'When you land in Baja California Sur, the last thing you want to worry about is navigating complex local transportation networks. Whether you are traveling for a romantic getaway, a corporate retreat, or a family vacation, our highly rated Cabo Airport Shuttle and private transfer solutions are tailored exactly to your needs. We bypass the chaotic taxi lines outside SJD airport, offering you a personalized meet-and-greet experience.'}
            </p>
            <p className="mb-6">
              {lang === 'es'
                ? 'Elegir el transporte adecuado en el Aeropuerto de Los Cabos marca el tono de todo tu viaje. Nos especializamos en lujo punto a punto, empleando solo choferes totalmente certificados, bilingües y altamente capacitados. Monitoreamos el estado de tu vuelo en tiempo real, lo que significa que las llegadas anticipadas o los vuelos retrasados se acomodan sin problemas y sin tarifas de espera ocultas.'
                : 'Choosing the right Cabo Airport Transportation sets the tone for your entire trip. We specialize in point-to-point luxury, employing only fully licensed, bilingual, and highly trained chauffeurs. We monitor your flight status in real-time, meaning early arrivals or delayed flights are seamlessly accommodated without any hidden wait-time fees.'}
            </p>
            <p className="mb-6">
              {lang === 'es'
                ? 'Nuestros servicios exclusivos aseguran que puedas comenzar a relajarte en el momento en que sales de la terminal. Con bebidas bien frías esperándote en el vehículo, aire acondicionado ajustado a tu temperatura preferida e interiores de cuero inmaculados, redefinimos cómo debería sentirse un Cabo Airport Shuttle.'
                : 'Our exclusive services ensure you can start relaxing the moment you step out of the terminal. With icy cold beverages waiting in the vehicle, air conditioning set to your preferred temperature, and immaculate leather interiors, we redefine what a Cabo Airport Shuttle should feel like.'}
            </p>
            <p>
              {lang === 'es'
                ? 'Ya sea que necesites transporte privado a Cabo San Lucas, San José del Cabo o el Corredor Turístico, estamos comprometidos a brindar el mejor servicio de transporte al aeropuerto SJD con tarifas competitivas y vehículos impecables.'
                : 'Whether you need private transportation to Cabo San Lucas, San Jose del Cabo, or the Tourist Corridor, we are committed to providing the absolute best SJD airport transportation service with competitive rates and pristine vehicles.'}
            </p>
          </div>
        </section>

        {/* IMAGEN 1: SJD AIRPORT TAXI BANNER (Dark Theme) */}
        <section className="mb-24">
          <div className="bg-[#0F172A] text-white rounded-[2rem] p-10 md:p-14 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
              {lang === 'es' ? '¿Taxi en el Aeropuerto SJD? Conoce tus opciones.' : 'SJD Airport Taxi? Know Your Options.'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-base md:text-lg leading-relaxed">
              <p>
                {lang === 'es' 
                  ? 'Al llegar a Los Cabos, muchos viajeros buscan un "taxi en el aeropuerto SJD" para llegar rápidamente a su resort. Si bien hay taxis locales disponibles justo afuera de la terminal, elegir un traslado al aeropuerto reservado con anticipación ofrece ventajas inigualables en costo y seguridad.'
                  : 'Upon arriving in Los Cabos, many travelers look for an "SJD airport taxi" to quickly reach their resort. While local taxis are available right outside the terminal, choosing a pre-booked airport transfer offers unmatched advantages in cost and safety.'}
              </p>
              <p>
                {lang === 'es'
                  ? 'A diferencia de un taxi regular, nuestro servicio de traslado privado garantiza una tarifa fija sin cargos ocultos de taxímetro, vehículos de lujo totalmente climatizados y un chofer bilingüe esperándote. Sáltate las largas filas de taxis y asegura tu transporte con Ballard Tours.'
                  : 'Unlike a regular taxi, our private transfer service guarantees a flat rate with no hidden meter fees, fully air-conditioned luxury vehicles, and a bilingual chauffeur waiting for you. Skip the long taxi lines and secure your transportation with Ballard Tours.'}
              </p>
            </div>
          </div>
        </section>

        {/* IMAGEN 2: POPULAR ROUTES (Con URLs para redirigir a reservas) */}
        <section className="mb-24">
          <div className="flex items-center mb-8">
            <MapPin className="w-8 h-8 text-slate-700 mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              {lang === 'es' ? 'Rutas Populares de Transporte al Aeropuerto' : 'Popular Airport Transportation Routes'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 bg-white border border-neutral-200 rounded-[2rem] p-8 md:p-10 shadow-sm">
            {/* Columna Izquierda */}
            <ul className="space-y-4">
              {[
                { name: 'Airport SJD to Nobu Hotel Los Cabos', link: `/${lang}/` },
                { name: 'Airport SJD to Riu Palace Baja California', link: `/${lang}/` },
                { name: 'Airport SJD to Grand Velas Los Cabos', link: `/${lang}/` },
                { name: 'Airport SJD to Marquis Los Cabos', link: `/${lang}/` },
                { name: 'Airport SJD to Hilton Los Cabos', link: `/${lang}/` },
                { name: 'Airport SJD to Dreams Los Cabos', link: `/${lang}/` },
                { name: 'Airport SJD to Pueblo Bonito Sunset', link: `/${lang}/` },
                { name: 'Airport SJD to Garza Blanca', link: `/${lang}/` },
              ].map((route, i) => (
                <li key={`left-${i}`}>
                  <Link href={route.link} className="flex items-start group">
                    <CheckCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors mr-3 shrink-0 mt-0.5" />
                    <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors">{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Columna Derecha */}
            <ul className="space-y-4">
              {[
                { name: 'Airport SJD to Hard Rock Hotel Los Cabos', link: `/${lang}/` },
                { name: 'Airport SJD to Riu Santa Fe', link: `/${lang}/` },
                { name: 'Airport SJD to Waldorf Astoria', link: `/${lang}/` },
                { name: 'Airport SJD to Secrets Puerto Los Cabos', link: `/${lang}/` },
                { name: 'Airport SJD to Hyatt Ziva Los Cabos', link: `/${lang}/` },
                { name: 'Airport SJD to Breathless Cabo San Lucas', link: `/${lang}/` },
                { name: 'Airport SJD to Pueblo Bonito Pacifica', link: `/${lang}/` },
              ].map((route, i) => (
                <li key={`right-${i}`}>
                  <Link href={route.link} className="flex items-start group">
                    <CheckCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors mr-3 shrink-0 mt-0.5" />
                    <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors">{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* IMAGEN 3: 2x2 GRID OF BENEFITS */}
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
                  {lang === 'es' ? 'Si necesitas mover un horario o realizar una cancelación, nuestro equipo te asistirá.' : 'If you need to move a schedule or make a cancellation, our team will assist you.'}
                </p>
              </div>
            </div>

            {/* 3. Child Safety Seats */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-3 rounded-xl shrink-0">
                <Baby className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg mb-1">{lang === 'es' ? 'Asientos de Seguridad para Niños' : 'Child Safety Seats'}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {lang === 'es' ? 'Proporcionamos asientos infantiles y asientos elevados completamente gratis previa solicitud.' : 'We provide infant car seats and booster seats completely free of charge upon request.'}
                </p>
              </div>
            </div>

            {/* 4. Affordable Rates */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-3 rounded-xl shrink-0">
                <Banknote className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg mb-1">{lang === 'es' ? 'Tarifas Accesibles' : 'Affordable Rates'}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {lang === 'es' ? 'Ofrecemos precios fijos transparentes sin tarifas inesperadas ni cargos ocultos.' : 'We offer transparent flat-rate pricing without any unexpected fees or hidden charges.'}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* IMAGEN 4: EASY BOOKING & FLEXIBLE PAYMENT */}
        <section className="mb-24 text-center max-w-2xl mx-auto py-10">
          <div className="flex justify-center items-center gap-3 mb-8">
            <span className="font-bold text-blue-900 text-xl tracking-wider italic">VISA</span>
            <span className="font-bold text-red-600 text-xl tracking-tight">MasterCard</span>
            <span className="font-bold text-sky-500 text-xl tracking-tight italic">PayPal</span>
            <span className="font-bold text-blue-600 text-sm border border-blue-600 px-1">AMERICAN<br/>EXPRESS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {lang === 'es' ? 'Reserva Fácil y Pago Flexible.' : 'Easy Booking & Flexible Payment.'}
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
            {lang === 'es'
              ? 'Sitio web de reservas fácil de tres clics. Ingresa tu destino, elige tu tipo de shuttle y haz clic en enviar. Puedes elegir entre pagar de forma segura con tarjeta de crédito, optar por pagar a la llegada, o usar PayPal.'
              : 'Three-click easy reservation website. Enter your destination, choose your shuttle type, and click submit. You can select from paying securely with a credit card, opting for payment on arrival, or using PayPal.'}
          </p>
        </section>

      </main>
      
      {/* FINAL CTA FOOTER */}
      <footer className="bg-neutral-900 py-20 px-6 border-t border-neutral-800 text-center text-white">
        <h2 className="text-3xl font-semibold tracking-tight mb-8">
          {lang === 'es' ? 'Comienza tu Aventura en Cabo' : 'Begin Your Cabo Adventure'}
        </h2>
        <Link href={`/${lang}/`} className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold text-neutral-900 transition-all duration-300 bg-white rounded-full hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98]">
          {lang === 'es' ? 'Obtener Precio Inmediato' : 'Get Instant Pricing'}
        </Link>
      </footer>
    </div>
  );
}