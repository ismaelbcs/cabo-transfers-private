// src/app/[lang]/fleet/page.js
'use client';

import React, { useEffect, use } from 'react';
import Link from 'next/link';
import {
    Users,
    ShieldCheck,
    MapPin,
    Star,
    Clock,
    Calendar,
    Baby,
    Banknote,
    Compass,
    ArrowRight
} from 'lucide-react';
// Ruta exacta basada en tu imagen:
import { FAQSection } from '../../../components/FaqBloque';

export default function FleetPage({ params }) {
    // 1. Desenvolvemos los parámetros para Next.js 15
    const resolvedParams = use(params);
    const lang = resolvedParams?.lang || 'en';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // 2. Diccionario de Traducciones (Inglés Principal)
    const content = {
        en: {
            seoTitle: "Our Fleet | Private & VIP Transportation in Los Cabos",
            seoDesc: "Discover our fleet of Vans and luxury SUVs for transportation in Los Cabos. VIP service to hotels, AirBnBs, private airports, and more.",
            title: "Our Fleet & Services.",
            subtitle: "Luxury vehicles tailored for every need.",
            
            // VAN
            vanTitle: "Group Van Transportation",
            vanBadge: "Up to 10 Passengers",
            vanText1: "Traveling as a group to Los Cabos has never been more comfortable and efficient. Our spacious Sprinter and Hiace Vans are designed to transport up to 10 passengers with all their luggage without sacrificing comfort.",
            vanText2: "The main benefit of choosing a Van is that your entire family, group of friends, or corporate team travels together, ensuring no one gets lost. Moreover, splitting the cost of a private Van is much more cost-effective than taking multiple taxis at the SJD airport. Equipped with dual-zone air conditioning and ergonomic seating, our Vans guarantee a refreshing start to your vacation.",
            vanKeywords: "Keywords: Los Cabos group transportation, SJD airport Van, private shuttle 10 passengers Cabo, Cabo family transport, Sprinter van rental Cabo.",

            // VIP / FBO
            vipTitle: "VIP Private Services & FBO",
            vipBadge: "Premium Experience",
            vipText1: "For those seeking maximum exclusivity, we offer our VIP Private Service in luxury SUVs such as the Chevrolet Suburban and Cadillac Escalade. Designed for executives and premium travelers, these vehicles offer an incredibly quiet and elegant ride.",
            vipText2: "We specialize in tarmac-side pickups at Private Airports (FBO) like the Cabo San Lucas International Airport (MMSL) and SJD FBO. Our sharply dressed chauffeurs will await you on the tarmac with complimentary drinks and refreshing towels, ensuring maximum discretion, privacy, and immediate transit to your resort with zero waiting in commercial customs.",
            vipKeywords: "Keywords: VIP transportation Los Cabos, SJD private FBO transfer, private chauffeur Cabo, luxury SUV airport Cabo, Cabo San Lucas MMSL transport.",

            // AIRBNB / VILLAS
            airbnbTitle: "Transfers to AirBnBs & Villas",
            airbnbBadge: "Door-to-Door Logistics",
            airbnbText1: "Vacation rentals are booming, and we are experts in logistics for AirBnBs and Private Villas. Unlike regular taxis that often get lost, our drivers perfectly know the entrances and strict security protocols of exclusive gated communities like Pedregal, Palmilla, Querencia, and Diamante.",
            airbnbText2: "By choosing this service, you get the huge benefit of requesting a Grocery Stop at Costco, Walmart, or Fresko. This way, you arrive at your Villa or AirBnB with a fully stocked fridge, cold drinks, and everything ready to enjoy without having to go out foraging on your first vacation day. We take you exactly door-to-door using precise GPS tracking.",
            airbnbKeywords: "Keywords: Los Cabos AirBnB transportation, Cabo private villa transfer, Pedregal transport, SJD airport grocery stop, Los Cabos vacation rental transport.",

            // ALL HOTELS
            hotelsTitle: "Full Coverage to All Resorts",
            hotelsBadge: "Direct Toll-Road Routes",
            hotelsText1: "No matter where you are staying, our private transportation service reaches every corner of the destination. We provide direct and safe transfers to the most prestigious hotels, including Nobu Hotel, Hard Rock Hotel, Diamante, Pueblo Bonito (Sunset Beach, Pacifica), Waldorf Astoria, Grand Velas, Chileno Bay, Montage, JW Marriott, Secrets Puerto Los Cabos, and Hyatt Ziva.",
            hotelsText2: "The greatest benefit of our hotel service is that we always take the Toll Road whenever possible—paid by us—to guarantee the fastest trip. Forget about shared shuttles that make stops at 5 hotels before yours. With Ballard Tours, you go straight from the SJD airport to your hotel lobby, maximizing your time at the pool or the beach.",
            hotelsKeywords: "Keywords: Los Cabos hotel transportation, SJD to Nobu, SJD to Hard Rock, Cabo resort transfers, Grand Velas transport Cabo, SJD to Waldorf Astoria.",

            // Attached sections
            benefitsTitle: "Why Book With Us",
            faqTitle: "Frequently Asked Questions",
            faqSubtitle: "Everything you need to know about our logistics and services.",
            routesTitle: "Popular Routes",
            toursTitle: "Tours & Excursions",
            paymentTitle: "Easy Booking & Flexible Payments",
            paymentText: "Three-click easy reservation website at Ballard Tours. Simply enter your destination or pickup location, choose your shuttle type, and click submit. At the end of the form, you will find the payment section, where you can select from the following options: pay with a credit card, opt for payment on arrival, or use PayPal for convenience."
        },
        es: {
            seoTitle: "Nuestra Flota | Transporte Privado y VIP en Los Cabos",
            seoDesc: "Conoce nuestra flota de Vans y SUVs de lujo para transporte en Los Cabos. Servicio VIP a hoteles, AirBnBs, aeropuertos privados y más.",
            title: "Nuestra Flota y Servicios.",
            subtitle: "Vehículos de lujo diseñados para cada necesidad.",
            
            // VAN
            vanTitle: "Transporte en Van para Grupos",
            vanBadge: "Hasta 10 Pasajeros",
            vanText1: "Viajar en grupo a Los Cabos nunca ha sido tan cómodo y eficiente. Nuestras espaciosas Sprinter y Hiace Vans están diseñadas para transportar hasta 10 pasajeros con todo su equipaje sin sacrificar comodidad.",
            vanText2: "El principal beneficio de elegir una Van es que todo tu grupo familiar, amigos o equipo corporativo viaja junto, asegurando que nadie se pierda. Además, dividir el costo de una Van privada resulta mucho más económico que tomar múltiples taxis en el aeropuerto de SJD. Equipadas con aire acondicionado de doble zona y asientos ergonómicos, nuestras Vans garantizan un inicio de vacaciones refrescante.",
            vanKeywords: "Keywords: transporte para grupos Los Cabos, Van aeropuerto SJD, shuttle privado 10 personas Cabo, transporte familiar Los Cabos.",

            // VIP / FBO
            vipTitle: "Servicios VIP y Aeropuertos FBO",
            vipBadge: "Experiencia Premium",
            vipText1: "Para aquellos que buscan la máxima exclusividad, ofrecemos nuestro Servicio Privado VIP en SUVs de lujo como Chevrolet Suburban y Cadillac Escalade. Diseñadas para ejecutivos y viajeros premium, estas unidades ofrecen un viaje sumamente silencioso y elegante.",
            vipText2: "Nos especializamos en recogidas directas en las pistas de Aeropuertos Privados (FBO) como el Aeropuerto Internacional de Cabo San Lucas (MMSL) y el SJD FBO. Nuestros choferes de etiqueta te esperarán pie de pista con bebidas de cortesía y toallas refrescantes, garantizando máxima discreción, privacidad y un tránsito inmediato hacia tu resort sin esperas en aduanas comerciales.",
            vipKeywords: "Keywords: transporte VIP Los Cabos, SJD FBO transfer, chofer privado Cabo, luxury SUV Cabo airport, Cabo San Lucas MMSL transport.",

            // AIRBNB / VILLAS
            airbnbTitle: "Traslados a AirBnBs y Villas",
            airbnbBadge: "Logística Puerta a Puerta",
            airbnbText1: "El turismo de alquiler vacacional está en auge, y nosotros somos expertos en la logística hacia AirBnBs y Villas Privadas. A diferencia de los taxis regulares que a menudo se pierden, nuestros choferes conocen a la perfección las entradas y protocolos de seguridad de las comunidades cerradas más exclusivas como Pedregal, Palmilla, Querencia y Diamante.",
            airbnbText2: "Al elegir este servicio, obtienes el gran beneficio de poder solicitar una parada de compras (Grocery Stop) en Costco, Walmart o Fresko. Así, llegarás a tu Villa o AirBnB con la despensa llena, bebidas frías y todo listo para disfrutar sin tener que salir a buscar provisiones en tu primer día de vacaciones. Te llevamos exactamente puerta a puerta mediante rastreo GPS preciso.",
            airbnbKeywords: "Keywords: transporte a AirBnB Los Cabos, Cabo villa transfer, transporte a Pedregal, grocery stop Cabo airport, Los Cabos vacation rental transport.",

            // ALL HOTELS
            hotelsTitle: "Cobertura a Todos los Hoteles",
            hotelsBadge: "Rutas Directas de Cuota",
            hotelsText1: "No importa dónde te hospedes, nuestro servicio de transporte privado llega a todos los rincones del destino. Proveemos traslados directos y seguros a los hoteles más prestigiosos, incluyendo Nobu Hotel, Hard Rock Hotel, Diamante, Pueblo Bonito (Sunset Beach, Pacifica), Waldorf Astoria, Grand Velas, Chileno Bay, Montage, JW Marriott, Secrets Puerto Los Cabos, y Hyatt Ziva.",
            hotelsText2: "El mayor beneficio de nuestro servicio de hotel es que tomamos la ruta de cuota (Toll Road) siempre que sea posible, pagada por nosotros, para garantizar el viaje más rápido posible. Olvídate de los shuttles compartidos que hacen paradas en 5 hoteles antes que el tuyo. Con Ballard Tours, vas directo del aeropuerto SJD al lobby de tu hotel, maximizando tu tiempo en la piscina o la playa.",
            hotelsKeywords: "Keywords: transporte a hoteles Los Cabos, SJD to Nobu, SJD to Hard Rock, resort transfers Cabo San Lucas, transporte Grand Velas Cabo.",

            // Attached sections
            benefitsTitle: "Beneficios de Reservar con Nosotros",
            faqTitle: "Preguntas Frecuentes",
            faqSubtitle: "Todo lo que necesitas saber sobre nuestra logística y servicios.",
            routesTitle: "Rutas Populares",
            toursTitle: "Tours y Excursiones",
            paymentTitle: "Pago Flexible y Seguro",
            paymentText: "Sitio web de reservación fácil en tres clics en Ballard Tours. Simplemente ingrese su destino o lugar de recogida, elija su tipo de transporte y haga clic en enviar. Al final del formulario, encontrará la sección de pago, donde puede seleccionar entre las siguientes opciones: pagar con tarjeta de crédito, optar por el pago a la llegada o usar PayPal para mayor comodidad."
        }
    };

    const t = content[lang];

    // Rutas Populares Compartidas (Adaptadas para Next.js App Router)
    const popularRoutes = [
        { name: "SJD to Nobu Hotel", path: "/destinations/sjd-to-nobu-hotel" },
        { name: "SJD to Hard Rock Hotel", path: "/destinations/sjd-to-hard-rock" },
        { name: "SJD to Riu Palace Baja California", path: "/destinations/sjd-to-riu-palace" },
        { name: "SJD to Riu Santa Fe", path: "/destinations/sjd-to-riu-santa-fe" },
        { name: "SJD to Grand Velas", path: "/destinations/sjd-to-grand-velas" },
        { name: "SJD to Waldorf Astoria Pedregal", path: "/destinations/sjd-to-waldorf-astoria" },
        { name: "SJD to Marquis Los Cabos", path: "/destinations/sjd-to-marquis" },
        { name: "SJD to Secrets Puerto Los Cabos", path: "/destinations/sjd-to-secrets-puerto-los-cabos" },
        { name: "SJD to Hilton Los Cabos", path: "/destinations/sjd-to-hilton-los-cabos" },
        { name: "SJD to Hyatt Ziva", path: "/destinations/sjd-to-hyatt-ziva" },
        { name: "SJD to Dreams Los Cabos", path: "/destinations/sjd-to-dreams-los-cabos" },
        { name: "SJD to Breathless Cabo", path: "/destinations/sjd-to-breathless" },
        { name: "SJD to Pueblo Bonito Sunset Beach", path: "/destinations/sjd-to-pueblo-bonito-sunset" },
        { name: "SJD to Pueblo Bonito Pacifica", path: "/destinations/sjd-to-pueblo-bonito-pacifica" }
    ];

    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans selection:bg-slate-900 selection:text-white">
            <title>{t.seoTitle}</title>
            <meta name="description" content={t.seoDesc} />

            {/* HERO SECTION (Emil Style: Minimalist & Tight Typography) */}
            <div className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
                    {t.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                    {t.subtitle}
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-4 space-y-12">

                {/* 1. VAN */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row group transition-transform duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="w-full lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                        <img src={`/hiace-airport-los-cabos-ballard.webp`} alt="Van Transportation up to 10 pax" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest mb-6 w-max">
                            <Users size={14} /> {t.vanBadge}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">{t.vanTitle}</h2>
                        <p className="text-slate-600 text-sm md:text-base mb-4 leading-relaxed font-medium">{t.vanText1}</p>
                        <p className="text-slate-600 text-sm md:text-base mb-6 leading-relaxed font-medium">{t.vanText2}</p>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{t.vanKeywords}</p>
                    </div>
                </div>

                {/* 2. PRIVATE VIP / FBO */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row-reverse group transition-transform duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="w-full lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                        <img src={`/suburban-airport-los-cabos-ballard.webp`} alt="Private VIP FBO Transportation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest mb-6 w-max shadow-md">
                            <Star size={14} /> {t.vipBadge}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">{t.vipTitle}</h2>
                        <p className="text-slate-600 text-sm md:text-base mb-4 leading-relaxed font-medium">{t.vipText1}</p>
                        <p className="text-slate-600 text-sm md:text-base mb-6 leading-relaxed font-medium">{t.vipText2}</p>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{t.vipKeywords}</p>
                    </div>
                </div>

                {/* 3. AIRBNB & VILLAS */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row group transition-transform duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="w-full lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                        <img src={`/suburban-airport-los-cabos-ballard-sjd.webp`} alt="AirBnB and Private Villas Transportation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest mb-6 w-max">
                            <MapPin size={14} /> {t.airbnbBadge}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">{t.airbnbTitle}</h2>
                        <p className="text-slate-600 text-sm md:text-base mb-4 leading-relaxed font-medium">{t.airbnbText1}</p>
                        <p className="text-slate-600 text-sm md:text-base mb-6 leading-relaxed font-medium">{t.airbnbText2}</p>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{t.airbnbKeywords}</p>
                    </div>
                </div>

                {/* 4. ALL HOTELS */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row-reverse group transition-transform duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                    <div className="w-full lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                        <img src={`/private-transportation-nobu-hotel-los-cabos.webp`} alt="All Hotels Los Cabos Transportation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest mb-6 w-max">
                            <ShieldCheck size={14} /> {t.hotelsBadge}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">{t.hotelsTitle}</h2>
                        <p className="text-slate-600 text-sm md:text-base mb-4 leading-relaxed font-medium">{t.hotelsText1}</p>
                        <p className="text-slate-600 text-sm md:text-base mb-6 leading-relaxed font-medium">{t.hotelsText2}</p>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{t.hotelsKeywords}</p>
                    </div>
                </div>

                {/* BENEFICIOS */}
                <div className="mb-10 mt-16 border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.benefitsTitle}</h2>
                </div>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Clock size={20} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-1">{lang === 'es' ? 'Soporte en Línea 24/7' : '24 / 7 Online Support'}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium">{lang === 'es' ? 'Respondemos de inmediato. Contáctanos por WhatsApp al +52 624 139 3497.' : 'We respond instantly. Reach out via WhatsApp at +52 624 139 3497.'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Calendar size={20} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-1">{lang === 'es' ? 'Asistencia de Itinerario' : 'Itinerary Assistance'}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium">{lang === 'es' ? 'Si necesitas ajustar horarios o cancelar, nuestro equipo local te asistirá rápidamente.' : 'Need to move a schedule or cancel? Our local team will assist you quickly.'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Baby size={20} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-1">{lang === 'es' ? 'Sillas de Seguridad Gratis' : 'Free Child Seats'}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium">{lang === 'es' ? 'Proveemos sillas para bebés y asientos elevados sin costo al solicitarlos en tu reserva.' : 'We provide infant car seats and boosters free of charge when requested.'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Banknote size={20} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-1">{lang === 'es' ? 'Tarifas Claras' : 'Affordable Rates'}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium">{lang === 'es' ? 'Ofrecemos tarifas fijas y transparentes. Sin cargos ocultos de última hora.' : 'We offer transparent flat-rate pricing without any unexpected hidden charges.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DIRECTORIO DE RUTAS Y TOURS (Bento Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
                    
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 flex flex-col hover:border-slate-300 transition-colors">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
                            <MapPin size={20} className="text-slate-400" /> {lang === 'es' ? 'Hoteles (A-M)' : 'Resorts (A-M)'}
                        </h2>
                        <ul className="space-y-3 text-sm text-slate-600 font-medium">
                            {popularRoutes.slice(0, 7).map((route, idx) => (
                                <li key={idx} className="flex items-start gap-2 group">
                                    <span className="text-slate-300 group-hover:text-slate-900 transition-colors">↳</span>
                                    <Link href={`/${lang}${route.path}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-900 transition-colors">
                                        {route.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 flex flex-col hover:border-slate-300 transition-colors">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
                            <MapPin size={20} className="text-slate-400" /> {lang === 'es' ? 'Hoteles (N-Z)' : 'Resorts (N-Z)'}
                        </h2>
                        <ul className="space-y-3 text-sm text-slate-600 font-medium mb-8">
                            {popularRoutes.slice(7).map((route, idx) => (
                                <li key={idx} className="flex items-start gap-2 group">
                                    <span className="text-slate-300 group-hover:text-slate-900 transition-colors">↳</span>
                                    <Link href={`/${lang}${route.path}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-slate-900 transition-colors">
                                        {route.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto border-t border-slate-100 pt-4">
                            <Link href={`/${lang}/blog`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-bold text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-1.5">
                                Ballard Tours Blog <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-800 p-8 flex flex-col text-white hover:border-slate-600 transition-colors">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
                            <Compass size={20} className="text-slate-400" /> {t.toursTitle}
                        </h2>
                        <ul className="space-y-3 text-sm text-slate-300 font-medium">
                            <li className="flex items-start gap-2 group"><span className="text-slate-600 group-hover:text-white transition-colors">↳</span><Link href={`/${lang}/tours/atv-off-road-adventure-cabo`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">ATV Off-Road Adventure</Link></li>
                            <li className="flex items-start gap-2 group"><span className="text-slate-600 group-hover:text-white transition-colors">↳</span><Link href={`/${lang}/tours/cabo-san-lucas-snorkel-tour`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Cabo Snorkel Tour</Link></li>
                            <li className="flex items-start gap-2 group"><span className="text-slate-600 group-hover:text-white transition-colors">↳</span><Link href={`/${lang}/tours/camel-safari-tour-cabo-san-lucas`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Camel Safari Tour</Link></li>
                            <li className="flex items-start gap-2 group"><span className="text-slate-600 group-hover:text-white transition-colors">↳</span><Link href={`/${lang}/tours/clear-boat-tour-cabo-san-lucas-arch`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Clear Boat to the Arch</Link></li>
                            <li className="flex items-start gap-2 group"><span className="text-slate-600 group-hover:text-white transition-colors">↳</span><Link href={`/${lang}/tours/espiritu-santo-island-tour-from-cabo`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Espiritu Santo Island</Link></li>
                            <li className="flex items-start gap-2 group"><span className="text-slate-600 group-hover:text-white transition-colors">↳</span><Link href={`/${lang}/tours/pirate-ship-sunset-tour-cabo`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Pirate Ship Sunset Tour</Link></li>
                            <li className="flex items-start gap-2 group"><span className="text-slate-600 group-hover:text-white transition-colors">↳</span><Link href={`/${lang}/tours/swim-with-whale-sharks-la-paz-cabo`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Swim with Whale Sharks</Link></li>
                        </ul>
                    </div>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 mt-12">
                    <FAQSection lang={lang} />
                </div>

                {/* MÉTODOS DE PAGO */}
                <div className="w-full flex flex-col items-center pt-12 pb-8 px-4 text-center">
                    <img src={`/pago-tarjetas.png`} alt="Métodos de Pago" className="h-10 md:h-12 object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 mb-6" />
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