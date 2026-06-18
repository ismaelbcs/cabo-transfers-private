// src/app/[lang]/cart/page.js
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Trash2, User, Plane, CreditCard, ChevronRight, ChevronLeft, 
  ShoppingBag, CheckCircle, Plus, Info, Banknote, Calendar, Mail, Phone, Compass,
  Ticket, Edit3 
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useBooking } from '../../../context/BookingContext';
import { toursData } from '../../../data/seoData';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../firebase';

// =========================================================
// 1. GENERADOR DE PLANTILLA HTML PARA ADMIN
// =========================================================
const generarHtmlCorreoAdmin = (item, datosCliente, numConfirmacion) => {
  const nombreCliente = `${datosCliente.nombre || ''} ${datosCliente.apellidos || ''}`.trim() || 'N/A';
  const correoCliente = datosCliente.email || 'N/A';
  const telefonoCliente = datosCliente.telefono || 'N/A';
  const metodoPago = datosCliente.paymentMethod === 'paypal' ? 'PayPal (Pagado)' : 'Efectivo al llegar';
  
  const tipoServicio = item.subtitulo || 'N/A';
  const hotelDestino = item.config?.hotelId || 'N/A';
  const pasajeros = item.config?.pasajeros || '1';
  
  const aerolineaLlegada = datosCliente.aerolinea ? `${datosCliente.aerolinea} (Vuelo: ${datosCliente.vuelo || 'N/A'})` : 'N/A';
  const horaLlegada = datosCliente.hora || 'N/A';
  
  const aerolineaSalida = item.config?.aerolineaSalida ? `${item.config.aerolineaSalida} (Vuelo: ${item.config.vueloSalida || 'N/A'})` : 'N/A (Vuelo: N/A)';
  const horaSalida = item.config?.horaSalida || 'N/A';
  const horaPickUp = item.config?.fechaLlegada || 'N/A'; 
  
  const wpLink = telefonoCliente !== 'N/A' ? `https://wa.me/${telefonoCliente.replace(/\D/g,'')}` : '#';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <tr>
          <td style="background-color: #213f8c; padding: 40px 20px; text-align: center;">
            <div style="margin-bottom: 20px;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.2); color: #ffffff; font-size: 12px; font-weight: bold; letter-spacing: 1px; padding: 6px 16px; border-radius: 9999px;">NOTIFICACIÓN DE WEB</span>
            </div>
            <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px; font-weight: 900;">¡Nuevo Servicio Recibido!</h1>
            <p style="color: #ffffff; margin: 0; font-size: 16px; opacity: 0.9;">${item.titulo}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #1e3a8a; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin: 0 0 20px 0;">INFORMACIÓN GENERAL</h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Nº de Confirmación:</td><td style="color: #1e3a8a; font-size: 14px; font-weight: 800; text-align: right; width: 60%; padding-bottom: 14px;">${numConfirmacion}</td></tr>
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Tipo de Servicio:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${tipoServicio}</td></tr>
            </table>

            <h2 style="color: #1e3a8a; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin: 30px 0 20px 0;">DATOS DEL CLIENTE</h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Nombre Completo:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${nombreCliente}</td></tr>
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Teléfono:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${telefonoCliente}</td></tr>
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Correo Electrónico:</td><td style="color: #2563eb; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px; text-decoration: underline;">${correoCliente}</td></tr>
            </table>

            <h2 style="color: #1e3a8a; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin: 30px 0 20px 0;">DETALLES LOGÍSTICOS</h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Hotel / Destino:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${hotelDestino}</td></tr>
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Pasajeros Totales:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${pasajeros}</td></tr>
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Aerolínea Llegada:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${aerolineaLlegada}</td></tr>
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Hora Llegada Vuelo:</td><td style="color: #1e3a8a; font-size: 14px; font-weight: 800; text-align: right; width: 60%; padding-bottom: 14px;">${horaLlegada}</td></tr>
              <tr><td style="color: #ea580c; font-size: 14px; font-weight: 800; width: 40%; padding-bottom: 14px;">Hora Pick-Up / Servicio:</td><td style="color: #ea580c; font-size: 14px; font-weight: 800; text-align: right; width: 60%; padding-bottom: 14px;">${horaPickUp}</td></tr>
            </table>

            <h2 style="color: #1e3a8a; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin: 30px 0 20px 0;">RESUMEN DE PAGO</h2>
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="color: #64748b; font-size: 14px; padding-bottom: 15px;">Método de Pago:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; padding-bottom: 15px;">${metodoPago}</td></tr>
                <tr><td style="color: #1e293b; font-size: 16px; font-weight: 800;">Valor de este servicio:</td><td style="color: #213f8c; font-size: 22px; font-weight: 900; text-align: right;">$${(item.precio || 0).toFixed(2)} USD</td></tr>
              </table>
            </div>

            <a href="${wpLink}" style="display: block; width: 100%; text-align: center; border: 2px solid #213f8c; color: #213f8c; text-decoration: none; padding: 14px 0; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 30px;">💬 Contactar con el Cliente</a>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// =========================================================
// 2. GENERADOR DE PLANTILLA HTML PARA CLIENTE
// =========================================================
const generarHtmlCorreoCliente = (item, datosCliente, numConfirmacion, lang) => {
  const isEs = lang === 'es';
  const nombreCliente = `${datosCliente.nombre || ''} ${datosCliente.apellidos || ''}`.trim() || 'Pasajero';
  const metodoPago = datosCliente.paymentMethod === 'paypal' ? 'PayPal' : 'Efectivo/Cash';
  const pasajeros = item.config?.pasajeros || 'N/A';
  const pickup = item.config?.fechaLlegada || 'N/A';

  const title = isEs ? '¡Gracias por tu reserva!' : 'Thank you for your booking!';
  const greeting = isEs ? 'Hola' : 'Hello';
  const subtitle = isEs ? 'Tu servicio en Los Cabos está confirmado. Aquí tienes los detalles:' : 'Your service in Los Cabos is confirmed. Here are the details:';

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 30px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background-color: #10b981; padding: 30px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">${title}</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">${item.titulo}</p>
        </div>
        <div style="padding: 30px;">
          <p>${greeting} <strong>${nombreCliente}</strong>,</p>
          <p>${subtitle}</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>${isEs ? 'N° de Confirmación' : 'Confirmation N°'}:</strong> <span style="color:#1e3a8a; font-weight:bold;">${numConfirmacion}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>${isEs ? 'Pasajeros' : 'Passengers'}:</strong> ${pasajeros}</p>
            <p style="margin: 0 0 10px 0;"><strong>${isEs ? 'Fecha de Servicio' : 'Service Date'}:</strong> <span style="color: #ea580c; font-weight: bold;">${pickup}</span></p>
            <p style="margin: 0 0 15px 0;"><strong>${isEs ? 'Método de Pago' : 'Payment Method'}:</strong> ${metodoPago}</p>
            <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">Total: $${(item.precio || 0).toFixed(2)} USD</p>
          </div>
          <p style="text-align: center; font-size: 12px; color: #94a3b8;">Ballard Tours Los Cabos</p>
        </div>
      </div>
    </div>
  `;
};

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================
export default function CheckoutPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const router = useRouter();
  const { combo = [], eliminarDelCombo, vaciarCombo } = useCart();
  const { appliedPromo, setServicioSeleccionado, setVistaEspecial, setPaso } = useBooking();
  
  const [step, setStep] = useState(1);
  const [confirmNumber, setConfirmNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', email: '', telefono: '',
    aerolinea: '', vuelo: '', hora: '', notas: '', paymentMethod: 'paypal'
  });

  // =========================================================
  // 🎟️ CARGAR CUPONES DESDE LOCALSTORAGE
  // =========================================================
  const [cuponesAplicados, setCuponesAplicados] = useState([]);

  useEffect(() => {
    const cargarCupones = () => {
      try {
        const guardados = localStorage.getItem('cabo_cupones');
        if (guardados) {
          const parsed = JSON.parse(guardados);
          setCuponesAplicados(Array.isArray(parsed) ? parsed : [parsed]);
        } else {
          setCuponesAplicados([]);
        }
      } catch (e) {
        setCuponesAplicados([]);
      }
    };
    
    cargarCupones();
    window.addEventListener('focus', cargarCupones);
    window.addEventListener('storage', cargarCupones);
    const interval = setInterval(cargarCupones, 1000); 

    return () => {
      window.removeEventListener('focus', cargarCupones);
      window.removeEventListener('storage', cargarCupones);
      clearInterval(interval);
    };
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // =========================================================
  // 🧮 LÓGICA DE MATEMÁTICAS CON CUPONES INCLUIDOS
  // =========================================================
  const subtotal = combo?.reduce((acc, item) => acc + (item.precio || 0), 0) || 0;
  
  const descuentoPorcentajePromo = appliedPromo ? Number(appliedPromo.porcentaje_descuento || appliedPromo.descuento || 0) : 0;
  
  const cuponesDescuento = cuponesAplicados.reduce((acc, c) => acc + (Number(c.descuento) || 10), 0);
  
  const descuentoPorcentaje = descuentoPorcentajePromo + cuponesDescuento;
  const cantidadDescontada = subtotal * (descuentoPorcentaje / 100);
  const granTotalFinal = Math.max(0, subtotal - cantidadDescontada);

  const hasAnyDiscount = appliedPromo || cuponesAplicados.length > 0;
  const isFormValid = formData.nombre.trim() !== '' && formData.email.trim() !== '';

  const procesarConfirmacion = async (detallesPago = null, metodoOverride = null) => {
    setIsProcessing(true);
    const metodoReal = metodoOverride || formData.paymentMethod;
    const nuevoNumConfirmacion = Math.random().toString(36).substring(2, 10).toUpperCase();
    const datosFinalesCliente = { ...formData, paymentMethod: metodoReal };

    try {
      let index = 1;
      
      await addDoc(collection(db, "reservas"), {
        numeroConfirmacion: nuevoNumConfirmacion,
        idioma: lang,
        estado: metodoReal === 'paypal' ? "Pagado (PayPal)" : "Pendiente (Efectivo)",
        cliente: datosFinalesCliente,
        servicios: combo,
        total: granTotalFinal,
        descuentoAplicado: descuentoPorcentaje,
        cupones: cuponesAplicados.map(c => c.codigo || c.codigoChofer || 'CUPON'),
        fechaCreacion: new Date().toISOString(),
      });
      
      for (const item of combo) {
        const docIdCliente = `${nuevoNumConfirmacion}_cliente_${index}`;
        await setDoc(doc(db, "correos", docIdCliente), {
          to: formData.email,
          message: {
            subject: isEs ? `Confirmación de Reserva: ${item.titulo} - Ballard Tours` : `Booking Confirmation: ${item.titulo} - Ballard Tours`,
            html: generarHtmlCorreoCliente(item, datosFinalesCliente, nuevoNumConfirmacion, lang)
          }
        });

        const docIdAdmin = `${nuevoNumConfirmacion}_admin_${index}`;
        await setDoc(doc(db, "correos", docIdAdmin), {
          to: "reservationballard@gmail.com", 
          message: {
            subject: `🚨 SERVICIO: ${item.titulo} - ${formData.nombre} (${nuevoNumConfirmacion})`,
            html: generarHtmlCorreoAdmin(item, datosFinalesCliente, nuevoNumConfirmacion)
          }
        });

        index++;
      }

      for (const cupon of cuponesAplicados) {
        if (cupon.tipo === 'resena') {
          const docCuponRef = doc(db, "cupones", cupon.codigo);
          await updateDoc(docCuponRef, { utilizado: true, fechaUso: new Date().toISOString() });
        }
        if (cupon.tipo === 'chofer') {
          await addDoc(collection(db, "comisiones_choferes"), {
            codigoChofer: cupon.codigo || cupon.codigoChofer || 'CUPON',
            choferCorreo: cupon.choferCorreo || 'N/A',
            numeroConfirmacion: nuevoNumConfirmacion,
            clienteNombre: `${formData.nombre} ${formData.apellidos}`,
            montoTotalReserva: granTotalFinal,
            fechaUso: new Date().toISOString()
          });
        }
      }
      
      localStorage.removeItem('cabo_cupones');
      setConfirmNumber(nuevoNumConfirmacion);
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Error al registrar en Firebase:", error);
      alert(isEs ? "Hubo un error al procesar tu reserva." : "There was an error processing your booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  const t = {
    titleCart: isEs ? "Mi Combo" : "My Combo",
    empty: isEs ? "Tu combo está vacío." : "Your combo is empty.",
    backHome: isEs ? "Volver al inicio" : "Back to home",
    remove: isEs ? "Eliminar" : "Remove",
    crossSell: isEs ? "Completa tu experiencia" : "Complete your experience",
    totalCombo: isEs ? "Total del Combo" : "Combo Total",
    proceed: isEs ? "Proceder al Checkout" : "Proceed to Checkout",
    step1: isEs ? "Servicio" : "Service",
    step2: isEs ? "Detalles" : "Details",
    step3: isEs ? "Información" : "Information",
    step4: isEs ? "Confirmación" : "Confirmation",
    titularTitle: isEs ? "Información del Titular" : "Cardholder Information",
    name: isEs ? "Nombre(s) *" : "First Name *",
    lastName: isEs ? "Apellidos" : "Last Name",
    email: isEs ? "Correo Electrónico *" : "Email Address *",
    phone: isEs ? "Teléfono" : "Phone Number",
    flightTitle: isEs ? "Información de Llegada" : "Arrival Information",
    arrivalFlight: isEs ? "Vuelo Llegada (SJD)" : "Arrival Flight (SJD Airport)",
    airline: isEs ? "Aerolínea" : "Airline",
    flightNo: isEs ? "No. de Vuelo" : "Flight No.",
    arrivalTime: isEs ? "Hora Aterrizaje" : "Arrival Time",
    reviewPay: isEs ? "Revisar y Pagar" : "Review and Pay",
    confirmTitle: isEs ? "Confirmación de Reserva" : "Booking Confirmation",
    paxLabel: isEs ? "Pasajero" : "Passenger",
    taxesInc: isEs ? "Impuestos incluidos" : "Taxes included",
    payTotal: isEs ? "Total a Pagar" : "Total to Pay",
    finalize: isEs ? "Finalizar Reserva" : "Complete Booking",
    processing: isEs ? "Procesando..." : "Processing...",
    errorForm: isEs ? "Llena Nombre y Correo para continuar" : "Fill your Name and Email",
    paymentMethodTitle: isEs ? "Método de Pago" : "Payment Method",
    paypalOptionTitle: "PayPal / Credit Card",
    paypalOptionDesc: isEs ? "Pago seguro" : "Secure payment",
    cashOptionTitle: isEs ? "Pago en Efectivo" : "Cash Payment",
    cashOptionDesc: isEs ? "Paga a tu llegada" : "Pay upon arrival",
    confirmCashBtn: isEs ? "Confirmar Reserva" : "Confirm Booking"
  };

  const crossSellItems = [
    ...toursData.filter(t => t.activo).map(t => ({
      id: t.id, title: t.nombre[lang], image: `/${t.imagenUrl}`, price: t.precioPx, isTour: true, url: `/${lang}/tours/${t.slug}`, type: 'Tour'
    })),
    { id: 'cenas', title: isEs ? 'Cenas y Restaurantes' : 'Dinners & Restaurants', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800', price: 85, isTour: false, type: isEs ? 'Especial' : 'Special' }
  ];

  const renderStepper = () => (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-12 px-4 relative">
      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10 -translate-y-1/2"></div>
      {[{ num: 1, label: t.step1, active: true }, { num: 2, label: t.step2, active: step >= 2 }, { num: 3, label: t.step3, active: step >= 3 }, { num: 4, label: t.step4, active: step >= 4 }].map((s, i) => (
        <div key={i} className="flex flex-col items-center bg-slate-50 px-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${s.active ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
            {s.active && step > s.num ? <CheckCircle size={16} /> : s.num}
          </div>
          <span className={`text-[10px] uppercase tracking-widest font-bold ${s.active ? 'text-blue-900' : 'text-slate-400'}`}>{s.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <PayPalScriptProvider options={{ "client-id": "Af_QMaiYhnkVGklhDJbI7gdNcNsgSTCyQG5GfsR0uxD3QEs-XSDIX7tBw3M6TWDkxljqn8jLfpS2CyxF", currency: "USD" }}>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-900 selection:text-white pt-32 pb-24">
        
        {isProcessing && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mb-4"></div>
            <p className="font-bold text-blue-900 text-lg">{t.processing}</p>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4">
          {step === 1 && (
            <div className="animate-fade-in w-full max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-3 tracking-tighter">
                <ShoppingBag className="text-blue-600" size={32} /> {t.titleCart}
              </h1>
              {combo.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-200/60 shadow-sm">
                  <p className="text-slate-500 mb-6 font-medium text-lg">{t.empty}</p>
                  <Link href={`/${lang}`} className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={18} /> {t.backHome}
                  </Link>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    {combo.map((item, idx) => (
                      <div key={item.id || idx} className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 last:border-0 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
                        <div className="flex-1 pl-4">
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">{item.titulo}</h3>
                          <p className="text-slate-500 font-medium text-sm mb-4">{item.subtitulo}</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">${(item.precio || 0).toFixed(2)}</p>
                        </div>
                        <button onClick={() => eliminarDelCombo && eliminarDelCombo(item.id)} className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 hover:bg-red-100 rounded-xl"><Trash2 size={20} /></button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 md:p-6 shadow-[0_-10px_30px_rgb(0,0,0,0.05)] z-40">
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{t.totalCombo}</p>
                        <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-slate-900 leading-none tracking-tighter">${(granTotalFinal || 0).toFixed(2)}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase pb-1.5">{t.taxesInc}</p>
                        </div>
                      </div>
                      <button onClick={() => { setStep(2); window.scrollTo(0,0); }} className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center">
                        {t.proceed} <ChevronRight size={18} className="ml-2" />
                      </button>
                    </div>
                  </div>
                  <div className="h-24"></div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in w-full">
              {renderStepper()}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-8">
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 tracking-tight"><User className="text-blue-600" size={24} /> {t.titularTitle}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 block">{t.name}</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={`w-full p-4 border rounded-xl outline-none text-slate-900 font-bold ${formData.nombre ? 'bg-slate-50 border-slate-300' : 'bg-red-50/50 border-red-200'}`} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 block">{t.lastName}</label>
                        <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-900 font-bold" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 block">{t.email}</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full pl-12 pr-4 py-4 border rounded-xl outline-none text-slate-900 font-bold ${formData.email ? 'bg-slate-50 border-slate-300' : 'bg-red-50/50 border-red-200'}`} />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 block">{t.phone}</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-900 font-bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-[400px] shrink-0">
                  <div className="bg-slate-950 rounded-[2rem] p-8 text-white sticky top-32 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4 tracking-tight"><ShoppingBag size={20} className="text-blue-500" /> {t.totalCombo}</h3>
                    
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Subtotal</p>
                        <p className="font-bold">${(subtotal || 0).toFixed(2)}</p>
                      </div>

                      <div className="mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-center mb-3">
                          <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-400"><Ticket size={14} className="text-emerald-400" /> {isEs ? "CÓDIGO / CUPÓN" : "CODE"}</span>
                          <Link href={`/${lang}/apply-code`} className="text-[10px] font-bold text-blue-400 flex items-center gap-1 hover:underline"><Edit3 size={12} /> {isEs ? "Añadir / Editar" : "Add"}</Link>
                        </div>
                        
                        {hasAnyDiscount && (
                          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-800/50">
                            {appliedPromo && (
                              <div className="flex justify-between items-center">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
                                  {appliedPromo.codigo || appliedPromo.code || (isEs ? "PROMO WEB" : "WEB PROMO")}
                                </span>
                                <span className="font-bold text-emerald-400 text-sm">
                                  -${(subtotal * (descuentoPorcentajePromo / 100)).toFixed(2)}
                                </span>
                              </div>
                            )}

                            {cuponesAplicados.map((c, i) => {
                              const cantidadDescontadaCupon = subtotal * ((Number(c.descuento) || 10) / 100);
                              return (
                                <div key={i} className="flex justify-between items-center">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
                                    {c.codigo || c.codigoChofer || (isEs ? 'CUPÓN CHOFER' : 'DRIVER CODE')}
                                  </span>
                                  <span className="font-bold text-emerald-400 text-sm">
                                    -${cantidadDescontadaCupon.toFixed(2)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t.payTotal}</p>
                          <p className="text-[10px] text-slate-500 mb-0 font-medium">{t.taxesInc}</p>
                        </div>
                        <p className="text-4xl font-black tracking-tighter">${(granTotalFinal || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => { setStep(1); window.scrollTo(0,0); }} className="px-4 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition flex items-center justify-center font-bold active:scale-95"><ChevronLeft size={20} /></button>
                      <button onClick={() => { if (isFormValid) { setStep(3); window.scrollTo(0,0); } else { alert(t.errorForm); } }} className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center transition-all text-sm tracking-wide ${isFormValid ? 'bg-white text-slate-900 hover:bg-slate-100 active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                        {t.reviewPay} <ChevronRight size={18} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in w-full">
              {renderStepper()}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4 tracking-tight uppercase">{t.confirmTitle}</h2>
                    <div className="space-y-4">
                      {formData.paymentMethod === 'paypal' && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative z-0 min-h-[150px]">
                          <PayPalButtons
                            style={{ layout: "vertical", shape: "rect", color: "gold" }}
                            createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: (granTotalFinal || 0).toFixed(2) } }] })}
                            onApprove={(data, actions) => actions.order.capture().then((details) => procesarConfirmacion(details, 'paypal'))}
                          />
                        </div>
                      )}
                      {formData.paymentMethod === 'efectivo' && (
                        <button onClick={() => procesarConfirmacion(null, 'efectivo')} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg">
                          <CheckCircle size={24} /> {t.confirmCashBtn}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-[400px] shrink-0">
                  <div className="bg-slate-950 rounded-[2rem] p-8 text-white sticky top-32 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-4 tracking-tight"><CreditCard size={20} className="text-emerald-400" /> {t.paymentMethodTitle}</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div onClick={() => setFormData({...formData, paymentMethod: 'paypal'})} className={`flex items-start gap-4 p-5 rounded-2xl cursor-pointer border-2 transition-all ${formData.paymentMethod === 'paypal' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
                        <div className="mt-0.5"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'paypal' ? 'border-blue-500' : 'border-slate-500'}`}>{formData.paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}</div></div>
                        <div className="flex-1"><span className="font-black text-base block mb-1 text-white">{t.paypalOptionTitle}</span></div>
                      </div>

                      <div onClick={() => setFormData({...formData, paymentMethod: 'efectivo'})} className={`flex items-start gap-4 p-5 rounded-2xl cursor-pointer border-2 transition-all ${formData.paymentMethod === 'efectivo' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-900 border-slate-800'}`}>
                        <div className="mt-0.5"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'efectivo' ? 'border-emerald-500' : 'border-slate-500'}`}>{formData.paymentMethod === 'efectivo' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}</div></div>
                        <div className="flex-1"><span className="font-black text-base block mb-1 text-white">{t.cashOptionTitle}</span></div>
                      </div>
                    </div>

                    <div className="mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-400"><Ticket size={14} className="text-emerald-400" /> {isEs ? "CÓDIGO / CUPÓN" : "CODE / COUPON"}</span>
                      </div>
                      
                      {hasAnyDiscount && (
                        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-800/50">
                          {cuponesAplicados.map((c, i) => {
                            const cantidadDescontadaCupon = subtotal * ((Number(c.descuento) || 10) / 100);
                            return (
                              <div key={i} className="flex justify-between items-center">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
                                  {c.codigo || c.codigoChofer || (isEs ? 'CUPÓN CHOFER' : 'DRIVER CODE')}
                                </span>
                                <span className="font-bold text-emerald-400 text-sm">
                                  -${cantidadDescontadaCupon.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-800">
                      <div><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t.payTotal}</p></div>
                      <p className="text-4xl font-black tracking-tighter">${(granTotalFinal || 0).toFixed(2)}</p>
                    </div>

                    <button onClick={() => { setStep(2); window.scrollTo(0,0); }} className="w-full mt-8 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition flex items-center justify-center font-bold"><ChevronLeft size={20} className="mr-2" /> Atrás</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in w-full max-w-4xl mx-auto space-y-8">
              <div className="bg-emerald-500 rounded-[2rem] p-10 md:p-16 text-center text-white shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md text-emerald-500"><CheckCircle size={40} /></div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{isEs ? '¡Tu Combo está Confirmado!' : 'Your Combo is Confirmed!'}</h1>
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl py-4 px-8 inline-block"><p className="text-3xl font-black tracking-widest">{confirmNumber}</p></div>
              </div>
              <div className="text-center mt-12">
                 <button onClick={() => { if(vaciarCombo) vaciarCombo(); router.push(`/${lang}`); }} className="bg-slate-900 text-white px-10 py-5 rounded-xl font-bold hover:bg-slate-800 transition-all text-lg shadow-md">
                   {isEs ? 'Volver al Inicio' : 'Return to Home'}
                 </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </PayPalScriptProvider>
  );
}