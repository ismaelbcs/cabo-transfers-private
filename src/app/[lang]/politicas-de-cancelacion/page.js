// src/app/[lang]/politicas-de-cancelacion/page.js
'use client';

import React, { useEffect, use } from 'react';
import { AlertTriangle, Clock, CalendarX, Plane, CloudRain } from 'lucide-react';

export default function CancellationPolicy({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const content = {
    es: {
      seoTitle: "Políticas de Cancelación | Ballard Tour Services",
      seoDesc: "Políticas de cancelación, reembolsos y modificaciones para los servicios de transportación de Ballard Tours en Los Cabos.",
      title: "Políticas de Cancelación.",
      subtitle: "Transparencia y claridad en tus reservas y reembolsos.",
      intro: "Las presentes Políticas forman parte integral de nuestros Términos y Condiciones. Al recibir un código de confirmación, estas políticas entran en vigor. Nuestro objetivo es ser justos con tu inversión y con el tiempo de nuestros operadores.",
      channelsTitle: "Canales oficiales para cancelaciones:",
      
      tableHeaders: ["Anticipación (Previo al servicio)", "Reembolso", "Penalidad"],
      standardTransfers: {
        title: "Traslados Individuales (1 a 6 Pasajeros)",
        rows: [
          { time: "Más de 48 horas", refund: "100%", penalty: "0%", color: "text-emerald-600" },
          { time: "Entre 24 y 48 horas", refund: "50%", penalty: "50%", color: "text-amber-600" },
          { time: "Menos de 24 horas", refund: "0%", penalty: "100%", color: "text-red-600" },
          { time: "No Show (No presentación)", refund: "0%", penalty: "100%", color: "text-red-600" }
        ]
      },
      groupTransfers: {
        title: "Traslados Grupales (7 a 15 Pasajeros o Vans Completas)",
        rows: [
          { time: "Más de 15 días", refund: "100%", penalty: "0%", color: "text-emerald-600" },
          { time: "Entre 7 y 14 días", refund: "50%", penalty: "50%", color: "text-amber-600" },
          { time: "Menos de 7 días", refund: "0%", penalty: "100%", color: "text-red-600" }
        ]
      },
      specialRules: [
        {
          icon: <Plane size={18} />,
          title: "Vuelos Cancelados o Retrasados",
          text: "Si tu aerolínea cancela o retrasa tu vuelo, reprogramaremos tu servicio sin penalidad (sujeto a disponibilidad y enviando el comprobante de la aerolínea)."
        },
        {
          icon: <CloudRain size={18} />,
          title: "Clima y Fuerza Mayor",
          text: "Alertas oficiales de huracán emitidas por el gobierno permiten cancelación al 100%. Sin embargo, lluvia normal, tráfico o días nublados no generan derecho a reembolso."
        },
        {
          icon: <Clock size={18} />,
          title: "Llegadas Tardías y Tiempos de Espera",
          text: "En el aeropuerto, ofrecemos 60 minutos de gracia tras el aterrizaje. En el hotel/villa, ofrecemos 15 minutos de gracia. Superado este tiempo sin comunicación, el vehículo se retirará y se considerará No Show (sin reembolso)."
        }
      ],
      refundProcess: {
        title: "Proceso de Reembolsos",
        text: "Los reembolsos aprobados se emiten en un plazo de 5 a 10 días hábiles. Importante: Las comisiones de procesamiento de tarjetas (aprox. 4% al 5% por Stripe/PayPal) no son reembolsables bajo ninguna circunstancia, ya que el procesador no las devuelve."
      },
      highSeason: "Nota de Temporada Alta: Durante el 15 de Diciembre al 5 de Enero y Semana Santa, las cancelaciones con menos de 7 días de anticipación no son reembolsables."
    },
    en: {
      seoTitle: "Cancellation Policy | Ballard Tour Services",
      seoDesc: "Cancellation policies, refunds, and modifications for Ballard Tours transportation services in Los Cabos.",
      title: "Cancellation Policy.",
      subtitle: "Transparency and clarity for your bookings and refunds.",
      intro: "These Policies are an integral part of our Terms and Conditions. Once a confirmation code is issued, these policies take immediate effect. Our goal is to be fair to your investment and our operators' time.",
      channelsTitle: "Official channels for cancellations:",
      
      tableHeaders: ["Notice Required (Prior to service)", "Refund", "Penalty"],
      standardTransfers: {
        title: "Standard Transfers (1 to 6 Passengers)",
        rows: [
          { time: "More than 48 hours", refund: "100%", penalty: "0%", color: "text-emerald-600" },
          { time: "Between 24 and 48 hours", refund: "50%", penalty: "50%", color: "text-amber-600" },
          { time: "Less than 24 hours", refund: "0%", penalty: "100%", color: "text-red-600" },
          { time: "No Show", refund: "0%", penalty: "100%", color: "text-red-600" }
        ]
      },
      groupTransfers: {
        title: "Group Transfers (7 to 15 Passengers or Full Vans)",
        rows: [
          { time: "More than 15 days", refund: "100%", penalty: "0%", color: "text-emerald-600" },
          { time: "Between 7 and 14 days", refund: "50%", penalty: "50%", color: "text-amber-600" },
          { time: "Less than 7 days", refund: "0%", penalty: "100%", color: "text-red-600" }
        ]
      },
      specialRules: [
        {
          icon: <Plane size={18} />,
          title: "Canceled or Delayed Flights",
          text: "If your airline cancels or delays your flight, we will reschedule your service without penalty (subject to availability and upon presentation of airline documentation)."
        },
        {
          icon: <CloudRain size={18} />,
          title: "Weather and Force Majeure",
          text: "Official government-issued hurricane alerts allow for a 100% refund. However, normal rain, heavy traffic, or cloudy days do not qualify for a refund."
        },
        {
          icon: <Clock size={18} />,
          title: "Late Arrivals and Wait Times",
          text: "At the airport, we offer a 60-minute grace period after landing. At hotels/villas, we offer a 15-minute grace period. If this time is exceeded without communication, the vehicle will leave and it will be considered a No Show (no refund)."
        }
      ],
      refundProcess: {
        title: "Refund Process",
        text: "Approved refunds are processed within 5 to 10 business days. Please note: Credit card processing fees (approx. 4% to 5% by Stripe/PayPal) are strictly non-refundable under any circumstances, as the processor does not return them."
      },
      highSeason: "Peak Season Note: From December 15th to January 5th and Easter Week, cancellations with less than 7 days notice are entirely non-refundable."
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
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Intro y Canales */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10">
          <p className="text-slate-600 font-medium leading-relaxed mb-6">
            {t.intro}
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 inline-block w-full">
            <p className="text-slate-900 font-bold mb-2 text-sm">{t.channelsTitle}</p>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
              <span className="bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">WhatsApp: +52 624 139 3497</span>
              <span className="bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">reservationballard@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Tablas de Tiempos (Estilo Limpio) */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
          {/* Transfer Individuales */}
          <div className="p-8 md:p-10 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight flex items-center gap-2">
              <Clock size={20} className="text-slate-400" /> {t.standardTransfers.title}
            </h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">{t.tableHeaders[0]}</th>
                    <th className="pb-3 font-bold">{t.tableHeaders[1]}</th>
                    <th className="pb-3 font-bold">{t.tableHeaders[2]}</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-slate-700">
                  {t.standardTransfers.rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-50 last:border-0">
                      <td className="py-4">{row.time}</td>
                      <td className={`py-4 font-bold ${row.color}`}>{row.refund}</td>
                      <td className="py-4 text-slate-400">{row.penalty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transfer Grupales */}
          <div className="p-8 md:p-10 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight flex items-center gap-2">
              <CalendarX size={20} className="text-slate-400" /> {t.groupTransfers.title}
            </h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">{t.tableHeaders[0]}</th>
                    <th className="pb-3 font-bold">{t.tableHeaders[1]}</th>
                    <th className="pb-3 font-bold">{t.tableHeaders[2]}</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-slate-700">
                  {t.groupTransfers.rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0">
                      <td className="py-4">{row.time}</td>
                      <td className={`py-4 font-bold ${row.color}`}>{row.refund}</td>
                      <td className="py-4 text-slate-400">{row.penalty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reglas Especiales Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.specialRules.map((rule, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-4 border border-slate-100">
                {rule.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{rule.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{rule.text}</p>
            </div>
          ))}
        </div>

        {/* Alertas Finales */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 md:p-10 flex flex-col gap-6">
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.refundProcess.title}</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">
              {t.refundProcess.text}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex items-start gap-4">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <p className="text-amber-900 font-medium text-sm leading-relaxed">
              {t.highSeason}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}