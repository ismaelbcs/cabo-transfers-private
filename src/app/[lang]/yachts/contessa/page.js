// src/app/[lang]/yachts/contessa/page.js
'use client';

import React, { useState, useMemo, use, useEffect } from 'react';
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
  ChevronRight,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../../../context/CartContext';
import { catalogoHoteles } from '../../../../data/seoData';
import { COUNTRIES, POPULAR_COUNTRY_CODES } from '../../../../data/countryCallingCodes';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { sendEmail } from '../../../../utils/sendEmail';
import TrustedPartners from '../../../../components/TrustedPartners';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';

export default function ContessaYachtPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const { agregarAlCombo } = useCart();

  // ==========================================
  // CONFIGURACIÓN DE PAQUETES - CONTESSA 85FT (PRECIOS ACTUALIZADOS)
  // Regla: +$1,000 USD al paquete, +$50 USD por huésped extra, +$100 USD a hora extra
  // ==========================================
  const paquetes = [
    {
      id: 'cruise-2',
      nameEn: '2 HOUR CRUISE',
      nameEs: '2 HORAS DE CRUCERO',
      hours: 2,
      price: 3700, // Original $2,700 + $1,000
      baseGuests: 10,
      maxGuests: 18, // 10 base + 8 extra max
      extraMax: 8,
      extraGuestPrice: 150, // Original $100 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Cruise past El Arco and Land’s End aboard the 85ft Contessa while enjoying fresh appetizers, open bar beverages, and custom meal selections.',
      descriptionEs: 'Navega frente al icónico Arco y Finisterra a bordo del Contessa de 85 pies disfrutando de bocadillos frescos, barra libre y menú personalizado.'
    },
    {
      id: 'all-inclusive-4',
      nameEn: '4 HOURS ALL INCLUSIVE',
      nameEs: '4 HORAS TODO INCLUIDO',
      hours: 4,
      price: 5000, // Original $4,000 + $1,000
      baseGuests: 10,
      maxGuests: 18,
      extraMax: 8,
      extraGuestPrice: 175, // Original $125 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'The ideal private charter in Cabo San Lucas. Visit the Arch, anchor in turquoise bays for paddleboarding and snorkeling, and dine al fresco on the spacious aft deck.',
      descriptionEs: 'El chárter privado ideal en Cabo San Lucas. Visita el Arco, ancla en bahías turquesa para hacer paddleboard y esnórquel, y disfruta de una comida al aire libre en popa.'
    },
    {
      id: 'all-inclusive-6',
      nameEn: '6 HOURS ALL INCLUSIVE',
      nameEs: '6 HORAS TODO INCLUIDO',
      hours: 6,
      price: 6000, // Original $5,000 + $1,000
      baseGuests: 10,
      maxGuests: 18,
      extraMax: 8,
      extraGuestPrice: 200, // Original $150 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Extended voyage into the Sea of Cortez toward Santa María or Chileno Bay. Plenty of time for stand-up fishing, water sports, sunbathing on the bow, and multi-course dining.',
      descriptionEs: 'Travesía extendida por el Mar de Cortés hacia Bahía Santa María o Chileno. Tiempo de sobra para pesca deportiva stand-up, deportes acuáticos, sol en proa y alta gastronomía.'
    },
    {
      id: 'all-inclusive-8',
      nameEn: '8 HOURS ALL INCLUSIVE',
      nameEs: '8 HORAS TODO INCLUIDO',
      hours: 8,
      price: 7000, // Original $6,000 + $1,000
      baseGuests: 10,
      maxGuests: 18,
      extraMax: 8,
      extraGuestPrice: 225, // Original $175 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: true, // Tag "Most Popular"
      descriptionEn: 'The ultimate full-day Sea of Cortez expedition. Explore secluded Baja coves, stand-up sportfishing with Penn & Avet tackle, paddleboarding, snorkeling, and sunset dining.',
      descriptionEs: 'La máxima expedición de día completo en el Mar de Cortés. Explora calas secretas de Baja, pesca deportiva con equipo Penn y Avet, paddleboard, esnórquel y cena al atardecer.'
    }
  ];

  // ==========================================
  // ESTADOS DEL CONFIGURADOR / CALCULADORA
  // ==========================================
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(paquetes[3]); // 8 Horas por defecto
  const [charterFecha, setCharterFecha] = useState('');
  const [totalHuespedes, setTotalHuespedes] = useState(10);
  const [horasExtras, setHorasExtras] = useState(0);
  const PRECIO_HORA_EXTRA = 850; // Base $750 + $100 USD

  // Estados de Transportación Terrestre (Basado en la lógica de Golf / Capella)
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

  // Cálculo del Costo de Huéspedes Adicionales ($150 / $175 / $200 / $225 USD c/u según paquete)
  const huespedesExtra = Math.max(0, totalHuespedes - paqueteSeleccionado.baseGuests);
  const costoHuespedesExtra = huespedesExtra * paqueteSeleccionado.extraGuestPrice;

  // Cálculo de Horas Extras ($850 USD c/u)
  const costoHorasExtras = horasExtras * PRECIO_HORA_EXTRA;

  // Gran Total
  const granTotalYate = paqueteSeleccionado.price + costoHuespedesExtra + costoHorasExtras + costoTransporte;

  // ==========================================
  // ESTADOS DEL MODAL "INQUIRE"
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
  // GALERÍA DE FOTOS DEL YATE CONTESSA 85FT
  // (Se actualizará con las imágenes del barco que suba el usuario)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/yachts/capella-aerial-overview.jpg',
      titleEn: '85ft Her Shine Marine "Contessa" Cruising the Sea of Cortez',
      titleEs: 'Yate Contessa de 85ft Her Shine Marine Navegando el Mar de Cortés',
      descEn: 'Spacious and impeccably maintained 85ft luxury charter yacht, ideal for exploring Cabo San Lucas and the Sea of Cortez.',
      descEs: 'Espacioso e impecablemente mantenido yate de lujo de 85 pies, ideal para explorar Cabo San Lucas y el Mar de Cortés.',
      labelEn: 'Aerial View',
      labelEs: 'Vista Aérea'
    },
    {
      src: '/yachts/capella-aft-deck-dining.jpg',
      titleEn: 'Ample Aft Deck with Al Fresco Dining & Double Swim Platform Stairs',
      titleEs: 'Amplia Cubierta de Popa para Comedor al Aire Libre y Doble Escalera',
      descEn: 'Double stairs lead from the swim platform up to the ample aft deck, perfect for al fresco dining with family and friends.',
      descEs: 'Dobles escaleras conducen desde la plataforma de nado hacia la amplia cubierta de popa, perfecta para comer al aire libre.',
      labelEn: 'Aft Dining',
      labelEs: 'Comedor Popa'
    },
    {
      src: '/yachts/capella-main-salon.jpg',
      titleEn: 'Open-Plan Salon with Fine Cherry Wood & Leather Crescent Sofas',
      titleEs: 'Salón de Concepto Abierto con Madera de Cerezo y Sofás de Piel',
      descEn: 'Two crescent-shaped leather sofas, fine cherry wood interior, U-shaped dinette, formal dining for 8, and 55" curved HD TV.',
      descEs: 'Dos sofás curvos encontrados en piel fina, interior de madera de cerezo, comedor formal para 8 y pantalla curva HD de 55".',
      labelEn: 'Main Salon',
      labelEs: 'Salón Principal'
    },
    {
      src: '/yachts/capella-flybridge-sky-lounge.jpg',
      titleEn: 'Shaded Upper Deck Accessed by Twin Curved Stairs',
      titleEs: 'Cubierta Superior Sombreada con Acceso por Doble Escalera Curva',
      descEn: 'Ample upper deck offering abundant shade, refreshing sea breeze, and Fusion surround sound system.',
      descEs: 'Amplia cubierta superior con abundante sombra, brisa marina refrescante y sonido envolvente Fusion.',
      labelEn: 'Upper Deck',
      labelEs: 'Cubierta Sup.'
    },
    {
      src: '/yachts/capella-bow-lounge-terrace.jpg',
      titleEn: 'Tranquil Bow Sunbathing Area & Walk-Around Deck',
      titleEs: 'Tranquilo Asoleadero en Proa y Cubierta Walk-Around Completa',
      descEn: 'Complete walk-around deck with high gunwale and a tranquil sunbathing sanctuary on Contessa’s bow.',
      descEs: 'Cubierta walk-around completa con borda alta y una tranquila zona para tomar el sol en la proa del Contessa.',
      labelEn: 'Bow Sunbed',
      labelEs: 'Proa'
    },
    {
      src: '/yachts/capella-master-stateroom.jpg',
      titleEn: 'Full-Beam Master & VIP Staterooms with Queen Beds',
      titleEs: 'Camarotes Master y VIP Full-Beam con Camas Queen y Baño Privado',
      descEn: 'Full-beam master stateroom with queen bed, walk-in closet, and large shower, plus full-beam aft VIP suite and two twin cabins.',
      descEs: 'Camarote principal de manga completa con cama queen y vestidor, más suite VIP en popa y dos camarotes twin con baño propio.',
      labelEn: 'Staterooms',
      labelEs: 'Camarotes'
    }
  ];

  // ==========================================
  // NAVEGACIÓN INFINITA DE FOTOS (CARRUSEL INFINITO)
  // ==========================================
  const handleNextPhoto = () => {
    setFotoActiva(prev => (prev === fotosGaleria.length - 1 ? 0 : prev + 1));
  };

  const handlePrevPhoto = () => {
    setFotoActiva(prev => (prev === 0 ? fotosGaleria.length - 1 : prev - 1));
  };

  // ==========================================
  // SOPORTE PARA GESTOS TÁCTILES (SWIPE EN CELULARES)
  // ==========================================
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const minSwipeDistance = 45;

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      handleNextPhoto();
    } else if (distance < -minSwipeDistance) {
      handlePrevPhoto();
    }
  };

  // ==========================================
  // NAVEGACIÓN POR TECLADO (FLECHAS IZQ/DER Y ESCAPE)
  // ==========================================
  useEffect(() => {
    if (!lightboxAbierto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'Escape') {
        setLightboxAbierto(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxAbierto, fotosGaleria.length]);

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

    const emailSubject = `NUEVA CONSULTA DE YATE: Contessa 85ft - ${inquireData.firstName} ${inquireData.lastName}`;
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: #0f172a; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Ballard Tours • Private Yacht Charters</h1>
            <p style="color: #0284c7; margin: 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">85ft Her Shine Marine "Contessa"</p>
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
            Solicitud generada a través de caboprivateairporttransfers.com / Contessa 85ft
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
          yachtName: '85ft Her Shine Marine Contessa',
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
      id: `yacht-contessa-${Date.now()}`,
      titulo: isEs ? `Chárter en Yate Contessa 85ft (${paqueteSeleccionado.nameEs})` : `Contessa 85ft Yacht Charter (${paqueteSeleccionado.nameEn})`,
      subtitulo: isEs 
        ? `${totalHuespedes} Pasajeros | ${paqueteSeleccionado.hours} Horas${horasExtras > 0 ? ` + ${horasExtras}h extra` : ''} | Fecha: ${charterFecha || 'Por confirmar'}${incluirTransporte ? ` | Con Traslado VIP desde ${busquedaOrigen}` : ''}`
        : `${totalHuespedes} Guests | ${paqueteSeleccionado.hours} Hours${horasExtras > 0 ? ` + ${horasExtras}h extra` : ''} | Date: ${charterFecha || 'To be confirmed'}${incluirTransporte ? ` | VIP Round-Trip Transfer from ${busquedaOrigen}` : ''}`,
      precio: granTotalYate,
      tipoEspecial: 'yacht',
      config: {
        yachtName: 'Contessa 85ft Her Shine Marine',
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
      ? `Hola Ballard Tours, deseo consultar disponibilidad para el Yate Contessa 85ft Her Shine Marine.\n- Paquete: ${paqueteSeleccionado.nameEs} ($${paqueteSeleccionado.price.toLocaleString()} USD)\n- Huéspedes: ${totalHuespedes}\n- Fecha estimada: ${charterFecha || 'Por coordinar'}\n- Horas extras: ${horasExtras}\n- Traslado terrestre: ${incluirTransporte ? `SÍ (${busquedaOrigen || 'Hotel'})` : 'NO'}\n- Cotización estimada: $${granTotalYate.toLocaleString()} USD.\n¿Me pueden confirmar horarios y detalles?`
      : `Hello Ballard Tours, I would like to check availability for the 85ft Her Shine Marine Yacht "Contessa".\n- Package: ${paqueteSeleccionado.nameEn} ($${paqueteSeleccionado.price.toLocaleString()} USD)\n- Guests: ${totalHuespedes}\n- Target Date: ${charterFecha || 'TBD'}\n- Extra hours: ${horasExtras}\n- Ground Transfer: ${incluirTransporte ? `YES (${busquedaOrigen || 'Hotel'})` : 'NO'}\n- Estimated Quote: $${granTotalYate.toLocaleString()} USD.\nPlease let me know availability.`
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      
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
              <Link href={`/${lang}/cabo-yacht-charters`} className="hover:text-blue-600 transition text-slate-400">
                {isEs ? 'Yates de Lujo' : 'Luxury Yachts'}
              </Link>
              <span>/</span>
              <span className="text-blue-900 font-extrabold">85ft Her Shine Marine "Contessa"</span>
            </div>

            <div className="flex justify-center items-center gap-4 mb-3 text-slate-400">
              <Ship size={24} className="text-blue-900" />
              <span className="border-t border-dashed border-slate-300 w-16"></span>
              <MapPin size={24} className="text-amber-500" />
            </div>

            {/* Título Principal H1 con palabras clave SEO */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-tight text-slate-900">
              {isEs ? 'Contessa – Renta de Yate de Lujo 85ft en Cabo San Lucas' : 'Contessa – 85 Ft Her Shine Marine Luxury Yacht Charter in Cabo'}
            </h1>
            
            <HeroReviewsBadge lang={lang} />

            <p className="text-base sm:text-lg md:text-xl text-blue-900 font-extrabold mt-3 max-w-3xl mx-auto leading-relaxed">
              {isEs 
                ? 'Ideal para Explorar las Maravillas del Mar de Cortés con Máximo Confort y Estabilidad.'
                : 'Ideal for Exploring the Wonders of the Sea of Cortez.'
              }
            </p>

            <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl mx-auto leading-relaxed font-normal">
              {isEs
                ? 'Contessa se mantiene en condiciones impecables y recientemente recibió una remodelación integral con mejoras de primer nivel para realzar el confort de sus huéspedes. Espaciosa, estable y sumamente cómoda, es un yate de chárter incomparable en Los Cabos: la embarcación ideal para paseos de un día y absolutamente perfecta para travesías nocturnas o de una semana por el Mar de Cortés.'
                : 'Contessa is impeccably maintained and had comprehensive refits recently with upgrades to enhance guests’ comfort. Spacious and commodious, she is an incomparable Cabo charter yacht. This is the ideal vessel for day trips, and absolutely perfect for overnight and week trips on the Sea of Cortez.'
              }
            </p>
          </div>

          {/* Selector de Galería de Fotos Reales con Visor Grande */}
          <div className="mt-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4 text-xs text-slate-600">
              <span className="font-extrabold flex items-center gap-1.5 text-sm sm:text-base text-slate-900">
                <CameraIcon size={18} className="text-blue-600" />
                {isEs ? 'Galería del Yate Contessa 85ft' : '85ft Contessa Yacht Photo Gallery'}
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

            {/* VISOR PRINCIPAL DE FOTO GRANDE */}
            <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200/90 bg-slate-900 group mb-4">
              <div 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative aspect-[16/9] sm:aspect-[16/9] md:h-[480px] w-full overflow-hidden bg-slate-100 touch-pan-y"
              >
                <img 
                  key={fotosGaleria[fotoActiva].src}
                  src={fotosGaleria[fotoActiva].src} 
                  alt={isEs 
                    ? `Contessa 85-foot Her Shine Marine renta de yate de lujo en Cabo San Lucas, Los Cabos, México - ${fotosGaleria[fotoActiva].titleEs}`
                    : `Contessa 85-foot Her Shine Marine luxury yacht charter in Cabo San Lucas, Los Cabos, Mexico - ${fotosGaleria[fotoActiva].titleEn}`
                  } 
                  className="w-full h-full object-cover transition-all duration-500 ease-out select-none"
                  draggable={false}
                />
                
                {/* Gradiente inferior para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

                {/* Flecha Anterior */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPhoto();
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
                    handleNextPhoto();
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
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {fotosGaleria.map((foto, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFotoActiva(idx)}
                  className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                    fotoActiva === idx 
                      ? 'border-blue-600 ring-4 ring-blue-500/25 scale-[1.03] shadow-md z-10' 
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
      {/* TRUSTED PARTNERS                                         */}
      {/* ======================================================== */}
      <TrustedPartners lang={lang} className="mb-12 rounded-2xl mx-4 max-w-7xl lg:mx-auto" />

      {/* ======================================================== */}
      {/* QUICK HIGHLIGHTS BAR (ESPECIFICACIONES RÁPIDAS EN CLARO) */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Ship className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Eslora / Astillero' : 'Length & Builder'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">85 Ft Her Shine</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Users className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Capacidad' : 'Guest Capacity'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? 'Hasta 18 Personas' : 'Up to 18 Guests'}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Compass className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Motores' : 'Engines'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">Twin Cat 3412</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Waves className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Deportes y Pesca' : 'Fishing & SUP'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? '4 SUPs + Pesca Pro' : '4 SUPs + Stand-Up'}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Sparkles className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Camarotes' : 'Staterooms'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? '4 Suites con Baño' : '4 En-Suite Cabins'}</p>
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
              ? 'Tarifas base para hasta 10 invitados. Permite hasta 8 huéspedes extra a bordo (18 personas máx.).'
              : 'Base rates for up to 10 guests. Allows up to 8 extra guests on board (18 guests max).'
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
                <div className={`${pkg.popular ? 'bg-[#003865]' : 'bg-[#0066b2]'} text-white py-3.5 px-4 text-center`}>
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
                        ${pkg.extraGuestPrice} {isEs ? `c/u (${pkg.extraMax} máx)` : `each (${pkg.extraMax} max)`}
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

        {/* Nota de Huéspedes Adicionales idéntica a la captura 2 */}
        <p className="text-center text-xs sm:text-sm text-slate-600 italic mt-8 max-w-3xl mx-auto">
          {isEs
            ? 'Esta embarcación permite hasta 8 huéspedes extra a bordo; cada huésped adicional tiene un cargo de $150, $175, $200 o $225 USD + Impuestos dependiendo del paquete seleccionado. Impuesto mexicano del 16% (IVA) no incluido.'
            : 'This boat allows for 8 extra guests on board; each extra guest is charged at $150, $175, $200 or $225 + Tax depending on the package selected. Mexican Sales Tax of 16% not included.'
          }
        </p>
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
                {isEs ? 'Configura tu Chárter en el Contessa 85ft' : 'Configure Your Contessa 85ft Charter'}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {isEs 
                  ? 'Añade invitados adicionales (hasta 8 extra / 18 total), horas extras y servicio de traslado privado ida y vuelta desde tu resort.'
                  : 'Add extra guests (up to 8 extra / 18 total), additional charter hours, and round-trip private resort ground transfers.'
                }
              </p>
            </div>

            {/* Cuadrito Interactivo para Modificar el Paquete */}
            <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-3.5 sm:p-4 w-full md:w-auto md:min-w-[340px] lg:min-w-[380px] shadow-2xs shrink-0">
              <label htmlFor="select-paquete-cuadrito" className="text-[11px] text-blue-900 font-extrabold uppercase tracking-wider block mb-1.5 flex items-center justify-between sm:justify-end gap-1.5">
                <span>{isEs ? 'Modificar Paquete Activo' : 'Active Package (Change)'}</span>
                <ChevronDown size={14} className="text-blue-900 shrink-0" />
              </label>
              <div className="relative">
                <select 
                  id="select-paquete-cuadrito"
                  value={paqueteSeleccionado.id} 
                  onChange={(e) => {
                    const selected = paquetes.find(p => p.id === e.target.value);
                    if (selected) {
                      setPaqueteSeleccionado(selected);
                    }
                  }}
                  className="w-full bg-white border border-blue-300 text-blue-950 font-black text-xs sm:text-sm rounded-xl px-3 py-2.5 cursor-pointer focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-xs transition hover:border-blue-500"
                >
                  {paquetes.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {isEs ? pkg.nameEs : pkg.nameEn} — ${pkg.price.toLocaleString()} USD
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1 font-medium sm:text-right">
                {isEs ? 'Haz clic aquí para cambiar de opción' : 'Click here to switch package'}
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3 COLUMNAS DEL CONFIGURADOR PERFECTAMENTE ALINEADAS      */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
            
            {/* 1. Selector de Fecha */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <label htmlFor="charter-fecha-input" className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                  <Calendar size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Fecha de navegación' : 'Charter Date'}</span>
                </label>
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  {isEs ? 'Seleccionar día' : 'Select day'}
                </span>
              </div>
              
              <div className="h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 flex items-center focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 transition">
                <input 
                  id="charter-fecha-input"
                  type="date" 
                  value={charterFecha} 
                  onChange={(e) => setCharterFecha(e.target.value)} 
                  className="w-full bg-transparent text-slate-800 outline-none text-sm font-semibold cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs 
                  ? 'Elige la fecha deseada para confirmar disponibilidad.' 
                  : 'Select desired date to check yacht availability.'
                }
              </p>
            </div>

            {/* 2. Selector de Huéspedes Totales (Máx 18: 10 base + 8 extra) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Users size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Total de Huéspedes' : 'Total Guests'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {huespedesExtra > 0 
                    ? `+${huespedesExtra} extra (+$${costoHuespedesExtra.toLocaleString()} USD)` 
                    : (isEs ? '10 base incl.' : '10 base incl.')}
                </span>
              </div>
              
              <div className="h-[52px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-1.5 transition">
                <button 
                  type="button"
                  onClick={() => setTotalHuespedes(prev => Math.max(1, prev - 1))}
                  disabled={totalHuespedes <= 1}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Decrease Guests"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-sm sm:text-base text-slate-900">
                  {totalHuespedes} {isEs ? 'Personas' : 'Guests'}
                </div>
                <button 
                  type="button"
                  onClick={() => setTotalHuespedes(prev => Math.min(18, prev + 1))}
                  disabled={totalHuespedes >= 18}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Increase Guests"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs 
                  ? `Tarifa cubre 10 personas. De 11 a 18 suma $${paqueteSeleccionado.extraGuestPrice} USD c/u (8 extra máx).` 
                  : `Rate covers 10 guests. From 11 to 18 adds $${paqueteSeleccionado.extraGuestPrice} USD each (8 extra max).`
                }
              </p>
            </div>

            {/* 3. Selector de Horas Extras */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Clock size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Horas Extras' : 'Extra Hours'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {horasExtras > 0 
                    ? `+${horasExtras}h (+$${costoHorasExtras.toLocaleString()} USD)` 
                    : `$${PRECIO_HORA_EXTRA} USD/hr`}
                </span>
              </div>

              <div className="h-[52px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-1.5 transition">
                <button 
                  type="button"
                  onClick={() => setHorasExtras(prev => Math.max(0, prev - 1))}
                  disabled={horasExtras <= 0}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Decrease Extra Hours"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-sm sm:text-base text-slate-900">
                  {horasExtras} {isEs ? 'Horas Extra' : 'Extra Hours'}
                </div>
                <button 
                  type="button"
                  onClick={() => setHorasExtras(prev => Math.min(12, prev + 1))}
                  disabled={horasExtras >= 12}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Increase Extra Hours"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs 
                  ? `Agrega las horas extras que desees ($${PRECIO_HORA_EXTRA} USD por hora).` 
                  : `Add as many extra hours as you want ($${PRECIO_HORA_EXTRA} USD per hour).`
                }
              </p>
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
                {isEs ? '* Impuestos mexicanos (16% IVA) no incluidos.' : '* Mexican Sales Tax (16%) not included.'}
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
                href={`https://wa.me/526121943286?text=${mensajeWhatsApp}`}
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
        
        {/* FILA 1: DETALLES DE LUJO Y EQUIPAMIENTO DEPORTIVO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Columna Izquierda: Descripción, Salón, Camarotes y Cubiertas */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Sección 1: Descripción General y Salón */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'Descripción del Yate' : 'Description'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">
                {isEs 
                  ? 'Ideal para Explorar las Maravillas del Mar de Cortés' 
                  : 'Ideal for Exploring the Wonders of the Sea of Cortez'
                }
              </h2>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  <strong className="text-slate-900">Contessa</strong> {isEs 
                    ? 'se mantiene en condiciones impecables y ha recibido remodelaciones integrales recientemente con actualizaciones pensadas para realzar el confort de nuestros huéspedes. Espaciosa y sumamente cómoda, es un yate de chárter incomparable en Los Cabos. Es la embarcación ideal para excursiones de un día y absolutamente perfecta para viajes nocturnos o de una semana por el Mar de Cortés.'
                    : 'is impeccably maintained and had comprehensive refits recently with upgrades to enhance guests’ comfort. Spacious and commodious, she is an incomparable Cabo charter yacht. This is the ideal vessel for day trips, and absolutely perfect for overnight and week trips on the Sea of Cortez.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'Dobles escaleras conducen desde la plataforma de nado hacia la amplia cubierta de popa, perfecta para disfrutar de cenas al aire libre (al fresco). El salón del Contessa cuenta con un gran diseño de concepto abierto que brinda abundantes asientos para familiares y amigos. Dos sofás en forma de media luna tapizados en piel fina se encuentran frente a frente, realzando el fino interior de madera de cerezo y la lujosa alfombra. Más allá de la sala de estar se ubica un antecomedor en forma de U frente al comedor formal para ocho personas. Incluye una nueva televisión HD de pantalla curva de 55 pulgadas con TV satelital, así como nuevas bocinas Fusion en toda la embarcación que garantizan un sonido óptimo. Contessa también cuenta con teléfono satelital a bordo.'
                    : 'Double stairs lead from the swim platform up to the ample aft deck, perfect for al fresco dining. Contessa’s salon has a large open plan, affording plentiful seating for family and friends. Two crescent shaped sofas face each other in fine leather, offsetting the fine cherry wood interior and lavish carpet. Beyond the living area is a U-shaped dinette across from the formal dining area for eight. A new curved 55 inch screen HD TV with satellite TV is included, as well as new fusion speakers throughout the vessel ensuring optimum sound. Contessa includes satellite telephone.'
                  }
                </p>
              </div>
            </section>

            {/* Sección 2: Cocina Gourmet y Camarotes con Baño Privado */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Sparkles size={14} />
                {isEs ? 'Cocina Gourmet y 4 Camarotes en Suite' : 'Luxury Galley & Stateroom Accommodations'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs ? '4 Camarotes Privados con Baño y Cocina de Acero Inoxidable' : 'Four En-Suite Staterooms & Chef’s Galley'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'La cocina (galley) está lujosamente equipada con electrodomésticos de acero inoxidable, dos hornos de convección, lavavajillas y dos congeladores. Hacia la proa en la cubierta inferior, se encuentran tres camarotes con sus propios baños privados. El camarote principal (Master) es de manga completa (full-beam) y cuenta con cama Queen, vestidor walk-in y una amplia regadera. Los dos camarotes de proa disponen de camas individuales (twin) y sus propios baños con regadera. Adicionalmente, la suite VIP está situada en popa y también es de manga completa (full-beam) con cama Queen y baño privado con regadera.'
                  : 'The galley is luxuriously outfitted with stainless steel appliances, two convection ovens, dish-washer, and two freezers. Forward on the lower deck, there are three staterooms with their own bathrooms. The master is full beam and has a queen bed, walk-in closet, and large shower. The two forward staterooms have twin beds and their own bathrooms with showers. The VIP is situated aft and is also full-beam with a queen bed and bathroom with a shower.'
                }
              </p>
            </section>

            {/* Sección 3: Proa, Cubierta Superior, Pesca y Estabilidad */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Waves size={14} />
                {isEs ? 'Cubiertas Exteriores, Pesca y Navegación' : 'Decks, Sportfishing & Seaworthiness'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs ? 'Asoleadero en Proa, Terraza Sombreada y Estabilidad Superior' : 'Sunbathing Bow, Shaded Upper Deck & Superior Stability'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'En la proa del Contessa hay una tranquila zona para tomar el sol. Su amplia cubierta superior ofrece abundante sombra y se accede a ella mediante dos escaleras curvas gemelas desde la cubierta de popa. Aquí es hacia donde los invitados suelen dirigirse de forma natural, ya que brinda una brisa refrescante y un punto de reunión inmejorable.'
                  : 'There is a tranquil sunbathing area on Contessa’s bow. Her ample upper deck offers abundant shade and is accessed by twin curved stairs from the aft deck. This is where people naturally migrate to, as it affords a refreshing breeze and congregation spot.'
                }
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'La embarcación cuenta con cuatro tablas de stand up paddle (SUP) y equipo de esnórquel. La pesca a bordo del Contessa es de estilo stand-up con cinturones de combate y arneses. Su borda alta, junto con su pasillo perimetral completo (walk-around), la hacen ideal para este tipo de pesca deportiva. Cuenta con tangones (outriggers) y una excelente selección de aparejos a bordo, ideales para pesca ligera.'
                  : 'The vessel has four stand up paddle boards and snorkel gear. Fishing aboard Contessa is stand up style with fighting belts and harnesses. Her high gunwale, along with complete walk-around, makes her ideal for this type of fishing. Outriggers and a nice selection of tackle are aboard: ideal for light fishing.'
                }
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Sus luces submarinas con una gama de colores crean la atmósfera de tu elección al atardecer o de noche. Contessa es sumamente marinera, segura y estable gracias a su amplia manga, grandes estabilizadores y potente propulsor de proa (bow thruster).'
                  : 'Underwater lights with a range of colors create the ambience of your choice. Contessa is extremely seaworthy and stable due to her beam, large stabilizers, and powerful bow thruster.'
                }
              </p>
            </section>

            {/* Sección: Servicio Todo Incluido */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="text-blue-900" size={22} />
                {isEs ? 'Hospitalidad Todo Incluido y Menú Personalizado' : 'All-Inclusive Hospitality & Custom Meal Selection'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isEs
                  ? 'Todos los paquetes del Contessa incluyen bocadillos gourmet (appetizers), barra libre de bebidas y selección de comida personalizada preparada a bordo en su lujosa cocina equipada con grado comercial.'
                  : 'Every Contessa charter package includes gourmet appetizers, open-bar beverages, and custom meal selection prepared fresh onboard in her full commercial-grade stainless steel galley.'
                }
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    {isEs ? 'Navegación Estable y Segura' : 'Stable & Seaworthy Cruising'}
                  </span>
                  <span className="text-slate-500">
                    {isEs ? 'Equipada con grandes estabilizadores, amplio beam y bow thruster.' : 'Outfitted with large stabilizers, wide beam, and powerful bow thruster.'}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    {isEs ? 'Ideal para Día o Pernocta' : 'Day Trips & Overnight Voyages'}
                  </span>
                  <span className="text-slate-500">
                    {isEs ? 'Perfecta para paseos de un día o expediciones de varios días en el Mar de Cortés.' : 'Ideal for Cabo day charters and multi-day trips on the Sea of Cortez.'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Yacht Highlights (Fishing Gear & Boat Features) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tarjeta de Yacht Highlights */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">
                <Waves size={16} />
                {isEs ? 'Especificaciones y Equipamiento' : 'Specifications & Equipment'}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {isEs ? 'Yacht Highlights' : 'Yacht Highlights'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {isEs
                  ? 'Contessa combina el confort de un yate de 85 pies recién remodelado con equipo completo de pesca deportiva, tablas de paddleboard, esnórquel y electrónica marina de última generación.'
                  : 'Contessa combines the luxury of a freshly refitted 85ft motor yacht with complete stand-up fishing gear, paddleboards, snorkeling equipment, and full marine electronics.'
                }
              </p>

              {/* BLOQUE 1: BOAT FEATURES */}
              <div className="mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                  <Ship size={15} />
                  {isEs ? 'Características del Barco (Boat Features)' : 'Boat Features'}
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-slate-800 font-semibold">
                    <span>{isEs ? 'Eslora (Length):' : 'Length:'}</span>
                    <span className="font-black text-blue-950">85ft</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-slate-700 font-medium">
                    <span>{isEs ? 'Astillero / Modelo:' : 'Builder Model:'}</span>
                    <span className="font-bold text-slate-900">Her Shine Marine</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-slate-700 font-medium">
                    <span>{isEs ? 'Motores (Engines):' : 'Engines:'}</span>
                    <span className="font-bold text-slate-900">Twin Caterpillar 3412</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>{isEs ? 'Sistema de sonido envolvente (Bocinas Fusion nuevas)' : 'Surround sound music system (New Fusion speakers)'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>{isEs ? 'Electrónica completa, Radar y Sonar Simrad' : 'Full Electronics, Radar, Simrad Sonar'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>{isEs ? 'TV HD curva de 55", TV Satelital y Teléfono Satelital' : '55" Curved HD TV, Satellite TV & Satellite Phone'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>{isEs ? 'Luces submarinas multicolor, estabilizadores y bow thruster' : 'Multi-color underwater lights, large stabilizers & bow thruster'}</span>
                  </div>
                </div>
              </div>

              {/* BLOQUE 2: FISHING GEAR & WATER TOYS */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                  <Anchor size={15} />
                  {isEs ? 'Equipo de Pesca y Juguetes Acuáticos (Fishing Gear)' : 'Fishing Gear & Water Toys'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Portable Live Bait Well</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Bottom Fishing Equipment</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Stand Up Fishing Equipment</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Regular Tackle 1x50 lb Avit</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Regular Tackle 4x50 lbs Penn</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Outriggers, Belts & Harnesses</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>4 Stand-Up Paddleboards</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Snorkeling Gear Onboard</span>
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

            {/* Testimonial VIP */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-xs text-slate-600 space-y-3 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="italic leading-relaxed text-slate-700 font-medium">
                "{isEs
                  ? 'Pasamos un día increíble a bordo del Contessa 85ft. La cubierta superior sombreada, el comedor al aire libre en popa y la estabilidad del barco hicieron que toda la familia disfrutara el recorrido por el Mar de Cortés y Bahía Chileno.'
                  : 'We had an unforgettable day aboard the 85ft Contessa. The shaded upper deck, al fresco dining on the aft deck, and the incredible stability of the yacht made cruising the Sea of Cortez effortless for our entire family.'
                }"
              </p>
              <div className="font-bold text-slate-900">
                — Michael & Sarah R., Charter Guests (Dallas, TX)
              </div>
            </div>

          </div>

        </div>

        {/* FILA 2: EXPERIENCIAS DE CHÁRTER Y LO MEJOR DE BAJA CALIFORNIA SUR */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
              <Compass size={14} />
              {isEs ? 'Experiencias de Chárter en Los Cabos' : 'Luxury Yacht Charter Experiences in Cabo San Lucas'}
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              {isEs 
                ? 'Explora las Maravillas del Mar de Cortés a Bordo del Contessa' 
                : 'Explore the Wonders of the Sea of Cortez Aboard Contessa'
              }
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
              {isEs
                ? 'Descubre la belleza de Los Cabos desde una perspectiva completamente diferente a bordo del Contessa de 85 pies. Un chárter privado es la forma más exclusiva de explorar las aguas cristalinas del Mar de Cortés, el Arco de Cabo San Lucas y las bahías de Baja California Sur con absoluta comodidad.'
                : 'Discover the beauty of Los Cabos from a completely different perspective aboard the 85ft Contessa. A private yacht charter is an exceptional way to explore the crystal-clear waters of the Sea of Cortez, Land’s End Arch, and the coastline of Baja California Sur in complete comfort.'
              }
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  01
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'El Arco y Finisterra' : "Land's End & El Arco"}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Navegación privada por las famosas formaciones rocosas y Playa del Amor.' : 'Private cruising along the Land’s End rock formations and Lover’s Beach.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  02
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'Snorkel & 4 Paddleboards' : 'Snorkeling & 4 SUPs'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Esnórquel y paseo en 4 tablas de stand-up paddle en bahías tranquilas.' : 'Snorkel gear and 4 stand-up paddleboards for exploring calm turquoise coves.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  03
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'Pesca Stand-Up Completa' : 'Stand-Up Sportfishing'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Cubierta walk-around completa, vivero portátil, tangones y carretes Penn y Avet.' : 'Complete walk-around deck, live bait well, outriggers, and Penn & Avet tackle.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  04
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'Cenas Al Fresco & Luces' : 'Al Fresco Dining & Lights'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Cena en popa al atardecer con luces submarinas multicolor y sonido Fusion.' : 'Sunset dining on the aft deck with multi-color underwater lights and Fusion sound.'}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* FILA 3: POR QUÉ ELEGIR CONTESSA PARA TU CHÁRTER */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
              <Award size={14} />
              {isEs ? 'Ventajas Exclusivas' : 'Why Choose Contessa for Your Cabo Yacht Charter?'}
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {isEs ? '¿Por qué elegir Contessa para tu chárter en Los Cabos?' : 'Why Choose Contessa for Your Cabo Yacht Charter?'}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {isEs 
                ? 'Contessa destaca por su mantenimiento impecable, remodelación reciente, extraordinaria estabilidad de navegación y distribución espaciosa tanto para paseos de un día como expediciones largas.'
                : 'Contessa stands out for her impeccable maintenance, recent comprehensive refits, extraordinary stability at sea, and spacious layout for both day charters and multi-day trips.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? '85 Pies Recién Remodelados' : '85ft Recently Refitted Yacht'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Mantenimiento impecable y remodelaciones recientes pensadas para ofrecer la máxima comodidad a bordo.' 
                  : 'Impeccably maintained Her Shine Marine vessel with comprehensive recent upgrades for guest comfort.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? '4 Camarotes con Baño Privado' : 'Four En-Suite Staterooms'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Master y VIP full-beam con camas Queen más dos camarotes twin, todos con baño y regadera propios.' 
                  : 'Full-beam Master and VIP queen suites plus two forward twin staterooms, each with private bathroom and shower.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Salón Abierto y Audio Fusion' : 'Open-Plan Salon & Fusion Audio'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Madera de cerezo, sofás de piel, comedor para 8, TV curva HD de 55" con satélite y sonido Fusion en todo el barco.' 
                  : 'Fine cherry wood, leather crescent sofas, formal dining for 8, 55" curved satellite HD TV, and new Fusion speakers.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Cubierta Superior Sombreada' : 'Shaded Upper Deck & Bow Lounge'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Acceso por doble escalera curva hacia una terraza sombreada con brisa fresca, además de asoleadero tranquilo en proa.' 
                  : 'Accessed by twin curved stairs, offering abundant shade and refreshing breeze, plus a tranquil bow sunbathing area.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                5
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Pesca Stand-Up y Deportes Acuáticos' : 'Stand-Up Fishing & Water Sports'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? '4 tablas de paddleboard, equipo de esnórquel, pasillo walk-around completo, vivero portátil y equipo Penn & Avet.' 
                  : '4 stand-up paddleboards, snorkel gear, full walk-around deck, live bait well, outriggers, and Penn & Avet tackle.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                6
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Estabilidad y Potencia Caterpillar' : 'Extraordinary Stability & Power'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Motores gemelos Caterpillar 3412, grandes estabilizadores, amplia manga y potente propulsor de proa.' 
                  : 'Twin Caterpillar 3412 engines, wide beam, large stabilizers, Simrad sonar/radar, and powerful bow thruster.'
                }
              </p>
            </div>

          </div>
        </div>

        {/* FILA 4: CTA - RESERVA TU EXPERIENCIA EN YATE PRIVADO */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 sm:p-12 text-center shadow-md relative overflow-hidden mb-16">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-bold text-blue-900 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {isEs ? 'Reserva Exclusiva' : 'Book Your Private Luxury Yacht Experience in Los Cabos'}
            </span>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-4 mb-4 tracking-tight">
              {isEs 
                ? 'Haz que tu Visita a Cabo San Lucas sea Inolvidable a Bordo del Contessa' 
                : 'Book Your Private Charter Aboard the 85ft Contessa in Los Cabos'
              }
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              {isEs
                ? 'Ya sea que busques un crucero de 2 horas al atardecer, un día completo todo incluido en las bahías de Cabo o una expedición por el Mar de Cortés, el Contessa de 85 pies ofrece el equilibrio perfecto de lujo, gastronomía y confort. Contáctanos para confirmar disponibilidad.'
                : 'Whether you are planning a 2-hour sunset cruise, an all-inclusive day charter in Cabo’s turquoise bays, or an extended voyage on the Sea of Cortez, the 85ft Contessa offers the ideal combination of comfort, stability, and personalized service.'
              }
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenInquire(paqueteSeleccionado)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-sm tracking-wide transition shadow-md flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                {isEs ? 'Solicitar Información / Inquire' : 'Inquire Now'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const calcEl = document.getElementById('booking-calculator');
                  if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm tracking-wide transition shadow-md flex items-center justify-center gap-2"
              >
                <Ship size={18} />
                {isEs ? 'Personalizar Chárter' : 'Customize Charter'}
              </button>

              <a
                href={`https://wa.me/526121943286?text=${mensajeWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <MessageCircle size={18} />
                {isEs ? 'WhatsApp Concierge' : 'WhatsApp Concierge'}
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SECCIÓN SEO FAQ                                           */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2 border border-blue-200">
            <Info size={14} />
            {isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEs ? 'Preguntas Frecuentes sobre el Chárter en Contessa 85ft' : 'Frequently Asked Questions About Contessa 85ft Yacht Charter'}
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            {isEs 
              ? 'Todo lo que necesitas saber para rentar el yate de lujo Contessa de 85 pies en Cabo San Lucas' 
              : 'Everything you need to know about booking the 85ft Her Shine Marine Contessa luxury yacht'
            }
          </p>
        </div>

        <div className="space-y-4">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Cuántos pasajeros admite el yate Contessa 85ft?' : 'How many guests can the 85ft Contessa yacht accommodate?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs 
                ? 'Las tarifas base de todos los paquetes del Contessa incluyen hasta 10 huéspedes, y la embarcación permite hasta 8 invitados adicionales a bordo (para un máximo total de 18 pasajeros).'
                : 'All Contessa charter packages include 10 base guests, and the vessel allows up to 8 additional guests on board (for a maximum capacity of 18 guests).'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué incluyen los paquetes del yate Contessa?' : 'What is included in the Contessa charter packages?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Todos los paquetes (2, 4, 6 y 8 horas) incluyen bocadillos (appetizers), barra libre de bebidas (beverages), selección de menú personalizado (custom meal selection), 4 tablas de stand up paddle, equipo de esnórquel y equipo de pesca deportiva.'
                : 'Every package (2, 4, 6, and 8 hours) includes gourmet appetizers, open bar beverages, custom meal selection, 4 stand-up paddleboards, snorkeling gear, and sportfishing equipment.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Cuántos camarotes tiene el Contessa 85ft?' : 'How many staterooms does Contessa have?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Contessa cuenta con 4 camarotes privados con baño propio y regadera: un camarote Master full-beam con cama Queen y vestidor, una suite VIP full-beam en popa con cama Queen, y dos camarotes en proa con camas individuales (twin).'
                : 'Contessa features 4 private staterooms each with its own bathroom and shower: a full-beam Master stateroom with a Queen bed and walk-in closet, a full-beam aft VIP stateroom with a Queen bed, and two forward twin-bed staterooms.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Está equipado para pesca deportiva en Cabo San Lucas?' : 'Is Contessa equipped for fishing in Cabo San Lucas?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Sí. La pesca a bordo del Contessa es de estilo stand-up con cinturones de pelea y arneses, pasillo walk-around completo, vivero portátil de carnada viva, equipo de pesca de fondo, tangones (outriggers) y carretes profesionales Avet de 50 lb y Penn de 50 lb.'
                : 'Yes. Contessa is outfitted for stand-up style fishing with fighting belts and harnesses, a full walk-around deck, portable live bait well, bottom fishing gear, outriggers, 1x50 lb Avet tackle, and 4x50 lbs Penn tackle.'
              }
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL INQUIRE                                             */}
      {/* ======================================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto border border-slate-200">
            
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
                    ? `Gracias ${inquireData.firstName}. Nuestro equipo VIP concierge de Ballard Tours se comunicará contigo a la brevedad para confirmar disponibilidad y los detalles de tu chárter en el Contessa 85ft.`
                    : `Thank you ${inquireData.firstName}. Our VIP concierge team at Ballard Tours will get in touch with you shortly to confirm availability and itinerary details aboard the 85ft Contessa.`
                  }
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/526121943286?text=${mensajeWhatsApp}`}
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
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-[#003865] tracking-tight">
                    {isEs ? 'Solicitar Información' : 'Inquire'}
                  </h3>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    85ft Her Shine Marine "Contessa"
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

                  <div>
                    <input 
                      type="date" 
                      required 
                      value={inquireData.date} 
                      onChange={(e) => setInquireData({ ...inquireData, date: e.target.value })} 
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#003865] outline-none"
                    />
                  </div>

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

                  <div>
                    <textarea 
                      rows={4} 
                      placeholder={isEs ? 'Escribe aquí tu mensaje, solicitudes de menú o preguntas...' : 'Your Message'} 
                      value={inquireData.message} 
                      onChange={(e) => setInquireData({ ...inquireData, message: e.target.value })} 
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none resize-none"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                    <span>
                      <strong>{isEs ? 'Paquete seleccionado:' : 'Selected Package:'}</strong> {isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn} ({totalHuespedes} pax)
                    </span>
                    <span className="font-extrabold text-[#003865] text-sm">
                      ${granTotalYate.toLocaleString()} USD
                    </span>
                  </div>

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
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-3 sm:p-6 md:p-8 animate-fade-in select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-between items-center text-white z-40 px-2">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-md">
                {fotoActiva + 1} / {fotosGaleria.length}
              </span>
              <span className="text-slate-300 font-bold hidden sm:inline">
                85ft Her Shine Marine "Contessa"
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                {isEs ? '← Desliza en pantalla o usa las flechas →' : '← Swipe screen or use arrow keys →'}
              </span>
              <button 
                type="button"
                onClick={() => setLightboxAbierto(false)} 
                className="p-2 sm:p-2.5 text-white hover:text-blue-400 transition rounded-full bg-white/10 hover:bg-white/20 cursor-pointer shadow-lg active:scale-95"
                title={isEs ? 'Cerrar (Esc)' : 'Close (Esc)'}
              >
                <X size={22} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden touch-pan-y">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all z-30 cursor-pointer shadow-2xl active:scale-90 group backdrop-blur-xs"
              aria-label="Previous Photo"
              title={isEs ? 'Foto anterior' : 'Previous photo'}
            >
              <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <img 
              key={fotosGaleria[fotoActiva].src}
              src={fotosGaleria[fotoActiva].src} 
              alt={fotosGaleria[fotoActiva].titleEn} 
              className="max-h-[72vh] sm:max-h-[76vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 ease-out select-none pointer-events-none"
              draggable={false}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all z-30 cursor-pointer shadow-2xl active:scale-90 group backdrop-blur-xs"
              aria-label="Next Photo"
              title={isEs ? 'Foto siguiente' : 'Next photo'}
            >
              <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white text-xs sm:text-sm z-40 px-2">
            <div className="text-center sm:text-left max-w-2xl">
              <h5 className="font-extrabold text-white text-sm sm:text-base">
                {isEs ? fotosGaleria[fotoActiva].titleEs : fotosGaleria[fotoActiva].titleEn}
              </h5>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5 line-clamp-2">
                {isEs ? fotosGaleria[fotoActiva].descEs : fotosGaleria[fotoActiva].descEn}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                type="button"
                onClick={handlePrevPhoto}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 text-xs sm:text-sm"
              >
                <ChevronLeft size={16} />
                <span>{isEs ? 'Anterior' : 'Previous'}</span>
              </button>
              <button 
                type="button"
                onClick={handleNextPhoto}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-blue-600/30 text-xs sm:text-sm"
              >
                <span>{isEs ? 'Siguiente' : 'Next'}</span>
                <ChevronRight size={16} />
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

