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
                        {lang === 'es' ? 'Traslados: Tu SJD Airport Shuttle' : 'Your SJD Airport Shuttle from Los Cabos'}
                    </h2>
                    <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Cabo San Lucas es un destino de ensueño para muchos viajeros. Al planificar cómo moverse, muchos viajeros eligen los servicios de CABO PRIVATE TRANSPORTATION como su SJD airport shuttle preferido para acceder rápidamente a los hoteles. Debido a estrictas regulaciones, las aplicaciones de viajes compartidos como Uber no pueden recogerte directamente. Para asegurarte la mejor experiencia posible, considera reservar tu SJD airport shuttle privado con nosotros.'
                                : 'Cabo San Lucas is a dream destination. Due to strict regulations, rideshare apps like Uber cannot pick you up directly from the terminal arrivals curb. When planning how you’ll get around, many visitors consider CABO PRIVATE TRANSPORTATION as their premium SJD airport shuttle to reach Los Cabos hotels quickly. Our SJD airport shuttle is recognized as one of the safest and most reliable transportation options.'}
                        </p>
            <div className="my-10">
              <GoogleReviewsWidget lang={lang} />
              <CustomerPhotosWidget lang={lang} />
            </div>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Llegar al Aeropuerto de Los Cabos (SJD) es el primer paso. Nuestro SJD airport shuttle ofrece una solución conveniente para llegar a tu alojamiento.'
                                : 'Arriving at Los Cabos (SJD) Airport is the first step in your Cabo adventure. A dedicated SJD airport shuttle provides a convenient solution to reach your accommodation.'}
                        </p>
                        
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mt-10 mb-6">
                            {lang === 'es'
                                ? 'Reserva tu SJD Airport Shuttle a los Resorts'
                                : 'SJD Airport Shuttle to Los Cabos Resorts – Rates & Booking'}
                        </h2>
                        
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                            <li>{lang === 'es' ? 'SJD airport shuttle exclusivo sin escalas directamente a tu Resort.' : 'Exclusive, non-stop SJD airport shuttle directly to your Los Cabos Resort.'}</li>
                            <li>{lang === 'es' ? 'Salida flexible para tu SJD airport shuttle.' : 'Flexible departure for your SJD airport shuttle.'}</li>
                            <li>{lang === 'es' ? 'El mejor SJD airport shuttle con choferes bilingües.' : 'The best SJD airport shuttle with licensed bilingual drivers.'}</li>
                            <li>{lang === 'es' ? 'SJD airport shuttle con precios garantizados — sin tarifas ocultas.' : 'Guaranteed pricing for your SJD airport shuttle—no hidden fees.'}</li>
                            <li>{lang === 'es' ? 'Asientos para niños disponibles en nuestro SJD airport shuttle.' : 'Children’s car seats are available in our SJD airport shuttle.'}</li>
                            <li>{lang === 'es' ? 'Paradas para compras en tu SJD airport shuttle.' : 'Grocery stops can be added to your SJD airport shuttle.'}</li>
                        </ul>

                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Asegurar tu SJD airport shuttle con anticipación garantiza una tarifa asequible. Nuestro SJD airport shuttle ofrece una tarifa plana de $80 USD por viaje (hasta 5 pasajeros). Un SJD airport shuttle de ida y vuelta cuesta $140 USD. Reservar tu SJD airport shuttle hoy garantiza tu tranquilidad.'
                                : 'Booking your SJD airport shuttle in advance locks in an affordable rate. Our SJD airport shuttle offers a flat rate of $80 USD for a one-way trip. A round-trip SJD airport shuttle is only $140 USD. Reserve your SJD airport shuttle today.'}
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
                
                {/* TRANSPORTATION OPTIONS SECTION */}
                <section className="mb-20">
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
                        {lang === 'es' ? 'Entendiendo el Transporte en Los Cabos (SJD)' : 'Los Cabos (SJD) Airport and Cabo San Lucas Transportation; Understanding'}
                    </h2>
                    <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'El Aeropuerto de Cabo (SJD), también conocido como Aeropuerto Internacional de Los Cabos, es la puerta principal a Cabo San Lucas. Atiende a millones de pasajeros cada año. Después de aterrizar, las opciones eficientes de transporte del aeropuerto de Cabo pueden llevarte rápidamente a tu destino final.'
                                : 'Cabo (SJD) Airport, also known as Los Cabos International Airport, is the main gateway to Cabo San Lucas. It serves millions of passengers every year. After landing, efficient cabo airport transport options can swiftly get you to your final destination in Cabo.'}
                        </p>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Aquí tienes un vistazo rápido a tus opciones de transporte:'
                                : 'Here’s a quick look at your transportation options:'}
                        </p>
                        <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                            <li><strong>{lang === 'es' ? 'Traslados Privados' : 'Private Shuttles'}:</strong> {lang === 'es' ? 'Directo y personalizado (un servicio popular de CABO PRIVATE TRANSPORTATION).' : 'Direct and personalized (a popular cabo shuttle service).'}</li>
                            <li><strong>{lang === 'es' ? 'Traslados Compartidos' : 'Shared Shuttles'}:</strong> {lang === 'es' ? 'Económicos y sociables.' : 'Cost-effective and sociable (shared shuttle Cabo options).'}</li>
                            <li><strong>{lang === 'es' ? 'Taxis' : 'Taxis'}:</strong> {lang === 'es' ? 'Convenientes pero más costosos.' : 'Convenient yet pricier (including a typical cabo airport taxi).'}</li>
                        </ul>
                        
                        <h3 className="text-xl font-bold mt-10 mb-4 text-neutral-900">
                            {lang === 'es' ? 'Comparando Servicios de Transporte: Consejos para elegir' : 'Comparing Shuttle Services: Tips for Choosing the Best Option'}
                        </h3>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Elegir el servicio de traslado adecuado puede mejorar tu experiencia de viaje. Al comparar proveedores de traslados en Cabo San Lucas, es esencial evaluar los servicios en función de precios y transparencia, opiniones de clientes, comodidades ofrecidas (como Wi-Fi y aire acondicionado) y opciones de reserva flexibles.'
                                : 'Choosing the right CABO PRIVATE TRANSPORTATION airport shuttle service can enhance your travel experience. To make an informed choice, focus on pricing and transparency, customer reviews and ratings, and offered amenities like Wi-Fi and air-conditioning.'}
                        </p>
                        
                        <h3 className="text-xl font-bold mt-10 mb-4 text-neutral-900">
                            {lang === 'es' ? 'Preguntas Frecuentes (FAQ) sobre SJD Airport Shuttle' : 'Frequently Asked Questions about SJD Airport Shuttle'}
                        </h3>
                        <div className="space-y-4 mb-6">
                            <p>
                                <strong>{lang === 'es' ? '¿Cuál es el SJD airport shuttle más confiable?' : 'What is the most reliable SJD airport shuttle?'}</strong><br />
                                {lang === 'es' 
                                    ? 'CABO PRIVATE TRANSPORTATION ofrece el servicio de SJD airport shuttle más confiable y mejor calificado, asegurando un viaje cómodo desde el Aeropuerto Internacional de Los Cabos directamente a tu resort.' 
                                    : 'CABO PRIVATE TRANSPORTATION offers the most reliable and highly-rated SJD airport shuttle service, ensuring a seamless and comfortable ride from Los Cabos International Airport directly to your resort.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Cuánto cuesta un SJD airport shuttle?' : 'How much does an SJD airport shuttle cost?'}</strong><br />
                                {lang === 'es' 
                                    ? 'Los precios varían, pero nuestro SJD shuttle privado de tarifa fija garantiza que no habrá cargos ocultos, convirtiéndolo en la opción más rentable y segura.' 
                                    : 'SJD airport shuttle prices vary, but our flat-rate private SJD shuttle guarantees no hidden fees, making it the most cost-effective and secure choice.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Dónde encuentro mi SJD airport shuttle al aterrizar?' : 'Where do I find my SJD airport shuttle after landing?'}</strong><br />
                                {lang === 'es' 
                                    ? 'Después de pasar aduanas y salir de la terminal, el chofer de tu SJD airport shuttle te estará esperando con un letrero personalizado. Te ayudamos a esquivar a los vendedores de tiempos compartidos para ir directo a tu vehículo.' 
                                    : 'After passing through customs and exiting the terminal, your SJD airport shuttle driver will be waiting for you outside with a personalized sign. We help you bypass timeshare vendors and go straight to your vehicle.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Puedo reservar un SJD airport shuttle el mismo día?' : 'Can I book an SJD airport shuttle on the same day?'}</strong><br />
                                {lang === 'es' 
                                    ? 'Recomendamos encarecidamente pre-reservar tu SJD airport shuttle en línea para garantizar disponibilidad y las mejores tarifas, aunque puedes contactarnos para viajes de último minuto.' 
                                    : 'We strongly recommend pre-booking your SJD airport shuttle online to guarantee availability and secure the best rates, although you can contact us for last-minute rides.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Cuál es la mejor manera de reservar?' : 'What is the best way to book a shuttle?'}</strong><br />
                                {lang === 'es' ? 'Reservar en línea en CABO PRIVATE TRANSPORTATION es a menudo lo más conveniente. Garantiza el mejor precio y disponibilidad.' : 'Online booking is often the most convenient. It ensures you get the best price and availability.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Están disponibles 24/7?' : 'Are Cabo airport shuttles available 24/7?'}</strong><br />
                                {lang === 'es' ? 'Sí, la mayoría de nuestros servicios operan todo el día, adaptándonos a tus vuelos.' : 'Most services operate around the clock. Check their availability, especially for late-night or early-morning transfers.'}
                            </p>
                            <p>
                                <strong>{lang === 'es' ? '¿Qué hago si mi vuelo se retrasa?' : 'What should I do if my flight is delayed?'}</strong><br />
                                {lang === 'es' ? 'Comunícate inmediatamente con nuestro equipo. Acomodaremos los retrasos de los vuelos con horarios actualizados de recogida.' : 'Contact the shuttle service immediately. We will accommodate flight delays with updated pickup times.'}
                            </p>
                        </div>
                        
                        <h3 className="text-xl font-bold mt-10 mb-4 text-neutral-900">
                            {lang === 'es' ? 'Conclusión: Comienza tu viaje sin estrés' : 'Conclusion: Start Your Cabo Trip Stress-Free'}
                        </h3>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Elegir el transporte correcto marca la pauta de tu viaje. Optar por CABO PRIVATE TRANSPORTATION garantiza una experiencia sin complicaciones desde el momento en que aterrizas en el aeropuerto SJD. Con el transporte adecuado, puedes comenzar tu viaje en Cabo sintiéndote renovado y listo para explorar.'
                                : 'Choosing the right airport shuttle sets the tone for your Cabo journey. Opting for a reliable service ensures a hassle-free experience from the moment you land at SJD Airport. With the right shuttle, you can start your Cabo trip feeling refreshed and ready for exploration.'}
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
