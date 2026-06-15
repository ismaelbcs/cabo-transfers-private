// src/app/[lang]/checkout/page.js
'use client';

// 1. IMPORTAMOS 'use' PARA NEXT.JS 15
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { useBooking } from '../../../context/BookingContext'; 
import { ShieldCheck, User, Mail, Phone, Plane, CreditCard, ChevronLeft, CheckCircle } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// IMPORTACIONES DE FIREBASE
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../firebase';

// =========================================================
// 1. GENERADOR DE PLANTILLA HTML PARA ADMIN (IDENTICO A LAS FOTOS)
// =========================================================
const generarHtmlCorreoAdmin = (item, datosCliente, numConfirmacion) => {
  // Extracción de datos
  const nombreCliente = `${datosCliente.nombre || ''} ${datosCliente.apellidos || ''}`.trim() || 'N/A';
  const correoCliente = datosCliente.email || 'N/A';
  const telefonoCliente = datosCliente.telefono || 'N/A';
  const metodoPago = datosCliente.paymentMethod === 'paypal' ? 'PayPal (Pagado)' : 'Efectivo al llegar';
  
  const tipoServicio = item.subtitulo || 'N/A';
  const hotelDestino = item.config?.hotelId || 'N/A';
  const pasajeros = item.config?.pasajeros || '1';
  
  // Vuelos
  const aerolineaLlegada = datosCliente.aerolinea ? `${datosCliente.aerolinea} (Vuelo: ${datosCliente.vuelo || 'N/A'})` : 'N/A';
  const horaLlegada = datosCliente.hora || 'N/A';
  
  // Variables adicionales que podrían o no venir dependiendo si es redondo
  const aerolineaSalida = item.config?.aerolineaSalida ? `${item.config.aerolineaSalida} (Vuelo: ${item.config.vueloSalida || 'N/A'})` : 'N/A (Vuelo: N/A)';
  const horaSalida = item.config?.horaSalida || 'N/A';
  const horaPickUp = item.config?.fechaLlegada || 'N/A'; 
  
  // Enlace para WhatsApp limpiando espacios del número
  const wpLink = telefonoCliente !== 'N/A' ? `https://wa.me/${telefonoCliente.replace(/\D/g,'')}` : '#';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0;">
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        
        <!-- HEADER AZUL OSCURO -->
        <tr>
          <td style="background-color: #213f8c; padding: 40px 20px; text-align: center;">
            <div style="margin-bottom: 20px;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.2); color: #ffffff; font-size: 12px; font-weight: bold; letter-spacing: 1px; padding: 6px 16px; border-radius: 9999px;">
                NOTIFICACIÓN DE WEB
              </span>
            </div>
            <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px; font-weight: 900;">¡Nuevo Servicio Recibido!</h1>
            <p style="color: #ffffff; margin: 0; font-size: 16px; opacity: 0.9;">${item.titulo}</p>
          </td>
        </tr>
        
        <!-- CUERPO DEL CORREO -->
        <tr>
          <td style="padding: 40px 30px;">
            
            <!-- INFORMACIÓN GENERAL -->
            <h2 style="color: #1e3a8a; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin: 0 0 20px 0;">
              INFORMACIÓN GENERAL
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Nº de Confirmación:</td>
                <td style="color: #1e3a8a; font-size: 14px; font-weight: 800; text-align: right; width: 60%; padding-bottom: 14px;">${numConfirmacion}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Tipo de Servicio:</td>
                <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${tipoServicio}</td>
              </tr>
            </table>

            <!-- DATOS DEL CLIENTE -->
            <h2 style="color: #1e3a8a; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin: 30px 0 20px 0;">
              DATOS DEL CLIENTE
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Nombre Completo:</td>
                <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${nombreCliente}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Teléfono:</td>
                <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${telefonoCliente}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Correo Electrónico:</td>
                <td style="color: #2563eb; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px; text-decoration: underline;">${correoCliente}</td>
              </tr>
            </table>

            <!-- DETALLES LOGÍSTICOS -->
            <h2 style="color: #1e3a8a; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin: 30px 0 20px 0;">
              DETALLES LOGÍSTICOS
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Hotel / Destino:</td>
                <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${hotelDestino}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Pasajeros Totales:</td>
                <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${pasajeros}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Aerolínea Llegada:</td>
                <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${aerolineaLlegada}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Hora Llegada Vuelo:</td>
                <td style="color: #1e3a8a; font-size: 14px; font-weight: 800; text-align: right; width: 60%; padding-bottom: 14px;">${horaLlegada}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Aerolínea Salida:</td>
                <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${aerolineaSalida}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Hora Salida Vuelo:</td>
                <td style="color: #1e3a8a; font-size: 14px; font-weight: 800; text-align: right; width: 60%; padding-bottom: 14px;">${horaSalida}</td>
              </tr>
              <tr>
                <td style="color: #ea580c; font-size: 14px; font-weight: 800; width: 40%; padding-bottom: 14px;">Hora Pick-Up / Servicio:</td>
                <td style="color: #ea580c; font-size: 14px; font-weight: 800; text-align: right; width: 60%; padding-bottom: 14px;">${horaPickUp}</td>
              </tr>
            </table>

            <!-- RESUMEN DE PAGO -->
            <h2 style="color: #1e3a8a; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin: 30px 0 20px 0;">
              RESUMEN DE PAGO
            </h2>
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="color: #64748b; font-size: 14px; padding-bottom: 15px;">Método de Pago:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; padding-bottom: 15px;">${metodoPago}</td>
                </tr>
                <tr>
                  <td style="color: #1e293b; font-size: 16px; font-weight: 800;">Valor de este servicio:</td>
                  <td style="color: #213f8c; font-size: 22px; font-weight: 900; text-align: right;">$${item.precio.toFixed(2)} USD</td>
                </tr>
              </table>
            </div>

            <!-- BOTON CONTACTAR CLIENTE -->
            <a href="${wpLink}" style="display: block; width: 100%; text-align: center; border: 2px solid #213f8c; color: #213f8c; text-decoration: none; padding: 14px 0; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 30px;">
              💬 Contactar con el Cliente
            </a>

            <!-- FOOTER -->
            <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 40px; line-height: 1.5;">
              Este es un correo automático generado por el nuevo sistema de reservas.<br/>Por favor, revisa la información y agenda el servicio.
            </p>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// =========================================================
// 2. GENERADOR DE PLANTILLA HTML PARA CLIENTE (ESTILO PREMIUM)
// =========================================================
const generarHtmlCorreoCliente = (item, datosCliente, numConfirmacion, lang) => {
  const nombreCliente = `${datosCliente.nombre || ''} ${datosCliente.apellidos || ''}`.trim() || 'Pasajero';
  const metodoPago = datosCliente.paymentMethod === 'paypal' ? 'PayPal' : 'Efectivo/Cash';
  const pasajeros = item.config?.pasajeros || 'N/A';
  const pickup = item.config?.fechaLlegada || 'N/A';

  const title = lang === 'es' ? '¡Gracias por tu reserva!' : 'Thank you for your booking!';
  const greeting = lang === 'es' ? 'Hola' : 'Hello';
  const subtitle = lang === 'es' ? 'Tu servicio en Los Cabos está confirmado. Aquí tienes los detalles:' : 'Your service in Los Cabos is confirmed. Here are the details:';

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
            <p style="margin: 0 0 10px 0;"><strong>${lang === 'es' ? 'N° de Confirmación' : 'Confirmation N°'}:</strong> <span style="color:#1e3a8a; font-weight:bold;">${numConfirmacion}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>${lang === 'es' ? 'Pasajeros' : 'Passengers'}:</strong> ${pasajeros}</p>
            <p style="margin: 0 0 10px 0;"><strong>${lang === 'es' ? 'Fecha de Servicio' : 'Service Date'}:</strong> <span style="color: #ea580c; font-weight: bold;">${pickup}</span></p>
            <p style="margin: 0 0 15px 0;"><strong>${lang === 'es' ? 'Método de Pago' : 'Payment Method'}:</strong> ${metodoPago}</p>
            <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">Total: $${item.precio.toFixed(2)} USD</p>
          </div>
          <p style="text-align: center; font-size: 12px; color: #94a3b8;">Ballard Tours Los Cabos</p>
        </div>
      </div>
    </div>
  `;
};

export default function CheckoutPage({ params }) {
  // DESENVOLVEMOS LA PROMESA DE LOS PARÁMETROS PARA NEXT.JS 15
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  
  const router = useRouter();
  const { carrito, carritoTotal, vaciarCombo } = useCart();
  
  // EXTRAEMOS APPLIEDPROMO DE USEBOOKING
  const { appliedPromo } = useBooking();
  
  // Estados de la interfaz
  const [isSuccess, setIsSuccess] = useState(false);
  const [numConfirmacion, setNumConfirmacion] = useState('');
  const [procesandoPago, setProcesandoPago] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    aerolinea: '',
    vuelo: '',
    notas: '',
    paymentMethod: 'paypal'
  });

  // LÓGICA MATEMÁTICA DE DESCUENTOS
  const descuentoPorcentaje = appliedPromo ? Number(appliedPromo.porcentaje_descuento || appliedPromo.descuento || 0) : 0;
  const cantidadDescontada = carritoTotal * (descuentoPorcentaje / 100);
  const granTotalFinal = carritoTotal - cantidadDescontada;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isSuccess]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =========================================================
  // LA FUNCIÓN MÁGICA QUE GUARDA EN FIREBASE
  // =========================================================
  const procesarConfirmacion = async (detallesPago = null) => {
    setProcesandoPago(true);

    // Generamos un número de confirmación aleatorio
    const nuevoNumConfirmacion = Math.random().toString(36).substr(2, 8).toUpperCase();
    setNumConfirmacion(nuevoNumConfirmacion);

    try {
      console.log("Preparando datos de correos para Firebase...");
      
      let index = 1;
      for (const item of carrito) {
        
        // CORREO PARA EL CLIENTE
        const docIdCliente = `${nuevoNumConfirmacion}_cliente_${index}`;
        await setDoc(doc(db, "correos", docIdCliente), {
          to: formData.email,
          message: {
            subject: lang === 'es' ? `Confirmación de Reserva: ${item.titulo} - Ballard Tours` : `Booking Confirmation: ${item.titulo} - Ballard Tours`,
            html: generarHtmlCorreoCliente(item, formData, nuevoNumConfirmacion, lang)
          }
        });

        // CORREO PARA ADMIN (TU EMPRESA)
        const docIdAdmin = `${nuevoNumConfirmacion}_admin_${index}`;
        await setDoc(doc(db, "correos", docIdAdmin), {
          to: "reservationballard@gmail.com", // Tu correo
          message: {
            subject: `🚨 SERVICIO: ${item.titulo} - ${formData.nombre} (${nuevoNumConfirmacion})`,
            html: generarHtmlCorreoAdmin(item, formData, nuevoNumConfirmacion)
          }
        });

        index++;
      }

      console.log("✅ Correos registrados en Firebase exitosamente.");
      
      // Vaciamos el carrito y mostramos la pantalla de éxito
      vaciarCombo();
      setIsSuccess(true);
      setProcesandoPago(false);

    } catch (error) {
      console.error("❌ Error al registrar los correos en Firebase:", error);
      setProcesandoPago(false);
      alert(lang === 'es' ? "Hubo un error al procesar tu reserva. Por favor intenta nuevamente." : "There was an error processing your booking. Please try again.");
    }
  };

  // =========================================================
  // PANTALLA DE ÉXITO (POST-PAGO)
  // =========================================================
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          {lang === 'es' ? '¡Reserva Confirmada!' : 'Booking Confirmed!'}
        </h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
          {lang === 'es' ? 'Hemos enviado los detalles a tu correo electrónico.' : 'We have sent the details to your email.'}
        </p>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8 w-full max-w-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'es' ? 'Número de Confirmación' : 'Confirmation Number'}
          </p>
          <p className="text-3xl font-black text-blue-900 tracking-widest">{numConfirmacion}</p>
        </div>

        <button 
          onClick={() => router.push(`/${lang}`)}
          className="px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg"
        >
          {lang === 'es' ? 'Volver a la página principal' : 'Return to Homepage'}
        </button>
      </div>
    );
  }

  // VISTA DE CARRITO VACÍO
  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-24 h-24 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mb-6">
          <CreditCard size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">
          {lang === 'es' ? 'Tu combo está vacío' : 'Your combo is empty'}
        </h1>
        <button 
          onClick={() => router.push(`/${lang}`)}
          className="px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg mt-6"
        >
           {lang === 'es' ? 'Volver al Inicio' : 'Return Home'}
        </button>
      </div>
    );
  }

  // VISTA PRINCIPAL DEL CHECKOUT
  return (
    <PayPalScriptProvider options={{ "client-id": "Af_QMaiYhnkVGklhDJbI7gdNcNsgSTCyQG5GfsR0uxD3QEs-XSDIX7tBw3M6TWDkxljqn8jLfpS2CyxF", currency: "USD" }}>
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
        {procesandoPago && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mb-4"></div>
             <p className="font-bold text-blue-900 text-lg">{lang === 'es' ? 'Procesando reserva...' : 'Processing booking...'}</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 animate-fade-in">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="flex-1">
            <button onClick={() => router.push(`/${lang}`)} className="text-blue-600 font-bold flex items-center hover:text-blue-800 transition mb-8">
              <ChevronLeft size={20} className="mr-1" /> {lang === 'es' ? 'Seguir comprando' : 'Continue shopping'}
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">
              {lang === 'es' ? 'Completa tu Reserva' : 'Complete your Booking'}
            </h1>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4"><User className="text-blue-600" size={24} /> {lang === 'es' ? 'Datos del Titular' : 'Lead Traveler Details'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'es' ? 'Nombre' : 'First Name'}</label><input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-900" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'es' ? 'Apellidos' : 'Last Name'}</label><input required type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-900" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'es' ? 'Correo' : 'Email'}</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-900" /></div></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'es' ? 'Teléfono' : 'Phone'}</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input required type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-900" /></div></div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4"><Plane className="text-blue-600" size={24} /> {lang === 'es' ? 'Información de Llegada' : 'Arrival Information'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'es' ? 'Aerolínea' : 'Airline'}</label><input type="text" name="aerolinea" value={formData.aerolinea} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-900" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'es' ? 'Vuelo' : 'Flight'}</label><input type="text" name="vuelo" value={formData.vuelo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-900" /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{lang === 'es' ? 'Comentarios / Hotel' : 'Comments / Resort'}</label><textarea name="notas" rows="3" value={formData.notas} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-900"></textarea></div>
                </div>
              </div>

            </form>
          </div>

          {/* COLUMNA DERECHA: RESUMEN Y PAYPAL */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-6 md:p-8 lg:sticky lg:top-32">
              <h3 className="text-2xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">{lang === 'es' ? 'Resumen de tu Combo' : 'Order Summary'}</h3>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 font-bold text-sm">Subtotal</span>
                  <span className="font-bold text-slate-700">${carritoTotal.toFixed(2)}</span>
                </div>
                
                {/* SE RENDERIZA EL DESCUENTO SI EXISTE UN CUPÓN ACTIVO */}
                {descuentoPorcentaje > 0 && (
                  <div className="flex justify-between items-center mb-2 text-green-600 font-bold text-sm">
                    <span>{lang === 'es' ? 'Descuento' : 'Discount'} ({descuentoPorcentaje}%)</span>
                    <span>-${cantidadDescontada.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-end">
                  <span className="text-slate-800 font-black text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-blue-600">${granTotalFinal.toFixed(2)}</span>
                    <p className="text-xs font-bold text-slate-400">USD</p>
                  </div>
                </div>
              </div>

              {/* BOTONES PAYPAL */}
              <div className="mt-4 relative z-0">
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", color: "gold" }}
                  disabled={!formData.nombre || !formData.email} // Desactiva PayPal si no hay nombre o email
                  createOrder={(data, actions) => {
                    return actions.order.create({ purchase_units: [{ amount: { value: granTotalFinal.toFixed(2) } }] });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                      procesarConfirmacion(details);
                    });
                  }}
                  onError={(err) => {
                    console.error("Error en PayPal:", err);
                    alert(lang === 'es' ? "Ocurrió un error con la plataforma de pago. Intenta de nuevo." : "An error occurred with the payment gateway. Please try again.");
                  }}
                />
              </div>

              {(!formData.nombre || !formData.email) && (
                <p className="text-xs text-red-500 mt-2 text-center font-bold">
                  {lang === 'es' ? 'Por favor llena tus datos de contacto antes de pagar.' : 'Please fill in your contact details before paying.'}
                </p>
              )}

            </div>
          </div>

        </div>
      </div>
    </PayPalScriptProvider>
  );
}