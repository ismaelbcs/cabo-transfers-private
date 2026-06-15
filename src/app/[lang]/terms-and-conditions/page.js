// src/app/[lang]/terms-and-conditions/page.js
'use client';

import React, { useEffect, use } from 'react';
import { Shield, Scale, MapPin, AlertCircle, CreditCard, UserCheck, Briefcase } from 'lucide-react';

export default function TermsAndConditions({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const content = {
    es: {
      seoTitle: "Términos y Condiciones | Ballard Tour Services",
      seoDesc: "Términos y condiciones de servicio para la transportación turística privada de Ballard Tour Services en Los Cabos, Baja California Sur.",
      title: "Términos y Condiciones.",
      subtitle: "Regulaciones legales para la prestación de nuestros servicios.",
      lastUpdated: "Versión 2024 - Última actualización: Junio 2024",
      companyInfo: "Ballard Tour Services • Transportación Turística Privada • Los Cabos, B.C.S., México",
      sections: [
        {
          icon: <Briefcase size={20} />,
          title: "1. Información General y Servicios",
          text: "Los presentes Términos y Condiciones regulan la relación comercial entre Ballard Tour Services y cualquier persona física o moral que contrate nuestros servicios de transportación privada, traslados aeroportuarios, eventos corporativos o excursiones en Baja California Sur. Al realizar una reservación por cualquier canal oficial (sitio web, WhatsApp, correo electrónico o teléfono), el cliente acepta íntegramente estos términos con validez legal en los Estados Unidos Mexicanos."
        },
        {
          icon: <CreditCard size={20} />,
          title: "2. Tarifas, Pagos y Cargos Adicionales",
          text: "La tarifa válida será la confirmada por escrito al cliente. Aceptamos pagos en MXN y USD mediante plataformas seguras (Stripe, PayPal) o efectivo. Podrán aplicar cargos adicionales in situ por: esperas superiores al tiempo de gracia, exceso de equipaje no declarado, paradas no programadas, cambios de ruta de último momento o limpieza extraordinaria por daños ocasionados por los pasajeros al interior de la unidad."
        },
        {
          icon: <Shield size={20} />,
          title: "3. Cancelaciones y Modificaciones",
          text: "Para mantener la transparencia y proteger la logística de nuestras operaciones, contamos con una política estricta de cancelaciones. Todos los reembolsos, penalizaciones por No Show y reglas de modificación de itinerarios están detallados en nuestra Política de Cancelación, la cual forma parte integral de este contrato."
        },
        {
          icon: <MapPin size={20} />,
          title: "4. Protocolos de Aeropuerto y Esperas",
          text: "Monitoreamos todos los vuelos de llegada en tiempo real. Un retraso de vuelo documentado no genera cargos adicionales. Una vez que el vuelo aterriza, nuestro conductor esperará un máximo de 60 minutos en la terminal. Si el cliente no se presenta o no se comunica dentro de este periodo, el servicio se clasificará como 'No Show' (ausencia) y no será sujeto a reembolso."
        },
        {
          icon: <UserCheck size={20} />,
          title: "5. Obligaciones y Conducta del Pasajero",
          text: "El cliente se compromete a proporcionar información veraz en su reservación (fecha, vuelo, número exacto de pasajeros) y a respetar los lineamientos del conductor. Está estrictamente prohibido el consumo de drogas ilegales, fumar (incluyendo vaporizadores) dentro de las unidades, comportamientos agresivos o cualquier acto que ponga en riesgo la seguridad vial. Ballard Tours se reserva el derecho de negar o terminar el servicio sin reembolso si se violan estas normas."
        },
        {
          icon: <AlertCircle size={20} />,
          title: "6. Equipaje, Menores y Artículos Prohibidos",
          text: "Por ley, todo menor de edad debe viajar acompañado de un adulto y utilizar los asientos de seguridad requeridos (car seats/boosters), los cuales proveemos sin costo al solicitarlos. El equipaje debe coincidir con la capacidad de la unidad reservada. No transportamos armas, explosivos, drogas ilícitas ni materiales peligrosos."
        },
        {
          icon: <Scale size={20} />,
          title: "7. Responsabilidad, Fuerza Mayor y Disputas",
          text: "Ballard Tours no será responsable por retrasos o cancelaciones derivadas de causas de fuerza mayor (huracanes, cierres de puertos/carreteras, pandemias, manifestaciones o accidentes de terceros). Nuestra responsabilidad máxima legal se limita al monto total pagado por el servicio. El cliente reconoce que toda reservación confirmada constituye una contratación legítima y renuncia a iniciar disputas bancarias (chargebacks) fraudulentas. Toda controversia se someterá a la jurisdicción de los tribunales competentes en Los Cabos, Baja California Sur."
        }
      ]
    },
    en: {
      seoTitle: "Terms and Conditions | Ballard Tour Services",
      seoDesc: "Terms and conditions of service for private tourist transportation by Ballard Tour Services in Los Cabos, Baja California Sur.",
      title: "Terms & Conditions.",
      subtitle: "Legal regulations for the provision of our services.",
      lastUpdated: "Version 2024 - Last updated: June 2024",
      companyInfo: "Ballard Tour Services • Private Tourist Transportation • Los Cabos, B.C.S., Mexico",
      sections: [
        {
          icon: <Briefcase size={20} />,
          title: "1. General Information and Services",
          text: "These Terms and Conditions regulate the commercial relationship between Ballard Tour Services and any individual or legal entity that books our private transportation, airport transfers, corporate events, or excursions in Baja California Sur. By making a reservation through any official channel (website, WhatsApp, email, or phone), the client fully accepts these terms, which are legally binding in the United Mexican States."
        },
        {
          icon: <CreditCard size={20} />,
          title: "2. Rates, Payments, and Additional Charges",
          text: "The valid rate will be the one confirmed in writing to the client. We accept payments in MXN and USD through secure platforms (Stripe, PayPal) or cash. Additional on-site charges may apply for: wait times exceeding the grace period, undeclared excess luggage, unscheduled stops, last-minute route changes, or extraordinary cleaning fees due to damage caused by passengers inside the vehicle."
        },
        {
          icon: <Shield size={20} />,
          title: "3. Cancellations and Modifications",
          text: "To maintain transparency and protect our operational logistics, we have a strict cancellation policy. All refunds, No-Show penalties, and itinerary modification rules are detailed in our separate Cancellation Policy, which forms an integral part of this contract."
        },
        {
          icon: <MapPin size={20} />,
          title: "4. Airport Protocols and Wait Times",
          text: "We monitor all arrival flights in real-time. A documented flight delay does not incur additional charges. Once the flight lands, our driver will wait a maximum of 60 minutes at the terminal. If the client fails to show up or communicate within this period, the service will be classified as a 'No Show' and will not be eligible for a refund."
        },
        {
          icon: <UserCheck size={20} />,
          title: "5. Passenger Obligations and Conduct",
          text: "The client agrees to provide accurate information in their reservation (date, flight, exact number of passengers) and to respect the driver's guidelines. The consumption of illegal drugs, smoking (including vapes) inside the vehicles, aggressive behavior, or any act that compromises road safety is strictly prohibited. Ballard Tours reserves the right to refuse or terminate service without a refund if these rules are violated."
        },
        {
          icon: <AlertCircle size={20} />,
          title: "6. Luggage, Minors, and Prohibited Items",
          text: "By law, all minors must travel accompanied by an adult and use the required safety seats (car seats/boosters), which we provide free of charge upon request. Luggage must match the capacity of the reserved vehicle. We do not transport weapons, explosives, illicit drugs, or hazardous materials."
        },
        {
          icon: <Scale size={20} />,
          title: "7. Liability, Force Majeure, and Disputes",
          text: "Ballard Tours shall not be held liable for delays or cancellations arising from force majeure events (hurricanes, port/road closures, pandemics, protests, or third-party accidents). Our maximum legal liability is limited to the total amount paid for the service. The client acknowledges that any confirmed reservation constitutes a legitimate contract and waives the right to initiate fraudulent bank disputes (chargebacks). Any controversy shall be submitted to the jurisdiction of the competent courts in Los Cabos, Baja California Sur."
        }
      ]
    }
  };

  const t = isEs ? content.es : content.en;

  return (
    <div className="bg-[#fafafa] min-h-screen pb-24 font-sans selection:bg-slate-900 selection:text-white">
      {/* SE QUITARON LAS ETIQUETAS HELMET */}
      <title>{t.seoTitle}</title>
      <meta name="description" content={t.seoDesc} />

      {/* Header Clásico Minimalista */}
      <div className="pt-32 pb-12 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
          {t.title}
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Info Box */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-8 mb-12 text-center">
          <p className="text-slate-900 font-bold text-lg mb-1 tracking-tight">Ballard Tour Services</p>
          <p className="text-slate-500 text-sm font-medium mb-4">Los Cabos, Baja California Sur, México</p>
          <div className="inline-block bg-slate-100 text-slate-600 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {t.lastUpdated}
          </div>
        </div>

        {/* Legal Sections */}
        <div className="space-y-8">
          {t.sections.map((sec, index) => (
            <div key={index} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900 shrink-0">
                  {sec.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  {sec.title}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium pl-14">
                {sec.text}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isEs ? 'Para dudas legales o aclaraciones, contáctanos en:' : 'For legal inquiries or clarifications, contact us at:'} <br/>
            <a href="mailto:reservationballard@gmail.com" className="text-slate-900 font-bold hover:underline mt-2 inline-block">
              reservationballard@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}