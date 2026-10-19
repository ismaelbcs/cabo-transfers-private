'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../../context/CartContext';
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Users, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  CreditCard, 
  FileText, 
  ChevronRight,
  Info,
  MapPin,
  Lock
} from 'lucide-react';

export default function QuotePage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const quoteId = (resolvedParams?.id || 'cot-6727').toUpperCase();
  const router = useRouter();
  const { agregarAlCombo, vaciarCombo } = useCart();

  // Datos específicos de la cotización para Simon Clay (COT-6727)
  const isCOT6727 = quoteId === 'COT-6727';
  
  const clientName = isCOT6727 ? 'SIMON CLAY' : 'VALUED CLIENT';
  const pax = isCOT6727 ? 5 : 5;
  const dates = isCOT6727 ? 'January 10, 2027 – January 24, 2027 (15 Days)' : 'January 10, 2027 – January 24, 2027 (15 Days)';
  const totalAmount = 5000.00;
  const depositAmount = 1000.00;
  const balanceDue = 4000.00;
  const dailyHours = 6;
  const days = 15;
  const pricePerHour = (totalAmount / (dailyHours * days)).toFixed(2); // $55.56 USD/hr
  const pricePerDay = (totalAmount / days).toFixed(2); // $333.33 USD/day

  const handleAcceptAndPayDeposit = () => {
    // Limpiamos carrito anterior para evitar confusiones
    vaciarCombo();

    // Agregamos el servicio especial a la reserva
    agregarAlCombo({
      id: `quote-${quoteId}`,
      servicio: 'custom_quote',
      titulo: isEs 
        ? `Servicio Privado de Chofer y Tours (15 Días) - Anticipo / Depósito` 
        : `Private Chauffeured & Tour Service (15 Days) - Initial Deposit`,
      subtitulo: isEs
        ? `Cotización #${quoteId} | 5 Pasajeros | Total: $5,000 USD | Anticipo: $1,000 USD | Saldo pendiente: $4,000 USD a la llegada`
        : `Quote #${quoteId} | 5 Passengers | Total: $5,000 USD | Deposit Paid: $1,000 USD | Balance Due: $4,000 USD on arrival`,
      precio: depositAmount,
      tipoEspecial: 'especiales',
      detalles: {
        origen: 'Aeropuerto SJD / Cabo San Lucas',
        destino: 'Private Chauffeured Service (15 Days - 6h/day)',
        pasajeros: pax.toString(),
        fecha: '2027-01-10 to 2027-01-24',
        horaIda: '12:00',
        horaRegreso: '10:00'
      },
      config: {
        hotelId: 'Waldorf Astoria Los Cabos Pedregal / Cabo San Lucas',
        pasajeros: pax.toString(),
        fechaLlegada: '2027-01-10',
        fechaSalida: '2027-01-24',
        notas: `OFFICIAL QUOTE #${quoteId} - TOTAL SERVICE: $5,000.00 USD. Initial Security Deposit Paid: $1,000.00 USD. Remaining Balance: $4,000.00 USD due upon arrival in Los Cabos. Note: Full detailed itinerary, daily schedules, and hotel address will be confirmed 1 week prior to arrival.`
      }
    });

    // Redirige directamente al checkout con el depósito cargado
    router.push(`/${lang}/checkout`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* ENCABEZADO DE LA COTIZACIÓN */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/60 p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-3">
                <FileText size={14} />
                {isEs ? 'Cotización Oficial' : 'Official Transportation Quote'}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {isEs ? 'Presupuesto de Servicio Privado' : 'Private Chauffeured Service Quote'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {isEs ? 'Ballard Tour Services · Los Cabos, B.C.S.' : 'Ballard Tour Services · Los Cabos, B.C.S.'}
              </p>
            </div>

            <div className="text-left md:text-right bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                {isEs ? 'FOLIO / REFERENCIA' : 'QUOTE FOLIO / REF'}
              </span>
              <span className="text-2xl font-black text-amber-400 tracking-wider">
                {quoteId}
              </span>
              <div className="flex items-center md:justify-end gap-1.5 mt-1 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {isEs ? 'Confirmación Pendiente' : 'Ready for Confirmation'}
              </div>
            </div>
          </div>

          {/* DATOS DEL CLIENTE Y SERVICIO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isEs ? 'Cliente' : 'Lead Traveler'}
              </span>
              <p className="font-black text-white text-base">{clientName}</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isEs ? 'Pasajeros' : 'Passengers (PAX)'}
              </span>
              <p className="font-black text-white text-base flex items-center gap-1.5">
                <Users size={16} className="text-amber-400" /> {pax} {isEs ? 'Personas' : 'Persons'}
              </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isEs ? 'Vehículo Asignado' : 'Assigned Vehicle'}
              </span>
              <p className="font-black text-white text-base flex items-center gap-1.5">
                <Car size={16} className="text-amber-400" /> Private SUV / Van
              </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isEs ? 'Duración del Servicio' : 'Service Duration'}
              </span>
              <p className="font-black text-white text-base flex items-center gap-1.5">
                <Clock size={16} className="text-amber-400" /> 15 Days (6h/day)
              </p>
            </div>
          </div>
        </div>

        {/* DESGLOSE DE PRECIOS EXACTO (COMO LO PIDIÓ SIMON) */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/60 p-6 md:p-8 shadow-2xl mb-8">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <CreditCard className="text-amber-400" size={22} />
            {isEs ? 'Desglose de Tarifas y Esquema de Pago' : 'Requested Pricing Breakdown & Payment Terms'}
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <span className="font-semibold text-slate-300">
                {isEs ? 'Precio estimado por hora:' : 'Price per hour:'}
              </span>
              <span className="font-mono font-bold text-white text-lg">
                ${pricePerHour} USD
              </span>
            </div>

            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <span className="font-semibold text-slate-300">
                {isEs ? 'Precio por jornada de 6 horas al día:' : 'Price per 6 hours a day:'}
              </span>
              <span className="font-mono font-bold text-white text-lg">
                ${pricePerDay} USD / day
              </span>
            </div>

            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-900/80 border border-slate-600">
              <span className="font-black text-white text-base">
                {isEs ? 'Costo total por los 15 días completos:' : 'Total cost for 15 days (6 hrs/day):'}
              </span>
              <span className="font-mono font-black text-amber-400 text-2xl">
                ${totalAmount.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* CAJA DESTACADA: ANTICIPO Y SALDO RESTANTE */}
          <div className="bg-gradient-to-br from-blue-950/60 to-slate-900/90 border-2 border-blue-500/40 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider mb-2">
                  {isEs ? 'Paso 1: Anticipo de Reserva' : 'Step 1: Security Deposit Due Today'}
                </span>
                <p className="text-3xl font-black text-emerald-400">
                  ${depositAmount.toFixed(2)} USD
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isEs 
                    ? 'Asegura tu vehículo y chofer privado para las 15 fechas.' 
                    : 'Guarantees your private vehicle and dedicated chauffeur for all 15 dates.'}
                </p>
              </div>

              <div className="md:border-l md:border-slate-700 md:pl-6">
                <span className="inline-block px-3 py-1 rounded bg-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">
                  {isEs ? 'Paso 2: Saldo Restante a la Llegada' : 'Step 2: Remaining Balance on Arrival'}
                </span>
                <p className="text-2xl font-black text-slate-200">
                  ${balanceDue.toFixed(2)} USD
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isEs 
                    ? 'Se liquida al iniciar el servicio con chofer en Los Cabos.' 
                    : 'Payable upon arrival when your private service begins in Los Cabos.'}
                </p>
              </div>
            </div>
          </div>

          {/* ACLARACIÓN IMPORTANTE DEL ITINERARIO */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8 flex items-start gap-4 text-amber-200/90 text-sm leading-relaxed">
            <Info size={22} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300 mb-1">
                {isEs ? 'Nota sobre el Itinerario y Destinos:' : 'Note on Itinerary & Destinations:'}
              </p>
              <p>
                {isEs 
                  ? 'Las ubicaciones de muestra incluidas en la cotización inicial (Waldorf Astoria Pedregal, Flora Farms, Acre, Diamante Golf, etc.) son ejemplos de referencia. Conforme a tu solicitud, el itinerario diario final, horarios específicos de recogida y dirección del hotel se confirmarán 1 semana antes de tu llegada.'
                  : 'The destinations listed in your initial quote sheet (Waldorf Astoria Pedregal, Flora Farms, Acre, Diamante Golf, etc.) are sample reference routes. As requested, your complete day-to-day itinerary, exact pickup times, and hotel address will be finalized 1 week prior to your arrival.'}
              </p>
            </div>
          </div>

          {/* AVISO DE POLÍTICA DE SEGURIDAD (PCI-DSS) */}
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5 mb-8 flex items-start gap-4 text-slate-300 text-xs leading-relaxed">
            <Lock size={20} className="text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-1">
                {isEs ? 'Políticas de Pago Seguro y Protección de Tarjetas:' : 'Secure Payment Policy & Cardholder Protection:'}
              </p>
              <p>
                {isEs
                  ? 'Por estrictos estándares bancarios internacionales (PCI-DSS) y protección mutua contra fraudes, NO aceptamos números de tarjeta por llamada, mensaje ni cobro manual remoto en terminal. Todos los anticipos se realizan de forma encriptada directamente por el titular a través de nuestra pasarela segura en línea (PayPal / Tarjeta de Crédito o Débito con 3D Secure).'
                  : 'For strict international banking standards (PCI-DSS) and fraud prevention, we do NOT accept credit card numbers submitted via email, phone, or manual remote terminal entry. All deposits must be processed directly by the cardholder through our verified 256-bit encrypted checkout (PayPal / Credit or Debit Card with 3D Secure verification).'}
              </p>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN / CONFIRMAR CON ANTICIPO */}
          <div className="text-center pt-2">
            <button
              onClick={handleAcceptAndPayDeposit}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <span>{isEs ? 'Pagar Anticipo de $1,000 USD y Confirmar' : 'Pay $1,000.00 USD Deposit & Confirm Booking'}</span>
              <ArrowRight size={22} />
            </button>
            <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-emerald-400" />
              {isEs 
                ? 'Pago 100% Seguro Encriptado · Confirmación Inmediata con Folio Oficial'
                : '100% Secure Encrypted Payment · Immediate Official Confirmation Receipt'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
