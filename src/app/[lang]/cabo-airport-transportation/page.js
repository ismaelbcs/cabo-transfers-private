import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Calendar, Baby, Banknote, CreditCard } from 'lucide-react';

export async function generateMetadata({ params }) {
  const lang = params?.lang || 'en';

  if (lang === 'es') {
    return {
      title: 'Transporte y Shuttle Premium en el Aeropuerto de Los Cabos',
      description: 'Experimenta el mejor servicio de transporte privado y shuttle en Los Cabos. Reserva tu traslado desde el Aeropuerto SJD a Hyatt Ziva, Paradisus Los Cabos, y más.',
      keywords: 'Transporte Aeropuerto Los Cabos, Shuttle Los Cabos, Transporte Aeropuerto SJD a Hyatt Ziva, Transporte privado',
    };
  }

  return {
    title: 'Premium Cabo Airport Transportation & Shuttle Services',
    description: 'Experience seamless Cabo Airport Transportation and Cabo Airport Shuttle services. Book your private transportation from SJD Airport to Hyatt Ziva, Paradisus Los Cabos, and more.',
    keywords: 'Cabo Airport Transportation, Cabo Airport Shuttle, Transportation from SJD Airport to Hyatt Ziva, Transportation from SJD Airport to Paradisus Los Cabos',
  };
}

export default function CaboTransportationPage({ params }) {
  const lang = params?.lang || 'en';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-200">
      
      {/* HEADER SECTION */}
      <header className="px-6 py-24 mx-auto max-w-5xl text-center md:py-32">
        <div className="inline-flex items-center px-3 py-1 mb-8 text-xs font-medium rounded-full text-neutral-600 bg-neutral-100 border border-neutral-200">
          ✨ {lang === 'es' ? 'Clasificado #1 en Traslados de Los Cabos' : 'Rated #1 in Los Cabos Transfers'}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-neutral-900 mb-6">
          Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-900">
            {lang === 'es' ? 'Transporte Aeropuerto Los Cabos' : 'Cabo Airport Transportation'}
          </span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-neutral-600 max-w-2xl mx-auto">
          {lang === 'es' 
            ? 'Llega a Los Cabos con la tranquilidad que mereces. Nuestro servicio de clase mundial garantiza un viaje seguro, lujoso y sin estrés desde el Aeropuerto Internacional de San José del Cabo (SJD) directamente a la recepción de tu resort.'
            : "Arrive in Los Cabos with the peace of mind you deserve. Our world-class Cabo Airport Transportation guarantees a seamless, luxurious, and completely stress-free journey from San Jose del Cabo International Airport (SJD) directly to your resort's lobby."}
        </p>
        
        {/* ACTION BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/${lang}/`} className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 bg-neutral-900 rounded-full hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-[0.98] w-full sm:w-auto">
            {lang === 'es' ? 'Reserva tu Transporte Ahora' : 'Book Your Transfer Now'}
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
        
        {/* NEW SECTION 1: DARK BANNER SJD AIRPORT TAXI */}
        <section className="mb-24">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
                {lang === 'es' ? '¿Taxi en el Aeropuerto SJD? Conoce tus Opciones.' : 'SJD Airport Taxi? Know Your Options.'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-lg leading-relaxed">
                <p>
                  {lang === 'es' 
                    ? 'Al llegar a Los Cabos, podrías sentir la tentación de tomar un taxi regular. Sin embargo, las filas para taxis en el aeropuerto suelen ser muy largas, especialmente en temporada alta, y las tarifas cambian constantemente según la demanda.'
                    : 'Upon arriving in Los Cabos, you might be tempted to grab a regular taxi. However, airport taxi lines can be notoriously long, especially during peak season, and rates are often subject to sudden changes depending on demand.'}
                </p>
                <p>
                  {lang === 'es'
                    ? 'A diferencia de un taxi regular, reservar tu transporte privado con anticipación garantiza un precio fijo, sin cargos ocultos. Tu chofer bilingüe te estará esperando con un letrero personalizado, listo para acompañarte directamente a tu vehículo de lujo de Ballard Tours.'
                    : 'Unlike a regular taxi, pre-booking your private transportation ensures a fixed, upfront price with no hidden fees. Your bilingual driver will be waiting for you with a personalized sign, ready to escort you directly to your luxury vehicle by Ballard Tours.'}
                </p>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-800 rounded-full opacity-50 blur-3xl"></div>
          </div>
        </section>

        {/* NEW SECTION 2: ROUTES & WHY CHOOSE US */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Routes */}
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                {lang === 'es' ? 'Rutas Populares de Transporte' : 'Popular Airport Transportation Routes'}
              </h3>
              <ul className="space-y-4">
                {[
                  'Airport SJD to Nobu Hotel Los Cabos',
                  'Airport SJD to Riu Palace Baja California',
                  'Airport SJD to Hard Rock Hotel',
                  'Airport SJD to Montage Los Cabos'
                ].map((route, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 shrink-0" />
                    <span className="text-lg text-neutral-700">{route}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right Column: Why Choose Us Card */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">
                {lang === 'es' ? '¿Por Qué Elegirnos?' : 'Why Choose Us?'}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                  <span className="text-neutral-600">{lang === 'es' ? 'Operando con excelencia desde 2005' : 'Operating with excellence since 2005'}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                  <span className="text-neutral-600">{lang === 'es' ? 'Choferes bilingües y certificados' : 'Bilingual and fully certified drivers'}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                  <span className="text-neutral-600">{lang === 'es' ? 'Monitoreo de vuelos en tiempo real' : 'Real-time flight tracking included'}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                  <span className="text-neutral-600 font-medium">{lang === 'es' ? 'Miles de visitantes satisfechos cada año.' : 'Thousands of satisfied visitors every year.'}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* NEW SECTION 3: 2x2 GRID OF BENEFITS */}
        <section className="mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-5 hover:bg-slate-100 transition-colors">
              <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                <Clock className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg">{lang === 'es' ? 'Soporte en Línea 24/7' : '24 / 7 Online Support'}</h4>
                <p className="text-neutral-500 text-sm">{lang === 'es' ? 'WhatsApp: +52 624 139 3497' : 'WhatsApp: +52 624 139 3497'}</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-5 hover:bg-slate-100 transition-colors">
              <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                <Calendar className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg">{lang === 'es' ? 'Asistencia de Itinerario' : 'Itinerary Assistance'}</h4>
                <p className="text-neutral-500 text-sm">{lang === 'es' ? 'Planificamos tus tiempos exactos.' : 'We plan your perfect timings.'}</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-5 hover:bg-slate-100 transition-colors">
              <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                <Baby className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg">{lang === 'es' ? 'Asientos para Bebés' : 'Child Safety Seats'}</h4>
                <p className="text-neutral-500 text-sm">{lang === 'es' ? 'Disponibles bajo previa solicitud.' : 'Available upon request.'}</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-5 hover:bg-slate-100 transition-colors">
              <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                <Banknote className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-lg">{lang === 'es' ? 'Tarifas Accesibles' : 'Affordable Rates'}</h4>
                <p className="text-neutral-500 text-sm">{lang === 'es' ? 'Garantía de precios fijos (flat-rate).' : 'Guaranteed flat-rate pricing.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ORIGINAL CONTENT (Optimized Text blocks) */}
        <section className="mb-24">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
            {lang === 'es' ? 'El Mejor Shuttle y Transporte Privado de Cabo' : 'The Ultimate Cabo Airport Shuttle & Private Transport'}
          </h2>
          <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
            <p className="mb-6">
              {lang === 'es' 
                ? 'Cuando aterrizas en Baja California Sur, lo último de lo que quieres preocuparte es de navegar por redes de transporte local. Ya sea que viajes para una escapada romántica, un retiro corporativo o unas vacaciones familiares, nuestras soluciones de Shuttle y traslados privados están hechas a tu medida.'
                : 'When you land in Baja California Sur, the last thing you want to worry about is navigating complex local transportation networks. Whether you are traveling for a romantic getaway, a corporate retreat, or a family vacation, our highly rated Cabo Airport Shuttle and private transfer solutions are tailored exactly to your needs.'}
            </p>
          </div>
        </section>

        {/* IMAGE 1 */}
        <div className="relative w-full aspect-[16/10] mb-24 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group transform transition-transform duration-500 hover:-translate-y-1">
          <Image 
            src="/suburban-airport-los-cabos-ballard-sjd.webp" 
            alt="Chevrolet Suburban waiting at SJD Airport for Los Cabos Transportation" 
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="font-semibold text-xl tracking-tight mb-1">{lang === 'es' ? 'Flota de Suburbans Premium' : 'Premium Suburban Fleet'}</p>
            <p className="text-sm font-medium text-white/80">San Jose del Cabo International Airport (SJD)</p>
          </div>
        </div>

        {/* NEW SECTION 4: SECURE PAYMENT CENTERED */}
        <section className="mb-24 text-center max-w-2xl mx-auto border-t border-b border-slate-200 py-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <CreditCard className="w-10 h-10 text-slate-800" />
            <div className="flex gap-2 font-bold text-slate-400 text-lg tracking-widest">
              <span>VISA</span>
              <span>•</span>
              <span>MASTERCARD</span>
              <span>•</span>
              <span>AMEX</span>
              <span>•</span>
              <span>PAYPAL</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {lang === 'es' ? 'Reserva Fácil y Pagos Flexibles.' : 'Easy Booking & Flexible Payment.'}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            {lang === 'es'
              ? 'Sitio web de reservas fáciles en tres clics. Ingresa tu destino, elige tu vehículo y paga de forma segura en línea con cualquier tarjeta de crédito principal o usando PayPal.'
              : 'Three-click easy reservation website. Enter your destination, choose your vehicle, and pay securely online with any major credit card or using PayPal.'}
          </p>
        </section>

      </main>
      
      {/* FINAL CTA FOOTER */}
      <footer className="bg-neutral-900 py-20 px-6 text-center text-white rounded-t-[3rem]">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
          {lang === 'es' ? 'Comienza tu Aventura en Cabo' : 'Begin Your Cabo Adventure'}
        </h2>
        <Link href={`/${lang}/`} className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-bold text-neutral-900 transition-all duration-300 bg-white rounded-full hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98]">
          {lang === 'es' ? 'Cotizar y Reservar Ahora' : 'Get Instant Pricing & Book'}
        </Link>
      </footer>
    </div>
  );
}