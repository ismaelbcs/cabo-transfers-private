import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Calendar, Baby, Banknote, MapPin } from 'lucide-react';

export async function generateMetadata({ params }) {
  const lang = params?.lang || 'en';
  if (lang === 'es') return {
    title: 'Allways Cabo Airport Transportation | Traslados 100% Seguros',
    description: 'Elige siempre la mejor opción. Allways Cabo Airport transportation disponible 24/7. Vehículos de lujo y servicio privado sin tiempos de espera.',
    keywords: 'allways cabo airpoort transportation, always cabo transportation, traslados seguros SJD, transporte aeropuerto los cabos',
  };
  return {
    title: 'Allways Cabo Airport Transportation | 24/7 Reliable Shuttle',
    description: 'Always choose the best. Allways Cabo Airport transportation available 24/7. Luxury vehicles, private service, and zero wait times at SJD.',
    keywords: 'allways cabo airpoort transportation, always cabo transportation, SJD reliable transfers, cabo private shuttle',
  };
}

export default function AllwaysCaboPage({ params }) {
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

            <section className="mt-16 pt-16 border-t border-neutral-200 text-neutral-600">

              {/* VERSIÓN INGLÉS */}
              {lang !== 'es' && (
                <article className="prose prose-lg prose-neutral max-w-none">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
                    The Asphalt Battlefield: An Investigative Report on <strong>allways cabo airport transportation</strong>, the <strong>Los Cabos taxi</strong> Syndicates, and the <strong>Los Cabos Uber</strong> Dilemma
                  </h1>

                  <p className="mb-6 leading-relaxed">
                    Stepping off the aircraft into the dry, radiating heat of Baja California Sur is a moment of pure relief for millions of American tourists each year. The promise of pristine beaches, luxury resorts, and endless margaritas is palpable. However, before the vacation truly begins, every traveler must navigate a fiercely contested micro-economy hidden in plain sight. As you wheel your luggage past customs and the notorious timeshare salespeople, you step into a high-stakes turf war. The combatants? The highly organized fleets providing <strong>allways cabo airport transportation</strong>, the deeply entrenched <strong>Los Cabos taxi</strong> unions, and the controversial digital disruptor known as <strong>Los Cabos Uber</strong>. Our months-long investigation uncovers the intricate web of federal laws, union monopolies, and digital rebellion that defines your first hour in Mexico.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Federal Fortress: Decoding the Jurisdiction of SJD</h2>
                  <p className="mb-6 leading-relaxed">
                    To understand the complexity of ground transit in this paradise, one must first examine the legal jurisdiction of the San José del Cabo International Airport (SJD). The airport sits miles away from the main tourist hubs of the Tourist Corridor and Cabo San Lucas. Crucially, the airport operates as a federal zone under Mexican law. This means local municipal transit rules are entirely superseded by strict federal regulations. This jurisdictional quirk is the absolute foundation of the transportation conflict. Every time a traveler wonders why a <strong>Los Cabos taxi</strong> costs upwards of a hundred dollars, or why a <strong>Los Cabos Uber</strong> cannot simply pull up to Terminal 2, the answer traces back to these federal concessions. The tarmac and curbsides are fiercely guarded territories, yielding millions of dollars in daily revenue.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Navigating the "Shark Tank"</h3>
                  <p className="mb-6 leading-relaxed">
                    Veterans of Baja travel affectionately refer to the exit corridor of SJD as the "Shark Tank." Here, independent operators and timeshare representatives aggressively vie for the attention of unbooked tourists. The sheer volume of money exchanging hands daily in this small strip of pavement makes it a vital economic artery for the entire state. If you haven't arranged your <strong>allways cabo airport transportation</strong> prior to landing, you will be bombarded with offers, conflicting information, and high-pressure sales tactics. Operating legally in this space requires exorbitant federal licensing fees, rigorous background checks, and union memberships, making the curb a highly exclusive club.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Pre-Planned Sanctuary: The Rise of <strong>allways cabo airport transportation</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    For the vast majority of seasoned American tourists, the chaos of arrival is entirely bypassed by securing <strong>allways cabo airport transportation</strong> well in advance. During our extensive on-the-ground reporting, a clear consensus emerged among luxury travelers and resort managers alike: pre-booked, private transit is the undisputed backbone of the region's elite tourism logistics. Companies operating in this space maintain massive, meticulously serviced fleets of luxury Suburbans, Escalades, and private passenger vans designed to whisk you away the moment you exit the terminal.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Why <strong>allways cabo airport transportation</strong> Dominates the Market</h3>
                  <p className="mb-6 leading-relaxed">
                    The dominance of <strong>allways cabo airport transportation</strong> is no accident; it is the result of rigorous compliance and unparalleled customer service. These operators pay significant premiums for specialized federal plates, allowing them to legally and peacefully wait for passengers on the airport grounds. When you invest in <strong>allways cabo airport transportation</strong>, you are buying ultimate peace of mind. A uniformed, bilingual driver waits with a personalized sign, offering ice-cold water, a chilled beer, and immediate refuge in an air-conditioned cabin. Because they adhere to strict vehicle maintenance logs and mandatory insurance policies, they represent the safest, most legally secure, and stress-free option available in Baja.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Traditional Stronghold: Inside the <strong>Los Cabos taxi</strong> Monopoly</h2>
                  <p className="mb-6 leading-relaxed">
                    If you miss your pre-booked ride or decide to risk traveling without a plan, you will inevitably fall into the hands of the <strong>Los Cabos taxi</strong> network. Brightly colored vans and sedans line up in a highly orchestrated, seemingly endless queue outside the terminals. But what exactly dictates the pricing of a <strong>Los Cabos taxi</strong>? Many tourists experience immediate sticker shock when quoted fares of $80 to $120 USD just for a standard ride to a Cabo San Lucas resort. Our investigation into the <strong>Los Cabos taxi</strong> syndicates reveals a deep-rooted system built on historical territorial rights, immense union power, and heavily regulated federal tariffs.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">The Hidden Economics of a <strong>Los Cabos taxi</strong></h3>
                  <p className="mb-6 leading-relaxed">
                    A <strong>Los Cabos taxi</strong> is far more than a simple vehicle; it is a moving franchise within a powerful legacy syndicate. The medallions (or concessions) required to operate a <strong>Los Cabos taxi</strong> directly from the airport curbside are strictly limited in number. They are often passed down through generations or sold on the private market for astronomical sums. Therefore, when you step into a <strong>Los Cabos taxi</strong>, your high fare is not merely covering gasoline and the driver's time; it is paying a steep premium to sustain a legacy transportation monopoly that holds exclusive, iron-clad federal rights to pick up spontaneous, un-booked travelers.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Digital Disruption: The High-Risk Reality of <strong>Los Cabos Uber</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    Enter the modern disruptor: <strong>Los Cabos Uber</strong>. When the global ride-sharing giant first launched its services in Baja California Sur, it sparked immediate, visceral, and sometimes violent backlash from the traditional transportation unions. For American tourists fully accustomed to tapping an app for a quick $20 ride, the concept of a <strong>Los Cabos Uber</strong> seemed like a miraculous savior from exorbitant vacation transit costs. However, the operational reality of utilizing a <strong>Los Cabos Uber</strong> directly at the airport is incredibly complicated, legally murky, and fraught with unexpected tension.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">The Illusion of Convenience: Can You Actually Take a <strong>Los Cabos Uber</strong>?</h3>
                  <p className="mb-6 leading-relaxed">
                    This remains the ultimate question for budget-conscious travelers. Because the airport is a strictly enforced federal zone, and independent app drivers do not possess million-dollar federal transportation licenses, a <strong>Los Cabos Uber</strong> is legally prohibited from picking up passengers anywhere near the terminal curbside. If a <strong>Los Cabos Uber</strong> driver is caught by federal police or transport inspectors attempting a pickup, they face devastating fines and immediate vehicle impoundment. Consequently, if you request a <strong>Los Cabos Uber</strong>, the app will force you to walk off federal property—a hot, dusty, and exhausting 15-to-20-minute trek with all your luggage out to the main highway. While a <strong>Los Cabos Uber</strong> is a fantastic, cost-effective tool for moving between downtown restaurants later in your trip, relying on it for your initial airport extraction is a high-risk gamble.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">A Traveler's Guide: Making the Right Choice</h2>
                  <p className="mb-4">Based on our extensive investigative reporting, here is the definitive breakdown of how to navigate your exit from the airport without becoming a casualty of the transportation turf war:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                    <li><strong>For Absolute Luxury, Safety, and Convenience:</strong> Secure <strong>allways cabo airport transportation</strong> before you fly. It guarantees a legally compliant, VIP extraction from the airport directly to your resort lobby, entirely bypassing the chaos.</li>
                    <li><strong>For Immediate, Unplanned Travel:</strong> Utilize a federally licensed <strong>Los Cabos taxi</strong>. While undeniably expensive, they possess the exclusive legal right to pick you up immediately at the curb without pre-arrangement.</li>
                    <li><strong>For Budget Travelers Willing to Sweat:</strong> The <strong>Los Cabos Uber</strong> is an option, but strictly if you are willing to physically drag your luggage entirely off the federal airport premises to the main highway, operating away from the eyes of strict federal inspectors.</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Conclusion: The Future of Transit in Baja</h2>
                  <p className="mb-6 leading-relaxed">
                    The battle lines on the asphalt of Baja are firmly drawn and heavily guarded. While premium providers of <strong>allways cabo airport transportation</strong> maintain their steady, luxurious grip on the discerning traveler market, the simmering tension between the entrenched <strong>Los Cabos taxi</strong> syndicates and the guerrilla tactics of <strong>Los Cabos Uber</strong> continues to evolve. For the American tourist, understanding this complex dynamic is the key to starting a vacation flawlessly. Knowledge is power, and knowing whether to pre-book, pay the premium at the curb, or take the long walk to the highway is the very first test of navigating the beautiful, chaotic reality of Los Cabos.
                  </p>
                </article>
              )}

              {/* VERSIÓN ESPAÑOL */}
              {lang === 'es' && (
                <article className="prose prose-lg prose-neutral max-w-none">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
                    El Campo de Batalla del Asfalto: Un Reportaje de Investigación sobre <strong>allways cabo airport transportation</strong>, los Sindicatos de <strong>Los Cabos taxi</strong> y el Dilema de <strong>Los Cabos Uber</strong>
                  </h1>

                  <p className="mb-6 leading-relaxed">
                    Bajar del avión y sentir el calor seco y radiante de Baja California Sur es un momento de puro alivio para millones de turistas estadounidenses cada año. La promesa de playas prístinas, resorts de lujo y margaritas interminables es palpable. Sin embargo, antes de que las vacaciones comiencen realmente, cada viajero debe navegar por una microeconomía ferozmente disputada y oculta a simple vista. Mientras arrastras tu equipaje por la aduana y pasas a los notorios vendedores de tiempo compartido, entras en una guerra territorial de altas apuestas. ¿Los combatientes? Las flotas altamente organizadas que proveen <strong>allways cabo airport transportation</strong>, los arraigados sindicatos de <strong>Los Cabos taxi</strong> y el controversial disruptor digital conocido como <strong>Los Cabos Uber</strong>. Nuestra investigación de meses de duración descubre la intrincada red de leyes federales, monopolios sindicales y rebelión digital que define tu primera hora en México.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Fortaleza Federal: Descifrando la Jurisdicción de SJD</h2>
                  <p className="mb-6 leading-relaxed">
                    Para entender la complejidad del transporte terrestre en este paraíso, primero se debe examinar la jurisdicción legal del Aeropuerto Internacional de San José del Cabo (SJD). El aeropuerto se encuentra a kilómetros de los principales centros turísticos del Corredor Turístico y Cabo San Lucas. Fundamentalmente, el aeropuerto opera como una zona federal bajo la estricta ley mexicana. Esto significa que las reglas de tránsito municipales locales son totalmente superadas por las regulaciones federales. Esta peculiaridad jurisdiccional es la base absoluta del conflicto de transporte. Cada vez que un viajero se pregunta por qué un <strong>Los Cabos taxi</strong> cuesta más de cien dólares, o por qué un <strong>Los Cabos Uber</strong> no puede simplemente llegar a la Terminal 2, la respuesta se remonta a estas concesiones federales. Las pistas y aceras son territorios ferozmente vigilados que generan millones de dólares en ingresos diarios.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Navegando por el "Tanque de Tiburones"</h3>
                  <p className="mb-6 leading-relaxed">
                    Los veteranos de los viajes a Baja se refieren cariñosamente al pasillo de salida de SJD como el "Tanque de Tiburones". Aquí, los operadores independientes y los representantes de tiempo compartido compiten agresivamente por la atención de los turistas sin reservación. El gran volumen de dinero que cambia de manos diariamente en esta pequeña franja de pavimento lo convierte en una arteria económica vital para todo el estado. Si no has organizado tu <strong>allways cabo airport transportation</strong> antes de aterrizar, serás bombardeado con ofertas, información contradictoria y tácticas de venta de alta presión. Operar legalmente en este espacio requiere tarifas de licencias federales exorbitantes, rigurosas verificaciones de antecedentes y membresías sindicales, haciendo de la acera un club altamente exclusivo.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">El Santuario Pre-planeado: El Ascenso de <strong>allways cabo airport transportation</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    Para la gran mayoría de los turistas estadounidenses experimentados, el caos de la llegada se evita por completo al asegurar <strong>allways cabo airport transportation</strong> con mucha anticipación. Durante nuestros exhaustivos reportajes sobre el terreno, surgió un claro consenso tanto entre los viajeros de lujo como entre los gerentes de resorts: el tránsito privado y pre-reservado es la columna vertebral indiscutible de la logística turística de élite de la región. Las empresas que operan en este espacio mantienen flotas masivas y meticulosamente mantenidas de Suburbans de lujo, Escalades y camionetas de pasajeros privadas diseñadas para llevarte en el momento en que sales de la terminal.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Por qué <strong>allways cabo airport transportation</strong> Domina el Mercado</h3>
                  <p className="mb-6 leading-relaxed">
                    El dominio de <strong>allways cabo airport transportation</strong> no es un accidente; es el resultado de un riguroso cumplimiento normativo y un servicio al cliente sin igual. Estos operadores pagan primas significativas por placas federales especialadas, lo que les permite esperar legal y pacíficamente a los pasajeros en los terrenos del aeropuerto. Cuando inviertes en <strong>allways cabo airport transportation</strong>, estás comprando la máxima tranquilidad. Un conductor uniformado y bilingüe te espera con un letrero personalizado, ofreciendo agua helada, una cerveza fría y refugio inmediato en una cabina con aire acondicionado. Debido a que cumplen con estrictos registros de mantenimiento de vehículos y pólizas de seguro obligatorias, representan la opción más segura, legalmente sólida y libre de estrés disponible en Baja California Sur.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">El Bastión Tradicional: Dentro del Monopolio de <strong>Los Cabos taxi</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    Si pierdes tu viaje pre-reservado o decides arriesgarte a viajar sin un plan, inevitablemente caerás en manos de la red de <strong>Los Cabos taxi</strong>. Camionetas y sedanes de colores brillantes se alinean en una cola altamente orquestada y aparentemente interminable fuera de las terminales. Pero, ¿qué dicta exactamente el precio de un <strong>Los Cabos taxi</strong>? Muchos turistas experimentan una sorpresa inmediata cuando se les cotizan tarifas de $80 a $120 USD solo por un viaje estándar a un resort en Cabo San Lucas. Nuestra investigación sobre los sindicatos de <strong>Los Cabos taxi</strong> revela un sistema profundamente arraigado construido sobre derechos territoriales históricos, un inmenso poder sindical y tarifas federales fuertemente reguladas.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">La Economía Oculta de un <strong>Los Cabos taxi</strong></h3>
                  <p className="mb-6 leading-relaxed">
                    Un <strong>Los Cabos taxi</strong> es mucho más que un simple vehículo; es una franquicia en movimiento dentro de un poderoso sindicato heredado. Las concesiones requeridas para operar un <strong>Los Cabos taxi</strong> directamente desde la acera del aeropuerto están estrictamente limitadas en número. A menudo se transmiten de generación en generación o se venden en el mercado privado por sumas astronómicas. Por lo tanto, cuando te subes a un <strong>Los Cabos taxi</strong>, tu alta tarifa no cubre meramente la gasolina y el tiempo del conductor; está pagando una alta prima para sostener un monopolio de transporte heredado que posee derechos federales exclusivos y blindados para recoger a viajeros espontáneos y sin reserva.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Disrupción Digital: La Realidad de Alto Riesgo de <strong>Los Cabos Uber</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    Entra el disruptor moderno: <strong>Los Cabos Uber</strong>. Cuando el gigante global de viajes compartidos lanzó por primera vez sus servicios en Baja California Sur, provocó una reacción inmediata, visceral y, a veces, violenta por parte de los sindicatos de transporte tradicionales. Para los turistas estadounidenses totalmente acostumbrados a tocar una aplicación para un viaje rápido de $20, el concepto de un <strong>Los Cabos Uber</strong> parecía ser un salvador milagroso de los exorbitantes costos de tránsito vacacional. Sin embargo, la realidad operativa de utilizar un <strong>Los Cabos Uber</strong> directamente en el aeropuerto es increíblemente complicada, legalmente turbia y está plagada de tensiones inesperadas.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">La Ilusión de la Comodidad: ¿Realmente Puedes Tomar un <strong>Los Cabos Uber</strong>?</h3>
                  <p className="mb-6 leading-relaxed">
                    Esta sigue siendo la pregunta definitiva para los viajeros conscientes de su presupuesto. Debido a que el aeropuerto es una zona federal estrictamente aplicada, y los conductores de aplicaciones independientes no poseen licencias de transporte federales millonarias, un <strong>Los Cabos Uber</strong> tiene legalmente prohibido recoger pasajeros en cualquier lugar cerca de la acera de la terminal. Si la policía federal o los inspectores de transporte sorprenden a un conductor de <strong>Los Cabos Uber</strong> intentando recoger a alguien, enfrentan multas devastadoras y la incautación inmediata del vehículo. En consecuencia, si solicitas un <strong>Los Cabos Uber</strong>, la aplicación te obligará a salir de la propiedad federal: una caminata calurosa, polvorienta y agotadora de 15 a 20 minutos con todo tu equipaje hasta la carretera principal. Si bien un <strong>Los Cabos Uber</strong> es una herramienta fantástica y rentable para moverse entre restaurantes del centro más adelante en tu viaje, depender de él para tu extracción inicial del aeropuerto es una apuesta de alto riesgo.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Guía del Viajero: Tomando la Decisión Correcta</h2>
                  <p className="mb-4">Basándonos en nuestros exhaustivos reportajes de investigación, aquí está el desglose definitivo de cómo navegar por tu salida del aeropuerto sin convertirte en una víctima de la guerra territorial del transporte:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                    <li><strong>Para Lujo, Seguridad y Comodidad Absolutos:</strong> Asegura <strong>allways cabo airport transportation</strong> antes de volar. Garantiza una extracción VIP y legalmente sólida desde el aeropuerto directamente al vestíbulo de tu resort, evitando por completo el caos.</li>
                    <li><strong>Para Viajes Inmediatos No Planificados:</strong> Utiliza un <strong>Los Cabos taxi</strong> con licencia federal. Aunque indudablemente costosos, poseen el derecho legal exclusivo de recogerte inmediatamente en la acera sin un acuerdo previo.</li>
                    <li><strong>Para Viajeros Económicos Dispuestos a Sudar:</strong> El <strong>Los Cabos Uber</strong> es una opción, pero estrictamente si estás dispuesto a arrastrar físicamente tu equipaje completamente fuera de las instalaciones federales del aeropuerto hasta la carretera principal, operando lejos de la mirada de los estrictos inspectores federales.</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Conclusión: El Futuro del Tránsito en Baja California Sur</h2>
                  <p className="mb-6 leading-relaxed">
                    Las líneas de batalla en el asfalto de Baja California Sur están firmemente trazadas y fuertemente custodiadas. Mientras que los proveedores premium de <strong>allways cabo airport transportation</strong> mantienen su control firme y lujoso sobre el mercado de viajeros exigentes, la tensión latente entre los arraigados sindicatos de <strong>Los Cabos taxi</strong> y las tácticas de guerrilla de <strong>Los Cabos Uber</strong> continúa evolucionando. Para el turista estadounidense, comprender esta compleja dinámica es la clave para comenzar unas vacaciones sin problemas. El conocimiento es poder, y saber si pre-reservar, pagar la prima en la acera o tomar la larga caminata hasta la carretera es la primera prueba real de navegar por la hermosa y caótica realidad de Los Cabos.
                  </p>
                </article>
              )}

            </section>
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