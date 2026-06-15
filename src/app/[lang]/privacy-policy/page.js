// src/app/[lang]/privacy-policy/page.js
'use client';

import React, { useEffect, use } from 'react';
import { ShieldCheck, Database, Eye, Settings, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicy({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const content = {
    es: {
      seoTitle: "Aviso de Privacidad | Ballard Tour Services",
      seoDesc: "Aviso de Privacidad de Ballard Tour Services en Los Cabos. Conoce cómo recopilamos, usamos y protegemos tus datos personales conforme a la LFPDPPP.",
      title: "Aviso de Privacidad.",
      subtitle: "Transparencia total sobre cómo protegemos tu información.",
      lastUpdated: "Versión 2024 - Última actualización: Junio 2024",
      companyInfo: "Ballard Tour Services • Transportación Turística Privada • Los Cabos, B.C.S., México",
      sections: [
        {
          icon: <Database size={20} />,
          title: "1. Datos Personales que Recabamos",
          text: "Para brindar nuestros servicios de transportación y tours, recopilamos los siguientes datos personales: nombre completo, dirección de correo electrónico, número de teléfono (WhatsApp), detalles de vuelos de llegada y salida, lugar de hospedaje y peticiones especiales de viaje. No recabamos datos personales sensibles. La información de tarjetas de crédito/débito es procesada directamente por pasarelas de pago seguras (Stripe/PayPal) y nunca es almacenada en nuestros servidores."
        },
        {
          icon: <Eye size={20} />,
          title: "2. Finalidad del Tratamiento de Datos",
          text: "Tus datos personales serán utilizados exclusivamente para las siguientes finalidades primarias: procesar y confirmar tus reservaciones de transporte o tours, coordinar la logística de tu llegada y salida (rastreo de vuelos), emitir comprobantes fiscales, y contactarte para notificaciones sobre tu servicio. Como finalidad secundaria, podríamos enviar encuestas de calidad o promociones exclusivas, de las cuales puedes solicitar la baja en cualquier momento."
        },
        {
          icon: <Globe size={20} />,
          title: "3. Transferencia de Datos",
          text: "Ballard Tour Services no vende, alquila ni comparte tu información personal con terceros ajenos a nuestra operación. Tus datos solo podrán ser compartidos con nuestros choferes asignados y proveedores de tours de confianza estrictamente para cumplir con el servicio contratado, o cuando sea requerido por una autoridad competente conforme a la legislación mexicana."
        },
        {
          icon: <Settings size={20} />,
          title: "4. Derechos ARCO",
          text: "Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), tienes el derecho de Acceder, Rectificar, Cancelar u Oponerte (Derechos ARCO) al tratamiento de tus datos personales. Para ejercer estos derechos, debes enviar una solicitud formal por escrito a nuestro equipo de privacidad."
        },
        {
          icon: <ShieldCheck size={20} />,
          title: "5. Uso de Cookies y Tecnologías de Rastreo",
          text: "Nuestro sitio web utiliza cookies estrictamente necesarias para el correcto funcionamiento del sistema de reservas, la selección de idioma y análisis básico de tráfico para mejorar la experiencia del usuario. Al continuar navegando en nuestro sitio web, consientes el uso de estas tecnologías."
        },
        {
          icon: <Mail size={20} />,
          title: "6. Modificaciones y Contacto",
          text: "Nos reservamos el derecho de actualizar este Aviso de Privacidad en cualquier momento. Las modificaciones estarán disponibles en esta página. Si tienes alguna duda sobre la protección de tu información o deseas revocar tu consentimiento, contáctanos a: reservationballard@gmail.com."
        }
      ]
    },
    en: {
      seoTitle: "Privacy Policy | Ballard Tour Services",
      seoDesc: "Privacy Policy for Ballard Tour Services in Los Cabos. Learn how we collect, use, and protect your personal data.",
      title: "Privacy Policy.",
      subtitle: "Total transparency on how we protect your information.",
      lastUpdated: "Version 2024 - Last updated: June 2024",
      companyInfo: "Ballard Tour Services • Private Tourist Transportation • Los Cabos, B.C.S., Mexico",
      sections: [
        {
          icon: <Database size={20} />,
          title: "1. Personal Data We Collect",
          text: "To provide our transportation and tour services, we collect the following personal data: full name, email address, phone number (WhatsApp), arrival and departure flight details, accommodation location, and special travel requests. We do not collect sensitive personal data. Credit/debit card information is processed directly by secure payment gateways (Stripe/PayPal) and is never stored on our servers."
        },
        {
          icon: <Eye size={20} />,
          title: "2. Purpose of Data Processing",
          text: "Your personal data will be used exclusively for the following primary purposes: processing and confirming your transportation or tour reservations, coordinating arrival and departure logistics (flight tracking), issuing billing receipts, and contacting you for service notifications. As a secondary purpose, we may send quality surveys or exclusive promotions, from which you can opt out at any time."
        },
        {
          icon: <Globe size={20} />,
          title: "3. Data Transfer",
          text: "Ballard Tour Services does not sell, rent, or share your personal information with third parties outside our operation. Your data may only be shared with our assigned drivers and trusted tour providers strictly to fulfill the contracted service, or when required by a competent authority in accordance with Mexican law."
        },
        {
          icon: <Settings size={20} />,
          title: "4. ARCO Rights",
          text: "In accordance with the Mexican Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP), you have the right to Access, Rectify, Cancel, or Oppose (ARCO Rights) the processing of your personal data. To exercise these rights, you must send a formal written request to our privacy team."
        },
        {
          icon: <ShieldCheck size={20} />,
          title: "5. Use of Cookies and Tracking Technologies",
          text: "Our website uses cookies that are strictly necessary for the proper functioning of the booking system, language selection, and basic traffic analysis to improve user experience. By continuing to browse our website, you consent to the use of these technologies."
        },
        {
          icon: <Mail size={20} />,
          title: "6. Modifications and Contact",
          text: "We reserve the right to update this Privacy Policy at any time. Modifications will be available on this page. If you have any questions about the protection of your information or wish to revoke your consent, please contact us at: reservationballard@gmail.com."
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
            {isEs ? 'Para ejercer tus derechos ARCO o dudas de privacidad, contáctanos en:' : 'To exercise your ARCO rights or for privacy inquiries, contact us at:'} <br/>
            <a href="mailto:reservationballard@gmail.com" className="text-slate-900 font-bold hover:underline mt-2 inline-block">
              reservationballard@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}