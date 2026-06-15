// src/components/FAQSection.jsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection = ({ lang = 'en' }) => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: { 
        es: "¿Cómo encuentro a mi chofer en el Aeropuerto de Los Cabos (SJD)?", 
        en: "How do I find my driver at SJD Los Cabos Airport?" 
      },
      a: { 
        es: "Después de recoger su equipaje y pasar aduana, por favor ignore a los representantes de tiempo compartido dentro de la terminal. Salga directamente del edificio; su chofer bilingüe lo estará esperando afuera con un letrero personalizado con su nombre.", 
        en: "Once you clear customs and grab your luggage, please ignore the timeshare representatives inside the terminal. Walk straight outside to the designated transportation area; your bilingual driver will be waiting holding a personalized sign with your name." 
      }
    },
    {
      q: { 
        es: "¿A qué áreas de Los Cabos ofrecen servicio de transporte?", 
        en: "What areas do you provide transportation to in Los Cabos?" 
      },
      a: { 
        es: "Ofrecemos transporte privado a todos los resorts y destinos de Baja California Sur. Nuestras rutas principales incluyen San José del Cabo, el Corredor Turístico, Cabo San Lucas y la Zona del Pacífico (Diamante, Nobu, Hard Rock).", 
        en: "We offer private transportation across the entire Baja California Sur peninsula. Our main routes include San Jose del Cabo, the Tourist Corridor, Cabo San Lucas, and the Pacific Zone (Diamante, Nobu, Hard Rock)." 
      }
    },
    {
      q: { 
        es: "¿El servicio de transporte de aeropuerto es compartido o privado?", 
        en: "Are your airport transfer services shared or private?" 
      },
      a: { 
        es: "Todos los traslados de Ballard Tours son 100% privados. Nunca compartirá su SUV de lujo o van Sprinter con desconocidos, garantizando un viaje directo y sin paradas hacia su hotel.", 
        en: "All Ballard Tours airport shuttles and transfers are 100% private. You will never share your luxury SUV or Sprinter van with strangers, ensuring a direct, non-stop ride to your resort." 
      }
    },
    {
      q: { 
        es: "¿Proporcionan sillas de bebé o asientos elevados (boosters)?", 
        en: "Do you provide child car seats or boosters?" 
      },
      a: { 
        es: "Sí, la seguridad de su familia es nuestra prioridad. Ofrecemos sillas para bebés y asientos elevados sin costo adicional. Solo tiene que solicitarlos durante su reserva y estarán instalados en su vehículo.", 
        en: "Yes, family safety is our top priority. We provide infant car seats, baby seats, and booster seats absolutely free of charge. Simply request them during your booking process, and they will be pre-installed in your vehicle." 
      }
    },
    {
      q: { 
        es: "¿Podemos hacer una parada para comprar despensa en el camino al hotel?", 
        en: "Can we stop for groceries or drinks on the way to our hotel?" 
      },
      a: { 
        es: "¡Por supuesto! Ofrecemos una parada de compras pre-programada (hasta por 1 hora) en tiendas populares como Costco, Walmart o Fresko por una pequeña tarifa adicional de $30 USD. Puede seleccionar esta opción al reservar.", 
        en: "Absolutely! We offer a pre-arranged shopping stop (up to 1 hour) at popular stores like Costco, Walmart, or Fresko for a small additional fee of $30 USD. Just select the 'Shopping Stop' option when booking online." 
      }
    },
    {
      q: { 
        es: "¿Qué sucede si mi vuelo de llegada se retrasa?", 
        en: "What happens if my incoming flight is delayed?" 
      },
      a: { 
        es: "Incluimos monitoreo de vuelos en tiempo real sin costo. Si su vuelo se retrasa o llega antes, nuestro equipo ajusta el horario de su chofer automáticamente. Estaremos allí cuando aterrice, sin cargos extra.", 
        en: "We include complimentary real-time flight tracking with all our airport transfers. If your flight is delayed or arrives early, our dispatch team adjusts your driver's schedule automatically. We will be there when you land, at no extra cost." 
      }
    },
    {
      q: { 
        es: "¿Qué tipo de vehículos utilizan para los traslados?", 
        en: "What type of vehicles do you use for your transportation services?" 
      },
      a: { 
        es: "Nuestra flota premium consiste en vehículos de modelo reciente con clima controlado. Utilizamos SUV de Lujo (como Chevrolet Suburban) para hasta 6 pasajeros, y amplias Vanes Mercedes Benz Sprinter para grupos de hasta 10 pasajeros.", 
        en: "Our premium fleet consists of late-model, climate-controlled vehicles. We use Luxury SUVs (like Chevrolet Suburbans) for up to 6 passengers, and spacious Mercedes Benz Sprinter Vans for larger groups of up to 10 passengers." 
      }
    },
    {
      q: { 
        es: "¿Sus precios incluyen impuestos y cuotas de autopista?", 
        en: "Do your prices include taxes and toll roads?" 
      },
      a: { 
        es: "Sí, nuestras tarifas fijas son con todo incluido. El precio que ve en la página cubre impuestos federales de aeropuerto, casetas de cobro y seguro del vehículo. No hay tarifas ocultas al llegar.", 
        en: "Yes, our flat-rate pricing is all-inclusive. The price you see covers federal airport taxes, toll roads, and vehicle insurance. There are no hidden fees upon arrival." 
      }
    }
  ];

  // Generador dinámico de Schema Markup para Google (SEO Nativo en Next.js)
  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q[lang],
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a[lang]
      }
    }))
  };

  return (
    <section className="w-full">
      {/* 🚀 Inyección Nativa de SEO para Next.js */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
      />
      
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-slate-50 text-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200 shadow-sm">
          <HelpCircle size={28} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
          {lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-slate-500 font-medium text-sm md:text-base max-w-2xl mx-auto">
          {lang === 'es' ? 'Todo lo que necesitas saber sobre nuestra logística y servicios de transporte.' : 'Everything you need to know about our transportation logistics and services.'}
        </p>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {faqs.map((faq, index) => {
          const isOpen = openFAQ === index;
          
          return (
            <div 
              key={index} 
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-slate-900 bg-slate-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}
            >
              <button
                onClick={() => setOpenFAQ(isOpen ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none group"
              >
                <span className={`font-bold text-base pr-6 transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  {faq.q[lang]}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                  <ChevronDown 
                    className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                    size={18} 
                  />
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-slate-600 font-medium text-sm leading-relaxed">
                    {faq.a[lang]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};