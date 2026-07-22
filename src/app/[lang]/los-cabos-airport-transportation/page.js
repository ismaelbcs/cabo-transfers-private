import React from 'react';
import GoogleReviewsWidget from '../../../components/GoogleReviewsWidget';
import CustomerPhotosWidget from '../../../components/CustomerPhotosWidget';
import GenericDestinationBooking from '../../../components/GenericDestinationBooking';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Calendar, Baby, Banknote, MapPin } from 'lucide-react';

export async function generateMetadata({ params }) {
    const lang = params?.lang || 'en';
    if (lang === 'es') return {
        title: 'Transporte del Aeropuerto de Los Cabos | CABO PRIVATE TRANSPORTATION',
        description: 'Transporte privado y seguro desde el Aeropuerto de Los Cabos (SJD). Reserva CABO PRIVATE TRANSPORTATION para el mejor inicio de tu viaje.',
        keywords: 'Cabo Airport Transportation, Los Cabos Airport Shuttles, SJD transporte privado',
    };
    return {
        title: 'Los Cabos Airport Transportation | CABO PRIVATE TRANSPORTATION',
        description: 'Safe and private transportation from Los Cabos Airport (SJD). Book CABO PRIVATE TRANSPORTATION for the best start to your trip.',
        keywords: 'Cabo Airport Transportation, Los Cabos Airport Shuttles, SJD private transfers',
    };
}

export default function CaboAirportTransportationPage({ params }) {
    const lang = params?.lang || 'en';

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-200">

            {/* 1. HEADER SECTION */}
            <header className="px-6 py-24 mx-auto max-w-5xl text-center md:py-32">
                <div className="inline-flex items-center px-3 py-1 mb-8 text-xs font-medium rounded-full text-neutral-600 bg-neutral-100 border border-neutral-200">
                    ✨ {lang === 'es' ? 'Transporte Premium en Los Cabos' : 'Premium Transportation in Los Cabos'}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-neutral-900 mb-6">
                    Los Cabos (SJD) Mexico <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-900">
                        Airport Transportation
                    </span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-neutral-600 max-w-2xl mx-auto">
                    {lang === 'es'
                        ? 'Cuando llegas al Aeropuerto Internacional de Los Cabos (SJD), pre-reservar tu transporte es esencial para un comienzo sin problemas de tu viaje. CABO PRIVATE TRANSPORTATION ofrece traslados privados y compartidos.'
                        : "When you arrive at Los Cabos International Airport (SJD), pre-booking your transportation is essential for a smooth start to your trip. CABO PRIVATE TRANSPORTATION offers exclusive private and shared transfers."}
                </p>

                {/* ACTION BUTTONS */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href={`/${lang}/`} className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 bg-neutral-900 rounded-full hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-[0.98] w-full sm:w-auto">
                        {lang === 'es' ? 'Reservar Transporte Ahora' : 'Book Transportation Now'}
                        <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    <Link href={`/${lang}/tours`} className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-neutral-900 transition-all duration-300 bg-white border border-neutral-200/80 rounded-full shadow-sm hover:shadow-md hover:bg-neutral-50 hover:border-neutral-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto">
                        {lang === 'es' ? 'Ver Tours y Servicios' : 'View Tours & Services'}
                    </Link>
                </div>
            </header>

            <main className="px-4 mx-auto max-w-7xl pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* COLUMNA IZQUIERDA (CONTENIDO) */}
        <div className="lg:col-span-8 order-2 lg:order-1">

                <section className="mb-20">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
                        {lang === 'es' ? 'Traslados desde el Aeropuerto de Los Cabos (SJD)' : 'Cabo Airport Shuttles from Los Cabos (SJD) Airport'}
                    </h2>
                    <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Cabo San Lucas es un destino de ensueño para muchos viajeros, con sus impresionantes playas y su vibrante vida nocturna que atrae a visitantes de todo el mundo. Al planificar cómo moverse, muchos viajeros eligen los servicios de CABO PRIVATE TRANSPORTATION desde el aeropuerto SJD para acceder rápidamente a los hoteles y villas de Los Cabos. Debido a estrictas regulaciones en esta zona federal, las aplicaciones de viajes compartidos como Uber no pueden recogerte directamente desde la acera de llegadas de la terminal. Para asegurarte la mejor experiencia posible, considera nuestras opciones de transporte.'
                                : 'Cabo San Lucas is a dream destination for many travelers. Its stunning beaches and vibrant nightlife attract visitors from around the world. Due to strict regulations in this federal zone, rideshare apps like Uber cannot pick you up directly from the terminal arrivals curb. When planning how you’ll get around, many visitors consider CABO PRIVATE TRANSPORTATION from SJD Airport to reach Los Cabos hotels and villas quickly. This award-winning service is recognized as one of the safest and most reliable transportation options.'}
                        </p>
            <div className="my-10">
              <GoogleReviewsWidget lang={lang} />
              <CustomerPhotosWidget lang={lang} />
            </div>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Llegar al Aeropuerto de Los Cabos (SJD) es el primer paso en tu aventura en Cabo. Nuestros servicios de transporte compartidos y privados ofrecen una solución conveniente para llegar a tu alojamiento.'
                                : 'Arriving at Los Cabos (SJD) Airport is the first step in your Cabo adventure. CABO PRIVATE TRANSPORTATION shuttles provide a convenient solution to reach your accommodation through private transfers and other reliable options.'}
                        </p>
                        
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mt-10 mb-6">
                            {lang === 'es'
                                ? 'Traslados desde SJD Internacional a los Resorts – Tarifas y Reservas'
                                : 'Cabo Mexico Airport Shuttles from SJD to Los Cabos Resorts – Rates & Booking'}
                        </h2>
                        
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                            <li>{lang === 'es' ? 'Traslado exclusivo sin escalas directamente del aeropuerto SJD a la puerta de tu Resort.' : 'Exclusive, non-stop transfer directly from SJD airport to Los Cabos Resorts door to door exclusive service.'}</li>
                            <li>{lang === 'es' ? 'Salida flexible — tu horario, tu traslado.' : 'Flexible departure—your schedule, your transfer.'}</li>
                            <li>{lang === 'es' ? 'Vehículos modernos y cómodos con choferes bilingües certificados.' : 'Modern, comfortable vehicles with licensed bilingual drivers.'}</li>
                            <li>{lang === 'es' ? 'Precios garantizados — sin tarifas ocultas.' : 'Guaranteed pricing—no hidden fees or surge rates.'}</li>
                            <li>{lang === 'es' ? 'Asientos para niños disponibles pre-reservando.' : 'Children’s car seats are required to be available pre-book.'}</li>
                            <li>{lang === 'es' ? 'Paradas para compras deben reservarse con anticipación.' : 'Grocery stops are required to be pre-booked.'}</li>
                        </ul>

                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Una de las mejores partes de organizar un transporte desde el Aeropuerto a tu resort con anticipación es asegurar una tarifa asequible. Nuestro servicio ofrece una tarifa plana de $80 USD por un viaje sencillo (cubre hasta 5 pasajeros). Si reservas un viaje de ida y vuelta, el costo total es de solo $140 USD. Reservar hoy garantiza tu tranquilidad.'
                                : 'One of the best parts of organizing a shuttle from Cabo Airport to Los Cabos Resorts in advance is locking in an affordable rate. Our service offers a flat rate of $80 USD for a one-way trip (this vehicle rate covers up to 5 passengers). If you book a round-trip, the total cost is only $140 USD. Reserve today to ensure a smooth start to your vacation.'}
                        </p>

                    </div>
                </section>

                {/* IMAGEN 1: SUBURBAN BALLARD SJD */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] mb-24 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group block hover:opacity-95 cursor-pointer">
                    <Link href={`/${lang}/cabo-airport-suv-service`}>
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
                            <p className="font-semibold text-xl tracking-tight mb-1">{lang === 'es' ? 'Ver Servicios SUV' : 'View SUV Services'}</p>
                        </div>
                    </Link>
                </div>

                {/* SJD AIRPORT TAXI BANNER (Dark Theme) */}
                <section className="mb-24">
                    <div className="bg-[#0F172A] text-white rounded-[2rem] p-10 md:p-14 shadow-xl">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
                            {lang === 'es' ? 'Comprendiendo las opciones en SJD' : 'Understanding Los Cabos (SJD) Airport Transportation'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-base md:text-lg leading-relaxed">
                            <p>
                                {lang === 'es'
                                    ? 'El Aeropuerto de Los Cabos (SJD) recibe millones de pasajeros cada año. Existen opciones privadas, compartidas y taxis. El transporte privado de CABO PRIVATE TRANSPORTATION es la opción preferida para viajar de forma personalizada y sin complicaciones.'
                                    : 'Cabo (SJD) Airport serves millions of passengers every year. Options include private shuttles, shared rides, and taxis. CABO PRIVATE TRANSPORTATION stands out for offering tailored services—a top choice among transportation options.'}
                            </p>
                            <p>
                                {lang === 'es'
                                    ? 'Los taxis son flexibles pero más costosos. Reservar con anticipación en CABO PRIVATE TRANSPORTATION asegura mejores tarifas y traslados sin complicaciones, garantizando privacidad y confort.'
                                    : 'Taxis are flexible but come with a heftier price tag. Booking CABO PRIVATE TRANSPORTATION in advance ensures better rates and hassle-free airport transfers, ensuring privacy and comfort.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* IMAGEN 2: TRANSPORTATION PRIVATE AIRPORT */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] mb-24 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group block hover:opacity-95 cursor-pointer">
                    <Link href={`/${lang}/private-transfers-los-cabos`}>
                        <Image
                            src="/transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd-cabo-private-1.webp"
                            alt="Private Transportation SJD Airport Los Cabos"
                            fill
                            sizes="(max-width: 768px) 100vw, 1000px"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <p className="font-semibold text-xl tracking-tight mb-1">{lang === 'es' ? 'Descubre Nuestros Traslados Privados' : 'Discover Our Private Transfers'}</p>
                        </div>
                    </Link>
                </div>
                
                <section className="mb-20">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
                        {lang === 'es' ? 'Cómo Reservar Paso a Paso' : 'How to Book: Step-by-Step Guide'}
                    </h2>
                    <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Reservar tu traslado con CABO PRIVATE TRANSPORTATION es simple y rápido. Ofrecemos reservas en línea para brindarte comodidad y flexibilidad.'
                                : 'Booking a shuttle with CABO PRIVATE TRANSPORTATION from Cabo (SJD) Airport is simple and quick. Online booking provides convenience and flexibility.'}
                        </p>
                        <ul className="list-decimal pl-6 mb-6 space-y-2 text-neutral-700">
                            <li>{lang === 'es' ? 'Elige tu tipo de traslado (privado, ida y vuelta).' : 'Choose your type: Decide between private, one-way, or round-trip.'}</li>
                            <li>{lang === 'es' ? 'Reserva en línea de forma segura.' : 'Book online: Secure your spot via our website.'}</li>
                            <li>{lang === 'es' ? 'Confirma los detalles de tu llegada.' : 'Confirm details: Double-check your pick-up time and location.'}</li>
                            <li>{lang === 'es' ? 'Recibe tu confirmación de reserva.' : 'Receive confirmation: Keep a record of your booking details.'}</li>
                        </ul>
                        
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Al elegir a CABO PRIVATE TRANSPORTATION, puedes esperar un servicio excepcional: acceso a Wi-Fi en los vehículos, aire acondicionado perfecto, y un chofer profesional bilingüe.'
                                : 'By choosing CABO PRIVATE TRANSPORTATION, you can expect exceptional service: Wi-Fi access in most vehicles, perfect air-conditioning, and a professional bilingual driver.'}
                        </p>
                        
                        <h3 className="text-xl font-bold mt-10 mb-4 text-neutral-900">
                            {lang === 'es' ? 'Consejos de Expertos para un Traslado Sin Problemas' : 'Insider Tips for a Smooth Airport Transfer Experience'}
                        </h3>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'La preparación es clave. Llegar al aeropuerto con un plan claro te ahorrará tiempo. Si tu vuelo se retrasa, comunícate con CABO PRIVATE TRANSPORTATION y ajustaremos tu recogida. Reservar con nosotros significa comenzar tu viaje sin estrés.'
                                : 'Preparation is key. Arriving at the airport with a clear plan saves time and hassle. If your flight is delayed, contact CABO PRIVATE TRANSPORTATION immediately and we will accommodate you. Booking with us means starting your Cabo trip stress-free!'}
                        </p>

                    </div>
                </section>

                {/* IMAGEN 3: PRIVATE TRANSPORTATION LUXURY */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] mb-24 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group block hover:opacity-95 cursor-pointer">
                    <Link href={`/${lang}/private-transfers-cabo-san-lucas`}>
                        <Image
                            src="/private-transportation-sjd-airport-los-cabos-luxury.webp"
                            alt="Private Transportation SJD Airport Los Cabos Luxury"
                            fill
                            sizes="(max-width: 768px) 100vw, 1000px"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <p className="font-semibold text-xl tracking-tight mb-1">{lang === 'es' ? 'Transporte de Lujo en Cabo San Lucas' : 'Luxury Transportation in Cabo San Lucas'}</p>
                        </div>
                    </Link>
                </div>

                {/* POPULAR ROUTES (Adapted) */}
                <section className="mb-24">
                    <div className="flex items-center mb-8">
                        <MapPin className="w-8 h-8 text-slate-700 mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                            {lang === 'es' ? 'Rutas Populares' : 'Popular Transfer Routes'}
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
                                { name: "Airport SJD to Waldorf Astoria", path: `/${lang}/destinations/sjd-to-waldorf-astoria` },
                                { name: "Airport SJD to Secrets Puerto Los Cabos", path: `/${lang}/destinations/sjd-to-secrets-puerto-los-cabos` },
                                { name: "Airport SJD to Hyatt Ziva Los Cabos", path: `/${lang}/destinations/sjd-to-hyatt-ziva` },
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
                                    {lang === 'es' ? 'Respondemos lo más rápido posible. Contáctanos en cualquier momento.' : 'We respond as quickly as possible. Reach out anytime.'}
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
                                <h4 className="font-bold text-neutral-900 text-lg mb-1">{lang === 'es' ? 'Asientos para Niños (Sillas)' : 'Child Safety Seats'}</h4>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    {lang === 'es' ? 'Proporcionamos asientos infantiles completamente gratis.' : 'We provide infant car seats completely free of charge upon request.'}
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
                                    {lang === 'es' ? 'Precios fijos transparentes sin tarifas inesperadas ni cargos ocultos.' : 'Transparent flat-rate pricing without any unexpected fees or hidden charges.'}
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

                    </div>

        {/* COLUMNA DERECHA (RESERVA) */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="sticky top-28">
            <GenericDestinationBooking lang={lang} locationName={lang === 'es' ? 'Los Cabos' : 'Los Cabos'} />
          </div>
        </div>

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
