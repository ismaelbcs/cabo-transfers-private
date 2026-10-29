// src/app/[lang]/yachts/page.js
'use client';

import React, { useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Anchor, 
  Users, 
  Clock, 
  Calendar, 
  Check, 
  CheckCircle, 
  CheckCircle2, 
  Info, 
  Plus, 
  Sparkles, 
  Award, 
  MapPin, 
  Car, 
  Utensils, 
  Wine, 
  Waves, 
  Compass, 
  X, 
  MessageCircle, 
  Maximize2,
  Ship,
  HeartHandshake,
  Star,
  Mail,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { catalogoHoteles } from '../../../data/seoData';
import { COUNTRIES, POPULAR_COUNTRY_CODES } from '../../../data/countryCallingCodes';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { sendEmail } from '../../../utils/sendEmail';
import TrustedPartners from '../../../components/TrustedPartners';
import HeroReviewsBadge from '../../../components/HeroReviewsBadge';

export default function YachtsPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const { agregarAlCombo } = useCart();

  // ==========================================
  // CONFIGURACIÓN DE PAQUETES (PRECIOS ACTUALIZADOS)
  // Regla: +$1,000 USD al paquete, +$50 al huésped extra ($250+$50=$300), +$100 a hora extra ($1,600)
  // ==========================================
  const paquetes = [
    {
      id: 'sunset-2-5',
      nameEn: '2.5 HOURS SUNSET',
      nameEs: '2.5 HORAS ATARDECER',
      hours: 2.5,
      price: 8000, // Original $7,000 + $1,000
      baseGuests: 10,
      maxGuests: 20,
      extraGuestPrice: 300, // Original $250 + $50
      appetizers: true,
      beverages: true,
      customMeal: false,
      popular: false,
      descriptionEn: 'Cruise past El Arco and Land’s End while enjoying signature cocktails, premium wine, and gourmet appetizers during Cabo’s world-famous sunset.',
      descriptionEs: 'Navega junto al icónico Arco y Finisterra disfrutando de cócteles de autor, vinos selectos y bocadillos gourmet bajo el legendario atardecer de Los Cabos.'
    },
    {
      id: 'all-inclusive-4',
      nameEn: '4 HOURS ALL INCLUSIVE',
      nameEs: '4 HORAS TODO INCLUIDO',
      hours: 4,
      price: 11000, // Original $10,000 + $1,000
      baseGuests: 10,
      maxGuests: 25,
      extraGuestPrice: 300,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'The quintessential private luxury charter. Visit the Arch, snorkel in crystalline bays, feast on custom meals prepared by our private chef, and play with Seabobs.',
      descriptionEs: 'El chárter de lujo por excelencia. Visita el Arco, esnorquelea en bahías cristalinas, deléitate con un menú a la medida de nuestro chef y diviértete con los Seabobs.'
    },
    {
      id: 'all-inclusive-6',
      nameEn: '6 HOURS ALL INCLUSIVE',
      nameEs: '6 HORAS TODO INCLUIDO',
      hours: 6,
      price: 13500, // Original $12,500 + $1,000
      baseGuests: 10,
      maxGuests: 25,
      extraGuestPrice: 300,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Extended cruise to Santa María or Chileno Bay. Ample time for water sports, stand-up paddling, multi-course dining, and soaking in the flybridge jacuzzi.',
      descriptionEs: 'Navegación extendida hacia Bahía Santa María o Chileno. Tiempo de sobra para deportes acuáticos, paddle board, comida de varios tiempos y jacuzzi en cubierta.'
    },
    {
      id: 'all-inclusive-8',
      nameEn: '8 HOURS ALL INCLUSIVE',
      nameEs: '8 HORAS TODO INCLUIDO',
      hours: 8,
      price: 16000, // Original $15,000 + $1,000
      baseGuests: 10,
      maxGuests: 25,
      extraGuestPrice: 300,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: true, // Tag "Most Popular"
      descriptionEn: 'The ultimate VIP superyacht day. Explore secluded Baja coves, deep-sea fishing with the 31ft Pursuit tender, scuba diving with onboard compressor, and sunset dining.',
      descriptionEs: 'La máxima experiencia VIP en superyate. Explora calas secretas de Baja, pesca deportiva con el tender Pursuit de 31ft, buceo con compresor y cena al atardecer.'
    }
  ];

  // ==========================================
  // ESTADOS DEL CONFIGURADOR / CALCULADORA
  // ==========================================
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(paquetes[3]); // 8 Horas por defecto
  const [charterFecha, setCharterFecha] = useState('');
  const [totalHuespedes, setTotalHuespedes] = useState(10);
  const [horasExtras, setHorasExtras] = useState(0); // $1,600 USD por hora extra
  const PRECIO_HORA_EXTRA = 1600;

  // Estados de Transportación Terrestre (Basado en la lógica de Golf)
  const [incluirTransporte, setIncluirTransporte] = useState(false);
  const [transporteOrigen, setTransporteOrigen] = useState('');
  const [busquedaOrigen, setBusquedaOrigen] = useState('');
  const [mostrarDropdownHoteles, setMostrarDropdownHoteles] = useState(false);
  const [horaRecogidaHotel, setHoraRecogidaHotel] = useState('11:00');
  const [horaRegresoMarina, setHoraRegresoMarina] = useState('19:30'); // Sin límite de tiempo

  // Matriz de precios de transporte hacia Cabo San Lucas Marina ('csl')
  const matrizPreciosMarinaCSL = { '1': 220, '2': 200, '3': 160, '4': 250, '5': 320, '6': 420 };
  
  // Recargo por cantidad de pasajeros en transporte terrestre
  const calcularRecargoTransporte = (pax) => {
    if (pax <= 4) return 0;
    if (pax <= 8) return 30;
    if (pax <= 10) return 45;
    if (pax <= 15) return 90;
    if (pax <= 20) return 140;
    return 180; // 21-25 pax
  };

  // Cálculo del Transporte Terrestre
  const costoTransporte = useMemo(() => {
    if (!incluirTransporte || !transporteOrigen) return 0;
    const zonaSeleccionada = String(transporteOrigen.split('|')[1]) || "1";
    const precioBase = Number(matrizPreciosMarinaCSL[zonaSeleccionada] || 200);
    const recargo = calcularRecargoTransporte(totalHuespedes);
    return precioBase + recargo;
  }, [incluirTransporte, transporteOrigen, totalHuespedes]);

  // Cálculo del Costo de Huéspedes Adicionales ($300 USD c/u)
  const huespedesExtra = Math.max(0, totalHuespedes - paqueteSeleccionado.baseGuests);
  const costoHuespedesExtra = huespedesExtra * paqueteSeleccionado.extraGuestPrice;

  // Cálculo de Horas Extras ($1,600 USD c/u)
  const costoHorasExtras = horasExtras * PRECIO_HORA_EXTRA;

  // Gran Total
  const granTotalYate = paqueteSeleccionado.price + costoHuespedesExtra + costoHorasExtras + costoTransporte;

  // ==========================================
  // ESTADOS DEL MODAL "INQUIRE" (Imagen 3)
  // ==========================================
  const [modalAbierto, setModalAbierto] = useState(false);
  const [inquireData, setInquireData] = useState({
    firstName: '',
    lastName: '',
    date: '',
    phoneCode: '+1',
    phoneNumber: '',
    email: '',
    source: 'Word of mouth',
    message: ''
  });
  const [enviandoInquiry, setEnviandoInquiry] = useState(false);
  const [inquiryEnviado, setInquiryEnviado] = useState(false);

  // ==========================================
  // FOTOS REALES DEL YATE CAPELLA (PROVISTAS POR EL USUARIO)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/yachts/capella-exterior-cruising.jpg',
      titleEn: '116 Ft Azimut-Benetti Capella Cruising Cabo Waters',
      titleEs: 'Superyate Capella de 116 pies navegando en las aguas de Los Cabos',
      descEn: 'One of only three ever built worldwide, cruising the deep blue Sea of Cortez.',
      descEs: 'Uno de solo tres jamás construidos en el mundo, navegando el Mar de Cortés.',
      labelEn: 'Cruising',
      labelEs: 'Navegación'
    },
    {
      src: '/yachts/capella-exterior-profile.jpg',
      titleEn: 'Capella Profile at Land’s End Cliffs',
      titleEs: 'Silueta del Capella frente a los acantilados de Finisterra',
      descEn: 'Graceful tri-deck Italian design and lines off the iconic Cabo coastline.',
      descEs: 'Elegante diseño italiano de tres cubiertas frente a la costa de Cabo.',
      labelEn: 'Profile',
      labelEs: 'Silueta'
    },
    {
      src: '/yachts/capella-flybridge-bar.jpg',
      titleEn: 'Upper Flybridge Bar & Alfresco Cocktail Lounge',
      titleEs: 'Bar en Cubierta Superior Flybridge y Salón de Cócteles al Aire Libre',
      descEn: 'Circular wet bar with open sea views, premium spirits, and sunset seating.',
      descEs: 'Wet bar circular con vistas al mar abierto, coctelería premium y asientos lounge.',
      labelEn: 'Sky Bar',
      labelEs: 'Sky Bar'
    },
    {
      src: '/yachts/capella-flybridge-jacuzzi.jpg',
      titleEn: 'Upper Flybridge Deck with 8-Person Jacuzzi & Lounge',
      titleEs: 'Cubierta Superior Flybridge con Jacuzzi para 8 Personas y Lounge',
      descEn: '8-person heated jacuzzi surrounded by teak deck, plush pillows, and open sea views.',
      descEs: 'Jacuzzi para ocho personas rodeado de cubierta de teca, cojines de lujo y vista al mar abierto.',
      labelEn: 'Jacuzzi',
      labelEs: 'Jacuzzi'
    },
    {
      src: '/yachts/capella-main-salon.jpg',
      titleEn: 'Open-Plan Main Salon with Circular Bar & Formal Dining',
      titleEs: 'Salón Principal de Concepto Abierto con Bar Circular y Comedor Formal',
      descEn: 'Spacious salon with hand-crafted cherry wood, plush lounge sofas, and formal dining.',
      descEs: 'Espacioso salón con maderas finas de cerezo, sillones lounge y comedor formal.',
      labelEn: 'Main Salon',
      labelEs: 'Salón'
    },
    {
      src: '/yachts/capella-master-stateroom.jpg',
      titleEn: 'Master Stateroom Suite with King Bed & Cherry Wood',
      titleEs: 'Camarote Principal Suite con Cama King y Maderas Finas',
      descEn: 'Full-beam master suite decorated with impeccable Italian craftsmanship.',
      descEs: 'Suite principal full-beam decorada con impecable artesanía italiana.',
      labelEn: 'Master Suite',
      labelEs: 'Suite King'
    },
    {
      src: '/yachts/capella-bow-sunpad.jpg',
      titleEn: 'Expansive Bow Sunbathing Pad',
      titleEs: 'Amplio Asoleadero en Proa con Cojines de Lujo',
      descEn: 'Ideal for sun lounging with fresh drinks by day and romantic stargazing by night.',
      descEs: 'Ideal para tomar el sol de día y admirar las estrellas por la noche.',
      labelEn: 'Bow Sunpad',
      labelEs: 'Proa'
    },
    {
      src: '/yachts/capella-mosaic-companionway.jpg',
      titleEn: 'Hand-Laid Mosaic Tile Companionway',
      titleEs: 'Pasillo Principal con Mosaicos Artesanales Hechos a Mano',
      descEn: 'Stunning artisan tile mosaic companionway accented with polished cherry wood.',
      descEs: 'Impresionante pasillo de mosaicos artesanales con acentos en madera de cerezo pulida.',
      labelEn: 'Mosaic Tile',
      labelEs: 'Mosaicos'
    }
  ];

  // Manejar apertura de Modal Inquire
  const handleOpenInquire = (paqueteOpt) => {
    if (paqueteOpt) setPaqueteSeleccionado(paqueteOpt);
    setInquireData(prev => ({
      ...prev,
      date: charterFecha || prev.date
    }));
    setModalAbierto(true);
  };

  // Enviar Formulario de Inquiry (Firestore + Nodemailer)
  const handleSubmitInquire = async (e) => {
    e.preventDefault();
    setEnviandoInquiry(true);

    const emailSubject = `NUEVA CONSULTA DE YATE: Capella 116ft - ${inquireData.firstName} ${inquireData.lastName}`;
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: #0f172a; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Ballard Tours • Private Yacht Charters</h1>
            <p style="color: #0284c7; margin: 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">116ft Azimut-Benetti "Capella"</p>
          </div>

          <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 16px;">Nueva Solicitud de Información / Inquire</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">Cliente:</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${inquireData.firstName} ${inquireData.lastName}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Correo:</td><td style="padding: 8px 0;"><a href="mailto:${inquireData.email}" style="color: #0284c7; text-decoration: none;">${inquireData.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Teléfono:</td><td style="padding: 8px 0; color: #0f172a;">${inquireData.phoneCode} ${inquireData.phoneNumber}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Fecha solicitada:</td><td style="padding: 8px 0; color: #b45309; font-weight: bold;">${inquireData.date || 'Por definir'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Paquete sugerido:</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${paqueteSeleccionado.nameEn} ($${paqueteSeleccionado.price.toLocaleString()} USD)</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Huéspedes:</td><td style="padding: 8px 0; color: #0f172a;">${totalHuespedes} personas</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">¿Incluye transporte?:</td><td style="padding: 8px 0; color: #0f172a;">${incluirTransporte ? `SÍ (${busquedaOrigen || 'Hotel por definir'} | Salida: ${horaRecogidaHotel} - Regreso: ${horaRegresoMarina})` : 'NO'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Presupuesto estimado:</td><td style="padding: 8px 0; color: #15803d; font-size: 18px; font-weight: 800;">$${granTotalYate.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Medio de contacto:</td><td style="padding: 8px 0; color: #334155;">${inquireData.source}</td></tr>
          </table>

          <h3 style="color: #1e293b; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Mensaje del Cliente:</h3>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #334155; border: 1px solid #e2e8f0;">
            ${inquireData.message || 'Sin mensaje adicional.'}
          </div>

          <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8;">
            Solicitud generada a través de caboprivateairporttransfers.com / yachts
          </div>
        </div>
      </div>
    `;

    try {
      await addDoc(collection(db, "correos"), {
        to: "reservationballard@gmail.com",
        message: {
          subject: emailSubject,
          html: emailHtml
        },
        yachtInquiry: {
          ...inquireData,
          paquete: paqueteSeleccionado.id,
          totalHuespedes,
          horasExtras,
          incluirTransporte,
          hotelOrigen: busquedaOrigen,
          granTotalYate,
          createdAt: new Date().toISOString()
        }
      });

      await sendEmail({
        to: "reservationballard@gmail.com",
        subject: emailSubject,
        html: emailHtml
      });

      setEnviandoInquiry(false);
      setInquiryEnviado(true);
    } catch (err) {
      console.error('Error al enviar inquiry:', err);
      setEnviandoInquiry(false);
      setInquiryEnviado(true);
    }
  };

  // Manejar adición al Carrito del combo
  const handleAddToCart = () => {
    agregarAlCombo({
      id: `yacht-capella-${Date.now()}`,
      titulo: isEs ? `Chárter en Yate Capella 116ft (${paqueteSeleccionado.nameEs})` : `Capella 116ft Yacht Charter (${paqueteSeleccionado.nameEn})`,
      subtitulo: isEs 
        ? `${totalHuespedes} Pasajeros | ${paqueteSeleccionado.hours} Horas${horasExtras > 0 ? ` + ${horasExtras}h extra` : ''} | Fecha: ${charterFecha || 'Por confirmar'}${incluirTransporte ? ` | Con Traslado VIP desde ${busquedaOrigen}` : ''}`
        : `${totalHuespedes} Guests | ${paqueteSeleccionado.hours} Hours${horasExtras > 0 ? ` + ${horasExtras}h extra` : ''} | Date: ${charterFecha || 'To be confirmed'}${incluirTransporte ? ` | VIP Round-Trip Transfer from ${busquedaOrigen}` : ''}`,
      precio: granTotalYate,
      tipoEspecial: 'yacht',
      config: {
        yachtName: 'Capella 116ft Azimut-Benetti',
        packageId: paqueteSeleccionado.id,
        packageName: paqueteSeleccionado.nameEn,
        basePrice: paqueteSeleccionado.price,
        guests: totalHuespedes,
        extraGuestsCount: huespedesExtra,
        extraGuestsPrice: costoHuespedesExtra,
        extraHours: horasExtras,
        extraHoursPrice: costoHorasExtras,
        charterDate: charterFecha,
        groundTransportation: incluirTransporte,
        transportHotel: busquedaOrigen,
        transportZone: transporteOrigen.split('|')[1] || null,
        hotelPickupTime: horaRecogidaHotel,
        marinaReturnTime: horaRegresoMarina,
        transportCost: costoTransporte
      }
    });

    router.push(`/${lang}/cart`);
  };

  // Mensaje para WhatsApp VIP Concierge
  const mensajeWhatsApp = encodeURIComponent(
    isEs
      ? `Hola Ballard Tours, deseo consultar disponibilidad para el Yate Capella 116ft Azimut-Benetti.\n- Paquete: ${paqueteSeleccionado.nameEs} ($${paqueteSeleccionado.price.toLocaleString()} USD)\n- Huéspedes: ${totalHuespedes}\n- Fecha estimada: ${charterFecha || 'Por coordinar'}\n- Horas extras: ${horasExtras}\n- Traslado terrestre: ${incluirTransporte ? `SÍ (${busquedaOrigen || 'Hotel'})` : 'NO'}\n- Cotización estimada: $${granTotalYate.toLocaleString()} USD.\n¿Me pueden confirmar horarios y detalles?`
      : `Hello Ballard Tours, I would like to check availability for the 116ft Azimut-Benetti Yacht "Capella".\n- Package: ${paqueteSeleccionado.nameEn} ($${paqueteSeleccionado.price.toLocaleString()} USD)\n- Guests: ${totalHuespedes}\n- Target Date: ${charterFecha || 'TBD'}\n- Extra hours: ${horasExtras}\n- Ground Transfer: ${incluirTransporte ? `YES (${busquedaOrigen || 'Hotel'})` : 'NO'}\n- Estimated Quote: $${granTotalYate.toLocaleString()} USD.\nPlease let me know availability.`
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* HERO BANNER - TEMA CLARO Y ELEGANTE                      */}
      {/* ======================================================== */}
      <div className="relative pt-28 pb-14 md:pt-32 md:pb-16 px-4 bg-gradient-to-b from-blue-50/80 via-white to-slate-50 border-b border-slate-200/90 mb-10 overflow-hidden">
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          
          {/* ======================================================== */}
          {/* CUADRO ELEGANTE ACORDE A LA TEMÁTICA PARA RESALTAR LETRAS */}
          {/* ======================================================== */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] border border-blue-100/80 text-center relative overflow-hidden mb-8">
            {/* Acento superior náutico */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 via-blue-600 to-amber-500"></div>

            {/* Breadcrumb e Indicadores */}
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4 text-xs text-slate-500 font-semibold">
              <Link href={`/${lang}`} className="hover:text-blue-600 transition flex items-center gap-1">
                <span>←</span> {isEs ? 'Inicio' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-slate-400">{isEs ? 'Yates de Lujo' : 'Luxury Yachts'}</span>
              <span>/</span>
              <span className="text-blue-900 font-extrabold">116ft Azimut-Benetti "Capella"</span>
            </div>

            <div className="flex justify-center items-center gap-4 mb-3 text-slate-400">
              <Ship size={24} className="text-blue-900" />
              <span className="border-t border-dashed border-slate-300 w-16"></span>
              <MapPin size={24} className="text-amber-500" />
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-tight text-slate-900">
              {isEs ? 'Renta de Yate Privado Capella 116ft' : '116 Ft Azimut-Benetti "Capella"'}
            </h1>
            
            <HeroReviewsBadge lang={lang} />

            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium mt-3 max-w-2xl mx-auto leading-relaxed">
              {isEs 
                ? 'Calidad, máximo lujo y excelencia italiana para navegar las aguas de Los Cabos. La embarcación en la que todos desean estar.'
                : 'Quality, luxury, and Italian excellence for cruising Baja’s deep blue seas. The vessel everybody wishes they were on.'
              }
            </p>
          </div>

          {/* Selector de Galería de Fotos Reales con Visor Grande */}
          <div className="mt-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4 text-xs text-slate-600">
              <span className="font-extrabold flex items-center gap-1.5 text-sm sm:text-base text-slate-900">
                <CameraIcon size={18} className="text-blue-600" />
                {isEs ? 'Fotos Reales del Yate Capella' : 'Real Yacht Capella Photos'}
              </span>
              <button 
                type="button"
                onClick={() => setLightboxAbierto(true)}
                className="text-blue-900 hover:text-blue-700 font-bold transition flex items-center gap-1.5 bg-white hover:bg-blue-50 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs"
              >
                <Maximize2 size={13} />
                {isEs ? 'Ver en pantalla completa' : 'View full screen'}
              </button>
            </div>

            {/* VISOR PRINCIPAL DE FOTO GRANDE (CAMBIA AL DAR CLIC A CUALQUIER FOTO) */}
            <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200/90 bg-slate-900 group mb-4">
              <div className="relative aspect-[16/9] sm:aspect-[16/9] md:h-[480px] w-full overflow-hidden bg-slate-100">
                <img 
                  key={fotosGaleria[fotoActiva].src}
                  src={fotosGaleria[fotoActiva].src} 
                  alt={isEs ? fotosGaleria[fotoActiva].titleEs : fotosGaleria[fotoActiva].titleEn} 
                  className="w-full h-full object-cover transition-all duration-500 ease-out"
                />
                
                {/* Gradiente inferior para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

                {/* Flecha Anterior */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFotoActiva(prev => (prev === 0 ? fotosGaleria.length - 1 : prev - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-lg flex items-center justify-center transition border border-slate-200 z-20 cursor-pointer active:scale-95"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Flecha Siguiente */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFotoActiva(prev => (prev === fotosGaleria.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-lg flex items-center justify-center transition border border-slate-200 z-20 cursor-pointer active:scale-95"
                  aria-label="Next Photo"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Badge superior contador */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black border border-slate-200 shadow-md">
                    {fotoActiva + 1} / {fotosGaleria.length}
                  </span>
                </div>

                {/* Leyenda y descripción de la foto sobre la imagen */}
                <div className="absolute bottom-4 left-4 right-4 text-left z-20">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider mb-1 shadow-xs">
                    {isEs ? 'Foto Activa' : 'Active Photo'}
                  </span>
                  <h3 className="text-base sm:text-xl md:text-2xl font-black text-white drop-shadow-md">
                    {isEs ? fotosGaleria[fotoActiva].titleEs : fotosGaleria[fotoActiva].titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-100 drop-shadow line-clamp-2 mt-0.5 max-w-2xl">
                    {isEs ? fotosGaleria[fotoActiva].descEs : fotosGaleria[fotoActiva].descEn}
                  </p>
                </div>
              </div>
            </div>

            {/* MINIATURAS INTERACTIVAS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
              {fotosGaleria.map((foto, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFotoActiva(idx)}
                  className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                    fotoActiva === idx 
                      ? 'border-blue-600 ring-4 ring-blue-500/25 scale-[1.04] shadow-md z-10' 
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <img src={foto.src} alt={foto.titleEn} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[10px] font-bold text-white truncate drop-shadow w-full text-center">
                      {isEs ? foto.labelEs : foto.labelEn}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* TRUSTED PARTNERS (AL IGUAL QUE EN HOTELES)               */}
      {/* ======================================================== */}
      <TrustedPartners lang={lang} className="mb-12 rounded-2xl mx-4 max-w-7xl lg:mx-auto" />

      {/* ======================================================== */}
      {/* QUICK HIGHLIGHTS BAR (ESPECIFICACIONES RÁPIDAS EN CLARO) */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Ship className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Eslora / Modelo' : 'Length & Model'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">116 Ft Azimut</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Users className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Capacidad' : 'Guest Capacity'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? 'Hasta 25 Personas' : 'Up to 25 Guests'}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Award className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Tripulación' : 'Crew Members'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? '7 Especialistas + Chef' : '7 Experts + Chef'}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Waves className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Tender de Pesca' : 'Support Tender'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">31ft Pursuit 600hp</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Sparkles className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Camarotes' : 'Staterooms'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? '5 Suites de Mármol' : '5 Marble Suites'}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <MapPin className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Punto de Salida' : 'Departure Point'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">Marina Cabo San Lucas</p>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SECCIÓN DE PAQUETES (CON PRECIOS Y DISEÑO FIEL)          */}
      {/* ======================================================== */}
      <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-28">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <Anchor size={14} />
            {isEs ? 'Paquetes de Chárter en Los Cabos' : 'All-Inclusive Yacht Packages'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isEs ? 'Paquetes Exclusivos Todo Incluido' : 'Packages'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {isEs 
              ? 'Tarifas transparentes para hasta 10 invitados. Huéspedes adicionales ($300 USD c/u) y horas extra disponibles.'
              : 'Base rates for up to 10 guests. Extra guests ($300 USD each) and additional hours available.'
            }
          </p>
        </div>

        {/* Rejilla de 4 Tarjetas de Paquetes con cabecera azul institucional */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paquetes.map((pkg) => {
            const esSeleccionado = paqueteSeleccionado.id === pkg.id;

            return (
              <div 
                key={pkg.id}
                onClick={() => setPaqueteSeleccionado(pkg)}
                className={`relative rounded-2xl bg-white text-slate-900 border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${
                  esSeleccionado 
                    ? 'ring-4 ring-blue-600 shadow-xl scale-[1.02] border-blue-600' 
                    : 'border-slate-200/90 shadow-sm hover:shadow-lg hover:border-blue-400'
                }`}
              >
                {/* Badge Most Popular */}
                {pkg.popular && (
                  <div className="absolute top-0 right-4 z-20">
                    <div className="bg-[#b4975a] text-white text-[11px] font-bold uppercase px-3 py-1 rounded-b-md shadow-xs">
                      {isEs ? 'Más Popular' : 'Most Popular'}
                    </div>
                  </div>
                )}

                {/* Header Azul del Paquete idéntico al screenshot */}
                <div className="bg-[#0066b2] text-white py-3.5 px-4 text-center">
                  <h3 className="font-extrabold text-xs sm:text-sm tracking-wider uppercase">
                    {isEs ? pkg.nameEs : pkg.nameEn}
                  </h3>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 flex flex-col flex-grow">
                  
                  {/* Precio Grande */}
                  <div className="text-center mb-4">
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      ${pkg.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-[11px] text-slate-500 italic mt-1 font-medium">
                      {isEs ? 'Impuestos mexicanos no incluidos en ningún paquete' : 'Mexican Sales Tax not included in any package'}
                    </p>
                  </div>

                  {/* Lista de Especificaciones con Iconos */}
                  <div className="space-y-3.5 border-t border-slate-100 pt-4 text-sm text-slate-700 flex-grow">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-[#0066b2]" />
                        <span className="font-medium">{isEs ? 'Huéspedes base' : 'Guests'}</span>
                      </div>
                      <span className="font-bold text-slate-900">{pkg.baseGuests}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-[#0066b2]" />
                        <span className="font-medium">{isEs ? 'Huéspedes extra' : 'Extra Guests'}</span>
                      </div>
                      <span className="font-semibold text-slate-800 text-xs">
                        ${pkg.extraGuestPrice} {isEs ? `c/u (${pkg.maxGuests} Máx)` : `each (${pkg.maxGuests} Max)`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#0066b2]" />
                        <span className="font-medium">{isEs ? 'Duración' : 'Hours'}</span>
                      </div>
                      <span className="font-bold text-slate-900">{pkg.hours}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Utensils size={16} className="text-[#0066b2]" />
                        <span className="font-medium">{isEs ? 'Bocadillos / Appetizers' : 'Appetizers'}</span>
                      </div>
                      <Check size={18} className="text-emerald-600 stroke-[3]" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wine size={16} className="text-[#0066b2]" />
                        <span className="font-medium">{isEs ? 'Barra libre y bebidas' : 'Beverages'}</span>
                      </div>
                      <Check size={18} className="text-emerald-600 stroke-[3]" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-[#0066b2]" />
                        <span className="font-medium">{isEs ? 'Menú personalizado chef' : 'Custom Meal Selection'}</span>
                      </div>
                      {pkg.customMeal ? (
                        <Check size={18} className="text-emerald-600 stroke-[3]" />
                      ) : (
                        <span className="text-slate-300 font-bold">—</span>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaqueteSeleccionado(pkg);
                        handleOpenInquire(pkg);
                      }}
                      className="w-full py-3 px-4 bg-[#003865] hover:bg-[#002244] text-white font-extrabold text-xs tracking-wider uppercase rounded-lg transition text-center shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {isEs ? 'SOLICITAR INFORMACIÓN' : 'INQUIRE NOW'}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaqueteSeleccionado(pkg);
                        const calcEl = document.getElementById('booking-calculator');
                        if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition text-center border ${
                        esSeleccionado 
                          ? 'bg-blue-50 text-blue-900 border-blue-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {esSeleccionado ? (isEs ? '✓ Paquete Seleccionado' : '✓ Selected Package') : (isEs ? 'Personalizar Reserva' : 'Customize Charter')}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CALCULADORA INTERACTIVA Y MÓDULO DE TRANSPORTE TERRESTRE */}
      {/* ======================================================== */}
      <div id="booking-calculator" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-28">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2 border border-blue-100">
                <Compass size={14} />
                {isEs ? 'Calculadora VIP en Vivo' : 'Live VIP Charter Calculator'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isEs ? 'Configura tu Chárter en el Capella' : 'Configure Your Capella Charter'}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {isEs 
                  ? 'Añade invitados adicionales, horas extras y servicio de traslado privado ida y vuelta desde tu resort.'
                  : 'Add extra guests, additional charter hours, and round-trip private resort ground transfers.'
                }
              </p>
            </div>

            {/* Cuadrito Interactivo para Modificar el Paquete */}
            <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-3 sm:p-4 text-left sm:text-right min-w-[280px] shadow-2xs">
              <label htmlFor="select-paquete-cuadrito" className="text-[11px] text-blue-900 font-extrabold uppercase tracking-wider block mb-1.5 flex items-center justify-between sm:justify-end gap-1.5">
                <span>{isEs ? 'Modificar Paquete Activo' : 'Active Package (Change)'}</span>
                <ChevronDown size={14} className="text-blue-900 shrink-0" />
              </label>
              <select 
                id="select-paquete-cuadrito"
                value={paqueteSeleccionado.id} 
                onChange={(e) => {
                  const selected = paquetes.find(p => p.id === e.target.value);
                  if (selected) {
                    setPaqueteSeleccionado(selected);
                  }
                }}
                className="w-full bg-white border border-blue-300 text-blue-950 font-black text-sm sm:text-base rounded-xl px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs transition hover:border-blue-500"
              >
                {paquetes.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {isEs ? pkg.nameEs : pkg.nameEn} — ${pkg.price.toLocaleString()} USD
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 block mt-1 font-medium sm:text-right">
                {isEs ? 'Haz clic aquí para cambiar de opción' : 'Click here to switch package'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* 1. Selector de Fecha */}
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-blue-900" />
                {isEs ? 'Fecha de navegación' : 'Charter Date'}
              </label>
              <input 
                type="date" 
                value={charterFecha} 
                onChange={(e) => setCharterFecha(e.target.value)} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 text-slate-800 outline-none text-sm transition font-medium"
              />
            </div>

            {/* 2. Selector de Huéspedes Totales */}
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-blue-900" />
                  {isEs ? 'Total de Huéspedes' : 'Total Guests'}
                </span>
                <span className="text-xs text-blue-900 font-bold">
                  {huespedesExtra > 0 
                    ? `+${huespedesExtra} extra (+$${costoHuespedesExtra.toLocaleString()} USD)` 
                    : (isEs ? '10 incluidos en tarifa' : '10 included in rate')}
                </span>
              </label>
              
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <button 
                  type="button"
                  onClick={() => setTotalHuespedes(prev => Math.max(1, prev - 1))}
                  disabled={totalHuespedes <= 1}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-base sm:text-lg text-slate-900">
                  {totalHuespedes} {isEs ? 'Personas' : 'Guests'}
                </div>
                <button 
                  type="button"
                  onClick={() => setTotalHuespedes(prev => Math.min(25, prev + 1))}
                  disabled={totalHuespedes >= 25}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 font-medium">
                {isEs 
                  ? 'Tarifa cubre 10 personas. A partir de 11 suma $300 USD por persona (hasta 25).' 
                  : 'Rate covers 10 guests. From 11+ adds $300 USD per guest (up to 25).'}
              </span>
            </div>

            {/* 3. Selector de Horas Extras */}
            <div className="flex flex-col">
              <label className="text-xs sm:text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-900" />
                  {isEs ? 'Horas Extras de Chárter' : 'Extra Charter Hours'}
                </span>
                <span className="text-xs text-blue-900 font-bold">
                  {horasExtras > 0 
                    ? `+${horasExtras}h (+$${costoHorasExtras.toLocaleString()} USD)` 
                    : '$1,600 USD/hr'}
                </span>
              </label>

              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <button 
                  type="button"
                  onClick={() => setHorasExtras(prev => Math.max(0, prev - 1))}
                  disabled={horasExtras <= 0}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-base sm:text-lg text-slate-900">
                  {horasExtras} {isEs ? 'Horas Extra' : 'Extra Hours'}
                </div>
                <button 
                  type="button"
                  onClick={() => setHorasExtras(prev => Math.min(12, prev + 1))}
                  disabled={horasExtras >= 12}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 font-medium">
                {isEs ? 'Agrega las horas extras que desees ($1,600 USD por hora).' : 'Add as many extra hours as you want ($1,600 USD per hour).'}
              </span>
            </div>

          </div>

          {/* ======================================================== */}
          {/* MÓDULO DE TRANSPORTE TERRESTRE OPCIONAL                 */}
          {/* ======================================================== */}
          <div className={`border-2 rounded-2xl p-5 sm:p-6 mb-8 transition-all duration-300 ${
            incluirTransporte ? 'bg-blue-50/80 border-blue-300 shadow-sm' : 'bg-slate-50/70 border-slate-200'
          }`}>
            <div 
              onClick={() => setIncluirTransporte(prev => !prev)}
              className="flex items-start justify-between gap-4 cursor-pointer select-none"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-colors ${
                  incluirTransporte ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  <Car size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {isEs ? '¿Deseas agregar Transportación Terrestre Privada VIP?' : 'Add VIP Private Round-Trip Ground Transportation?'}
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                      incluirTransporte ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {incluirTransporte ? (isEs ? '✓ Activo' : '✓ Active') : (isEs ? 'Opcional' : 'Optional')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {isEs 
                      ? 'Traslado exclusivo ida y vuelta desde tu hotel o villa a la Marina de Cabo San Lucas en Suburban o Van de lujo. Horario 100% flexible sin tiempo límite.'
                      : 'Private round-trip SUV/Van transfer from your resort or private villa directly to Cabo San Lucas Marina. 100% flexible schedule with no time restrictions.'
                    }
                  </p>
                </div>
              </div>

              {/* Botón Switch 100% Controlado por React */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIncluirTransporte(prev => !prev);
                }}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  incluirTransporte ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={incluirTransporte}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    incluirTransporte ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Formulario de Transporte visible al activar */}
            {incluirTransporte && (
              <div className="pt-5 mt-5 border-t border-blue-200/80 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Buscador de Hotel Origen con Autocomplete */}
                <div className="flex flex-col relative md:col-span-1">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-900" />
                    {isEs ? 'Hotel o Villa de Recogida' : 'Pick-up Hotel or Villa'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={isEs ? 'Escribe tu resort...' : 'Type to search resort...'} 
                    value={busquedaOrigen} 
                    onChange={(e) => { 
                      setBusquedaOrigen(e.target.value); 
                      setMostrarDropdownHoteles(true); 
                      if (e.target.value === '') setTransporteOrigen(''); 
                    }} 
                    onFocus={() => setMostrarDropdownHoteles(true)} 
                    onBlur={() => setTimeout(() => setMostrarDropdownHoteles(false), 250)} 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-900 outline-none shadow-xs"
                  />
                  {mostrarDropdownHoteles && (
                    <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 top-[70px] max-h-56 overflow-y-auto">
                      {catalogoHoteles
                        .filter(h => (busquedaOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))))
                        .slice(0, 25)
                        .map((hotel, idx) => (
                          <li 
                            key={`${hotel.id}-${idx}`} 
                            onMouseDown={() => { 
                              const zona = hotel.zonaId || hotel.zona || "1"; 
                              setTransporteOrigen(`${hotel.nombre}|${zona}`); 
                              setBusquedaOrigen(`${hotel.nombre} (Zona ${zona})`); 
                              setMostrarDropdownHoteles(false); 
                            }} 
                            className="p-3 hover:bg-blue-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 transition flex justify-between text-xs items-center"
                          >
                            <span className="truncate pr-2 font-medium">{hotel.nombre}</span>
                            <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 whitespace-nowrap">
                              {isEs ? 'Zona' : 'Zone'} {hotel.zonaId || hotel.zona || 1}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                  {transporteOrigen && (
                    <span className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
                      <CheckCircle2 size={12} /> {isEs ? `Tarifa calculada para Zona ${transporteOrigen.split('|')[1]}` : `Rate calculated for Zone ${transporteOrigen.split('|')[1]}`}
                    </span>
                  )}
                </div>

                {/* Hora de recogida en el Hotel */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-900" />
                    {isEs ? 'Hora de recogida en Hotel' : 'Hotel Pick-up Time'}
                  </label>
                  <input 
                    type="time" 
                    value={horaRecogidaHotel} 
                    onChange={(e) => setHoraRecogidaHotel(e.target.value)} 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-900 outline-none font-medium shadow-xs"
                  />
                  <span className="text-[11px] text-slate-500 mt-1">
                    {isEs ? 'Sugerimos 45 min antes de zarpar.' : 'Suggested 45 min before cruise.'}
                  </span>
                </div>

                {/* Hora de recogida en la Marina (SIN TIEMPO LÍMITE) */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock size={14} className="text-emerald-600" />
                    {isEs ? 'Hora de regreso de la Marina (Flexible)' : 'Marina Return Time (Flexible)'}
                  </label>
                  <input 
                    type="time" 
                    value={horaRegresoMarina} 
                    onChange={(e) => setHoraRegresoMarina(e.target.value)} 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-900 outline-none font-medium shadow-xs"
                  />
                  <span className="text-[11px] text-emerald-700 mt-1 font-semibold">
                    {isEs ? '✓ Sin límite de tiempo: tú eliges la hora exacta.' : '✓ No time limit: choose your exact return schedule.'}
                  </span>
                </div>

              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RESUMEN DE COTIZACIÓN - DISEÑO ELEGANTE Y AMIGABLE       */}
          {/* (NO NEGRO: BLANCO / AZUL SUAVE DE LUJO)                  */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-br from-white via-blue-50/60 to-indigo-50/40 border-2 border-blue-200/80 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-950/5">
            
            <div className="w-full lg:w-auto text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-950 text-xs font-black uppercase tracking-wider mb-2 border border-blue-200">
                <Sparkles size={13} className="text-blue-700" />
                {isEs ? 'Inversión Total Estimada' : 'Estimated Total Investment'}
              </div>
              
              <div className="flex items-baseline justify-center lg:justify-start gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
                  ${granTotalYate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs sm:text-sm font-black text-blue-900 bg-blue-100 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-blue-200">
                  USD
                </span>
              </div>

              {/* Desglose amigable en pastillas */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-700 mt-3">
                <span className="bg-white/90 border border-slate-200/90 px-2.5 py-1 rounded-lg font-medium shadow-2xs">
                  • {paqueteSeleccionado.hours}h {isEs ? 'chárter' : 'charter'} (${paqueteSeleccionado.price.toLocaleString()} USD)
                </span>
                {huespedesExtra > 0 && (
                  <span className="bg-blue-100/70 text-blue-950 border border-blue-200 px-2.5 py-1 rounded-lg font-bold">
                    • {huespedesExtra} {isEs ? 'huéspedes extra' : 'extra guests'} (+${costoHuespedesExtra.toLocaleString()} USD)
                  </span>
                )}
                {horasExtras > 0 && (
                  <span className="bg-blue-100/70 text-blue-950 border border-blue-200 px-2.5 py-1 rounded-lg font-bold">
                    • {horasExtras}h {isEs ? 'extra' : 'extra'} (+${costoHorasExtras.toLocaleString()} USD)
                  </span>
                )}
                {incluirTransporte && (
                  <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                    • {isEs ? 'Traslado VIP Ida y Vuelta' : 'VIP Round-Trip Transfer'} (+${costoTransporte.toLocaleString()} USD)
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                {isEs ? '* Impuestos mexicanos (16% IVA) no incluidos.' : '* Mexican Sales Tax not included.'}
              </p>
            </div>

            {/* Acciones principales */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              
              <button
                type="button"
                onClick={() => handleOpenInquire(paqueteSeleccionado)}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition border-2 border-slate-200 hover:border-slate-300 shadow-xs flex items-center justify-center gap-2"
              >
                <Mail size={18} className="text-amber-600" />
                {isEs ? 'Solicitar Información' : 'Inquire Now'}
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm tracking-wide transition shadow-lg shadow-blue-600/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus size={18} className="stroke-[3]" />
                {isEs ? 'Añadir a mi Carrito' : 'Add to Cart'}
              </button>

              <a
                href={`https://wa.me/526242385150?text=${mensajeWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center shadow-md shadow-emerald-600/20 active:scale-95"
                title={isEs ? 'Chat con Concierge VIP por WhatsApp' : 'Chat with VIP Concierge on WhatsApp'}
              >
                <MessageCircle size={20} />
              </a>

            </div>

          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* DESCRIPCIÓN Y ESPECIFICACIONES COMPLETAS (TEMA CLARO)     */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Columna Izquierda: Historia y Detalles */}
          <div className="lg:col-span-7 space-y-8">
            
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'Excelencia Italiana en Cabo San Lucas' : 'Italian Excellence in Baja'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">
                {isEs 
                  ? 'La Embarcación en la que Todos Desean Estar' 
                  : 'The Vessel Everybody Wishes They Were On'
                }
              </h3>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  <strong className="text-slate-900">Capella</strong> {isEs 
                    ? 'es un majestuoso superyate Azimut-Benetti de 116 pies (35.4 metros), uno de tan solo tres ejemplares de este modelo específico construidos en todo el mundo. Este navío excepcional posee sin duda alguna el factor “WOW”. Tan pronto como subes a bordo, te encuentras rodeado de lujo, calidez y espacios diáfanos decorados con un gusto impecable.'
                    : 'is a beautiful 116 ft Azimut-Benetti yacht, one of only three of this particular model that was ever built. This fine vessel definitely has the wow factor. As soon as you step on board, you find yourself surrounded by luxury and light airy spaces decorated with impeccable taste.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'El atributo más destacado del Capella es su ingeniosa distribución: cuenta con amplias áreas sociales de concepto abierto, camarotes sumamente espaciosos, una cocina sobredimensionada para alta gastronomía y líneas elegantes que roban miradas dondequiera que navega. De hecho, nuestros huéspedes internacionales comentan sistemáticamente que se siente como un yate mucho más grande.'
                    : 'Capella’s standout feature is the layout, with ample open-plan entertaining areas, spacious staterooms, an oversize galley, and graceful lines that turn heads wherever she goes. In fact, our international guests consistently comment that she feels like a much larger yacht. No wonder this is the vessel that everybody wishes they were on.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'Cuenta con una espaciosa cubierta de popa con mesa para 12 comensales, un confortable salón con wet bar completo y comedor formal para 10 personas, un camarote principal full-beam con regadera de lluvia y tina de hidromasaje, 5 camarotes en total con baños completos revestidos en finos mármoles y cuatro cabinas para la tripulación. El pasillo principal está acabado en un hermoso mosaico artesanal que aporta un toque de distinción inigualable.'
                    : 'This fine yacht features a commodious aft deck with dining for 12, a comfortable salon with a full wet bar and dining for 10, a full beam main stateroom with a rain shower and a jacuzzi bathtub, five staterooms total with full bathrooms boasting marble accents, and four crew cabins. The companionway is finished in beautiful hand-laid mosaic tile that adds an elegant touch.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'La proa ofrece un asoleadero generoso ideal para contemplar las estrellas por la noche. La cubierta superior flybridge presume un techo corredizo retráctil, barra de bar, área de camastros para tomar el sol, jacuzzi para ocho personas y cómodos asientos para albergar holgadamente a más de 25 invitados. La cubierta superior es definitivamente el lugar favorito de nuestros huéspedes para relajarse, disfrutar canapés y saborear cócteles al aire libre.'
                    : 'The bow has an ample sunbathing pad that is ideal for stargazing at night. The upper deck boasts a retractable sunroof, a bar, a sun lounging area, a jacuzzi for eight, and generous seating that easily accommodates 25 plus guests. The upper deck is definitely the favorite area for our guests to lounge, relax, and enjoy alfresco cocktails and canapés.'
                  }
                </p>
              </div>
            </section>

            {/* Servicio y Tripulación */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="text-blue-900" size={22} />
                {isEs ? 'Servicio de Clase Mundial y Tripulación Dedicada' : 'World-Class Hospitality & Crew'}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isEs
                  ? 'Lo que distingue al Capella son sus detalles: desde recibirte con toallas frescas y perfumadas al abordar, hasta las sábanas italianas Frette en los camarotes. Nuestras azafatas anticipan cada necesidad con una sonrisa y servicio discreto, haciéndote sentir en casa mientras respetan plenamente tu privacidad.'
                  : 'What sets Capella apart are the details – from being greeted with fresh cool towels as you board, to the Frette linens in the cabins, nothing is overlooked. Our stewardesses anticipate your every need and deliver with an understated service and a smile. They are true professionals that make you feel at home whilst respecting your privacy.'
                }
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    {isEs ? 'Tripulación de 7 a Tiempo Completo' : 'Full-Time Crew of 7'}
                  </span>
                  <span className="text-slate-500">
                    {isEs ? 'Capitán experto, marineros certificados y azafatas dedicadas.' : 'Expert captain, certified deckhands, and discreet stewardesses.'}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    {isEs ? 'Chef Privado Internacional' : 'Award-Winning Private Chef'}
                  </span>
                  <span className="text-slate-500">
                    {isEs ? 'Especialista en cocina tailandesa, india, mexicana, italiana y americana.' : 'Mastering Thai, Indian, Mexican, Italian, and American gastronomy.'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Juguetes Acuáticos y Tender Pursuit */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tarjeta de Juguetes Acuáticos en Tema Claro */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">
                <Waves size={16} />
                {isEs ? 'Equipamiento Náutico Exclusivo' : 'Yacht Highlights & Toys'}
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-6">
                {isEs ? 'Boat Features & Water Toys' : 'Boat Features & Water Toys'}
              </h4>

              <div className="space-y-3.5 text-sm">
                
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    31'
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">31 ft Pursuit Fishing & Activity Tender</span>
                    <span className="text-xs text-slate-600">{isEs ? 'Equipado con dos motores Yamaha de 300 hp para pesca de altura y traslados costeros.' : 'Powered by twin Yamaha 300hp outboards for big game fishing and coastal tenders.'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>12 ft Dinghy</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>2 Seabobs (Diving Scooters)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Dive Compressor on board</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>4 Stand Up Paddle Boards</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>2 Ocean Kayaks</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Professional Fishing Gear</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>High-End Snorkel Sets</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Various Floaties & Mats</span>
                  </div>
                </div>

              </div>

              {/* Banner de Salida en Marina */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
                <MapPin className="text-blue-900 shrink-0" size={20} />
                <div>
                  <span className="font-bold text-slate-900 block">{isEs ? 'Muelle Exclusivo en Marina Cabo San Lucas' : 'Exclusive Slip in Cabo San Lucas Marina'}</span>
                  <span>{isEs ? 'Zarpe puntual sin filas ni demoras. Acceso directo y seguro.' : 'Seamless embarkation with VIP gate access and no delays.'}</span>
                </div>
              </div>
            </div>

            {/* Testimonial / Review VIP */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-xs text-slate-600 space-y-3 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="italic leading-relaxed text-slate-700 font-medium">
                "{isEs
                  ? 'Navegar en el Capella superó todas nuestras expectativas. La atención del chef, el jacuzzi al atardecer frente al Arco de Cabo San Lucas y la facilidad con la que nos coordinaron el transporte desde el hotel hicieron que fuera el punto culminante de nuestro viaje.'
                  : 'Cruising on Capella exceeded every single expectation. The private chef’s multi-course meal, the upper deck jacuzzi at sunset by Land’s End, and the seamless private transportation made it the undisputed highlight of our vacation.'
                }"
              </p>
              <div className="font-bold text-slate-900">
                — Charles M., Charter Guest (Silicon Valley, CA)
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SECCIÓN SEO FAQ (PREGUNTAS FRECUENTES EN CLARO)          */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2 border border-blue-200">
            <Info size={14} />
            {isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEs ? 'Todo lo que necesitas saber para tu chárter en Los Cabos' : 'Everything You Need to Know for Your Cabo Yacht Rental'}
          </h3>
        </div>

        <div className="space-y-4">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between text-base">
              <span>{isEs ? '¿De dónde zarpa el yate Capella 116ft?' : 'Where does the 116ft Capella yacht depart from?'}</span>
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs 
                ? 'El Capella se encuentra atracado en la prestigiosa Marina de Cabo San Lucas. Te proporcionaremos el número exacto de muelle y las indicaciones de llegada. Además, puedes agregar nuestro servicio de transportación terrestre privada de ida y vuelta directamente desde cualquier hotel o villa en Los Cabos.'
                : 'Capella is moored in the world-class Marina Cabo San Lucas. Full dock coordinates and VIP gate access instructions are provided upon booking. You can also select our private round-trip ground transportation directly from any resort or villa in Los Cabos.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between text-base">
              <span>{isEs ? '¿Qué incluye la barra libre y la comida del chef?' : 'What is included in the open bar and chef menu?'}</span>
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Todos los paquetes incluyen barra libre premium internacional con tequilas selectos, licores, cerveza fría, vino y cócteles preparados al momento. Los paquetes de 4, 6 y 8 horas incluyen comida personalizada de varios tiempos diseñada por nuestro chef ejecutivo galardonado según tus preferencias y restricciones dietéticas.'
                : 'All packages include a top-shelf international open bar featuring premium tequilas, spirits, ice-cold Mexican and imported beer, wine, and craft cocktails. Charters of 4, 6, and 8 hours feature multi-course custom dining prepared fresh onboard by our award-winning private chef according to your culinary preferences.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between text-base">
              <span>{isEs ? '¿Puedo llevar más de 10 personas a bordo?' : 'Can we bring more than 10 guests on board?'}</span>
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? '¡Por supuesto! El precio base incluye hasta 10 invitados. Cada huésped adicional tiene un costo de $300 USD por persona (con un máximo de 20 personas en el paseo Sunset y hasta 25 personas en los chárters de 4, 6 y 8 horas).'
                : 'Yes! The standard package price covers up to 10 guests. Additional guests are welcomed at $300 USD each, accommodating up to 20 guests on the Sunset cruise and up to 25 guests on the 4, 6, and 8-hour all-inclusive charters.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between text-base">
              <span>{isEs ? '¿Cómo funciona la transportación terrestre?' : 'How does the optional ground transportation work?'}</span>
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Nuestra transportación terrestre privada te recoge directamente en el lobby de tu resort o villa en unidades de lujo con aire acondicionado y chofer bilingüe. A diferencia de otros servicios, no imponemos límites de tiempo en el horario: tú defines la hora de salida del hotel y la hora exacta de regreso de la marina.'
                : 'Our private chauffeured ground transportation picks you up directly from your resort or villa lobby in luxury air-conditioned SUVs or executive vans. Unlike restrictive services, we impose zero wait time limits: you choose your exact hotel departure and flexible marina return times.'
              }
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL INQUIRE (EXACTO A LA IMAGEN 3 DEL USUARIO)          */}
      {/* ======================================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto border border-slate-200">
            
            {/* Botón Cerrar */}
            <button 
              onClick={() => {
                setModalAbierto(false);
                setInquiryEnviado(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition p-1 rounded-full hover:bg-slate-100"
            >
              <X size={22} />
            </button>

            {inquiryEnviado ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {isEs ? '¡Solicitud Recibida!' : 'Inquiry Received!'}
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  {isEs 
                    ? `Gracias ${inquireData.firstName}. Nuestro equipo VIP concierge de Ballard Tours se comunicará contigo a la brevedad para confirmar disponibilidad y los detalles de tu chárter en el Capella.`
                    : `Thank you ${inquireData.firstName}. Our VIP concierge team at Ballard Tours will get in touch with you shortly to confirm availability and itinerary details aboard Capella.`
                  }
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/526242385150?text=${mensajeWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    {isEs ? 'Contactar por WhatsApp ahora' : 'Chat on WhatsApp now'}
                  </a>
                  <button
                    onClick={() => {
                      setModalAbierto(false);
                      setInquiryEnviado(false);
                    }}
                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
                  >
                    {isEs ? 'Cerrar Ventana' : 'Close Window'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header del Modal idéntico a la imagen 3 */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-[#003865] tracking-tight">
                    {isEs ? 'Solicitar Información' : 'Inquire'}
                  </h3>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    116ft Azimut-Benetti "Capella"
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
                    {isEs 
                      ? 'Si estás interesado en reservar este yate o deseas más información por favor déjanos un mensaje aquí' 
                      : 'If you are interested to book this yacht or just want more information please leave us a message here'
                    }
                  </p>
                  <div className="w-full h-px bg-slate-200 mt-4"></div>
                </div>

                <form onSubmit={handleSubmitInquire} className="space-y-4 text-left">
                  
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input 
                        type="text" 
                        required 
                        placeholder={isEs ? 'Nombre' : 'First Name'} 
                        value={inquireData.firstName} 
                        onChange={(e) => setInquireData({ ...inquireData, firstName: e.target.value })} 
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        required 
                        placeholder={isEs ? 'Apellido' : 'Last Name'} 
                        value={inquireData.lastName} 
                        onChange={(e) => setInquireData({ ...inquireData, lastName: e.target.value })} 
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <input 
                      type="date" 
                      required 
                      value={inquireData.date} 
                      onChange={(e) => setInquireData({ ...inquireData, date: e.target.value })} 
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#003865] outline-none"
                    />
                  </div>

                  {/* Phone Number con Selector de Código de País */}
                  <div className="flex gap-2">
                    <select
                      value={inquireData.phoneCode}
                      onChange={(e) => setInquireData({ ...inquireData, phoneCode: e.target.value })}
                      className="p-3 border border-slate-300 rounded-lg text-sm text-slate-800 bg-slate-50 focus:ring-2 focus:ring-[#003865] outline-none shrink-0"
                    >
                      {POPULAR_COUNTRY_CODES.map(code => {
                        const c = COUNTRIES.find(x => x.code === code);
                        return c ? <option key={c.code} value={c.dialCode}>{c.flag} {c.dialCode}</option> : null;
                      })}
                      <option disabled>──────────</option>
                      {COUNTRIES.filter(x => !POPULAR_COUNTRY_CODES.includes(x.code)).map(c => (
                        <option key={c.code} value={c.dialCode}>{c.flag} {c.dialCode} ({c.name})</option>
                      ))}
                    </select>
                    
                    <input 
                      type="tel" 
                      required 
                      placeholder={isEs ? 'Número de Teléfono' : 'Phone Number'} 
                      value={inquireData.phoneNumber} 
                      onChange={(e) => setInquireData({ ...inquireData, phoneNumber: e.target.value })} 
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <input 
                      type="email" 
                      required 
                      placeholder={isEs ? 'Correo Electrónico' : 'Email'} 
                      value={inquireData.email} 
                      onChange={(e) => setInquireData({ ...inquireData, email: e.target.value })} 
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none"
                    />
                  </div>

                  {/* How did you hear about us? */}
                  <div>
                    <label className="text-xs text-slate-600 font-semibold mb-1 block">
                      {isEs ? '¿Cómo se enteró de nosotros?' : 'How did you hear about us?'}
                    </label>
                    <select 
                      value={inquireData.source} 
                      onChange={(e) => setInquireData({ ...inquireData, source: e.target.value })} 
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:ring-2 focus:ring-[#003865] outline-none"
                    >
                      <option value="Word of mouth">{isEs ? 'Recomendación de boca en boca' : 'Word of mouth'}</option>
                      <option value="Google search">{isEs ? 'Búsqueda en Google' : 'Google search'}</option>
                      <option value="Social media">{isEs ? 'Redes sociales (Instagram / Facebook)' : 'Social media'}</option>
                      <option value="Hotel concierge">{isEs ? 'Concierge de Hotel / Villa' : 'Hotel concierge'}</option>
                      <option value="Returning customer">{isEs ? 'Cliente recurrente' : 'Returning customer'}</option>
                    </select>
                  </div>

                  {/* Your Message */}
                  <div>
                    <textarea 
                      rows={4} 
                      placeholder={isEs ? 'Escribe aquí tu mensaje, solicitudes de menú o preguntas...' : 'Your Message'} 
                      value={inquireData.message} 
                      onChange={(e) => setInquireData({ ...inquireData, message: e.target.value })} 
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none resize-none"
                    />
                  </div>

                  {/* Resumen del paquete dentro del modal */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                    <span>
                      <strong>{isEs ? 'Paquete seleccionado:' : 'Selected Package:'}</strong> {isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn} ({totalHuespedes} pax)
                    </span>
                    <span className="font-extrabold text-[#003865] text-sm">
                      ${granTotalYate.toLocaleString()} USD
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-2">
                    <button 
                      type="submit" 
                      disabled={enviandoInquiry}
                      className="w-full sm:w-auto min-w-[160px] py-3 px-8 bg-[#003865] hover:bg-[#002244] text-white font-extrabold text-sm tracking-wider rounded-lg transition shadow-sm disabled:opacity-50"
                    >
                      {enviandoInquiry ? (isEs ? 'Enviando...' : 'Submitting...') : (isEs ? 'Enviar Solicitud' : 'Submit')}
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIGHTBOX DE FOTOS EN PANTALLA COMPLETA                   */}
      {/* ======================================================== */}
      {lightboxAbierto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
          <div className="flex justify-between items-center text-white">
            <div className="text-sm font-semibold">
              <span className="text-blue-400 font-bold">{fotoActiva + 1}</span> / {fotosGaleria.length} • Capella 116ft
            </div>
            <button 
              onClick={() => setLightboxAbierto(false)} 
              className="p-2 text-white hover:text-blue-400 transition rounded-full bg-white/10"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img 
              src={fotosGaleria[fotoActiva].src} 
              alt={fotosGaleria[fotoActiva].titleEn} 
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-xs sm:text-sm">
            <div className="text-center sm:text-left">
              <h5 className="font-bold text-white text-base">
                {isEs ? fotosGaleria[fotoActiva].titleEs : fotosGaleria[fotoActiva].titleEn}
              </h5>
              <p className="text-slate-400">
                {isEs ? fotosGaleria[fotoActiva].descEs : fotosGaleria[fotoActiva].descEn}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFotoActiva(prev => (prev === 0 ? fotosGaleria.length - 1 : prev - 1))}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition font-bold"
              >
                ← {isEs ? 'Anterior' : 'Previous'}
              </button>
              <button 
                onClick={() => setFotoActiva(prev => (prev === fotosGaleria.length - 1 ? 0 : prev + 1))}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition font-bold"
              >
                {isEs ? 'Siguiente' : 'Next'} →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Icono auxiliar para la cámara
function CameraIcon({ size = 16, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
