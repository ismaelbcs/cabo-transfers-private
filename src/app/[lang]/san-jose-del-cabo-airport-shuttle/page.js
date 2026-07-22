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
        title: 'San Jose del Cabo Airport Shuttle | CABO PRIVATE TRANSPORTATION',
        description: 'Transporte privado y seguro. Reserva el mejor san jose del cabo airport shuttle para el inicio perfecto de tu viaje a Los Cabos.',
        keywords: 'san jose del cabo airport shuttle',
    };
    return {
        title: 'San Jose del Cabo Airport Shuttle | CABO PRIVATE TRANSPORTATION',
        description: 'Safe and private transportation. Book the best san jose del cabo airport shuttle for the perfect start to your trip to Los Cabos.',
        keywords: 'san jose del cabo airport shuttle',
    };
}

export default function SanJoseDelCaboAirportShuttlePage({ params }) {
    const lang = params?.lang || 'en';

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-200">

            {/* 1. HEADER SECTION */}
            <header className="px-6 py-24 mx-auto max-w-5xl text-center md:py-32">
                <div className="inline-flex items-center px-3 py-1 mb-8 text-xs font-medium rounded-full text-neutral-600 bg-neutral-100 border border-neutral-200">
                    ✨ {lang === 'es' ? 'Transporte Premium a San José' : 'Premium Transportation to San Jose'}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-neutral-900 mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-900">
                        San Jose del Cabo Airport Shuttle
                    </span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-neutral-600 max-w-2xl mx-auto">
                    {lang === 'es'
                        ? 'Cuando llegas al Aeropuerto Internacional de Los Cabos, pre-reservar tu san jose del cabo airport shuttle es esencial. CABO PRIVATE TRANSPORTATION ofrece el mejor san jose del cabo airport shuttle.'
                        : "When you arrive at Los Cabos International Airport, pre-booking your san jose del cabo airport shuttle is essential. CABO PRIVATE TRANSPORTATION offers the best san jose del cabo airport shuttle."}
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
                        {lang === 'es' ? 'Traslados: Tu San Jose del Cabo Airport Shuttle' : 'Your San Jose del Cabo Airport Shuttle'}
                    </h2>
                    <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'San José del Cabo es un destino de ensueño. Al planificar cómo moverse, muchos viajeros eligen a CABO PRIVATE TRANSPORTATION como su san jose del cabo airport shuttle preferido para acceder rápidamente a su hotel. Debido a estrictas regulaciones, Uber no puede recogerte en el aeropuerto. Para la mejor experiencia, considera reservar tu san jose del cabo airport shuttle privado con nosotros.'
                                : 'San Jose del Cabo is a dream destination. When planning how to get around, many consider CABO PRIVATE TRANSPORTATION as their premium san jose del cabo airport shuttle. Due to regulations, Uber cannot pick you up. Our san jose del cabo airport shuttle is recognized as one of the safest options.'}
                        </p>
            <div className="my-10">
              <GoogleReviewsWidget lang={lang} />
              <CustomerPhotosWidget lang={lang} />
            </div>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Llegar al Aeropuerto es el primer paso. Nuestro san jose del cabo airport shuttle ofrece una solución conveniente para llegar a tu alojamiento.'
                                : 'Arriving at the Airport is the first step. A dedicated san jose del cabo airport shuttle provides a convenient solution to reach your hotel.'}
                        </p>
                        
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mt-10 mb-6">
                            {lang === 'es'
                                ? 'Reserva tu San Jose del Cabo Airport Shuttle a los Resorts'
                                : 'San Jose del Cabo Airport Shuttle – Rates & Booking'}
                        </h2>
                        
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                            <li>{lang === 'es' ? 'Un san jose del cabo airport shuttle exclusivo y sin escalas.' : 'An exclusive, non-stop san jose del cabo airport shuttle.'}</li>
                            <li>{lang === 'es' ? 'Salida flexible para tu san jose del cabo airport shuttle.' : 'Flexible departure for your san jose del cabo airport shuttle.'}</li>
                            <li>{lang === 'es' ? 'El mejor san jose del cabo airport shuttle con choferes bilingües.' : 'The best san jose del cabo airport shuttle with licensed bilingual drivers.'}</li>
                            <li>{lang === 'es' ? 'Nuestro san jose del cabo airport shuttle con precios garantizados.' : 'Guaranteed pricing for your san jose del cabo airport shuttle.'}</li>
                            <li>{lang === 'es' ? 'Asientos para niños en nuestro san jose del cabo airport shuttle.' : 'Children’s car seats in our san jose del cabo airport shuttle.'}</li>
                            <li>{lang === 'es' ? 'Paradas para compras en tu san jose del cabo airport shuttle.' : 'Grocery stops can be added to your san jose del cabo airport shuttle.'}</li>
                        </ul>

                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Asegurar tu san jose del cabo airport shuttle con anticipación te da tranquilidad. Nuestro san jose del cabo airport shuttle ofrece excelentes tarifas planas. Un san jose del cabo airport shuttle de ida y vuelta es la mejor opción. Reservar tu san jose del cabo airport shuttle hoy es fácil.'
                                : 'Booking your san jose del cabo airport shuttle in advance locks in an affordable rate. Our san jose del cabo airport shuttle offers a great flat rate. A round-trip san jose del cabo airport shuttle is the best choice. Reserve your san jose del cabo airport shuttle today.'}
                        </p>

                    </div>
                </section>

                {/* IMAGEN 1: SUBURBAN BALLARD SJD */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] mb-24 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group block hover:opacity-95 cursor-pointer">
                    <Link href={`/${lang}/cabo-airport-suv-service`}>
                        <Image
                            src="/suburban-airport-los-cabos-ballard-sjd.webp"
                            alt="Chevrolet Suburban waiting at SJD Airport for your san jose del cabo airport shuttle"
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
                            {lang === 'es' ? 'Opciones de San Jose del Cabo Airport Shuttle' : 'Understanding your San Jose del Cabo Airport Shuttle options'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-base md:text-lg leading-relaxed">
                            <p>
                                {lang === 'es'
                                    ? 'Para llegar a tu hotel, un san jose del cabo airport shuttle de CABO PRIVATE TRANSPORTATION es la opción preferida por privacidad y confort.'
                                    : 'To get to your hotel, a san jose del cabo airport shuttle from CABO PRIVATE TRANSPORTATION stands out as a top choice.'}
                            </p>
                            <p>
                                {lang === 'es'
                                    ? 'Reservar con anticipación tu san jose del cabo airport shuttle asegura mejores tarifas y evitar esperas innecesarias.'
                                    : 'Booking your san jose del cabo airport shuttle in advance ensures better rates and hassle-free transfers.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* IMAGEN 2: TRANSPORTATION PRIVATE AIRPORT */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] mb-24 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group block hover:opacity-95 cursor-pointer">
                    <Link href={`/${lang}/private-transfers-los-cabos`}>
                        <Image
                            src="/transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd-cabo-private-1.webp"
                            alt="San Jose del Cabo Airport Shuttle vehicle"
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
                
                {/* TRANSPORTATION OPTIONS SECTION */}
                <section className="mb-20">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
                        {lang === 'es' ? 'Comparando: San Jose del Cabo Airport Shuttle' : 'San Jose del Cabo Airport Shuttle Options'}
                    </h2>
                    <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Un san jose del cabo airport shuttle es la puerta principal a tu descanso. Nuestro san jose del cabo airport shuttle te lleva de manera rápida y segura.'
                                : 'A san jose del cabo airport shuttle is the main gateway to your vacation. Our san jose del cabo airport shuttle takes you there swiftly.'}
                        </p>
                        
                        <h3 className="text-xl font-bold mt-10 mb-4 text-neutral-900">
                            {lang === 'es' ? 'Preguntas Frecuentes (FAQ) sobre San Jose del Cabo Airport Shuttle' : 'Frequently Asked Questions about San Jose del Cabo Airport Shuttle'}
                        </h3>
                        <div className="space-y-4 mb-6">
                            <p>
                                <strong>{lang === 'es' ? '¿Cuál es el san jose del cabo airport shuttle más confiable?' : 'What is the most reliable san jose del cabo airport shuttle?'}</strong><br />
                                {lang === 'es' 
                                    ? 'CABO PRIVATE TRANSPORTATION ofrece el san jose del cabo airport shuttle más confiable y mejor calificado.' 
                                    : 'CABO PRIVATE TRANSPORTATION offers the most reliable and highly-rated san jose del cabo airport shuttle.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Cuánto cuesta un san jose del cabo airport shuttle?' : 'How much does a san jose del cabo airport shuttle cost?'}</strong><br />
                                {lang === 'es' 
                                    ? 'Nuestro san jose del cabo airport shuttle de tarifa fija garantiza que no habrá cargos ocultos.' 
                                    : 'Our flat-rate san jose del cabo airport shuttle guarantees no hidden fees.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Dónde encuentro mi san jose del cabo airport shuttle al aterrizar?' : 'Where do I find my san jose del cabo airport shuttle after landing?'}</strong><br />
                                {lang === 'es' 
                                    ? 'El chofer de tu san jose del cabo airport shuttle te estará esperando con un letrero personalizado.' 
                                    : 'Your san jose del cabo airport shuttle driver will be waiting for you outside with a personalized sign.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Puedo reservar un san jose del cabo airport shuttle el mismo día?' : 'Can I book a san jose del cabo airport shuttle on the same day?'}</strong><br />
                                {lang === 'es' 
                                    ? 'Recomendamos pre-reservar tu san jose del cabo airport shuttle en línea para garantizar disponibilidad.' 
                                    : 'We strongly recommend pre-booking your san jose del cabo airport shuttle online to guarantee availability.'}
                            </p>
                        </div>
                        
                        <h3 className="text-xl font-bold mt-10 mb-4 text-neutral-900">
                            {lang === 'es' ? 'Conclusión: Inicia tu viaje en tu San Jose del Cabo Airport Shuttle' : 'Conclusion: Start Your Trip in your San Jose del Cabo Airport Shuttle'}
                        </h3>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Optar por un san jose del cabo airport shuttle garantiza una experiencia sin complicaciones. Con el san jose del cabo airport shuttle adecuado, tu viaje es un éxito.'
                                : 'Opting for a san jose del cabo airport shuttle ensures a hassle-free experience. With the right san jose del cabo airport shuttle, your trip is a success.'}
                        </p>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
                        {lang === 'es' ? 'Cómo Reservar Paso a Paso' : 'How to Book: Step-by-Step Guide'}
                    </h2>
                    <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Reservar tu traslado con CABO PRIVATE TRANSPORTATION es simple y rápido. Ofrecemos reservas en línea para brindarte comodidad y flexibilidad.'
                                : 'Booking a shuttle with CABO PRIVATE TRANSPORTATION is simple and quick. Online booking provides convenience and flexibility.'}
                        </p>
                        <ul className="list-decimal pl-6 mb-6 space-y-2 text-neutral-700">
                            <li>{lang === 'es' ? 'Elige tu tipo de traslado (privado, ida y vuelta).' : 'Choose your type: Decide between private, one-way, or round-trip.'}</li>
                            <li>{lang === 'es' ? 'Reserva en línea de forma segura.' : 'Book online: Secure your spot via our website.'}</li>
                            <li>{lang === 'es' ? 'Confirma los detalles de tu llegada.' : 'Confirm details: Double-check your pick-up time and location.'}</li>
                            <li>{lang === 'es' ? 'Recibe tu confirmación de reserva.' : 'Receive confirmation: Keep a record of your booking details.'}</li>
                        </ul>
                    </div>
                </section>

                {/* IMAGEN 3: PRIVATE TRANSPORTATION LUXURY */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] mb-24 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group block hover:opacity-95 cursor-pointer">
                    <Link href={`/${lang}/private-transfers-cabo-san-lucas`}>
                        <Image
                            src="/private-transportation-sjd-airport-los-cabos-luxury.webp"
                            alt="San Jose del Cabo Airport Shuttle Luxury"
                            fill
                            sizes="(max-width: 768px) 100vw, 1000px"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <p className="font-semibold text-xl tracking-tight mb-1">{lang === 'es' ? 'Transporte de Lujo' : 'Luxury Transportation'}</p>
                        </div>
                    </Link>
                </div>

                {/* POPULAR ROUTES */}
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

                {/* GOOGLE MAPS SJD AIRPORT */}
                <section className="mb-24">
                    <div className="flex items-center mb-8">
                        <MapPin className="w-8 h-8 text-slate-700 mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                            {lang === 'es' ? 'Ubicación del Aeropuerto de Los Cabos (SJD)' : 'Los Cabos Airport (SJD) Location'}
                        </h2>
                    </div>
                    <div className="w-full h-[400px] rounded-[2rem] overflow-hidden shadow-sm border border-neutral-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29388.083377287953!2d-109.73361545648833!3d23.149727400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86af50f0326f59bd%3A0xc3cf2a4db6873527!2sLos%20Cabos%20International%20Airport!5e0!3m2!1sen!2smx!4v1689912000000!5m2!1sen!2smx"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
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

                {/* EASY BOOKING & FLEXIBLE PAYMENT */}
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
            <GenericDestinationBooking lang={lang} locationName={lang === 'es' ? 'San José del Cabo' : 'San Jose del Cabo'} />
          </div>
        </div>

      </main>

            {/* FINAL CTA FOOTER */}
            <footer className="bg-neutral-900 py-20 px-6 border-t border-neutral-800 text-center text-white">
                <h2 className="text-3xl font-semibold tracking-tight mb-8">
                    {lang === 'es' ? 'Comienza tu Viaje a San José del Cabo' : 'Begin Your San Jose del Cabo Adventure'}
                </h2>
                <Link href={`/${lang}/`} className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold text-neutral-900 transition-all duration-300 bg-white rounded-full hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98]">
                    {lang === 'es' ? 'Obtener Precio y Reservar' : 'Get Instant Pricing & Book'}
                </Link>
            </footer>
        </div>
    );
}
