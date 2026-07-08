'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ type = 'hotel', locationName = '', lang = 'es' }) {
  const [openIndex, setOpenIndex] = useState(0);

  // Definimos las preguntas por tipo
  const faqs = {
    hotel: [
      {
        q: lang === 'es' ? `¿Dónde me encuentro con mi chofer en el Aeropuerto SJD para ir a ${locationName}?` : `Where do I meet my driver at SJD Airport to go to ${locationName}?`,
        a: lang === 'es' 
          ? `Al salir de la terminal, nuestro equipo te estará esperando con un letrero personalizado. En la Terminal 2, nos ubicamos en la sombrilla número 3. En la Terminal 1, nos encontrarás en la salida de grupos. Estaremos monitoreando tu vuelo para estar a tiempo.`
          : `Upon exiting the terminal, our team will be waiting with a personalized sign. At Terminal 2, we are located at umbrella number 3. At Terminal 1, you will find us at the groups exit. We will be monitoring your flight to be on time.`
      },
      {
        q: lang === 'es' ? '¿Puedo pedir una parada en el supermercado antes de llegar al hotel?' : 'Can I request a grocery stop before arriving at the hotel?',
        a: lang === 'es'
          ? '¡Sí! Por una pequeña tarifa adicional puedes agregar una parada en Walmart, Fresko o Costco para abastecerte antes de llegar a tu resort. Solo menciónalo al hacer tu reserva.'
          : 'Yes! For a small additional fee, you can add a stop at Walmart, Fresko, or Costco to stock up before arriving at your resort. Just mention it when booking.'
      },
      {
        q: lang === 'es' ? '¿Qué amenidades incluyen sus traslados?' : 'What amenities are included in your transfers?',
        a: lang === 'es'
          ? 'Nuestros traslados a hoteles incluyen bebidas de cortesía (agua fría/cervezas), sillas para bebés o asientos elevados totalmente gratis (bajo petición), aire acondicionado y conductores bilingües profesionales.'
          : 'Our hotel transfers include complimentary drinks (cold water/beers), completely free baby car seats or booster seats (upon request), air conditioning, and professional bilingual drivers.'
      },
      {
        q: lang === 'es' ? '¿Los vehículos son seguros y privados?' : 'Are the vehicles safe and private?',
        a: lang === 'es'
          ? `Totalmente. Todos nuestros servicios a ${locationName} son 100% privados (no compartes con desconocidos). Contamos con vehículos de modelo reciente, pólizas de seguro de cobertura amplia y choferes certificados.`
          : `Absolutely. All our services to ${locationName} are 100% private (no sharing with strangers). We feature recent model vehicles, full coverage insurance policies, and certified drivers.`
      }
    ],
    restaurant: [
      {
        q: lang === 'es' ? `¿El servicio de traslado a ${locationName} es completamente privado?` : `Is the transfer service to ${locationName} completely private?`,
        a: lang === 'es'
          ? `Sí, disfrutarás de un vehículo exclusivo para ti y tus acompañantes, con aire acondicionado y un chofer profesional bilingüe que asegurará un trayecto cómodo hacia ${locationName}.`
          : `Yes, you will enjoy an exclusive vehicle for you and your companions, with air conditioning and a professional bilingual driver ensuring a comfortable ride to ${locationName}.`
      },
      {
        q: lang === 'es' ? '¿Qué políticas de cancelación manejan para restaurantes?' : 'What is your cancellation policy for restaurant transfers?',
        a: lang === 'es'
          ? 'Ofrecemos cancelación gratuita hasta 48 horas antes de tu reserva. Entendemos que los planes pueden cambiar, por lo que te brindamos flexibilidad total.'
          : 'We offer free cancellation up to 48 hours before your booking. We understand plans change, so we provide full flexibility.'
      },
      {
        q: lang === 'es' ? '¿Incluyen alguna amenidad en el camino al restaurante?' : 'Do you include any amenities on the way to the restaurant?',
        a: lang === 'es'
          ? 'Para que inicies tu velada de la mejor manera, incluimos bebidas de cortesía (agua fresca y cervezas) en todos nuestros servicios hacia restaurantes.'
          : 'To start your evening the best way, we include complimentary drinks (cold water and beers) on all our restaurant transfer services.'
      },
      {
        q: lang === 'es' ? '¿El chofer nos esperará mientras cenamos?' : 'Will the driver wait for us while we have dinner?',
        a: lang === 'es'
          ? 'Puedes reservar el viaje redondo, en cuyo caso acordaremos una hora de recogida para regresarte a tu hotel. Si necesitas que el chofer espere en el lugar, puedes contratar el servicio por hora.'
          : 'You can book a round trip, in which case we will arrange a pickup time to take you back to your hotel. If you need the driver on standby, you can hire our hourly service.'
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
