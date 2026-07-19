import React from 'react';
import GoogleReviewsWidget from '../../../components/GoogleReviewsWidget';
import CustomerPhotosWidget from '../../../components/CustomerPhotosWidget';
import GenericDestinationBooking from '../../../components/GenericDestinationBooking';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Calendar, Baby, Banknote, MapPin } from 'lucide-react';

export async function generateMetadata({ params }) {
  const lang = params?.lang || 'en';

  if (lang === 'es') {
    return {
      title: 'Transporte Premium en Aeropuerto de Los Cabos | Cabo Shuttle',
      description: 'Reserva tu transporte privado y shuttle en el Aeropuerto de Los Cabos (SJD). Traslados seguros, sin filas de taxi, a hoteles como Hyatt Ziva, Nobu y Hard Rock.',
      keywords: 'Transporte Aeropuerto Los Cabos, Shuttle Los Cabos, Taxi Aeropuerto SJD, Transporte privado Cabo San Lucas, Traslados SJD a hotel, Camionetas Los Cabos',
    };
  }

  return {
    title: 'Premium Cabo Airport Transportation & Shuttle Services',
    description: 'Experience seamless Cabo Airport Transportation and Cabo Airport Shuttle services. Book your private transportation from SJD Airport to Hyatt Ziva, Paradisus, Nobu, and more.',
    keywords: 'Cabo Airport Transportation, Cabo Airport Shuttle, SJD Airport Taxi, Private Transportation Cabo, Cabo San Lucas Airport Transfers, VIP Cabo Transportation',
  };
}

export default function CaboTransportationPage({ params }) {
  const lang = params?.lang || 'en';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-200">

      {/* 1. HEADER SECTION */}
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

      <main className="px-4 mx-auto max-w-7xl pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* COLUMNA IZQUIERDA (CONTENIDO) */}
        <div className="lg:col-span-8 order-2 lg:order-1">

        {/* TEXTO SEO SÚPER EXTENSO PARA DOMINAR GOOGLE */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-6">
            {lang === 'es' ? 'El Mejor Shuttle y Transporte Privado de Cabo' : 'The Ultimate Cabo Airport Shuttle & Private Transport'}
          </h2>
          <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
            <p className="mb-6">
              {lang === 'es'
                ? 'Cuando aterrizas en Baja California Sur, lo último de lo que quieres preocuparte es de navegar por redes de transporte local. Ya sea que viajes para una escapada romántica, un retiro corporativo o unas vacaciones familiares, nuestras soluciones de Shuttle y traslados privados están hechas a tu medida. Evitamos las caóticas filas de taxis afuera del aeropuerto SJD, ofreciéndote una experiencia de bienvenida personalizada (Meet and Greet) en la terminal.'
                : 'When you land in Baja California Sur, the last thing you want to worry about is navigating complex local transportation networks. Whether you are traveling for a romantic getaway, a corporate retreat, or a family vacation, our highly rated Cabo Airport Shuttle and private transfer solutions are tailored exactly to your needs. We bypass the chaotic taxi lines outside SJD airport, offering you a personalized meet-and-greet experience.'}
            </p>
            <div className="my-10">
              <GoogleReviewsWidget lang={lang} />
              <CustomerPhotosWidget lang={lang} />
            </div>
            <p className="mb-6">
              {lang === 'es'
                ? 'Elegir el transporte adecuado en el Aeropuerto de Los Cabos marca el tono de todo tu viaje. Nos especializamos en lujo punto a punto, empleando solo choferes totalmente certificados, bilingües y altamente capacitados. Monitoreamos el estado de tu vuelo en tiempo real, lo que significa que las llegadas anticipadas o los vuelos retrasados se acomodan sin problemas y sin tarifas de espera ocultas.'
                : 'Choosing the right Cabo Airport Transportation sets the tone for your entire trip. We specialize in point-to-point luxury, employing only fully licensed, bilingual, and highly trained chauffeurs. We monitor your flight status in real-time, meaning early arrivals or delayed flights are seamlessly accommodated without any hidden wait-time fees.'}
            </p>
            <p className="mb-6">
              {lang === 'es'
                ? '¿Te preguntas cómo ir del Aeropuerto SJD a tu hotel de forma segura? Ya sea que te alojes en el lujoso Corredor Turístico, en la vibrante zona de Medano Beach en el centro de Cabo San Lucas, o en la tranquila San José del Cabo, moverte por la península es muy sencillo con nuestros traslados privados al aeropuerto. Entendemos que encontrar un transporte VIP confiable en Cabo San Lucas puede ser abrumador. Por eso, nuestro personal te ayuda a esquivar las distracciones de los tiempos compartidos y te guía directo a tu vehículo.'
                : 'Are you wondering how to safely get from SJD Airport to your hotel? Whether you are staying at the luxurious Tourist Corridor, the vibrant Medano Beach in downtown Cabo San Lucas, or the peaceful San Jose del Cabo, navigating the peninsula is effortless with our dedicated private airport transfers. We understand that finding reliable VIP transportation in Cabo San Lucas can be overwhelming. That’s why our staff helps you dodge timeshare distractions and guides you straight to your vehicle.'}
            </p>
            <p className="mb-6">
              {lang === 'es'
                ? 'Si viajas con un grupo grande, nuestras espaciosas camionetas (Vans) en el aeropuerto de Cabo brindan suficiente espacio para todos tus acompañantes, equipaje y equipo de golf. Para aquellos que buscan la máxima elegancia, nuestras camionetas de lujo tipo SUV (como Suburbans y Escalades) garantizan un viaje suave, privado y con mucho estilo.'
                : 'If you are traveling with a larger group, our spacious Van rentals at the Cabo airport provide enough room for all your companions, luggage, and golf clubs. For those seeking maximum elegance, our luxury SUVs in Cabo (such as Suburbans and Escalades) guarantee a smooth, private, and highly stylish ride.'}
            </p>
            <p className="mb-6">
              {lang === 'es'
                ? 'Nuestros servicios exclusivos aseguran que puedas comenzar a relajarte en el momento en que sales de la terminal. Con bebidas bien frías esperándote en el vehículo, aire acondicionado ajustado a tu temperatura preferida e interiores de cuero inmaculados, redefinimos cómo debería sentirse un Cabo Airport Shuttle. La seguridad es nuestra principal prioridad; todos nuestros vehículos se someten a rigurosas inspecciones mecánicas diarias.'
                : 'Our exclusive services ensure you can start relaxing the moment you step out of the terminal. With icy cold beverages waiting in the vehicle, air conditioning set to your preferred temperature, and immaculate leather interiors, we redefine what a Cabo Airport Shuttle should feel like. Safety is our absolute top priority; all our vehicles undergo rigorous daily mechanical inspections.'}
            </p>
            <p>
              {lang === 'es'
                ? 'Ya sea que necesites transporte privado a Cabo San Lucas, San José del Cabo, La Paz, o Todos Santos, en Ballard Tours estamos comprometidos a brindar el mejor servicio de transporte en el aeropuerto de Los Cabos con tarifas altamente competitivas, facturación disponible y vehículos impecables que representan el verdadero servicio de primera clase en Baja California Sur.'
                : 'Whether you need private transportation to Cabo San Lucas, San Jose del Cabo, La Paz, or Todos Santos, at Ballard Tours we are committed to providing the absolute best SJD airport transportation service with highly competitive rates, available invoicing, and pristine vehicles that represent true first-class service in Baja California Sur.'}
            </p>

            <section className="mt-16 pt-16 border-t border-neutral-200 text-neutral-600">

              {/* VERSIÓN INGLÉS */}
              {lang !== 'es' && (
                <article className="prose prose-lg prose-neutral max-w-none">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
                    The Asphalt Battlefield: An Investigative Report on the Hidden Economics and Turf Wars of <strong>cabo airport transportation</strong>
                  </h1>

                  <p className="mb-6 leading-relaxed">
                    Stepping off the aircraft into the dry, radiating heat of Baja California Sur is a moment of pure relief for millions of American tourists each year. The promise of pristine beaches, world-class luxury resorts, and endless ocean views is palpable. However, before the vacation truly begins, every traveler must navigate a fiercely contested micro-economy hidden in plain sight. As you wheel your luggage past customs and politely decline the notoriously aggressive timeshare salespeople, you are unknowingly stepping into a high-stakes, multi-million-dollar turf war. At the heart of this conflict is a single, highly lucrative industry: <strong>cabo airport transportation</strong>.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Federal Zone: Understanding the Jurisdiction of <strong>cabo airport transportation</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    To truly comprehend the complexity and the often-frustrating nature of ground transit in Baja, one must first examine the layout, history, and legal jurisdiction of the airport itself. Located in the municipality of San José del Cabo, the international airport sits miles away from the main tourist hubs of the Tourist Corridor and the bustling nightlife of Cabo San Lucas. But the geographical distance is only half the story. Under Mexican law, the physical grounds of the airport operate as a strict federal zone.
                  </p>
                  <p className="mb-6 leading-relaxed">
                    This means that local municipal transit rules are entirely superseded by federal regulations enforced by the Secretariat of Infrastructure, Communications and Transportation (SICT). This jurisdictional quirk is the very foundation of the transportation conflict. Every time a traveler wonders why spontaneous rides cost so much, or why ride-sharing apps cannot simply pull up to Terminal 2, the answer traces back to these federal concessions. The tarmac, the parking lots, and the curbsides are heavily guarded territories. Consequently, securing authorized <strong>cabo airport transportation</strong> is not just a matter of logistics; it is a matter of navigating federal law.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Navigating the "Shark Tank" Phenomenon</h3>
                  <p className="mb-6 leading-relaxed">
                    Veterans of Baja travel affectionately refer to the exit corridor of the airport as the "Shark Tank." Here, independent operators and taxi syndicates aggressively vie for the attention of unbooked, often disoriented tourists. The sheer volume of money exchanging hands daily in this small strip of pavement makes it a vital economic artery for the region. Our investigation reveals that the right to operate any form of commercial <strong>cabo airport transportation</strong> within these federal boundaries requires exorbitant licensing fees, rigorous background checks, special federal plates, and union memberships that trace back decades. It is an ecosystem designed to keep unauthorized outsiders out and protect those who hold historical operating rights.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Pre-Planned Peace: The Backbone of <strong>cabo airport transportation</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    For the vast majority of seasoned American tourists, the chaos of arrival is completely mitigated by booking private <strong>cabo airport transportation</strong> well in advance. During our months-long investigation, speaking with transport managers, federal inspectors, and resort concierges, a clear pattern emerged: pre-arranged <strong>cabo airport transportation</strong> is the absolute backbone of the region's massive tourism logistics network. Companies operating these services range from corporate fleets of luxury SUVs to shared passenger vans that efficiently drop off guests at multiple resorts along the corridor.
                  </p>
                  <p className="mb-6 leading-relaxed">
                    The dominance of the private <strong>cabo airport transportation</strong> sector is not accidental. These operators pay significant premiums for federal plates, allowing them to legally and safely wait for passengers directly on the airport grounds. When you book your <strong>cabo airport transportation</strong> ahead of time, you are ultimately paying for peace of mind, reliability, and legal protection. A uniformed, bilingual driver waits with a sign bearing your name, offering icy cold water and immediate refuge from the Baja heat. This level of service is heavily regulated; a reputable <strong>cabo airport transportation</strong> provider must adhere to strict vehicle maintenance logs and comprehensive insurance mandates, making them the most stress-free option available.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Traditional Stronghold: The Taxi Syndicates</h2>
                  <p className="mb-6 leading-relaxed">
                    If you arrive without pre-arranged <strong>cabo airport transportation</strong> and decide to wing it, you will inevitably encounter the traditional taxi network. The bright, clearly marked vans and sedans line up in a highly orchestrated, almost militaristic queue outside the terminals. Many American tourists experience sudden sticker shock when quoted fares upwards of $80 to $120 USD for a simple 30-minute ride to their resort.
                  </p>
                  <p className="mb-6 leading-relaxed">
                    Our deep dive into these syndicates reveals a deeply rooted system of territorial rights and legacy economics. A traditional taxi is not just a car; it is a moving franchise. The medallions required to legally operate spontaneous <strong>cabo airport transportation</strong> directly from the federal zone are strictly limited. They are passed down through families for generations or sold on the private market for astronomical sums. Therefore, when you step into a terminal taxi, you are paying a premium to sustain a legacy monopoly that holds exclusive federal rights to pick up spontaneous travelers at the curbside.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Digital Disruption: The Controversial Reality of Uber</h2>
                  <p className="mb-6 leading-relaxed">
                    Enter the global disruptor: ride-sharing apps. When Uber officially launched its platform in Baja California Sur, it sparked immediate, severe, and occasionally violent backlash from the traditional unions who control the <strong>cabo airport transportation</strong> market. For American tourists accustomed to simply tapping an app for a quick ride, the concept seemed like a long-awaited savior. However, the reality of utilizing an app for your <strong>cabo airport transportation</strong> is fraught with tension and legal loopholes.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">The Infamous "Uber Walk"</h3>
                  <p className="mb-6 leading-relaxed">
                    Because the entirety of the airport is a federal zone, and standard ride-share drivers operate private vehicles without federal commercial licenses, they are legally prohibited from providing <strong>cabo airport transportation</strong> at the terminal curbside. If a driver is caught by federal police attempting a pickup on airport grounds, they face massive fines and the immediate impoundment of their vehicle.
                  </p>
                  <p className="mb-6 leading-relaxed">
                    Consequently, ride-share apps are geographically fenced. If you attempt to use them for your <strong>cabo airport transportation</strong>, the application will direct you to walk completely off the federal property. This involves dragging your luggage under the punishing Mexican sun for 15 to 20 minutes, navigating dusty sidewalks and highway overpasses, just to reach Highway 1 outside the jurisdiction of the airport. Relying on an app for your initial extraction is a high-risk gamble that actively pits tourists against local transport politics.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">A Traveler's Guide: Making the Right Choice</h2>
                  <p className="mb-4 text-neutral-700">Based on our extensive on-the-ground reporting, here is the definitive breakdown of how to navigate your exit from the airport and select the best <strong>cabo airport transportation</strong>:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-3 text-neutral-700">
                    <li><strong>For absolute convenience, luxury, and safety:</strong> Pre-book a private <strong>cabo airport transportation</strong> service. This offers a legally sound, stress-free extraction from the airport directly to your hotel lobby, bypassing the chaos entirely.</li>
                    <li><strong>For last-minute or spontaneous travel:</strong> Utilize a federally licensed terminal taxi. While you will pay a premium price, they offer immediate relief and possess the absolute legal right to provide <strong>cabo airport transportation</strong> at the curb without any hassle.</li>
                    <li><strong>For budget travelers willing to sweat:</strong> Ride-sharing is an option, but <em>strictly</em> if you are physically prepared and willing to drag your luggage completely off the airport premises to the main highway, away from the scrutinizing eyes of federal inspectors.</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Conclusion: The Future of Transit in Baja</h2>
                  <p className="mb-6 leading-relaxed">
                    The battlelines at the airport are firmly drawn in the asphalt. While premium, pre-booked <strong>cabo airport transportation</strong> maintains a steady, untouchable grip on the organized market, the simmering tension between historically dominant taxi syndicates and modern digital disruptors continues to shape the region's economy. For the American tourist, understanding this complex dynamic is the key to starting a vacation smoothly rather than in frustration. Knowledge is power, and securing reliable <strong>cabo airport transportation</strong> is the first real test of navigating the beautiful, complex reality of Baja California Sur.
                  </p>
                </article>
              )}

              {/* VERSIÓN ESPAÑOL */}
              {lang === 'es' && (
                <article className="prose prose-lg prose-neutral max-w-none">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
                    El Campo de Batalla del Asfalto: Un Reportaje de Investigación sobre la Economía Oculta del <strong>cabo airport transportation</strong>
                  </h1>

                  <p className="mb-6 leading-relaxed">
                    Bajar del avión y sentir el calor seco y radiante de Baja California Sur es un momento de puro alivio para millones de turistas estadounidenses e internacionales cada año. La promesa de playas prístinas, resorts de lujo de clase mundial y vistas interminables del océano es palpable. Sin embargo, antes de que las vacaciones comiencen realmente, cada viajero debe navegar por una microeconomía ferozmente disputada y oculta a simple vista. Mientras arrastras tu equipaje por la aduana y declinas cortésmente a los agresivos vendedores de tiempo compartido, estás entrando sin saberlo en una guerra territorial de altas apuestas y millones de dólares. En el centro de este conflicto se encuentra una industria singular y altamente lucrativa: el <strong>cabo airport transportation</strong>.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Zona Federal: Entendiendo la Jurisdicción del <strong>cabo airport transportation</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    Para comprender verdaderamente la complejidad y la naturaleza a menudo frustrante del tránsito terrestre en Baja, primero se debe examinar el diseño, la historia y la jurisdicción legal del propio aeropuerto. Ubicado en el municipio de San José del Cabo, el aeropuerto internacional se encuentra a kilómetros de distancia de los principales centros turísticos del Corredor Turístico y de la bulliciosa vida nocturna de Cabo San Lucas. Pero la distancia geográfica es solo la mitad de la historia. Bajo la ley mexicana, los terrenos físicos del aeropuerto operan como una estricta zona federal.
                  </p>
                  <p className="mb-6 leading-relaxed">
                    Esto significa que las reglas de tránsito municipales locales son completamente superadas por las regulaciones federales aplicadas por la Secretaría de Infraestructura, Comunicaciones y Transportes (SICT). Esta peculiaridad jurisdiccional es la base misma del conflicto de transporte. Cada vez que un viajero se pregunta por qué los viajes espontáneos cuestan tanto, o por qué las aplicaciones de viajes compartidos no pueden simplemente llegar a la Terminal 2, la respuesta se remonta a estas concesiones federales. Las pistas, los estacionamientos y las aceras son territorios fuertemente vigilados. En consecuencia, asegurar un <strong>cabo airport transportation</strong> autorizado no es solo una cuestión de logística; es una cuestión de navegar por la ley federal.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Navegando por el Fenómeno del "Tanque de Tiburones"</h3>
                  <p className="mb-6 leading-relaxed">
                    Los veteranos de los viajes a Baja se refieren cariñosamente al pasillo de salida del aeropuerto como el "Tanque de Tiburones". Aquí, los operadores independientes y los sindicatos de taxis compiten agresivamente por la atención de turistas sin reservación y a menudo desorientados. El gran volumen de dinero que cambia de manos diariamente en esta pequeña franja de pavimento la convierte en una arteria económica vital para la región. Nuestra investigación revela que el derecho a operar cualquier forma comercial de <strong>cabo airport transportation</strong> dentro de estos límites federales requiere el pago de tarifas de licencia exorbitantes, rigurosas verificaciones de antecedentes, placas federales especiales y membresías sindicales que se remontan a décadas atrás.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Paz Pre-planeada: La Columna Vertebral del <strong>cabo airport transportation</strong></h2>
                  <p className="mb-6 leading-relaxed">
                    Para la gran mayoría de los turistas experimentados, el caos de la llegada se mitiga por completo reservando un <strong>cabo airport transportation</strong> privado con mucha anticipación. Durante nuestra investigación de meses de duración, hablando con gerentes de transporte, inspectores federales y conserjes de resorts, surgió un patrón claro: el <strong>cabo airport transportation</strong> preestablecido es la columna vertebral absoluta de la enorme red logística de turismo de la región. Las empresas que operan estos servicios van desde flotas corporativas de lujosas SUVs hasta camionetas compartidas que dejan a los huéspedes de manera eficiente a lo largo del corredor.
                  </p>
                  <p className="mb-6 leading-relaxed">
                    El dominio del sector privado de <strong>cabo airport transportation</strong> no es accidental. Estos operadores pagan primas significativas por placas federales, lo que les permite esperar legal y de forma segura a los pasajeros directamente en los terrenos del aeropuerto. Cuando reservas tu <strong>cabo airport transportation</strong> con anticipación, en última instancia estás pagando por tranquilidad, confiabilidad y protección legal. Un conductor uniformado y bilingüe te espera con un letrero con tu nombre, ofreciendo agua helada y refugio inmediato del calor. Este nivel de servicio está fuertemente regulado; un proveedor de <strong>cabo airport transportation</strong> de buena reputación debe cumplir con estrictos registros de mantenimiento de vehículos y seguros integrales, convirtiéndolos en la opción más libre de estrés.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">El Bastión Tradicional: Los Sindicatos de Taxis</h2>
                  <p className="mb-6 leading-relaxed">
                    Si llegas sin un <strong>cabo airport transportation</strong> preestablecido y decides improvisar, inevitablemente te encontrarás con la red de taxis tradicionales. Las camionetas y sedanes brillantes y claramente marcados se alinean en una cola altamente orquestada fuera de las terminales. Muchos turistas experimentan un impacto repentino al recibir cotizaciones de tarifas de más de $80 a $120 USD por un simple viaje de 30 minutos a su resort.
                  </p>
                  <p className="mb-6 leading-relaxed">
                    Nuestra inmersión profunda en estos sindicatos revela un sistema profundamente arraigado de derechos territoriales. Un taxi tradicional no es solo un automóvil; es una franquicia en movimiento. Las concesiones requeridas para operar legalmente un <strong>cabo airport transportation</strong> espontáneo directamente desde la zona federal están estrictamente limitadas. Se transmiten de generación en generación o se venden en el mercado privado por sumas astronómicas. Por lo tanto, cuando te subes a un taxi de la terminal, estás pagando una prima para sostener un monopolio heredado que posee derechos federales exclusivos en la acera.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Disrupción Digital: La Realidad Controversial de Uber</h2>
                  <p className="mb-6 leading-relaxed">
                    Entra el disruptor global: las aplicaciones de viajes compartidos. Cuando Uber lanzó oficialmente su plataforma en Baja California Sur, provocó una reacción inmediata y severa por parte de los sindicatos tradicionales que controlan el mercado del <strong>cabo airport transportation</strong>. Para los turistas acostumbrados a simplemente tocar una aplicación para un viaje rápido, el concepto parecía un salvador. Sin embargo, la realidad de utilizar una app para tu <strong>cabo airport transportation</strong> está llena de tensión y lagunas legales.
                  </p>

                  <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">La Infame "Caminata Uber"</h3>
                  <p className="mb-6 leading-relaxed">
                    Debido a que la totalidad del aeropuerto es una zona federal, y los conductores de viajes compartidos operan vehículos privados sin licencias comerciales federales, tienen legalmente prohibido proporcionar <strong>cabo airport transportation</strong> en la acera de la terminal. Si la policía federal sorprende a un conductor intentando recoger pasajeros en los terrenos del aeropuerto, se enfrentan a multas masivas y la incautación inmediata de su vehículo.
                  </p>
                  <p className="mb-6 leading-relaxed">
                    En consecuencia, las aplicaciones de viajes compartidos están geocercadas. Si intentas usarlas para tu <strong>cabo airport transportation</strong>, la aplicación te indicará que camines completamente fuera de la propiedad federal. Esto implica arrastrar tu equipaje bajo el castigador sol mexicano durante 15 a 20 minutos, navegando por aceras polvorientas y pasos elevados, solo para llegar a la Carretera 1 fuera de la jurisdicción del aeropuerto. Depender de una app para tu extracción inicial es una apuesta de alto riesgo.
                  </p>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Guía del Viajero: Tomando la Decisión Correcta</h2>
                  <p className="mb-4 text-neutral-700">Basándonos en nuestros exhaustivos reportajes sobre el terreno, aquí está el desglose definitivo de cómo navegar por tu salida del aeropuerto y seleccionar el mejor <strong>cabo airport transportation</strong>:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-3 text-neutral-700">
                    <li><strong>Para absoluta comodidad, lujo y seguridad:</strong> Reserva previamente un servicio privado de <strong>cabo airport transportation</strong>. Esto ofrece una extracción legalmente sólida y sin estrés desde el aeropuerto directamente al vestíbulo de tu hotel, evitando el caos por completo.</li>
                    <li><strong>Para viajes de última hora o espontáneos:</strong> Utiliza un taxi de terminal con licencia federal. Aunque pagarás un precio superior, ofrecen alivio inmediato y poseen el derecho legal absoluto de proporcionar <strong>cabo airport transportation</strong> en la acera sin ningún problema.</li>
                    <li><strong>Para viajeros económicos dispuestos a sudar:</strong> Los viajes compartidos son una opción, pero <em>estrictamente</em> si estás preparado físicamente y dispuesto a arrastrar tu equipaje completamente fuera de las instalaciones del aeropuerto hasta la carretera principal.</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Conclusión: El Futuro del Tránsito en Baja California Sur</h2>
                  <p className="mb-6 leading-relaxed">
                    Las líneas de batalla en el aeropuerto están firmemente trazadas en el asfalto. Mientras que el <strong>cabo airport transportation</strong> privado y de reserva previa mantiene un control firme e intocable sobre el mercado organizado, la tensión latente entre los sindicatos de taxis históricamente dominantes y los disruptores digitales modernos continúa moldeando la economía de la región. Para el turista, comprender esta dinámica compleja es la clave para comenzar unas vacaciones sin problemas en lugar de con frustración. El conocimiento es poder, y asegurar un <strong>cabo airport transportation</strong> confiable es la primera prueba real de navegar por la hermosa y compleja realidad de Baja California Sur.
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
            <p className="font-semibold text-xl tracking-tight mb-1">{lang === 'es' ? 'Flota de Lujo en Aeropuerto SJD' : 'Luxury Fleet at SJD Airport'}</p>
          </div>
        </div>

        {/* SJD AIRPORT TAXI BANNER (Dark Theme) */}
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

        {/* POPULAR ROUTES */}
        <section className="mb-24">
          <div className="flex items-center mb-8">
            <MapPin className="w-8 h-8 text-slate-700 mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              {lang === 'es' ? 'Rutas Populares de Transporte' : 'Popular Airport Transportation Routes'}
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
            alt="Private Transportation at Nobu Hotel Los Cabos"
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