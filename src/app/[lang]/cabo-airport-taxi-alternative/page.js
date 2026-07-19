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
        title: 'La Mejor Alternativa a Taxis en Aeropuerto de Cabo | Ballard Tours',
        description: 'Evita los taxis regulares. Descubre la mejor alternativa a los taxis del aeropuerto SJD con nuestro servicio de transporte privado y tarifas fijas.',
        keywords: 'Alternativa taxi Cabo, SJD airport taxi alternative, Transporte privado vs taxi Los Cabos',
    };
    return {
        title: 'The Best Cabo Airport Taxi Alternative | Private SJD Transfers',
        description: 'Skip the expensive regular taxis. Discover the best Cabo Airport Taxi Alternative with our reliable, flat-rate private transportation service.',
        keywords: 'Cabo Airport Taxi Alternative, SJD airport taxi, skip taxi cabo, private transfer vs taxi cabo',
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

            <main className="px-4 mx-auto max-w-7xl pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* COLUMNA IZQUIERDA (CONTENIDO) */}
        <div className="lg:col-span-8 order-2 lg:order-1">

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
            <div className="my-10">
              <GoogleReviewsWidget lang={lang} />
              <CustomerPhotosWidget lang={lang} />
            </div>
                        <p className="mb-6">
                            {lang === 'es'
                                ? 'Nuestras SUV de lujo son la opción perfecta para familias, ejecutivos o pequeños grupos de amigos que llevan equipaje extra, palos de golf o simplemente desean viajar con el mayor nivel de confort en Los Cabos. Además, te recibimos con bebidas frías de cortesía en el interior.'
                                : 'Our luxury SUVs are the perfect choice for families, executives, or small groups of friends carrying extra luggage, golf clubs, or simply wishing to travel with the highest level of comfort in Los Cabos. Plus, we welcome you with complimentary icy cold beverages inside.'}
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-6">
                            {lang === 'es'
                                ? 'La Alternativa Superior a los Taxis'
                                : 'The Superior Alternative to Local Taxis'}
                        </h2>
                        <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
                            <p className="mb-6">
                                {lang === 'es' ? (
                                    <>Si buscas seguridad, precios fijos y comodidad, nuestra flota de SUV es la mejor <strong>cabo airport taxi alternative</strong> disponible. A diferencia de los taxis locales, nuestros vehículos ofrecen lujo garantizado sin sorpresas en el precio.</>
                                ) : (
                                    <>If you are looking for safety, flat rates, and comfort, our SUV fleet is the best <strong>cabo airport taxi alternative</strong> available. Unlike local taxis, our vehicles offer guaranteed luxury with no surprise pricing.</>
                                )}
                            </p>
                            <p className="mb-6">
                                {lang === 'es' ? (
                                    <>Elegir una <strong>cabo airport taxi alternative</strong> significa que tendrás un chofer bilingüe profesional esperándote, vehículos mucho más amplios para tu equipaje y tarifas transparentes establecidas antes de tu llegada.</>
                                ) : (
                                    <>Choosing a reliable <strong>cabo airport taxi alternative</strong> means you will have a professional bilingual driver waiting for you, much larger vehicles for your luggage, and transparent rates set before you arrive.</>
                                )}
                            </p>
                            <p>
                                {lang === 'es' ? (
                                    <>Asegura tu traslado hoy mismo con nuestra <strong>cabo airport taxi alternative</strong> y disfruta de un servicio premium que los transportes convencionales del aeropuerto simplemente no pueden igualar.</>
                                ) : (
                                    <>Secure your transfer today with our <strong>cabo airport taxi alternative</strong> and enjoy a premium service that conventional airport transportation simply cannot match.</>
                                )}
                            </p>

                            <section className="mt-16 pt-16 border-t border-neutral-200 text-neutral-600">

                                {/* VERSIÓN INGLÉS */}
                                {lang !== 'es' && (
                                    <article className="prose prose-lg prose-neutral max-w-none">
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
                                            The Asphalt Battlefield: An Investigative Report on Finding a Reliable <strong>cabo airport taxi alternative</strong> and the High-Stakes <strong>Los Cabos Uber</strong> Dilemma
                                        </h1>

                                        <p className="mb-6 leading-relaxed">
                                            Stepping off the aircraft into the dry, radiating heat of Baja California Sur is a moment of pure relief for millions of American tourists each year. The promise of pristine beaches, luxury resorts, and endless margaritas is palpable. However, before the vacation truly begins, every traveler must navigate a fiercely contested micro-economy hidden in plain sight. As you wheel your luggage past customs and the notorious timeshare salespeople at the San José del Cabo International Airport (SJD), you step into a high-stakes turf war. The combatants? The entrenched local taxi syndicates, the private operators offering a premium <strong>cabo airport taxi alternative</strong>, and the controversial digital disruptor known as <strong>Los Cabos Uber</strong>. Our months-long investigation uncovers the intricate web of federal laws, union monopolies, and digital rebellion that defines your first hour in Mexico.
                                        </p>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Federal Fortress: Why You Need a <strong>cabo airport taxi alternative</strong></h2>
                                        <p className="mb-6 leading-relaxed">
                                            To understand the complexity of ground transit in this paradise, one must first examine the legal jurisdiction of SJD. The airport sits miles away from the main tourist hubs of the Tourist Corridor and Cabo San Lucas. Crucially, the airport operates as a federal zone under Mexican law. This means local municipal transit rules are entirely superseded by strict federal regulations. This jurisdictional quirk is the absolute foundation of the transportation conflict. Every time a traveler experiences sticker shock at the curb and searches for a viable <strong>cabo airport taxi alternative</strong>, or wonders why a <strong>Los Cabos Uber</strong> cannot simply pull up to Terminal 2, the answer traces back to these federal concessions. The tarmac and curbsides are fiercely guarded territories, yielding millions of dollars in daily revenue, and access is heavily restricted.
                                        </p>

                                        <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">The Cost of the Status Quo</h3>
                                        <p className="mb-6 leading-relaxed">
                                            If you arrive without a plan, you will inevitably fall into the hands of the traditional airport taxi network. Brightly colored vans and sedans line up in a highly orchestrated queue outside the terminals. But what exactly dictates their pricing? Many tourists are stunned when quoted fares upwards of $80 to $120 USD just for a standard ride to a Cabo San Lucas resort. These exorbitant prices are what drive the immense demand for a reliable <strong>cabo airport taxi alternative</strong>. The medallions required to operate directly from the airport curbside are strictly limited in number, passed down through generations, or sold for astronomical sums. When you pay that curb rate, you are sustaining a legacy monopoly, making the search for a <strong>cabo airport taxi alternative</strong> not just a matter of preference, but of financial necessity.
                                        </p>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Digital Disruption: The High-Risk Reality of <strong>Los Cabos Uber</strong></h2>
                                        <p className="mb-6 leading-relaxed">
                                            Enter the modern disruptor: <strong>Los Cabos Uber</strong>. When the global ride-sharing giant first launched its services in Baja California Sur, it sparked immediate, visceral, and sometimes violent backlash from the traditional transportation unions. For American tourists fully accustomed to tapping an app for a quick, cheap ride, the concept of a <strong>Los Cabos Uber</strong> seemed like a miraculous savior and the ultimate <strong>cabo airport taxi alternative</strong>. However, the operational reality of utilizing a <strong>Los Cabos Uber</strong> directly at the airport is incredibly complicated, legally murky, and fraught with unexpected tension.
                                        </p>

                                        <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">The Illusion of Convenience: Can You Actually Take a <strong>Los Cabos Uber</strong>?</h3>
                                        <p className="mb-6 leading-relaxed">
                                            This remains the ultimate question for budget-conscious travelers. Because the airport is a strictly enforced federal zone, and independent app drivers do not possess million-dollar federal transportation licenses, a <strong>Los Cabos Uber</strong> is legally prohibited from picking up passengers anywhere near the terminal curbside. If a <strong>Los Cabos Uber</strong> driver is caught by federal police or transport inspectors attempting a pickup, they face devastating fines and immediate vehicle impoundment. Consequently, if you request a <strong>Los Cabos Uber</strong> upon landing, the app will force you to walk off federal property. This requires a hot, dusty, and exhausting 15-to-20-minute trek with all your luggage out to the main highway, Highway 1. While <strong>Los Cabos Uber</strong> is a fantastic, cost-effective tool for moving between downtown restaurants later in your trip, relying on it as your primary <strong>cabo airport taxi alternative</strong> upon arrival is a high-risk physical gamble.
                                        </p>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Pre-Planned Sanctuary: The Ultimate <strong>cabo airport taxi alternative</strong></h2>
                                        <p className="mb-6 leading-relaxed">
                                            For the vast majority of seasoned American tourists, the chaos of arrival and the physical demands of the ride-share walk are entirely bypassed by securing a private <strong>cabo airport taxi alternative</strong> well in advance. During our extensive on-the-ground reporting, a clear consensus emerged among luxury travelers and resort managers alike: pre-booked, private transit is the undisputed backbone of the region's elite tourism logistics. Companies operating in this space maintain massive, meticulously serviced fleets of luxury SUVs and private passenger vans designed to whisk you away the moment you exit the terminal.
                                        </p>

                                        <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Why Pre-Booking Beats the Curb</h3>
                                        <p className="mb-6 leading-relaxed">
                                            The dominance of private shuttles as a <strong>cabo airport taxi alternative</strong> is no accident; it is the result of rigorous compliance and unparalleled customer service. These operators pay significant premiums for specialized federal plates, allowing them to legally and peacefully wait for passengers on the airport grounds—unlike a <strong>Los Cabos Uber</strong>. When you invest in this type of <strong>cabo airport taxi alternative</strong>, you are buying ultimate peace of mind. A uniformed, bilingual driver waits with a personalized sign, offering ice-cold water, a chilled beer, and immediate refuge in an air-conditioned cabin. It bridges the gap between the overpriced traditional taxi and the physically demanding <strong>Los Cabos Uber</strong> highway pickup.
                                        </p>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">A Traveler's Guide: Making the Right Choice for Your Extraction</h2>
                                        <p className="mb-4">Based on our extensive investigative reporting, here is the definitive breakdown of how to navigate your exit from the airport and choose the right <strong>cabo airport taxi alternative</strong> without becoming a casualty of the transportation turf war:</p>
                                        <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                                            <li><strong>For Absolute Luxury, Safety, and Convenience:</strong> Pre-book a private <strong>cabo airport taxi alternative</strong> (like a luxury shuttle or SUV) before you fly. It guarantees a legally compliant, VIP extraction directly to your resort lobby, entirely bypassing the chaos.</li>
                                            <li><strong>For Immediate, Unplanned Travel:</strong> Pay the premium at the curb. While undeniably expensive and lacking the value of a true <strong>cabo airport taxi alternative</strong>, the union taxis possess the exclusive legal right to pick you up immediately without pre-arrangement.</li>
                                            <li><strong>For Budget Travelers Willing to Sweat:</strong> The <strong>Los Cabos Uber</strong> is a viable <strong>cabo airport taxi alternative</strong>, but strictly if you are willing to physically drag your luggage entirely off the federal airport premises to the main highway, operating away from the eyes of strict federal inspectors.</li>
                                        </ul>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Conclusion: The Future of Transit in Baja</h2>
                                        <p className="mb-6 leading-relaxed">
                                            The battle lines on the asphalt of Baja are firmly drawn and heavily guarded. While premium providers of a private <strong>cabo airport taxi alternative</strong> maintain their steady, luxurious grip on the discerning traveler market, the simmering tension between the entrenched syndicates and the guerrilla tactics of <strong>Los Cabos Uber</strong> continues to evolve. For the American tourist, understanding this complex dynamic is the key to starting a vacation flawlessly. Knowledge is power, and knowing whether to pre-book a <strong>cabo airport taxi alternative</strong>, pay the premium at the curb, or take the long walk to summon a <strong>Los Cabos Uber</strong> is the very first test of navigating the beautiful, chaotic reality of Los Cabos.
                                        </p>
                                    </article>
                                )}

                                {/* VERSIÓN ESPAÑOL */}
                                {lang === 'es' && (
                                    <article className="prose prose-lg prose-neutral max-w-none">
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
                                            El Campo de Batalla del Asfalto: Un Reportaje de Investigación sobre la Búsqueda de un <strong>cabo airport taxi alternative</strong> y el Dilema de <strong>Los Cabos Uber</strong>
                                        </h1>

                                        <p className="mb-6 leading-relaxed">
                                            Bajar del avión y sentir el calor seco y radiante de Baja California Sur es un momento de puro alivio para millones de turistas estadounidenses cada año. La promesa de playas prístinas, resorts de lujo y margaritas interminables es palpable. Sin embargo, antes de que las vacaciones comiencen realmente, cada viajero debe navegar por una microeconomía ferozmente disputada y oculta a simple vista. Mientras arrastras tu equipaje por la aduana y pasas a los notorios vendedores de tiempo compartido en el Aeropuerto Internacional de San José del Cabo (SJD), entras en una guerra territorial de altas apuestas. ¿Los combatientes? Los arraigados sindicatos de taxis locales, los operadores privados que ofrecen un <strong>cabo airport taxi alternative</strong> de primera calidad, y el controversial disruptor digital conocido como <strong>Los Cabos Uber</strong>. Nuestra investigación de meses de duración descubre la intrincada red de leyes federales, monopolios sindicales y rebelión digital que define tu primera hora en México.
                                        </p>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Fortaleza Federal: Por Qué Necesitas un <strong>cabo airport taxi alternative</strong></h2>
                                        <p className="mb-6 leading-relaxed">
                                            Para entender la complejidad del transporte terrestre en este paraíso, primero se debe examinar la jurisdicción legal de SJD. El aeropuerto se encuentra a kilómetros de los principales centros turísticos del Corredor Turístico y Cabo San Lucas. Fundamentalmente, el aeropuerto opera como una zona federal bajo la estricta ley mexicana. Esto significa que las reglas de tránsito municipales locales son totalmente superadas por las regulaciones federales. Esta peculiaridad jurisdiccional es la base absoluta del conflicto de transporte. Cada vez que un viajero se asusta con los precios en la acera y busca un <strong>cabo airport taxi alternative</strong> viable, o se pregunta por qué un <strong>Los Cabos Uber</strong> no puede simplemente llegar a la Terminal 2, la respuesta se remonta a estas concesiones federales. Las pistas y aceras son territorios ferozmente vigilados que generan millones de dólares en ingresos diarios, y el acceso está fuertemente restringido.
                                        </p>

                                        <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">El Costo del Status Quo</h3>
                                        <p className="mb-6 leading-relaxed">
                                            Si llegas sin un plan, inevitablemente caerás en manos de la red tradicional de taxis del aeropuerto. Camionetas y sedanes de colores brillantes se alinean en una cola altamente orquestada fuera de las terminales. Pero, ¿qué dicta exactamente sus precios? Muchos turistas se quedan atónitos cuando se les cotizan tarifas de $80 a $120 USD solo por un viaje estándar a un resort en Cabo San Lucas. Estos precios exorbitantes son los que impulsan la inmensa demanda de un <strong>cabo airport taxi alternative</strong> confiable. Las concesiones requeridas para operar directamente desde la acera del aeropuerto están estrictamente limitadas en número, se transmiten de generación en generación o se venden por sumas astronómicas. Cuando pagas esa tarifa de acera, estás sosteniendo un monopolio heredado, haciendo que la búsqueda de un <strong>cabo airport taxi alternative</strong> no sea solo una cuestión de preferencia, sino de necesidad financiera.
                                        </p>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Disrupción Digital: La Realidad de Alto Riesgo de <strong>Los Cabos Uber</strong></h2>
                                        <p className="mb-6 leading-relaxed">
                                            Entra el disruptor moderno: <strong>Los Cabos Uber</strong>. Cuando el gigante global de viajes compartidos lanzó por primera vez sus servicios en Baja California Sur, provocó una reacción inmediata, visceral y, a veces, violenta por parte de los sindicatos de transporte tradicionales. Para los turistas estadounidenses totalmente acostumbrados a tocar una aplicación para un viaje rápido y barato, el concepto de un <strong>Los Cabos Uber</strong> parecía un salvador milagroso y el <strong>cabo airport taxi alternative</strong> definitivo. Sin embargo, la realidad operativa de utilizar un <strong>Los Cabos Uber</strong> directamente en el aeropuerto es increíblemente complicada, legalmente turbia y está plagada de tensiones inesperadas.
                                        </p>

                                        <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">La Ilusión de la Comodidad: ¿Realmente Puedes Tomar un <strong>Los Cabos Uber</strong>?</h3>
                                        <p className="mb-6 leading-relaxed">
                                            Esta sigue siendo la pregunta definitiva para los viajeros conscientes de su presupuesto. Debido a que el aeropuerto es una zona federal estrictamente aplicada, y los conductores de aplicaciones independientes no poseen licencias de transporte federales millonarias, un <strong>Los Cabos Uber</strong> tiene legalmente prohibido recoger pasajeros en cualquier lugar cerca de la acera de la terminal. Si la policía federal o los inspectores de transporte sorprenden a un conductor de <strong>Los Cabos Uber</strong> intentando recoger a alguien, enfrentan multas devastadoras y la incautación inmediata del vehículo. En consecuencia, si solicitas un <strong>Los Cabos Uber</strong> al aterrizar, la aplicación te obligará a salir de la propiedad federal. Esto requiere una caminata calurosa, polvorienta y agotadora de 15 a 20 minutos con todo tu equipaje hasta la carretera principal, la Carretera 1. Si bien <strong>Los Cabos Uber</strong> es una herramienta fantástica y rentable para moverse entre restaurantes del centro más adelante en tu viaje, depender de él como tu principal <strong>cabo airport taxi alternative</strong> a tu llegada es una apuesta física de alto riesgo.
                                        </p>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">El Santuario Pre-planeado: El <strong>cabo airport taxi alternative</strong> Definitivo</h2>
                                        <p className="mb-6 leading-relaxed">
                                            Para la gran mayoría de los turistas estadounidenses experimentados, el caos de la llegada y las exigencias físicas de la caminata hacia el viaje compartido se evitan por completo asegurando un <strong>cabo airport taxi alternative</strong> privado con mucha anticipación. Durante nuestros exhaustivos reportajes sobre el terreno, surgió un claro consenso tanto entre los viajeros de lujo como entre los gerentes de resorts: el tránsito privado y pre-reservado es la columna vertebral indiscutible de la logística turística de élite de la región. Las empresas que operan en este espacio mantienen flotas masivas y meticulosamente mantenidas de SUV de lujo y camionetas de pasajeros privadas diseñadas para llevarte en el momento en que sales de la terminal.
                                        </p>

                                        <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Por Qué Pre-reservar Supera a la Acera</h3>
                                        <p className="mb-6 leading-relaxed">
                                            El dominio de los traslados privados como un <strong>cabo airport taxi alternative</strong> no es un accidente; es el resultado de un riguroso cumplimiento normativo y un servicio al cliente sin igual. Estos operadores pagan primas significativas por placas federales especializadas, lo que les permite esperar legal y pacíficamente a los pasajeros en los terrenos del aeropuerto, a diferencia de un <strong>Los Cabos Uber</strong>. Cuando inviertes en este tipo de <strong>cabo airport taxi alternative</strong>, estás comprando la máxima tranquilidad. Un conductor uniformado y bilingüe te espera con un letrero personalizado, ofreciendo agua helada, una cerveza fría y refugio inmediato en una cabina con aire acondicionado. Sirve de puente entre el taxi tradicional sobrevalorado y la exigente recogida en la carretera de <strong>Los Cabos Uber</strong>.
                                        </p>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Guía del Viajero: Tomando la Decisión Correcta para tu Extracción</h2>
                                        <p className="mb-4">Basándonos en nuestros exhaustivos reportajes de investigación, aquí está el desglose definitivo de cómo navegar por tu salida del aeropuerto y elegir el <strong>cabo airport taxi alternative</strong> adecuado sin convertirte en una víctima de la guerra territorial del transporte:</p>
                                        <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                                            <li><strong>Para Lujo, Seguridad y Comodidad Absolutos:</strong> Reserva previamente un <strong>cabo airport taxi alternative</strong> privado (como un transporte de lujo o SUV) antes de volar. Garantiza una extracción VIP y legalmente sólida directamente al vestíbulo de tu resort, evitando por completo el caos.</li>
                                            <li><strong>Para Viajes Inmediatos No Planificados:</strong> Paga la prima en la acera. Aunque indudablemente costosos y carentes del valor de un verdadero <strong>cabo airport taxi alternative</strong>, los taxis sindicalizados poseen el derecho legal exclusivo de recogerte inmediatamente sin un acuerdo previo.</li>
                                            <li><strong>Para Viajeros Económicos Dispuestos a Sudar:</strong> El <strong>Los Cabos Uber</strong> es un <strong>cabo airport taxi alternative</strong> viable, pero estrictamente si estás dispuesto a arrastrar físicamente tu equipaje completamente fuera de las instalaciones federales del aeropuerto hasta la carretera principal, operando lejos de la mirada de los estrictos inspectores federales.</li>
                                        </ul>

                                        <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Conclusión: El Futuro del Tránsito en Baja California Sur</h2>
                                        <p className="mb-6 leading-relaxed">
                                            Las líneas de batalla en el asfalto de Baja California Sur están firmemente trazadas y fuertemente custodiadas. Mientras que los proveedores premium de un <strong>cabo airport taxi alternative</strong> privado mantienen su control firme y lujoso sobre el mercado de viajeros exigentes, la tensión latente entre los sindicatos arraigados y las tácticas de guerrilla de <strong>Los Cabos Uber</strong> continúa evolucionando. Para el turista estadounidense, comprender esta compleja dinámica es la clave para comenzar unas vacaciones sin problemas. El conocimiento es poder, y saber si pre-reservar un <strong>cabo airport taxi alternative</strong>, pagar la prima en la acera o tomar la larga caminata para llamar a un <strong>Los Cabos Uber</strong> es la primera prueba real de navegar por la hermosa y caótica realidad de Los Cabos.
                                        </p>
                                    </article>
                                )}

                            </section>
                        </div>
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