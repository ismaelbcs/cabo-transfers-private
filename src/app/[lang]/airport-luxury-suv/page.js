import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Calendar, Baby, Banknote, MapPin } from 'lucide-react';

export async function generateMetadata({ params }) {
  const lang = params?.lang || 'en';
  if (lang === 'es') return {
    title: 'Airport Luxury SUV en Cabo | Traslados VIP Aeropuerto SJD',
    description: 'Llega con estilo reservando nuestro servicio Airport Luxury SUV. Camionetas Suburban y Escalade de primer nivel en Los Cabos.',
    keywords: 'airport Luxury SUV, Cabo airport luxury SUV, SUV transporte privado SJD, Suburban Cabo',
  };
  return {
    title: 'Cabo Airport Luxury SUV Services | Premium VIP Transfers',
    description: 'Upgrade your arrival with our Airport Luxury SUV service in Cabo. Travel in a premium Suburban or Escalade from SJD Airport to your destination.',
    keywords: 'airport Luxury SUV, Cabo airport luxury SUV, VIP SUV transfers Cabo, SJD airport premium transportation',
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-6">
              {lang === 'es'
                ? 'Llega a tu Hotel en una Airport Luxury SUV'
                : 'Arrive at Your Hotel in an Airport Luxury SUV'}
            </h2>
            <div className="prose prose-lg text-neutral-600 prose-p:leading-relaxed max-w-none">
              <p className="mb-6">
                {lang === 'es' ? (
                  <>Eleva tu experiencia de viaje reservando una impecable <strong>airport luxury suv</strong> para tu llegada a Los Cabos. Creemos que tu transporte debe ser tan excepcional como tus vacaciones, brindándote amplitud y elegancia en cada kilómetro.</>
                ) : (
                  <>Elevate your travel experience by booking a pristine <strong>airport luxury suv</strong> for your arrival in Los Cabos. We believe your transportation should be as exceptional as your vacation, providing spaciousness and elegance in every mile.</>
                )}
              </p>
              <p className="mb-6">
                {lang === 'es' ? (
                  <>Nuestra flota cuenta con modelos premium, asegurando que tu <strong>airport luxury suv</strong> tenga espacio de sobra para todo tu equipaje y palos de golf. Evita los vehículos compactos y disfruta del verdadero confort de Baja California.</>
                ) : (
                  <>Our fleet features premium models, ensuring your <strong>airport luxury suv</strong> has more than enough room for all your luggage and golf clubs. Avoid cramped vehicles and enjoy true Baja comfort.</>
                )}
              </p>
              <p>
                {lang === 'es' ? (
                  <>Disfruta de un servicio VIP desde el primer momento; tu chofer te estará esperando con tu <strong>airport luxury suv</strong> lista para llevarte a tu resort frente al mar con la máxima seguridad.</>
                ) : (
                  <>Enjoy VIP service from the very first moment; your chauffeur will be waiting with your <strong>airport luxury suv</strong> ready to whisk you away to your oceanfront resort safely.</>
                )}
              </p>

              <section className="mt-16 pt-16 border-t border-neutral-200 text-neutral-600">

                {/* ENGLISH VERSION */}
                {lang !== 'es' && (
                  <article className="prose prose-lg prose-neutral max-w-none">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
                      The Asphalt Battlefield: An Investigative Report on the <strong>airport luxury suv sjd</strong> Transit Wars, the <strong>Los Cabos taxi</strong> Syndicates, and the <strong>Los Cabos Uber</strong> Dilemma
                    </h1>

                    <p className="mb-6 leading-relaxed">
                      Stepping off the aircraft into the dry, radiating heat of Baja California Sur is a moment of pure relief for millions of American tourists each year. The promise of pristine beaches, luxury resorts, and endless margaritas is palpable. However, before the vacation truly begins, every traveler must navigate a fiercely contested micro-economy hidden in plain sight. As you wheel your luggage past customs and the notorious timeshare salespeople, you step into a high-stakes turf war. The combatants? The highly organized operators of the <strong>airport luxury suv sjd</strong> services, the entrenched <strong>Los Cabos taxi</strong> unions, and the digital disruptor known as <strong>Los Cabos Uber</strong>.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Arrival: The Jurisdictional Quirk of SJD</h2>
                    <p className="mb-6 leading-relaxed">
                      To understand the complexity of ground transportation here, one must first examine the layout and legal jurisdiction of the San José del Cabo International Airport. Located miles away from the main tourist hubs of the Tourist Corridor and Cabo San Lucas, the airport operates as a federal zone under Mexican law. This means local transit rules are superseded by strict federal regulations. This jurisdictional quirk is the very foundation of the transportation conflict. Every time a traveler wonders why a <strong>Los Cabos taxi</strong> costs upwards of $100, or why a <strong>Los Cabos Uber</strong> cannot simply pull up to Terminal 2, the answer traces back to these federal concessions. The tarmac and curbsides are heavily guarded territories, yielding millions of dollars in daily revenue, driving the immense demand for pre-booked <strong>airport luxury suv sjd</strong> transfers.
                    </p>

                    <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Navigating the "Shark Tank"</h3>
                    <p className="mb-6 leading-relaxed">
                      Veterans of Baja travel affectionately refer to the exit corridor of the airport as the "Shark Tank." Here, operators aggressively vie for the attention of unbooked tourists. If you haven't pre-arranged an <strong>airport luxury suv sjd</strong>, you will be bombarded with offers. The sheer volume of money exchanging hands daily in this small strip of pavement makes it a vital economic artery. Our investigation reveals that the right to operate a commercial vehicle—whether it be an <strong>airport luxury suv sjd</strong> or a licensed <strong>Los Cabos taxi</strong>—within these federal boundaries requires exorbitant licensing fees, rigorous background checks, and union memberships that trace back decades.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Pre-Planned Peace: The Rise of the <strong>airport luxury suv sjd</strong></h2>
                    <p className="mb-6 leading-relaxed">
                      For the vast majority of seasoned American tourists, the chaos of arrival is completely bypassed by booking an <strong>airport luxury suv sjd</strong> well in advance. During our months-long investigation, a clear pattern emerged: the <strong>airport luxury suv sjd</strong> is the ultimate backbone of the region's high-end tourism logistics. These operators utilize massive corporate fleets of luxury Suburbans, Escalades, and Navigators to whisk guests away to resorts along the corridor in absolute comfort.
                    </p>

                    <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Why the <strong>airport luxury suv sjd</strong> Dominates the Premium Market</h3>
                    <p className="mb-6 leading-relaxed">
                      The dominance of the <strong>airport luxury suv sjd</strong> industry is not accidental. These operators pay significant premiums for federal plates, allowing them to legally wait for passengers on the airport grounds. When you book an <strong>airport luxury suv sjd</strong>, you are paying for absolute peace of mind. A uniformed, bilingual driver waits with a sign bearing your name, offering cold water, Wi-Fi, and immediate refuge from the desert heat. This level of service is heavily regulated. A reputable <strong>airport luxury suv sjd</strong> provider must adhere to strict vehicle maintenance logs and comprehensive insurance mandates, making them the most legally secure and stress-free option available.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Traditional Stronghold: Inside the <strong>Los Cabos taxi</strong> Monopoly</h2>
                    <p className="mb-6 leading-relaxed">
                      If you miss your luxury transfer or decide to wing it, you will inevitably encounter the <strong>Los Cabos taxi</strong> network. The bright vans and sedans line up in a highly orchestrated queue outside the terminals. But what goes into the pricing of a <strong>Los Cabos taxi</strong>? Many tourists experience immediate sticker shock when quoted fares upwards of $80 to $120 USD for a standard ride to Cabo San Lucas. Our investigation into the <strong>Los Cabos taxi</strong> syndicates reveals a deep-rooted, multi-generational system of territorial rights and heavy union dues.
                    </p>

                    <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">The Economics of a <strong>Los Cabos taxi</strong></h3>
                    <p className="mb-6 leading-relaxed">
                      A <strong>Los Cabos taxi</strong> is not just a car; it is a moving franchise. The medallions (or federal concessions) required to operate a <strong>Los Cabos taxi</strong> from the airport are limited in number and passed down through families or sold for astronomical sums. Therefore, when you step into a <strong>Los Cabos taxi</strong>, you are not just paying for gas and the driver's time; you are paying a premium to sustain a legacy transportation monopoly that holds exclusive federal rights to pick up spontaneous travelers at the airport curbside.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">The Digital Disruption: The Controversial Reality of <strong>Los Cabos Uber</strong></h2>
                    <p className="mb-6 leading-relaxed">
                      Enter the disruptor: <strong>Los Cabos Uber</strong>. When the ride-sharing giant launched in Baja California Sur, it sparked immediate, and sometimes violent, backlash from the traditional <strong>Los Cabos taxi</strong> unions. For American tourists accustomed to simply tapping an app for a cheap ride, the concept of a <strong>Los Cabos Uber</strong> seemed like a savior from high transportation costs. However, the reality of utilizing a <strong>Los Cabos Uber</strong> at the airport is far more complicated, heavily restricted, and fraught with tension.
                    </p>

                    <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Can You Actually Take a <strong>Los Cabos Uber</strong> from the Airport?</h3>
                    <p className="mb-6 leading-relaxed">
                      This is the ultimate question for budget-conscious travelers. Because the airport is a federal zone, and Uber drivers typically do not possess federal transportation licenses, a <strong>Los Cabos Uber</strong> is legally prohibited from picking up passengers at the terminal curbside. If a <strong>Los Cabos Uber</strong> driver is caught by federal police or transport inspectors doing so, they face massive fines and vehicle impoundment. Consequently, if you request a <strong>Los Cabos Uber</strong> from the terminal, the app will direct you to walk entirely off federal property. This usually involves a hot, dusty 15-minute trek with your luggage out to the main highway. While a <strong>Los Cabos Uber</strong> is excellent for moving between restaurants in downtown Cabo San Lucas, relying on it for your initial airport extraction is a high-risk gamble that pits tourists directly against local transport politics.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">A Traveler's Guide: Making the Right Choice at SJD</h2>
                    <p className="mb-4">Based on our extensive on-the-ground reporting, here is the definitive breakdown of how to navigate your exit from the airport without falling victim to the transportation turf war:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                      <li><strong>For absolute convenience, luxury, and safety:</strong> Pre-book an <strong>airport luxury suv sjd</strong>. It offers a legally sound, premium extraction from the airport directly to your hotel lobby with zero friction.</li>
                      <li><strong>For last-minute or emergency travel:</strong> Utilize a federally licensed <strong>Los Cabos taxi</strong>. While undeniably expensive, they have the legal right to pick you up immediately at the curb without any pre-arrangement.</li>
                      <li><strong>For budget travelers willing to sweat:</strong> The <strong>Los Cabos Uber</strong> is an option, but strictly if you are willing to drag your luggage completely off the airport premises to the main highway, away from the eyes of inspectors and the <strong>Los Cabos taxi</strong> unions.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Conclusion: The Future of Transit in Baja</h2>
                    <p className="mb-6 leading-relaxed">
                      The battlelines at the airport are firmly drawn. While the <strong>airport luxury suv sjd</strong> maintains its steady, premium grip on the high-end market, the tension between the traditional <strong>Los Cabos taxi</strong> and the modern <strong>Los Cabos Uber</strong> continues to simmer on the sun-baked asphalt. For the American tourist, understanding this dynamic is the key to starting a vacation smoothly. Knowledge is power, and knowing whether to click for a <strong>Los Cabos Uber</strong>, flag down a <strong>Los Cabos taxi</strong>, or pre-book an <strong>airport luxury suv sjd</strong> is the first real test of navigating the beautiful, complex reality of Baja California Sur.
                    </p>
                  </article>
                )}

                {/* VERSIÓN ESPAÑOL */}
                {lang === 'es' && (
                  <article className="prose prose-lg prose-neutral max-w-none">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
                      El Campo de Batalla del Asfalto: Un Reportaje de Investigación sobre la Guerra del <strong>airport luxury suv sjd</strong>, los Sindicatos de <strong>Los Cabos taxi</strong> y el Dilema de <strong>Los Cabos Uber</strong>
                    </h1>

                    <p className="mb-6 leading-relaxed">
                      Bajar del avión y sentir el calor seco y radiante de Baja California Sur es un momento de puro alivio para millones de turistas cada año. La promesa de playas prístinas, resorts de lujo y margaritas interminables es palpable. Sin embargo, antes de que las vacaciones comiencen realmente, cada viajero debe navegar por una microeconomía ferozmente disputada y oculta a simple vista. Mientras arrastras tu equipaje por la aduana y pasas a los notorios vendedores de tiempo compartido, entras en una guerra territorial de altas apuestas. ¿Los combatientes? Los operadores altamente organizados de los servicios de <strong>airport luxury suv sjd</strong>, los arraigados sindicatos de <strong>Los Cabos taxi</strong> y el disruptor digital conocido como <strong>Los Cabos Uber</strong>.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Llegada: La Peculiaridad Jurisdiccional de SJD</h2>
                    <p className="mb-6 leading-relaxed">
                      Para entender la complejidad del transporte terrestre aquí, primero se debe examinar el diseño y la jurisdicción legal del Aeropuerto Internacional de San José del Cabo. Situado a kilómetros de los principales centros turísticos, el aeropuerto opera como una zona federal bajo la ley mexicana. Esto significa que las reglas de tránsito locales son superadas por estrictas regulaciones federales. Esta peculiaridad jurisdiccional es la base misma del conflicto de transporte. Cada vez que un viajero se pregunta por qué un <strong>Los Cabos taxi</strong> cuesta más de $100 USD, o por qué un <strong>Los Cabos Uber</strong> no puede simplemente llegar a la Terminal 2, la respuesta se remonta a estas concesiones federales. Las pistas y aceras son territorios vigilados que generan millones de dólares, impulsando la inmensa demanda de traslados pre-reservados en un <strong>airport luxury suv sjd</strong>.
                    </p>

                    <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Navegando el "Tanque de Tiburones"</h3>
                    <p className="mb-6 leading-relaxed">
                      Los veteranos de los viajes a Baja se refieren cariñosamente al pasillo de salida del aeropuerto como el "Tanque de Tiburones". Aquí, los operadores compiten agresivamente por la atención de los turistas sin reservación. Si no has arreglado un <strong>airport luxury suv sjd</strong> con anticipación, serás bombardeado con ofertas. El gran volumen de dinero que cambia de manos diariamente en esta pequeña franja de pavimento lo convierte en una arteria económica vital. Nuestra investigación revela que el derecho a operar un vehículo comercial, ya sea un <strong>airport luxury suv sjd</strong> privado o un <strong>Los Cabos taxi</strong> con licencia, dentro de estos límites requiere tarifas de licencia exorbitantes, rigurosas verificaciones de antecedentes y membresías sindicales de décadas.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Paz Pre-planeada: El Ascenso del <strong>airport luxury suv sjd</strong></h2>
                    <p className="mb-6 leading-relaxed">
                      Para la gran mayoría de los turistas experimentados, el caos de la llegada se esquiva por completo al reservar un <strong>airport luxury suv sjd</strong> con mucha anticipación. Durante nuestra investigación de meses de duración, surgió un patrón claro: el <strong>airport luxury suv sjd</strong> es la columna vertebral definitiva de la logística turística de alta gama de la región. Estos operadores utilizan flotas corporativas masivas de Suburbans, Escalades y Navigators de lujo para llevar a los huéspedes a los resorts a lo largo del corredor con absoluta comodidad.
                    </p>

                    <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">Por qué el <strong>airport luxury suv sjd</strong> Domina el Mercado Premium</h3>
                    <p className="mb-6 leading-relaxed">
                      El dominio de la industria del <strong>airport luxury suv sjd</strong> no es accidental. Estos operadores pagan primas significativas por placas federales, lo que les permite esperar legalmente a los pasajeros en los terrenos del aeropuerto. Cuando reservas un <strong>airport luxury suv sjd</strong>, estás pagando por absoluta tranquilidad. Un conductor bilingüe y uniformado espera con un letrero con tu nombre, ofreciendo agua fría, Wi-Fi y refugio inmediato del calor del desierto. Una empresa de <strong>airport luxury suv sjd</strong> de buena reputación debe cumplir con estrictos registros de mantenimiento de vehículos y seguros a todo riesgo, lo que los convierte en la opción legalmente más segura.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">El Bastión Tradicional: Dentro del Monopolio del <strong>Los Cabos taxi</strong></h2>
                    <p className="mb-6 leading-relaxed">
                      Si pierdes tu traslado de lujo o decides improvisar, inevitablemente te encontrarás con la red de <strong>Los Cabos taxi</strong>. Las brillantes furgonetas y sedanes se alinean en una cola altamente orquestada fuera de las terminales. Pero, ¿qué influye en el precio de un <strong>Los Cabos taxi</strong>? Muchos turistas experimentan un impacto inmediato cuando se les cotizan tarifas de $80 a $120 USD por un viaje estándar a Cabo San Lucas. Nuestra investigación sobre los sindicatos de <strong>Los Cabos taxi</strong> revela un sistema multigeneracional profundamente arraigado de derechos territoriales.
                    </p>

                    <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">La Economía de un <strong>Los Cabos taxi</strong></h3>
                    <p className="mb-6 leading-relaxed">
                      Un <strong>Los Cabos taxi</strong> no es solo un automóvil; es una franquicia en movimiento. Las concesiones federales requeridas para operar un <strong>Los Cabos taxi</strong> desde el aeropuerto son limitadas en número y se transmiten de generación en generación o se venden por sumas astronómicas. Por lo tanto, cuando te subes a un <strong>Los Cabos taxi</strong>, no solo estás pagando por la gasolina; estás pagando una prima para sostener un monopolio de transporte heredado que posee derechos exclusivos para recoger a viajeros espontáneos.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">La Disrupción Digital: La Realidad Controversial de <strong>Los Cabos Uber</strong></h2>
                    <p className="mb-6 leading-relaxed">
                      Entra el disruptor: <strong>Los Cabos Uber</strong>. Cuando el gigante de los viajes compartidos se lanzó en Baja California Sur, provocó una reacción inmediata, y a veces violenta, de los sindicatos tradicionales de <strong>Los Cabos taxi</strong>. Para los turistas acostumbrados a simplemente tocar una aplicación, el concepto de un <strong>Los Cabos Uber</strong> parecía ser un salvador. Sin embargo, la realidad de utilizar un <strong>Los Cabos Uber</strong> en el aeropuerto es mucho más complicada, fuertemente restringida y llena de tensión.
                    </p>

                    <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-3">¿Realmente Puedes Tomar un <strong>Los Cabos Uber</strong> desde el Aeropuerto?</h3>
                    <p className="mb-6 leading-relaxed">
                      Debido a que el aeropuerto es una zona federal, un <strong>Los Cabos Uber</strong> tiene legalmente prohibido recoger pasajeros en la acera de la terminal. Si la policía federal sorprende a un conductor de <strong>Los Cabos Uber</strong> haciéndolo, enfrentan multas masivas y la incautación del vehículo. En consecuencia, si solicitas un <strong>Los Cabos Uber</strong> desde la terminal, la aplicación te indicará que salgas completamente de la propiedad federal. Esto generalmente implica una caminata calurosa y polvorienta de 15 minutos con tu equipaje hasta la carretera principal. Si bien un <strong>Los Cabos Uber</strong> es excelente para moverse por la ciudad, depender de él para tu extracción inicial del aeropuerto es una apuesta de alto riesgo.
                    </p>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Guía del Viajero: Tomando la Decisión Correcta en SJD</h2>
                    <p className="mb-4">Basándonos en nuestros exhaustivos reportajes sobre el terreno, aquí está el desglose definitivo de cómo navegar por tu salida del aeropuerto:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-neutral-700">
                      <li><strong>Para absoluta comodidad, lujo y seguridad:</strong> Reserva previamente un <strong>airport luxury suv sjd</strong>. Ofrece una extracción premium y legalmente sólida directamente a tu hotel.</li>
                      <li><strong>Para viajes de última hora:</strong> Utiliza un <strong>Los Cabos taxi</strong> con licencia federal. Aunque son innegablemente costosos, tienen el derecho legal de recogerte inmediatamente en la acera.</li>
                      <li><strong>Para viajeros económicos:</strong> El <strong>Los Cabos Uber</strong> es una opción, pero estrictamente si estás dispuesto a arrastrar tu equipaje completamente fuera de las instalaciones del aeropuerto hasta la carretera principal, lejos de los sindicatos de <strong>Los Cabos taxi</strong>.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Conclusión: El Futuro del Tránsito en Baja</h2>
                    <p className="mb-6 leading-relaxed">
                      Las líneas de batalla en el aeropuerto están firmemente trazadas. Mientras que el <strong>airport luxury suv sjd</strong> mantiene su control firme y premium sobre el mercado de alta gama, la tensión entre el tradicional <strong>Los Cabos taxi</strong> y el moderno <strong>Los Cabos Uber</strong> continúa a fuego lento en el asfalto bañado por el sol. El conocimiento es poder, y saber si hacer clic para pedir un <strong>Los Cabos Uber</strong>, levantar la mano a un <strong>Los Cabos taxi</strong> o pre-reservar un <strong>airport luxury suv sjd</strong> es la primera prueba real de navegar por la hermosa y compleja realidad de Baja California Sur.
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