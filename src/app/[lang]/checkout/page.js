// src/app/[lang]/checkout/page.js
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { useBooking } from '../../../context/BookingContext';
import Link from 'next/link';
import { ShieldCheck, User, Mail, Phone, Plane, CreditCard, ChevronLeft, CheckCircle, Ticket, Edit3, X, Trash2 } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
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

  const aerolineaLlegada = item.flightInfo?.aerolinea ? `${item.flightInfo.aerolinea} (Vuelo: ${item.flightInfo.vuelo || 'N/A'})` : 'N/A';
  const horaLlegada = item.flightInfo?.hora || 'N/A';

  // Respaldo dual para la Salida (ya sea que venga del config o del formulario)
  const aerolineaSalida = item.flightInfo?.aerolineaSalida ? `${item.flightInfo.aerolineaSalida} (Vuelo: ${item.flightInfo.vueloSalida || 'N/A'})` : 'N/A';
  const horaSalida = item.flightInfo?.horaSalida || 'N/A';

  const horaPickUp = item.flightInfo?.horaPickUp || 'N/A';

  const wpLink = telefonoCliente !== 'N/A' ? `https://wa.me/${telefonoCliente.replace(/\D/g, '')}` : '#';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
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
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Aerolínea Salida:</td><td style="color: #1e293b; font-size: 14px; font-weight: 700; text-align: right; width: 60%; padding-bottom: 14px;">${aerolineaSalida}</td></tr>
              <tr><td style="color: #64748b; font-size: 14px; width: 40%; padding-bottom: 14px;">Hora Salida Vuelo:</td><td style="color: #1e3a8a; font-size: 14px; font-weight: 800; text-align: right; width: 60%; padding-bottom: 14px;">${horaSalida}</td></tr>
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
  const nombreCliente = `${datosCliente.nombre || ''} ${datosCliente.apellidos || ''}`.trim() || (isEs ? 'Pasajero' : 'Passenger');
  const metodoPago = datosCliente.paymentMethod === 'paypal' ? (isEs ? 'PayPal (Pagado)' : 'PayPal (Paid)') : (isEs ? 'Efectivo al llegar' : 'Cash on arrival');

  const hotel = item.config?.hotelId || item.extrasEspeciales?.hotelOrigen || item.extrasEspeciales?.cenaOrigen || item.extrasEspeciales?.golfOrigen || item.extrasEspeciales?.nightlifeOrigen || 'N/A';
  const pasajeros = item.config?.pasajeros || item.extrasEspeciales?.cenaPax || item.extrasEspeciales?.hotelPax || item.extrasEspeciales?.golfPax || item.extrasEspeciales?.nightlifePax || item.config?.hhPax || 'N/A';
  const pickup = item.flightInfo?.horaPickUp || item.extrasEspeciales?.cenaHora || item.extrasEspeciales?.hotelHora || item.extrasEspeciales?.golfHora || item.extrasEspeciales?.nightlifeHora || item.config?.hhHora || item.config?.fechaLlegada || 'N/A';

  let bgStyle = `background-color: #1e3a8a;`;
  let badgeText = isEs ? 'Confirmación Oficial' : 'Official Confirmation';
  let headerText = isEs ? `
    <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">¡Gracias por reservar con nosotros!</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 15px;">${item.titulo || 'N/A'}</p>
  ` : `
    <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Thank you for booking with us!</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 15px;">${item.titulo || 'N/A'}</p>
  `;

  if (item.servicio === 'tours' || item.tipoEspecial) {
    let bgImg = 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?q=80&w=800';
    if (item.tipoEspecial === 'cena') bgImg = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800';
    else if (item.tipoEspecial === 'golf') bgImg = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800';
    else if (item.tipoEspecial === 'nightlife') bgImg = 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800';
    else if (item.servicio === 'tours') bgImg = 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=800';

    bgStyle = `background: linear-gradient(to bottom, rgba(30,58,138,0.7), rgba(30,58,138,0.85)), url('${bgImg}') center/cover no-repeat;`;

    headerText = isEs ? `
      <span style="font-size: 14px; font-weight: 500; opacity: 0.9;">Gracias por reservar con nosotros tu producto de</span><br/>
      <span style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; display: inline-block; margin-top: 5px;">${item.titulo}</span>
    ` : `
      <span style="font-size: 14px; font-weight: 500; opacity: 0.9;">Thank you for booking with us your</span><br/>
      <span style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; display: inline-block; margin-top: 5px;">${item.titulo}</span>
    `;
  }

  const linkModificacion = `https://ballardtours.com/?id=${numConfirmacion}`;
  const linkWhatsApp = `https://wa.me/526121943286?text=${isEs ? 'Hola,%20tengo%20una%20duda%20sobre%20mi%20reserva%20' : 'Hello,%20I%20have%20a%20question%20about%20my%20booking%20'}${numConfirmacion}`;

  const greeting = isEs ? `Hola <strong>${nombreCliente}</strong>,` : `Hello <strong>${nombreCliente}</strong>,`;
  const mainDesc = isEs
    ? 'Hemos recibido tu solicitud y tu transporte/experiencia en Los Cabos está asegurado. Aquí tienes los detalles de este servicio:'
    : 'We have received your request and your transportation/experience in Los Cabos is secured. Here are the details for this service:';

  const summaryTitle = isEs ? 'Resumen del Servicio' : 'Service Summary';
  const labelConfirm = isEs ? 'N° de Confirmación:' : 'Confirmation N°:';
  const labelService = isEs ? 'Servicio:' : 'Service:';
  const labelPax = isEs ? 'Pasajeros:' : 'Passengers:';
  const labelPickup = isEs ? 'Hora Sugerida/Pick-Up:' : 'Suggested Pick-Up Time:';
  const labelMethod = isEs ? 'Método de Pago:' : 'Payment Method:';
  const btnModify = isEs ? '✏️ Modificar mi Reserva' : '✏️ Modify My Booking';
  const btnChat = isEs ? '💬 Chat con el Proveedor' : '💬 Chat with Provider';
  const footerText = isEs
    ? 'Ballard Tours Los Cabos<br/>Si necesitas asistencia urgente, responde a este correo.'
    : 'Ballard Tours Los Cabos<br/>If you need urgent assistance, please reply to this email.';

  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 30px 15px; color: #1e293b; display: block; width: 100%; box-sizing: border-box;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <div style="${bgStyle} padding: 40px 30px; text-align: center; color: #ffffff;">
          <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(4px); color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">${badgeText}</span><br/>
          ${headerText}
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; margin-top: 0; color: #334155;">${greeting}</p>
          <p style="font-size: 15px; color: #64748b; line-height: 1.5; margin-bottom: 25px;">${mainDesc}</p>
          
          <h2 style="font-size: 14px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 15px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">${summaryTitle}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tbody>
              <tr style="border-bottom: 1px solid #f8fafc;">
                <td style="padding: 10px 0; font-size: 14px; color: #64748b; width: 40%;">${labelConfirm}</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 700; color: #1e3a8a; width: 60%; text-align: right;">${numConfirmacion}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f8fafc;">
                <td style="padding: 10px 0; font-size: 14px; color: #64748b; width: 40%;">${labelService}</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #1e293b; width: 60%; text-align: right;">${item.subtitulo || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f8fafc;">
                <td style="padding: 10px 0; font-size: 14px; color: #64748b; width: 40%;">${labelPax}</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #1e293b; width: 60%; text-align: right;">${pasajeros}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f8fafc;">
                <td style="padding: 10px 0; font-size: 14px; color: #64748b; width: 40%;">${labelPickup}</td>
                <td style="padding: 10px 0; font-size: 15px; font-weight: 900; color: #ea580c; width: 60%; text-align: right;">${pickup}</td>
              </tr>
            </tbody>
          </table>

          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="font-size: 14px; color: #64748b;">${labelMethod}</td>
                  <td style="font-size: 14px; font-weight: 600; text-align: right;">${metodoPago}</td>
                </tr>
                <tr>
                  <td style="font-size: 16px; font-weight: 700; padding-top: 10px; color: #1e293b;">Total:</td>
                  <td style="font-size: 20px; font-weight: 700; text-align: right; padding-top: 10px; color: #1e3a8a;">$${(item.precio || 0).toFixed(2)} USD</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="${linkModificacion}" style="display: block; background-color: #1e3a8a; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 8px; font-weight: bold; margin-bottom: 12px; box-shadow: 0 4px 6px rgba(30,58,138,0.2);">
              ${btnModify}
            </a>
            <a href="${linkWhatsApp}" target="_blank" style="display: block; background-color: #ffffff; color: #059669; border: 2px solid #059669; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold;">
              ${btnChat}
            </a>
          </div>

          <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px; line-height: 1.5;">
            ${footerText}
          </p>
        </div>
      </div>
    </div>
  `;
};

export default function CheckoutPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const router = useRouter();

  const { combo = [], vaciarCombo } = useCart();
  const { appliedPromo } = useBooking();

  const [isSuccess, setIsSuccess] = useState(false);
  const [numConfirmacion, setNumConfirmacion] = useState('');
  const [procesandoPago, setProcesandoPago] = useState(false);

  // Estados para el Modal de Promociones
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Formulario con estados dinámicos para salida y llegada
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', email: '', telefono: '',
    notas: '', paymentMethod: 'paypal'
  });
  const [vuelosData, setVuelosData] = useState({});

  // FUSIÓN: Asignamos el vuelo basado en el índice
  const handleVueloChange = (idx, campo, valor) => {
    setVuelosData(prev => ({
      ...prev,
      [idx]: {
        ...(prev[idx] || {}),
        [campo]: valor
      }
    }));
  };

  const [cuponesAplicados, setCuponesAplicados] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const cargarCupones = () => {
      const guardados = localStorage.getItem('cabo_cupones');
      if (guardados) {
        try {
          const parsed = JSON.parse(guardados);
          setCuponesAplicados(Array.isArray(parsed) ? parsed : [parsed]);
        } catch (error) {
          setCuponesAplicados([]);
        }
      } else {
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

  useEffect(() => {
    if (isSuccess) {
      window.scrollTo(0, 0);
    }
  }, [isSuccess]);

  // =========================================================
  // 🔥 LÓGICA DE VALIDACIÓN DE CÓDIGOS (RESEÑAS Y CHOFERES)
  // =========================================================
  const aplicarCodigo = async () => {
    if (!promoInput) {
      setPromoError(isEs ? 'Ingresa un código.' : 'Enter a code.');
      return;
    }
    setIsValidatingPromo(true);
    setPromoError('');
    const codigoLimpio = promoInput.trim().toUpperCase();

    if (cuponesAplicados.some(c => c.codigo === codigoLimpio || c.codigoChofer === codigoLimpio)) {
      setPromoError(isEs ? 'Este código ya está aplicado.' : 'Code is already applied.');
      setIsValidatingPromo(false);
      return;
    }

    try {
      let cuponValido = null;

      const qResena = query(collection(db, "cupones"), where("codigo", "==", codigoLimpio));
      const snapResena = await getDocs(qResena);

      if (!snapResena.empty) {
        const data = snapResena.docs[0].data();
        if (data.utilizado) {
          setPromoError(isEs ? 'Este cupón de reseña ya fue utilizado.' : 'This review coupon has already been used.');
          setIsValidatingPromo(false);
          return;
        }
        cuponValido = { tipo: 'resena', codigo: codigoLimpio, descuento: data.descuento || 10 };
      } else {
        const qChofer = query(collection(db, "codigos_descuento"), where("codigo", "==", codigoLimpio));
        const snapChofer = await getDocs(qChofer);

        if (!snapChofer.empty) {
          const data = snapChofer.docs[0].data();
          cuponValido = {
            tipo: 'chofer',
            codigo: codigoLimpio,
            descuento: data.descuento || 10,
            choferCorreo: data.correo || data.CORREO || 'N/A',
            nombreChofer: data.nombre || 'Chofer'
          };
        }
      }

      if (cuponValido) {
        const nuevosCupones = [...cuponesAplicados, cuponValido];
        setCuponesAplicados(nuevosCupones);
        localStorage.setItem('cabo_cupones', JSON.stringify(nuevosCupones));
        setShowPromoModal(false);
        setPromoInput('');
      } else {
        setPromoError(isEs ? 'Código inválido o no existe.' : 'Invalid code or does not exist.');
      }
    } catch (error) {
      console.error(error);
      setPromoError(isEs ? 'Error de conexión. Intenta de nuevo.' : 'Connection error. Try again.');
    }
    setIsValidatingPromo(false);
  };

  const removerCupon = (codigo) => {
    const nuevos = cuponesAplicados.filter(c => c.codigo !== codigo && c.codigoChofer !== codigo);
    setCuponesAplicados(nuevos);
    localStorage.setItem('cabo_cupones', JSON.stringify(nuevos));
  };

  // =========================================================
  // 🧮 MATEMÁTICAS PROTEGIDAS CON DESCUENTOS ACUMULABLES
  // =========================================================
  const subtotal = combo.reduce((acc, item) => acc + (item.precio || 0), 0);
  const promoBasePorcentaje = appliedPromo ? Number(appliedPromo.porcentaje_descuento || appliedPromo.descuento || 0) : 0;
  const cuponesDescuento = cuponesAplicados.reduce((acc, c) => acc + (Number(c.descuento) || 10), 0);
  const descuentoPorcentajeTotal = promoBasePorcentaje + cuponesDescuento;
  const cantidadDescontada = subtotal * (descuentoPorcentajeTotal / 100);
  const granTotalFinal = Math.max(0, subtotal - cantidadDescontada);

  const hasAnyDiscount = appliedPromo || cuponesAplicados.length > 0;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const procesarConfirmacion = async (detallesPago = null, metodoOverride = null) => {
    setProcesandoPago(true);
    const metodoReal = metodoOverride || formData.paymentMethod;
    const nuevoNumConfirmacion = Math.random().toString(36).substring(2, 10).toUpperCase();
    const datosFinalesCliente = { ...formData, paymentMethod: metodoReal };
    setNumConfirmacion(nuevoNumConfirmacion);

    // FUSIÓN: Mapeamos los combos y les insertamos su vuelo específico
    const comboFinalConVuelos = combo.map((item, idx) => ({
      ...item,
      flightInfo: vuelosData[idx] || {}
    }));

    try {
      await setDoc(doc(db, "reservas", nuevoNumConfirmacion), {
        numeroConfirmacion: nuevoNumConfirmacion,
        estado: metodoReal === 'paypal' ? "Pagado (PayPal)" : "Pendiente (Efectivo)",
        cliente: datosFinalesCliente,
        servicios: comboFinalConVuelos, 
        subtotal: subtotal,
        descuentoAplicado: descuentoPorcentajeTotal,
        totalPagado: granTotalFinal,
        cupones: cuponesAplicados.map(c => c.codigo || c.codigoChofer || 'CUPON'),
        fecha: new Date().toISOString()
      });

      let index = 1;
      for (const item of comboFinalConVuelos) {
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
            codigoChofer: cupon.codigo || cupon.codigoChofer || 'CUPON_CHOFER',
            choferCorreo: cupon.choferCorreo || 'N/A',
            numeroConfirmacion: nuevoNumConfirmacion,
            clienteNombre: `${formData.nombre} ${formData.apellidos}`,
            montoTotalReserva: granTotalFinal,
            fechaUso: new Date().toISOString()
          });

          if (formData.email) {
            const docIdCuponUsado = `${formData.email.trim().toLowerCase()}_${cupon.codigo || cupon.codigoChofer}`;
            await setDoc(doc(db, "cupones_usados", docIdCuponUsado), {
              correo: formData.email.trim().toLowerCase(),
              codigo: cupon.codigo || cupon.codigoChofer,
              fechaUso: new Date().toISOString()
            });
          }

          if (cupon.choferCorreo && cupon.choferCorreo !== 'N/A') {
            const nombreChofer = cupon.nombreChofer || cupon.nombre || (isEs ? "Chofer" : "Driver");
            const comision = subtotal * 0.10;
            const serviciosResumen = combo.map(item => item.titulo).join(', ');
            const fechaServicio = combo[0]?.config?.fechaLlegada || combo[0]?.config?.fechaTour || combo[0]?.config?.cenaHora || (isEs ? 'Fecha en sistema' : 'System Date');
            const nombreClienteCompleto = `${formData.nombre} ${formData.apellidos}`.trim();

            const subjectChofer = isEs
              ? `¡Nueva Venta! Comisión Generada - Ballard Tours`
              : `New Sale! Commission Generated - Ballard Tours`;

            const htmlChofer = isEs ? `
                <div style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 30px; color: #1e293b;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                    <div style="background-color: #15803d; padding: 25px; text-align: center; color: white;">
                      <h2 style="margin: 0; font-size: 24px;">¡Felicidades ${nombreChofer}! 🎉</h2>
                      <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 15px;">Has generado una nueva comisión de venta</p>
                    </div>
                    <div style="padding: 30px;">
                      <p style="font-size: 16px; color: #334155;">Un cliente acaba de realizar una reserva utilizando tu código de descuento.</p>
                      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0; color: #475569;"><strong>👤 Cliente:</strong> <span style="color: #0f172a;">${nombreClienteCompleto}</span></p>
                        <p style="margin: 0 0 10px 0; color: #475569;"><strong>📅 Fecha del servicio:</strong> <span style="color: #0f172a;">${fechaServicio}</span></p>
                        <p style="margin: 0; color: #475569;"><strong>🛍️ Producto(s):</strong> <span style="color: #0f172a;">${serviciosResumen}</span></p>
                      </div>
                      <div style="background-color: #dcfce3; padding: 25px; border-radius: 8px; text-align: center; border: 1px solid #bbf7d0;">
                        <p style="margin: 0; font-size: 14px; color: #166534; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Tu Comisión (10%)</p>
                        <p style="margin: 8px 0 0 0; font-size: 36px; font-weight: 900; color: #15803d;">$${comision.toFixed(2)} USD</p>
                      </div>
                    </div>
                  </div>
                </div>
              ` : `
                <div style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 30px; color: #1e293b;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                    <div style="background-color: #15803d; padding: 25px; text-align: center; color: white;">
                      <h2 style="margin: 0; font-size: 24px;">Congratulations ${nombreChofer}! 🎉</h2>
                      <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 15px;">You generated a sales commission</p>
                    </div>
                    <div style="padding: 30px;">
                      <p style="font-size: 16px; color: #334155;">A client made a reservation using your discount code.</p>
                      <div style="background-color: #dcfce3; padding: 25px; border-radius: 8px; text-align: center; border: 1px solid #bbf7d0;">
                        <p style="margin: 0; font-size: 14px; color: #166534; text-transform: uppercase; font-weight: bold;">Commission (10%)</p>
                        <p style="margin: 8px 0 0 0; font-size: 36px; font-weight: 900; color: #15803d;">$${comision.toFixed(2)} USD</p>
                      </div>
                    </div>
                  </div>
                </div>
              `;

            await addDoc(collection(db, "correos"), {
              to: cupon.choferCorreo,
              message: { subject: subjectChofer, html: htmlChofer }
            });
          }
        }
      }

      localStorage.removeItem('cabo_cupones');
      vaciarCombo();
      setIsSuccess(true);
      setProcesandoPago(false);

    } catch (error) {
      console.error("Error al registrar en Firebase:", error);
      setProcesandoPago(false);
      alert(isEs ? "Error al procesar reserva. Intenta de nuevo." : "Error processing booking. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">{isEs ? '¡Reserva Confirmada!' : 'Booking Confirmed!'}</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">{isEs ? 'Enviamos los detalles a tu correo.' : 'Details sent to your email.'}</p>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8 w-full max-w-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{isEs ? 'Confirmación' : 'Confirmation'}</p>
          <p className="text-3xl font-black text-blue-900 tracking-widest">{numConfirmacion}</p>
        </div>

        <button onClick={() => router.push(`/${lang}`)} className="px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg">
          {isEs ? 'Volver al Inicio' : 'Return Home'}
        </button>
      </div>
    );
  }

  if (combo.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-24 h-24 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mb-6"><CreditCard size={48} /></div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">{isEs ? 'Tu combo está vacío' : 'Your combo is empty'}</h1>
        <button onClick={() => router.push(`/${lang}`)} className="px-8 py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg mt-6">
          {isEs ? 'Volver al Inicio' : 'Return Home'}
        </button>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": "Af_QMaiYhnkVGklhDJbI7gdNcNsgSTCyQG5GfsR0uxD3QEs-XSDIX7tBw3M6TWDkxljqn8jLfpS2CyxF", currency: "USD" }}>
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 relative">

        {/* ========================================================= */}
        {/* MODAL DE CÓDIGOS DE DESCUENTO NATIVO */}
        {/* ========================================================= */}
        {showPromoModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative animate-fade-in">
              <button onClick={() => setShowPromoModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors p-2"><X size={20} /></button>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><Ticket size={24} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{isEs ? 'Ingresar Código' : 'Enter Code'}</h3>
              <p className="text-sm text-slate-500 mb-6">{isEs ? 'Ingresa tu cupón de reseña o código de chofer.' : 'Enter your review coupon or driver code.'}</p>

              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Ej. CABO10"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 font-black text-slate-900 focus:border-blue-600 focus:ring-0 outline-none text-center tracking-widest text-lg transition-colors"
              />

              {promoError && <p className="text-red-500 text-xs font-bold mt-3 text-center">{promoError}</p>}

              <button
                onClick={aplicarCodigo}
                disabled={isValidatingPromo || !promoInput}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidatingPromo ? (isEs ? 'Validando...' : 'Validating...') : (isEs ? 'Aplicar Descuento' : 'Apply Discount')}
              </button>
            </div>
          </div>
        )}

        {procesandoPago && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9998] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mb-4"></div>
            <p className="font-bold text-blue-900 text-lg">{isEs ? 'Procesando...' : 'Processing...'}</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 animate-fade-in">

          <div className="flex-1 w-full lg:max-w-[700px]">
            <button onClick={() => router.push(`/${lang}`)} className="text-blue-600 font-bold flex items-center hover:text-blue-800 transition mb-8">
              <ChevronLeft size={20} className="mr-1" /> {isEs ? 'Seguir comprando' : 'Continue shopping'}
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">{isEs ? 'Completa tu Reserva' : 'Complete your Booking'}</h1>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

              <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 tracking-tight"><User className="text-blue-600" size={24} /> {isEs ? 'Datos del Titular' : 'Lead Traveler Details'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 block">{isEs ? 'Nombre(s)' : 'First Name'}</label>
                    <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={`w-full p-4 border rounded-xl outline-none text-slate-900 font-bold ${formData.nombre ? 'bg-slate-50 border-slate-300' : 'bg-red-50/50 border-red-200'}`} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 block">{isEs ? 'Apellidos' : 'Last Name'}</label>
                    <input required type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-900 font-bold" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 block">{isEs ? 'Correo Electrónico' : 'Email Address'}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full pl-12 pr-4 py-4 border rounded-xl outline-none text-slate-900 font-bold ${formData.email ? 'bg-slate-50 border-slate-300' : 'bg-red-50/50 border-red-200'}`} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 block">{isEs ? 'Teléfono' : 'Phone Number'}</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-900 font-bold" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* INFORMACIÓN DE VUELOS (DINÁMICO BASADO EN EL CARRITO) */}
              {/* ========================================================= */}

              {combo.map((item, idx) => {
                const esLlegada = item.servicio === 'aeropuerto_hotel';
                const esSalida = item.servicio === 'hotel_aeropuerto';
                const esRedondo = item.servicio === 'redondo';

                if (!esLlegada && !esSalida && !esRedondo) return null;

                const hotelNombre = item.config?.hotelId || item.extrasEspeciales?.hotelOrigen || item.extrasEspeciales?.cenaOrigen || (isEs ? 'Hotel no especificado' : 'Unspecified Hotel');
                const numPasajeros = item.config?.pasajeros || item.extrasEspeciales?.hotelPax || item.extrasEspeciales?.cenaPax || '1';
                const tagText = isEs 
                  ? `${item.titulo} → ${hotelNombre} - ${numPasajeros} Pasajero(s)` 
                  : `${item.titulo} → ${hotelNombre} - ${numPasajeros} Passenger(s)`;

                return (
                  <div key={idx} className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8 animate-fade-in">
                    <h2 className="text-xl font-black text-[#0f285e] mb-4 flex items-center gap-2 tracking-tight">
                      <Plane className="text-blue-600" size={24} /> {isEs ? 'Información de Vuelos' : 'Flight Information'}
                    </h2>

                    <div className="inline-block bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg mb-6">
                      <span className="text-[13px] font-medium text-slate-600">{tagText}</span>
                    </div>

                    {/* VUELO DE LLEGADA */}
                    {(esLlegada || esRedondo) && (
                      <div className="bg-[#f4f8ff] border border-blue-100/80 rounded-2xl p-6 mb-5 last:mb-0">
                        <h3 className="text-sm font-bold text-[#1e3a8a] flex items-center gap-2 mb-4">
                          <Plane className="rotate-90 text-blue-600" size={18} /> {isEs ? 'Vuelo de Llegada al Aeropuerto (SJD)' : 'Arrival Flight to Airport (SJD)'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div className="flex flex-col">
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5">{isEs ? 'Aerolínea' : 'Airline'}</label>
                            <input type="text" value={vuelosData[idx]?.aerolinea || ''} onChange={(e) => handleVueloChange(idx, 'aerolinea', e.target.value)} placeholder={isEs ? "Ej. American Airlines" : "E.g. American Airlines"} className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-700 font-medium text-sm transition-all shadow-sm" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5">{isEs ? 'No. de Vuelo' : 'Flight No.'}</label>
                            <input type="text" value={vuelosData[idx]?.vuelo || ''} onChange={(e) => handleVueloChange(idx, 'vuelo', e.target.value)} placeholder={isEs ? "Ej. AA1234" : "E.g. AA1234"} className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-700 font-medium text-sm transition-all shadow-sm" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5">{isEs ? 'Hora de Aterrizaje' : 'Arrival Time'}</label>
                            <input type="time" value={vuelosData[idx]?.hora || ''} onChange={(e) => handleVueloChange(idx, 'hora', e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-700 font-medium text-sm transition-all shadow-sm" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VUELO DE SALIDA + HORA DE PICK-UP */}
                    {(esSalida || esRedondo) && (
                      <div className="bg-[#fff9f0] border border-amber-100/80 rounded-2xl p-6 mb-5 last:mb-0">
                        <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-4">
                          <Plane className="-rotate-45 text-amber-600" size={18} /> {isEs ? 'Vuelo de Salida desde Aeropuerto (SJD)' : 'Departure Flight from Airport (SJD)'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                          <div className="flex flex-col">
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5">{isEs ? 'Aerolínea' : 'Airline'}</label>
                            <input type="text" value={vuelosData[idx]?.aerolineaSalida || ''} onChange={(e) => handleVueloChange(idx, 'aerolineaSalida', e.target.value)} placeholder={isEs ? "Ej. Delta" : "E.g. Delta"} className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 text-slate-700 font-medium text-sm transition-all shadow-sm" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5">{isEs ? 'No. de Vuelo' : 'Flight No.'}</label>
                            <input type="text" value={vuelosData[idx]?.vueloSalida || ''} onChange={(e) => handleVueloChange(idx, 'vueloSalida', e.target.value)} placeholder={isEs ? "Ej. DL5678" : "E.g. DL5678"} className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 text-slate-700 font-medium text-sm transition-all shadow-sm" />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[12px] font-semibold text-slate-700 mb-1.5">{isEs ? 'Hora de Despegue' : 'Departure Time'}</label>
                            <input type="time" value={vuelosData[idx]?.horaSalida || ''} onChange={(e) => handleVueloChange(idx, 'horaSalida', e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 text-slate-700 font-medium text-sm transition-all shadow-sm" />
                          </div>
                        </div>

                        {/* BLOQUE: HORA DE RECOGIDA (PICK-UP) */}
                        <div className="bg-white p-4 rounded-xl border border-amber-200/60 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
                          <div className="flex-1">
                            <p className="text-[13px] font-bold text-slate-800">{isEs ? 'Hora de Pick-up sugerida' : 'Suggested Pick-up Time'}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                              {isEs ? 'Te recomendamos estar listos 3 horas antes de tu vuelo. El chofer te contactará para confirmar.' : 'We recommend being ready 3 hours before your flight. The driver will contact you to confirm.'}
                            </p>
                          </div>
                          <input
                            type="time"
                            value={vuelosData[idx]?.horaPickUp || ''}
                            onChange={(e) => handleVueloChange(idx, 'horaPickUp', e.target.value)}
                            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-700 font-bold transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ========================================================= */}
              {/* CAJA DE COMENTARIOS INDEPENDIENTE Y SEPARADA */}
              {/* ========================================================= */}
              <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8 mb-8">
                <div className="flex flex-col">
                  <label className="text-[12px] font-bold text-[#0f285e] mb-2 block tracking-wide">
                    {isEs ? 'Comentarios / Instrucciones / Hotel' : 'Comments / Resort / Instructions'}
                  </label>
                  <textarea name="notas" rows="3" value={formData.notas} onChange={handleChange} placeholder={isEs ? "¿Algo más que debamos saber?" : "Anything else we should know?"} className="w-full p-4 bg-white shadow-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-700 font-medium transition-all"></textarea>
                </div>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-[420px] flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-6 md:p-8 lg:sticky lg:top-32 w-full">
              <h3 className="text-2xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">{isEs ? 'Resumen de tu Combo' : 'Order Summary'}</h3>

              <div className="mb-6 space-y-4">
                {combo.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="pr-4">
                      <p className="font-bold text-slate-800 text-sm tracking-tight">{item.titulo}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{item.subtitulo}</p>
                    </div>
                    <p className="font-bold text-blue-600">${(item.precio || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-500 font-bold text-sm">Subtotal</span>
                  <span className="font-bold text-slate-700">${subtotal.toFixed(2)}</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl mt-4 mb-4 shadow-inner border border-slate-800">
                  <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-slate-400">
                      <Ticket size={14} className="text-emerald-400" />
                      {isEs ? 'CÓDIGO / CUPÓN' : 'CODE / COUPON'}
                    </span>

                    <button onClick={() => setShowPromoModal(true)} className="text-[10px] font-bold text-blue-400 flex items-center gap-1 hover:underline transition-all">
                      <Edit3 size={12} /> {isEs ? "Añadir / Editar" : "Add / Edit"}
                    </button>
                  </div>

                  {hasAnyDiscount ? (
                    <div className="flex flex-col gap-2">
                      {appliedPromo && (
                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
                            {appliedPromo.codigo || appliedPromo.code || (isEs ? "PROMO WEB" : "WEB PROMO")}
                          </span>
                          <span className="font-bold text-emerald-400 text-sm">
                            -${(subtotal * (promoBasePorcentaje / 100)).toFixed(2)}
                          </span>
                        </div>
                      )}

                      {cuponesAplicados.map((c, i) => {
                        const cantidadDescontadaCupon = subtotal * ((Number(c.descuento) || 10) / 100);
                        return (
                          <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
                                {c.codigo || c.codigoChofer || (isEs ? 'CUPÓN CHOFER' : 'DRIVER CODE')}
                              </span>
                              <button onClick={() => removerCupon(c.codigo || c.codigoChofer)} className="text-slate-500 hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <span className="font-bold text-emerald-400 text-sm">
                              -${cantidadDescontadaCupon.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <button onClick={() => setShowPromoModal(true)} className="text-[11px] text-slate-400 font-bold hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">
                        {isEs ? "Añadir código de descuento o chofer" : "Add discount or driver code"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-4 mt-2 flex justify-between items-end">
                  <span className="text-slate-800 font-black text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-blue-600">${granTotalFinal.toFixed(2)}</span>
                    <p className="text-xs font-bold text-slate-400">USD</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{isEs ? 'Elige tu Método de Pago' : 'Choose Payment Method'}</p>
                <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all w-full ${formData.paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleChange} className="w-5 h-5 accent-blue-600 flex-shrink-0" />
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-slate-900 text-sm">PayPal / Credit Card</span>
                    <span className="font-black text-blue-700">${granTotalFinal.toFixed(2)}</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all w-full ${formData.paymentMethod === 'efectivo' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <input type="radio" name="paymentMethod" value="efectivo" checked={formData.paymentMethod === 'efectivo'} onChange={handleChange} className="w-5 h-5 accent-slate-900 flex-shrink-0" />
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-slate-900 text-sm">{isEs ? 'Pagar en Efectivo (Cash)' : 'Pay in Cash on Arrival'}</span>
                    <span className="font-black text-slate-900">${granTotalFinal.toFixed(2)}</span>
                  </div>
                </label>
              </div>

              <div className="mt-4 relative z-0">
                {formData.paymentMethod === 'paypal' ? (
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", color: "gold" }}
                    disabled={!formData.nombre || !formData.email}
                    createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: granTotalFinal.toFixed(2) } }] })}
                    onApprove={(data, actions) => actions.order.capture().then((details) => procesarConfirmacion(details, 'paypal'))}
                    onError={(err) => alert(isEs ? "Error al procesar pago." : "Payment error.")}
                  />
                ) : (
                  <button
                    disabled={!formData.nombre || !formData.email}
                    onClick={() => procesarConfirmacion(null, 'efectivo')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEs ? 'Confirmar Reserva en Efectivo' : 'Confirm Cash Booking'}
                  </button>
                )}
              </div>

              {(!formData.nombre || !formData.email) && (
                <p className="text-xs text-red-500 mt-4 text-center font-bold">
                  {isEs ? 'Por favor llena tus datos de contacto antes de pagar.' : 'Please fill in your contact details before paying.'}
                </p>
              )}

            </div>
          </div>

        </div>
      </div>
    </PayPalScriptProvider>
  );
}