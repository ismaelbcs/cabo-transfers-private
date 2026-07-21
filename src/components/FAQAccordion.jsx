'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ type = 'hotel', locationName = '', lang = 'es' }) {
  const [openIndex, setOpenIndex] = useState(0);

  // Definimos las preguntas por tipo
  const faqs = {
    hotel: [
      {
        q: lang === 'es' ? \`¿Cuál es la distancia y el tiempo del aeropuerto a \${locationName}?\` : \`What is the distance and travel time from the airport to \${locationName}?\`,
        a: lang === 'es'
          ? \`Los tiempos pueden variar, pero nuestros choferes experimentados siempre calculan la mejor ruta libre de tráfico para llegar a \${locationName} en el menor tiempo posible, garantizando un viaje suave y relajante.\`
          : \`Times may vary, but our experienced chauffeurs always calculate the best traffic-free route to arrive at \${locationName} in the shortest possible time, ensuring a smooth and relaxing journey.\`
      },
      {
        q: lang === 'es' ? \`¿Puedo solicitar paradas técnicas antes de mi registro en \${locationName}?\` : \`Can I request technical stops before checking in at \${locationName}?\`,
        a: lang === 'es'
          ? \`¡Sí, por supuesto! Podemos hacer una breve escala pre-programada (por una pequeña tarifa adicional) en un supermercado como Walmart o Costco, cajero automático o farmacia en tu camino a \${locationName}. Solo te pedimos solicitarlo al momento de reservar tu traslado para ajustar los tiempos de logística.\`
          : \`Yes, of course! We can make a short pre-scheduled stop (for a small additional fee) at a grocery store like Walmart or Costco, ATM, or pharmacy on your way to \${locationName}. We just ask that you request it when booking your transfer to adjust logistics timing.\`
      },
      {
        q: lang === 'es' ? \`¿Qué pasa si mi vuelo se retrasa, pierdo mi viaje a \${locationName}?\` : \`What happens if my flight is delayed, do I lose my ride to \${locationName}?\`,
        a: lang === 'es'
          ? \`En absoluto. Nosotros rastreamos continuamente tu número de vuelo en los monitores del aeropuerto. Por lo tanto, tu chofer asignado para llevarte a \${locationName} sabrá exactamente a qué hora aterrizas, sin importar si hay demoras o si llegas adelantado.\`
          : \`Not at all. We continuously track your flight number on the airport monitors. Therefore, your chauffeur assigned to take you to \${locationName} will know exactly what time you land, regardless of whether there are delays or if you arrive early.\`
      },
      {
        q: lang === 'es' ? \`¿Cómo identifico al representante que me guiará a mi transporte para \${locationName}?\` : \`How do I identify the representative who will guide me to my transportation for \${locationName}?\`,
        a: lang === 'es'
          ? \`Al confirmar tu reserva, te proporcionaremos instrucciones detalladas y claras. Nuestro representante oficial te estará esperando en la zona designada (Terminal 2 en sombrilla 3, o Terminal 1 en salida de grupos) con un letrero visible con tu nombre, listo para ayudarte con tu equipaje y acompañarte al vehículo que te dejará en las puertas de \${locationName}.\`
          : \`Upon confirming your reservation, we will provide clear and detailed instructions. Our official representative will be waiting for you in the designated area (Terminal 2 at umbrella 3, or Terminal 1 at groups exit) with a visible sign with your name, ready to help you with your luggage and escort you to the vehicle that will drop you off at the doors of \${locationName}.\`
      },
      {
        q: lang === 'es' ? \`¿Qué amenidades incluyen sus traslados a \${locationName}?\` : \`What amenities are included in your transfers to \${locationName}?\`,
        a: lang === 'es'
          ? \`Nuestros traslados a \${locationName} incluyen bebidas de cortesía (agua fría/cervezas), sillas para bebés o asientos elevados totalmente gratis (bajo petición), aire acondicionado y conductores bilingües profesionales.\`
          : \`Our transfers to \${locationName} include complimentary drinks (cold water/beers), completely free baby car seats or booster seats (upon request), air conditioning, and professional bilingual drivers.\`
      },
      {
        q: lang === 'es' ? \`¿Los vehículos hacia \${locationName} son seguros y privados?\` : \`Are the vehicles to \${locationName} safe and private?\`,
        a: lang === 'es'
          ? \`Totalmente. Todos nuestros servicios a \${locationName} son 100% privados (no compartes con desconocidos). Contamos con vehículos de modelo reciente, pólizas de seguro de cobertura amplia y choferes certificados.\`
          : \`Absolutely. All our services to \${locationName} are 100% private (no sharing with strangers). We feature recent model vehicles, full coverage insurance policies, and certified drivers.\`
      }
    ],
    restaurant: [
      {
        q: lang === 'es' ? \`¿El servicio de traslado a \${locationName} es completamente privado?\` : \`Is the transfer service to \${locationName} completely private?\`,
        a: lang === 'es'
          ? \`Sí, disfrutarás de un vehículo exclusivo para ti y tus acompañantes, con aire acondicionado y un chofer profesional bilingüe que asegurará un trayecto cómodo hacia \${locationName}.\`
          : \`Yes, you will enjoy an exclusive vehicle for you and your companions, with air conditioning and a professional bilingual driver ensuring a comfortable ride to \${locationName}.\`
      },
      {
        q: lang === 'es' ? '¿Qué políticas de cancelación manejan para restaurantes?' : 'What is your cancellation policy for restaurant transfers?',
        a: lang === 'es'
          ? 'Ofrecemos cancelación gratuita hasta 48 horas antes de tu reserva. Entendemos que los planes pueden cambiar, por lo que te brindamos flexibilidad total.'
          : 'We offer free cancellation up to 48 hours before your booking. We understand plans change, so we provide full flexibility.'
      },
      {
        q: lang === 'es' ? \`¿Incluyen alguna amenidad en el camino a \${locationName}?\` : \`Do you include any amenities on the way to \${locationName}?\`,
        a: lang === 'es'
          ? \`Para que inicies tu velada de la mejor manera, incluimos bebidas de cortesía (agua fresca y cervezas) en todos nuestros servicios hacia \${locationName}.\`
          : \`To start your evening the best way, we include complimentary drinks (cold water and beers) on all our transfer services to \${locationName}.\`
      },
      {
        q: lang === 'es' ? \`¿Qué pasa si mi cena en \${locationName} toma más tiempo de lo esperado?\` : \`What happens if my dinner at \${locationName} takes longer than expected?\`,
        a: lang === 'es'
          ? \`Entendemos que la alta gastronomía toma tiempo. Cuando reservas transporte redondo a \${locationName}, tu chofer permanece a la espera. Si tu cena o las bebidas posteriores en \${locationName} se extienden más allá de tu tiempo estimado, simplemente envíanos un rápido mensaje por WhatsApp. Ajustaremos tu recogida desde \${locationName} sin dejarte varado.\`
          : \`Fine dining takes time, and we understand that. When you book round-trip dinner transportation to \${locationName}, your driver remains on standby. If your multi-course meal or after-dinner drinks at \${locationName} extend past your estimated time, simply send us a quick WhatsApp message. We will adjust your pickup from \${locationName} accordingly without leaving you stranded.\`
      },
      {
        q: lang === 'es' ? \`¿Podemos poner nuestra propia música en el camino a \${locationName}?\` : \`Can we play our own music on the way to \${locationName}?\`,
        a: lang === 'es'
          ? \`¡Absolutamente! Queremos que tu transporte de lujo a \${locationName} se sienta como una extensión de tu celebración. Puedes conectar fácilmente tu smartphone a nuestro sistema de sonido Bluetooth y reproducir tu playlist favorita mientras te conducimos a \${locationName}.\`
          : \`Absolutely! We want your luxury transportation to \${locationName} to feel like an extension of your celebration. You can easily connect your smartphone to our Bluetooth sound system and play your favorite playlist while we drive you to \${locationName}.\`
      },
      {
        q: lang === 'es' ? \`¿Ofrecen transporte de un solo viaje desde \${locationName} de regreso a mi hotel?\` : \`Do you offer one-way transportation from \${locationName} back to my hotel?\`,
        a: lang === 'es'
          ? \`Aunque la mayoría de los invitados prefieren la conveniencia de nuestro servicio redondo, por supuesto que ofrecemos recogidas de un solo viaje desde \${locationName}. Solo indícanos la hora exacta en que nos necesitas en \${locationName}, y un vehículo de lujo estará allí esperando para llevarte a casa a salvo.\`
          : \`While most guests prefer the convenience of our round-trip service, we absolutely offer one-way pickups from \${locationName}. Just let us know the exact time you need us at \${locationName}, and a luxury vehicle will be there waiting to take you home safely.\`
      }
    ],
    golf: [
      {
        q: lang === 'es' ? `¿El vehículo tiene suficiente espacio para mis palos de golf al ir a ${locationName}?` : `Does the vehicle have enough space for my golf clubs when going to ${locationName}?`,
        a: lang === 'es'
          ? '¡Por supuesto! Nuestros traslados son privados y utilizamos SUVs espaciosas y vans tipo Sprinter, perfectas para acomodar cómodamente a tu grupo y todo su equipo de golf.'
          : 'Absolutely! Our transfers are private, and we use spacious SUVs and Sprinter vans, perfect for comfortably accommodating your group and all your golf gear.'
      },
      {
        q: lang === 'es' ? '¿Qué pasa si mi tee time cambia o se cancela?' : 'What happens if my tee time changes or is canceled?',
        a: lang === 'es'
          ? 'Tienes la tranquilidad de contar con cancelación gratuita hasta 24 horas antes del servicio. Solo avísanos y ajustaremos la logística.'
          : 'You have the peace of mind of free cancellation up to 24 hours before the service. Just let us know and we will adjust the logistics.'
      },
      {
        q: lang === 'es' ? '¿Qué incluye el servicio hacia el campo de golf?' : 'What is included in the service to the golf course?',
        a: lang === 'es'
          ? 'Todos nuestros traslados de golf incluyen chofer bilingüe, aire acondicionado y bebidas de cortesía para mantenerte hidratado antes de salir al campo.'
          : 'All our golf transfers include a bilingual driver, air conditioning, and complimentary drinks to keep you hydrated before hitting the course.'
      }
    ]
  };

  const currentFaqs = faqs[type] || faqs['hotel'];

  return (
    <div className="mt-12 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
        </h3>
        <p className="text-slate-500 mt-2 font-medium">
          {lang === 'es' ? 'Resolvemos tus dudas antes de viajar.' : 'Clearing your doubts before you travel.'}
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {currentFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="group">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className={`w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors ${isOpen ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'}`}
              >
                <span className={`text-lg font-bold pr-8 leading-snug ${isOpen ? 'text-blue-700' : 'text-slate-800'}`}>
                  {faq.q}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'border-blue-200 bg-blue-100' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                  <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 md:p-8 pt-0 text-slate-600 leading-relaxed font-medium">
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
