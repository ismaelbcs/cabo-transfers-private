// src/app/[lang]/yachts/baja-therapy/page.js
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
  CheckCircle2,
  Plus,
  Sparkles,
  MapPin,
  Car,
  Wine,
  Waves,
  Compass,
  X,
  MessageCircle,
  Maximize2,
  Ship,
  Mail,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  Award,
  Sun,
  Music
} from 'lucide-react';
import { useCart } from '../../../../context/CartContext';
import { catalogoHoteles } from '../../../../data/seoData';
import { COUNTRIES, POPULAR_COUNTRY_CODES } from '../../../../data/countryCallingCodes';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { sendEmail } from '../../../../utils/sendEmail';
import TrustedPartners from '../../../../components/TrustedPartners';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';

export default function BajaTherapyYachtPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const { agregarAlCombo } = useCart();

  // ==========================================
  // CONFIGURACIÓN DE PAQUETES - 30 FT "BAJA THERAPY" DOUBLE-DECK PONTOON
  // Regla aplicada:
  // - Paquete Base 3 Horas (Sunset / Arch Cruise): Original $560 + $1,000 = $1,560 USD (1 a 10 pasajeros)
  // - Paquete 3 Horas Signature Experience (Sunset / Whale Watching / Snorkel / Events): Original $950 + $1,000 = $1,950 USD (1 a 10 pasajeros)
  // - Persona Adicional (11 a 20 pasajeros): Original $80 + $50 = $130 USD por pasajero (Capacidad máx: 20 pasajeros)
  // - Hora Adicional: Original ~$190/hr + $100 = $290 USD por hora
  // ==========================================
  const paquetes = [
    {
      id: 'charter-3h-sunset-arch',
      nameEn: '3 HOURS – SUNSET & ARCH CRUISE',
      nameEs: '3 HORAS – ATARDECER Y TOUR AL ARCO',
      hours: 3,
      price: 1560, // Original $560 + $1,000
      baseGuests: 10,
      maxGuests: 20,
      extraGuestPrice: 130, // Original $80 + $50
      popular: true,
      descriptionEn:
        '3-hour private charter aboard the 30 Ft "Baja Therapy" double-deck pontoon for up to 10 base guests (20 max capacity). Includes open bar, professional crew, upper deck lounge & slide, premium sound system, snorkel gear, paddleboard & floating mat.',
      descriptionEs:
        'Chárter privado de 3 horas a bordo del pontón de lujo de doble piso "Baja Therapy" de 30 pies para hasta 10 invitados base (capacidad máx. 20). Incluye barra libre, tripulación profesional, terraza superior con tobogán, sonido premium, esnórquel, paddleboard y tapete flotante.'
    },
    {
      id: 'charter-3h-signature-experience',
      nameEn: '3 HOURS – SIGNATURE PARTY / SNORKEL / WHALES',
      nameEs: '3 HORAS – FIESTA VIP / SNORKEL / BALLENAS',
      hours: 3,
      price: 1950, // Original $950 + $1,000
      baseGuests: 10,
      maxGuests: 20,
      extraGuestPrice: 130,
      popular: false,
      descriptionEn:
        '3-hour signature experience tailored for birthdays, bachelor/bachelorette parties, snorkel tours in calm bays, or seasonal whale watching aboard the 2-level Baja Therapy pontoon.',
      descriptionEs:
        'Experiencia insignia de 3 horas ideal para cumpleaños, despedidas de soltero(a), tour de esnórquel en bahías tranquilas o avistamiento de ballenas a bordo del pontón de 2 pisos Baja Therapy.'
    },
    {
      id: 'charter-4h-extended',
      nameEn: '4 HOURS – EXTENDED PARTY & SNORKEL',
      nameEs: '4 HORAS – FIESTA EXTENDIDA Y SNORKEL',
      hours: 4,
      price: 1850, // 3h ($1,560) + 1h extra ($290)
      baseGuests: 10,
      maxGuests: 20,
      extraGuestPrice: 130,
      popular: false,
      descriptionEn:
        '4-hour half-day double-deck party boat charter with extra anchoring time for swimming, sliding from the upper deck, paddleboarding, snorkeling, and open bar celebrations.',
      descriptionEs:
        'Chárter de medio día (4 horas) en barco de fiesta de doble piso con tiempo extra de fondeo para nadar, deslizarse por el tobogán superior, paddleboard, esnórquel y barra libre.'
    },
    {
      id: 'charter-6h-full-celebration',
      nameEn: '6 HOURS – ULTIMATE CABO PARTY CHARTER',
      nameEs: '6 HORAS – CELEBRACIÓN COMPLETA EN CABO',
      hours: 6,
      price: 2430, // 3h ($1,560) + 3h extra ($870)
      baseGuests: 10,
      maxGuests: 20,
      extraGuestPrice: 130,
      popular: false,
      descriptionEn:
        '6-hour private celebration cruise from daytime bay snorkeling and water activities right into Cabo’s golden hour sunset around Land’s End and El Arco.',
      descriptionEs:
        'Crucero privado de celebración de 6 horas combinando esnórquel y actividades acuáticas de día con el mágico atardecer frente al Finisterra y El Arco.'
    }
  ];

  // ==========================================
  // ESTADOS DEL CONFIGURADOR / CALCULADORA
  // ==========================================
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(paquetes[0]);
  const [charterFecha, setCharterFecha] = useState('');
  const [totalHuespedes, setTotalHuespedes] = useState(10);
  const [horasExtras, setHorasExtras] = useState(0); // $290 USD por hora extra
  const PRECIO_HORA_EXTRA = 290;

  // Estados de Transportación Terrestre
  const [incluirTransporte, setIncluirTransporte] = useState(false);
  const [transporteOrigen, setTransporteOrigen] = useState('');
  const [busquedaOrigen, setBusquedaOrigen] = useState('');
  const [mostrarDropdownHoteles, setMostrarDropdownHoteles] = useState(false);
  const [horaRecogidaHotel, setHoraRecogidaHotel] = useState('15:30');
  const [horaRegresoMarina, setHoraRegresoMarina] = useState('19:30');

  // Matriz de precios de transporte hacia Cabo San Lucas Marina ('csl')
  const matrizPreciosMarinaCSL = { '1': 220, '2': 200, '3': 160, '4': 250, '5': 320, '6': 420 };

  const calcularRecargoTransporte = (pax) => {
    if (pax <= 4) return 0;
    if (pax <= 8) return 30;
    if (pax <= 10) return 45;
    if (pax <= 15) return 90;
    if (pax === 16) return 110;
    return 110 + ((pax - 16) * 20);
  };

  const costoTransporte = useMemo(() => {
    if (!incluirTransporte || !transporteOrigen) return 0;
    const hotel = catalogoHoteles.find(h => h.nombre === transporteOrigen);
    const zona = hotel ? String(hotel.zona) : '3';
    const precioBaseZona = matrizPreciosMarinaCSL[zona] || 200;
    const recargoPax = calcularRecargoTransporte(totalHuespedes);
    return precioBaseZona + recargoPax;
  }, [incluirTransporte, transporteOrigen, totalHuespedes]);

  // Cálculo de Huéspedes Extra (Máximo 10 extra -> 20 total; $130 USD c/u)
  const huespedesExtra = Math.max(0, totalHuespedes - paqueteSeleccionado.baseGuests);
  const costoHuespedesExtra = huespedesExtra * paqueteSeleccionado.extraGuestPrice;

  // Cálculo de Horas Extras ($290 USD c/u)
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
  // FOTOS REALES DEL 30 FT "BAJA THERAPY" (/yachts/Baja Therapy/)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/yachts/Baja Therapy/cover.Bzegnl3K_1cRkvD.webp',
      titleEn: '30 Ft "Baja Therapy" Luxury Double-Deck Pontoon at El Arco in Cabo San Lucas',
      titleEs: 'Pontón de Lujo Doble Piso 30 Ft "Baja Therapy" frente a El Arco en Cabo San Lucas',
      descEn: 'A luxury double-deck pontoon designed for unforgettable private charters in Los Cabos, perfect for birthdays and group celebrations up to 20 guests.',
      descEs: 'Un pontón de lujo de doble piso diseñado para chárters privados inolvidables en Los Cabos, perfecto para cumpleaños y celebraciones de hasta 20 invitados.',
      labelEn: '30 Ft Double-Deck Pontoon',
      labelEs: 'Pontón Doble Piso 30 Ft'
    },
    {
      src: '/yachts/Baja Therapy/4.CCpvPTJP_ZcyhUS.webp',
      titleEn: 'Sunset Cruise Cabo – Golden Hour Magic Around Land’s End & El Arco',
      titleEs: 'Crucero al Atardecer en Cabo – Hora Dorada frente al Finisterra y El Arco',
      descEn: 'A private sunset charter with an unhurried route, polished service, and cinematic views around Land’s End.',
      descEs: 'Un chárter privado al atardecer con ruta sin prisas, servicio impecable y vistas cinematográficas alrededor de El Arco.',
      labelEn: 'Sunset Cruise Cabo',
      labelEs: 'Crucero al Atardecer'
    },
    {
      src: '/yachts/Baja Therapy/1.5MxG9lIe_wdbkQ.webp',
      titleEn: 'Spacious Main Deck with Custom Tan Leather Wrap-Around Lounges',
      titleEs: 'Amplia Cubierta Principal con Salas Lounge en Piel Color Camel',
      descEn: 'Plush shaded seating, teak-style flooring, and premium sound system for the ultimate Cabo party boat experience.',
      descEs: 'Asientos de lujo con sombra, piso estilo teca y sistema de sonido premium para la mejor fiesta privada en el mar.',
      labelEn: 'Luxury Lounge Deck',
      labelEs: 'Sala Lounge con Sombra'
    },
    {
      src: '/yachts/Baja Therapy/2.CHNNoIqn_Z1VPJSD.webp',
      titleEn: 'VIP Captain’s Club Chairs & Cocktail Table Onboard Baja Therapy',
      titleEs: 'Sillones Giratorios VIP con Mesa de Cócteles a Bordo de Baja Therapy',
      descEn: 'Enjoy handcrafted open-bar drinks and panoramic ocean views while cruising past Lover’s Beach and the Sea Lion Colony.',
      descEs: 'Disfruta de bebidas de barra libre y vistas panorámicas mientras navegas frente a Playa del Amor y la Colonia de Lobos Marinos.',
      labelEn: 'VIP Seating & Helm',
      labelEs: 'Asientos VIP y Cabina'
    },
    {
      src: '/yachts/Baja Therapy/3.D2bq6Z5Q_Z139WxH.webp',
      titleEn: 'Upper Deck Lounge & Custom Water Slide into Cabo’s Turquoise Bays',
      titleEs: 'Terraza en Segundo Piso y Tobogán Acuático hacia las Bahías de Cabo',
      descEn: 'Anchor in a calm bay to slide from the second deck, swim, snorkel, paddleboard, or relax on the floating mat.',
      descEs: 'Fondea en una bahía tranquila para deslizarte desde el segundo piso, nadar, hacer esnórquel, paddleboard o descansar en el tapete flotante.',
      labelEn: 'Upper Deck & Slide',
      labelEs: 'Segundo Piso y Tobogán'
    }
  ];

  const handleNextPhoto = () => {
    setFotoActiva((prev) => (prev + 1) % fotosGaleria.length);
  };

  const handlePrevPhoto = () => {
    setFotoActiva((prev) => (prev - 1 + fotosGaleria.length) % fotosGaleria.length);
  };

  useEffect(() => {
    if (!lightboxAbierto) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'Escape') setLightboxAbierto(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxAbierto]);

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 40) handleNextPhoto();
    if (distance < -40) handlePrevPhoto();
  };

  const hotelesFiltrados = useMemo(() => {
    if (!busquedaOrigen.trim()) return catalogoHoteles;
    return catalogoHoteles.filter(h =>
      h.nombre.toLowerCase().includes(busquedaOrigen.toLowerCase())
    );
  }, [busquedaOrigen]);

  const handleSelectPackage = (pkg) => {
    setPaqueteSeleccionado(pkg);
    const calcEl = document.getElementById('booking-calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleOpenInquire = (pkg = paqueteSeleccionado) => {
    setPaqueteSeleccionado(pkg);
    if (charterFecha && !inquireData.date) {
      setInquireData(prev => ({ ...prev, date: charterFecha }));
    }
    setInquiryEnviado(false);
    setModalAbierto(true);
  };

  const handleAddToCart = () => {
    if (!charterFecha) {
      alert(isEs ? 'Por favor selecciona una fecha para tu chárter privado.' : 'Please select a date for your private yacht charter.');
      return;
    }
    if (incluirTransporte && !transporteOrigen) {
      alert(isEs ? 'Por favor selecciona tu hotel o punto de recogida para el transporte terrestre.' : 'Please select your hotel or pickup location for the ground transfer.');
      return;
    }

    const totalHoras = paqueteSeleccionado.hours + horasExtras;

    agregarAlCombo({
      id: `yacht-baja-therapy-${paqueteSeleccionado.id}-${Date.now()}`,
      tipo: 'yate',
      nombre: `30 Ft "Baja Therapy" Double-Deck Pontoon - ${isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn}`,
      fecha: charterFecha,
      horario: incluirTransporte ? `${horaRecogidaHotel} - ${horaRegresoMarina}` : `${totalHoras} Hours Charter`,
      pasajeros: totalHuespedes,
      precio: granTotalYate,
      detalles: {
        embarcacion: '30 Ft "Baja Therapy" Luxury Double-Deck Pontoon',
        paqueteBase: isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn,
        horasBase: paqueteSeleccionado.hours,
        horasExtras,
        costoHorasExtras,
        huespedesBase: 10,
        huespedesExtra,
        costoHuespedesExtra,
        incluyeTransporte: incluirTransporte,
        hotelOrigen: incluirTransporte ? transporteOrigen : 'No Ground Transfer (Direct at Cabo San Lucas Marina)',
        horaIda: incluirTransporte ? horaRecogidaHotel : null,
        horaVuelta: incluirTransporte ? horaRegresoMarina : null,
        costoTransporte,
        notaFiscal: isEs
          ? 'Tarifa base cubre hasta 10 invitados (capacidad máxima 20 pasajeros, $130 USD por persona adicional). Propinas e impuestos no incluidos.'
          : 'Base rate covers up to 10 guests (maximum capacity 20 passengers, $130 USD per additional guest). Gratuity and taxes not included.'
      }
    });

    router.push(`/${lang}/checkout`);
  };

  const handleSubmitInquire = async (e) => {
    e.preventDefault();
    setEnviandoInquiry(true);

    try {
      const payload = {
        tipo: 'Yacht Charter Inquiry - 30 Ft Baja Therapy Double-Deck Pontoon',
        embarcacion: '30 Ft "Baja Therapy" Double-Deck Pontoon',
        paqueteInteres: isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn,
        horasTotales: paqueteSeleccionado.hours + horasExtras,
        huespedesEstimados: totalHuespedes,
        incluyeTransporteTerrestre: incluirTransporte,
        hotelRecogida: incluirTransporte ? transporteOrigen : 'No solicitado',
        cotizacionEstimadaUSD: granTotalYate,
        clienteNombre: `${inquireData.firstName} ${inquireData.lastName}`.trim(),
        clienteFecha: inquireData.date || charterFecha || 'Pendiente',
        clienteTelefono: `${inquireData.phoneCode} ${inquireData.phoneNumber}`,
        clienteEmail: inquireData.email,
        comoNosConocio: inquireData.source,
        mensaje: inquireData.message,
        idioma: lang,
        creadoEn: new Date().toISOString()
      };

      await sendEmail({
        to: 'reservationballard@gmail.com',
        subject: `🛥️ New Yacht Inquiry: 30 Ft "Baja Therapy" Double-Deck Pontoon (${payload.clienteNombre})`,
        html: `
          <h2>Solicitud de Reserva / Información - 30 Ft "Baja Therapy" Double-Deck Pontoon</h2>
          <p><strong>Cliente:</strong> ${payload.clienteNombre}</p>
          <p><strong>Email:</strong> ${payload.clienteEmail}</p>
          <p><strong>Teléfono:</strong> ${payload.clienteTelefono}</p>
          <p><strong>Fecha deseada:</strong> ${payload.clienteFecha}</p>
          <p><strong>¿Cómo nos conoció?:</strong> ${payload.comoNosConocio}</p>
          <hr />
          <h3>Configuración Seleccionada:</h3>
          <ul>
            <li><strong>Paquete:</strong> ${payload.paqueteInteres} ($${paqueteSeleccionado.price.toLocaleString()} USD)</li>
            <li><strong>Pasajeros:</strong> ${totalHuespedes} (${huespedesExtra} extra = +$${costoHuespedesExtra.toLocaleString()} USD)</li>
            <li><strong>Horas Extra:</strong> ${horasExtras} (+$${costoHorasExtras.toLocaleString()} USD)</li>
            <li><strong>Transporte Privado Hotel-Marina-Hotel:</strong> ${incluirTransporte ? `Sí, desde ${transporteOrigen} (+$${costoTransporte} USD)` : 'No'}</li>
            <li><strong>Total Estimado:</strong> $${granTotalYate.toLocaleString()} USD</li>
          </ul>
          <p><strong>Mensaje del cliente:</strong><br/>${payload.mensaje || 'Sin mensaje adicional'}</p>
        `
      });

      try {
        await addDoc(collection(db, 'yacht_inquiries'), payload);
      } catch (dbErr) {
        console.warn('Respaldo yacht_inquiries:', dbErr);
      }

      setInquiryEnviado(true);
    } catch (error) {
      console.error('Error enviando inquiry de yate:', error);
      setInquiryEnviado(true);
    } finally {
      setEnviandoInquiry(false);
    }
  };

  const mensajeWhatsApp = encodeURIComponent(
    isEs
      ? `¡Hola! Me interesa reservar el pontón de lujo de doble piso 30 Ft "Baja Therapy" en Cabo San Lucas.\n\n• Paquete: ${paqueteSeleccionado.nameEs}\n• Fecha: ${charterFecha || 'Por definir'}\n• Huéspedes: ${totalHuespedes} personas\n• Horas extra: ${horasExtras}\n• Transporte terrestre: ${incluirTransporte ? `Sí (${transporteOrigen})` : 'No'}\n• Total estimado: $${granTotalYate.toLocaleString()} USD`
      : `Hello! I'm interested in chartering the 30 Ft "Baja Therapy" Luxury Double-Deck Pontoon in Cabo San Lucas.\n\n• Package: ${paqueteSeleccionado.nameEn}\n• Date: ${charterFecha || 'TBD'}\n• Guests: ${totalHuespedes} guests\n• Extra hours: ${horasExtras}\n• Ground transport: ${incluirTransporte ? `Yes (${transporteOrigen})` : 'No'}\n• Estimated total: $${granTotalYate.toLocaleString()} USD`
  );

  // ==========================================
  // 4 MOMENTOS / EXPERIENCIAS A BORDO DEL 30 FT BAJA THERAPY
  // ==========================================
  const experienciasMomentos = [
    {
      badgeEn: 'SUNSET',
      badgeEs: 'ATARDECER',
      durationEn: '3 HOURS · FROM $1,560',
      durationEs: '3 HORAS · DESDE $1,560',
      titleEn: 'Sunset Cruise Cabo',
      titleEs: 'Crucero al Atardecer en Cabo',
      descEn:
        'Designed for guests who want to wind down the day with style, rather than a rushed sightseeing stop. Carefully paced around Land’s End and El Arco with seamless open-bar service.',
      descEs:
        'Diseñado para quienes desean cerrar el día con estilo en lugar de una parada turística apresurada. Ruta sin prisas alrededor del Finisterra y El Arco con servicio impecable de barra libre.',
      img: '/yachts/Baja Therapy/4.CCpvPTJP_ZcyhUS.webp'
    },
    {
      badgeEn: 'WILDLIFE',
      badgeEs: 'VIDA MARINA',
      durationEn: '3 HOURS · FROM $1,950',
      durationEs: '3 HORAS · DESDE $1,950',
      titleEn: 'Whale Watching Cabo',
      titleEs: 'Avistamiento de Ballenas en Cabo',
      descEn:
        'Experience the magic of Cabo’s whale migration from the elevated 360-degree vantage point of our upper deck lounge. Carefully planned around migration patterns and calm waters.',
      descEs:
        'Vive la magia de la migración de ballenas en Los Cabos desde la vista panorámica elevada de nuestra cubierta de segundo piso.',
      img: '/yachts/Baja Therapy/cover.Bzegnl3K_1cRkvD.webp'
    },
    {
      badgeEn: 'SNORKEL',
      badgeEs: 'ESNÓRQUEL',
      durationEn: '3 HOURS · FROM $1,950',
      durationEs: '3 HORAS · DESDE $1,950',
      titleEn: 'Snorkel Tour Cabo',
      titleEs: 'Tour de Esnórquel y Tobogán',
      descEn:
        'Dive into the vibrant marine life of Los Cabos with a private snorkeling charter. Enjoy crystal-clear waters, our upper-deck water slide, stand-up paddleboard, and floating mat.',
      descEs:
        'Sumérgete en la vida marina de Los Cabos en una bahía cristalina con tobogán desde el segundo piso, equipo de esnórquel, paddleboard y tapete flotante.',
      img: '/yachts/Baja Therapy/3.D2bq6Z5Q_Z139WxH.webp'
    },
    {
      badgeEn: 'EVENTS',
      badgeEs: 'EVENTOS',
      durationEn: '3 HOURS · FROM $1,950',
      durationEs: '3 HORAS · DESDE $1,950',
      titleEn: 'Private Events Onboard Cabo',
      titleEs: 'Eventos Privados y Celebraciones',
      descEn:
        'Turn your birthday, bachelor/bachelorette party, proposal, or anniversary into an extraordinary milestone for up to 20 guests with open bar, premium sound, and 2 deck levels.',
      descEs:
        'Convierte tu cumpleaños, despedida de soltero(a), propuesta o aniversario en una celebración inolvidable para hasta 20 invitados con barra libre, sonido premium y 2 pisos.',
      img: '/yachts/Baja Therapy/1.5MxG9lIe_wdbkQ.webp'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pb-24">

      {/* ======================================================== */}
      {/* HERO COMPACTO Y ELEGANTE                                 */}
      {/* ======================================================== */}
      <div className="relative pt-24 pb-6 sm:pt-28 sm:pb-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-widest mb-3">
                <Anchor size={13} />
                <span>
                  {isEs
                    ? 'Pontón de Lujo de Doble Piso (2 Niveles) • Hasta 20 Pasajeros'
                    : 'Luxury Double-Deck Pontoon (2 Levels) • Up to 20 Passengers'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                {isEs
                  ? '30 Ft "Baja Therapy" – Pontón de Lujo de Doble Piso en Cabo San Lucas'
                  : '30 Ft "Baja Therapy" – Luxury Double-Deck Pontoon in Cabo San Lucas'}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
                {isEs
                  ? 'Un pontón de lujo de doble piso diseñado para chárters privados inolvidables en Los Cabos, perfecto para cumpleaños, despedidas y celebraciones en grupo. Terraza Superior con Tobogán • Barra Libre • Sonido Premium • Esnórquel, Paddleboard y Tapete Flotante.'
                  : 'A luxury double-deck pontoon designed for unforgettable private charters in Los Cabos, perfect for birthdays, bachelor/bachelorette parties, and group celebrations. Upper Deck Lounge & Water Slide • Open Bar • Premium Sound System • Snorkel, Paddleboard & Floating Mat.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenInquire(paqueteSeleccionado)}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                {isEs ? 'Solicitar Propuesta' : 'Inquire'}
              </button>

              <a
                href="#packages-section"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <Sparkles size={15} className="text-amber-600" />
                {isEs ? 'Ver Paquetes' : 'View Packages'}
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GALERÍA VISUAL INTERACTIVA (5 FOTOS REALES BAJA THERAPY) */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">

        <div
          className="relative h-[320px] sm:h-[460px] md:h-[540px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-lg group bg-slate-900 mb-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={fotosGaleria[fotoActiva].src}
            alt={isEs ? fotosGaleria[fotoActiva].titleEs : fotosGaleria[fotoActiva].titleEn}
            className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
            onClick={() => setLightboxAbierto(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20 pointer-events-none" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPhoto();
            }}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition cursor-pointer z-10 active:scale-90"
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextPhoto();
            }}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition cursor-pointer z-10 active:scale-90"
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <span className="px-3 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md text-white font-bold text-xs border border-white/15">
              {fotoActiva + 1} / {fotosGaleria.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxAbierto(true)}
              className="p-2 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white border border-white/15 transition cursor-pointer"
              title={isEs ? 'Ver en pantalla completa' : 'View fullscreen'}
            >
              <Maximize2 size={16} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider mb-1.5">
                {isEs ? fotosGaleria[fotoActiva].labelEs : fotosGaleria[fotoActiva].labelEn}
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-snug drop-shadow-xs">
                {isEs ? fotosGaleria[fotoActiva].titleEs : fotosGaleria[fotoActiva].titleEn}
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm mt-0.5 max-w-2xl">
                {isEs ? fotosGaleria[fotoActiva].descEs : fotosGaleria[fotoActiva].descEn}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setLightboxAbierto(true)}
              className="self-start sm:self-auto shrink-0 px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <CameraIcon size={15} className="text-blue-900" />
              <span>{isEs ? `Ver las ${fotosGaleria.length} fotos` : `Show all ${fotosGaleria.length} photos`}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-300">
          {fotosGaleria.map((foto, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setFotoActiva(index)}
              className={`relative h-16 w-24 sm:h-20 sm:w-32 shrink-0 rounded-xl overflow-hidden transition-all cursor-pointer ${
                fotoActiva === index
                  ? 'ring-3 ring-blue-900 scale-102 opacity-100 shadow-sm'
                  : 'opacity-65 hover:opacity-100'
              }`}
            >
              <img
                src={foto.src}
                alt={isEs ? foto.labelEs : foto.labelEn}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* BARRA DE ESPECIFICACIONES RÁPIDAS (SPECS BAR)            */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-[#003865] text-white rounded-2xl py-6 px-4 sm:px-8 shadow-md grid grid-cols-2 sm:grid-cols-5 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-blue-800">
          <div className="pt-2 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              20 <span className="text-xs font-semibold text-amber-300 uppercase">Max</span>
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-200 mt-1 font-semibold">
              {isEs ? 'Capacidad Máxima' : 'Maximum Capacity'}
            </div>
          </div>

          <div className="pt-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">10</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-200 mt-1 font-semibold">
              {isEs ? 'Pasajeros Incluidos' : 'Guests Included'}
            </div>
          </div>

          <div className="pt-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">2</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-200 mt-1 font-semibold">
              {isEs ? 'Niveles (Doble Piso)' : 'Deck Levels (Double-Deck)'}
            </div>
          </div>

          <div className="pt-4 sm:pt-0">
            <div className="text-xl sm:text-2xl font-black tracking-tight">Custom Pontoon</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-200 mt-1 font-semibold">
              {isEs ? 'Tipo de Embarcación' : 'Vessel Type'}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 pt-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300">$130 USD</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-200 mt-1 font-semibold">
              {isEs ? 'Persona Adicional (11–20)' : 'Additional Person (11–20)'}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECCIÓN DE RESEÑAS Y SOCIOS DE CONFIANZA                 */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <HeroReviewsBadge isEs={isEs} />
      </div>

      <div className="mb-12">
        <TrustedPartners isEs={isEs} />
      </div>

      {/* ======================================================== */}
      {/* SECCIÓN DE PAQUETES Y TARIFAS (DESDE $1,560 USD)         */}
      {/* ======================================================== */}
      <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#003865] tracking-tight">
            {isEs ? 'Paquetes y Tarifas – 30 Ft "Baja Therapy"' : 'Pricing & Packages – 30 Ft "Baja Therapy"'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl mx-auto">
            {isEs
              ? 'Las tarifas cubren hasta 10 invitados (capacidad máxima de 20 pasajeros; $130 USD por persona adicional de 11 a 20). Incluye barra libre, tripulación profesional, terraza superior con tobogán, sistema de sonido premium, esnórquel, paddleboard y tapete flotante.'
              : 'Rates cover up to 10 guests (maximum capacity is 20 passengers; $130 USD per additional person for guests 11–20). Includes open bar, professional crew, upper deck lounge & slide, premium sound system, snorkel gear, paddleboard & floating mat.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {paquetes.map((pkg, idx) => {
            const isSelected = paqueteSeleccionado.id === pkg.id;

            const headerColors = [
              'bg-[#003865]',
              'bg-[#1877d2]',
              'bg-[#0d5ca8]',
              'bg-[#07427c]'
            ];

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg)}
                className={`relative flex flex-col rounded-xl bg-white transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#003865] shadow-xl -translate-y-1'
                    : 'border border-slate-300 hover:border-slate-400 shadow-md hover:-translate-y-0.5'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c8b273] text-white text-xs font-extrabold px-5 py-1.5 rounded-t-md shadow-xs tracking-wide z-10 whitespace-nowrap">
                    {isEs ? 'Más Popular • Sunset & Arch' : 'Most Popular • Sunset & Arch'}
                  </div>
                )}

                <div className={`${headerColors[idx]} text-white text-center py-3.5 px-4 rounded-t-[10px]`}>
                  <h3 className="font-extrabold text-xs sm:text-sm tracking-wider uppercase">
                    {isEs ? pkg.nameEs : pkg.nameEn}
                  </h3>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between text-slate-800">
                  <div>
                    <div className="text-center mb-5">
                      <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                        ${pkg.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <p className="text-[11px] italic text-slate-500 mt-1">
                        {isEs
                          ? 'Incluye 1 a 10 pasajeros • Capacidad máx. 20'
                          : 'Covers 1 to 10 guests • Max capacity 20'}
                      </p>
                    </div>

                    <div className="space-y-2.5 text-xs border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Users size={15} className="text-[#003865]" />
                          {isEs ? 'Pasajeros Incluidos' : 'Guests Included'}
                        </span>
                        <span className="font-bold text-slate-900">1 - {pkg.baseGuests}</span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Users size={15} className="text-[#003865]" />
                          {isEs ? 'Persona Adicional' : 'Additional Person'}
                        </span>
                        <span className="font-medium text-slate-600 text-right">
                          {isEs ? `$${pkg.extraGuestPrice} USD (máx 20)` : `$${pkg.extraGuestPrice} USD (max 20)`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Clock size={15} className="text-[#003865]" />
                          {isEs ? 'Duración' : 'Duration'}
                        </span>
                        <span className="font-bold text-slate-900">{pkg.hours}h</span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Wine size={15} className="text-[#003865]" />
                          {isEs ? 'Barra Libre y Tripulación' : 'Open Bar & Crew'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Music size={15} className="text-[#003865]" />
                          {isEs ? '2 Pisos, Tobogán y Sonido' : '2 Decks, Slide & Sound'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      <div className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Waves size={15} className="text-[#003865]" />
                          {isEs ? 'Snorkel, SUP y Tapete Flotante' : 'Snorkel, SUP & Floating Mat'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPackage(pkg);
                      }}
                      className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition ${
                        isSelected
                          ? 'bg-[#003865] text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isSelected
                        ? (isEs ? '✓ Paquete Seleccionado' : '✓ Selected Package')
                        : (isEs ? 'Seleccionar y Cotizar' : 'Select & Customize')}
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
                {isEs ? 'Configura tu Chárter en 30 Ft "Baja Therapy"' : 'Configure Your 30 Ft "Baja Therapy" Charter'}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {isEs
                  ? 'Personaliza tu grupo (hasta 20 pasajeros), añade horas extras ($290 USD/hr) y traslado privado desde tu hotel.'
                  : 'Customize your group size (up to 20 passengers), add extra hours ($290 USD/hr), and round-trip private resort transfers.'}
              </p>
            </div>

            <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-3.5 sm:p-4 w-full md:w-auto md:min-w-[340px] lg:min-w-[380px] shadow-2xs shrink-0">
              <label htmlFor="select-paquete-baja-therapy" className="text-[11px] text-blue-900 font-extrabold uppercase tracking-wider block mb-1.5 flex items-center justify-between sm:justify-end gap-1.5">
                <span>{isEs ? 'Modificar Paquete Activo' : 'Active Package (Change)'}</span>
                <ChevronDown size={14} className="text-blue-900 shrink-0" />
              </label>
              <div className="relative">
                <select
                  id="select-paquete-baja-therapy"
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">

            {/* 1. Fecha */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <label htmlFor="charter-fecha-baja-therapy" className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                  <Calendar size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Fecha de navegación' : 'Charter Date'}</span>
                </label>
              </div>

              <div className="h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 flex items-center focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 transition">
                <input
                  id="charter-fecha-baja-therapy"
                  type="date"
                  value={charterFecha}
                  onChange={(e) => setCharterFecha(e.target.value)}
                  className="w-full bg-transparent text-slate-800 outline-none text-sm font-semibold cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Disponible todo el año en Cabo San Lucas.'
                  : 'Available all year for private experiences in Los Cabos.'}
              </p>
            </div>

            {/* 2. Total de Pasajeros (1 a 20) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Users size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Total de Pasajeros' : 'Total Passengers'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {huespedesExtra > 0
                    ? `+${huespedesExtra} extra (+$${costoHuespedesExtra.toLocaleString()} USD)`
                    : (isEs ? '10 incl.' : '10 incl.')}
                </span>
              </div>

              <div className="h-[52px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-1.5 transition">
                <button
                  type="button"
                  onClick={() => setTotalHuespedes(prev => Math.max(1, prev - 1))}
                  disabled={totalHuespedes <= 1}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-sm sm:text-base text-slate-900">
                  {totalHuespedes} {isEs ? 'Pasajeros' : 'Guests'}
                </div>
                <button
                  type="button"
                  onClick={() => setTotalHuespedes(prev => Math.min(20, prev + 1))}
                  disabled={totalHuespedes >= 20}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Incluye 1 a 10 pasajeros. De 11 a 20 suma $130 USD por persona adicional.'
                  : 'Covers 1 to 10 guests. Guests 11–20 add $130 USD per additional person.'}
              </p>
            </div>

            {/* 3. Horas Extras ($290 USD/hr) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Clock size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Horas Extras' : 'Extra Hours'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {horasExtras > 0
                    ? `+${horasExtras}h (+$${costoHorasExtras.toLocaleString()} USD)`
                    : '$290 USD/hr'}
                </span>
              </div>

              <div className="h-[52px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-1.5 transition">
                <button
                  type="button"
                  onClick={() => setHorasExtras(prev => Math.max(0, prev - 1))}
                  disabled={horasExtras <= 0}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-sm sm:text-base text-slate-900">
                  {horasExtras} {isEs ? 'Horas Extra' : 'Extra Hours'}
                </div>
                <button
                  type="button"
                  onClick={() => setHorasExtras(prev => Math.min(6, prev + 1))}
                  disabled={horasExtras >= 6}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Extiende tu fiesta privada por $290 USD por hora adicional.'
                  : 'Extend your private charter for $290 USD per additional hour.'}
              </p>
            </div>

          </div>

          {/* MÓDULO DE TRANSPORTE TERRESTRE OPCIONAL */}
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
                      ? 'Traslado exclusivo ida y vuelta desde tu hotel o villa a la Marina de Cabo San Lucas en Suburban o Sprinter de lujo.'
                      : 'Private round-trip SUV/Sprinter transfer from your resort or private villa directly to Cabo San Lucas Marina.'}
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
                <div className="relative">
                  <label className="text-xs text-slate-700 font-bold mb-1.5 block flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-900" />
                    {isEs ? 'Hotel o Villa de Recogida' : 'Pickup Resort or Villa'}
                  </label>
                  <input
                    type="text"
                    value={busquedaOrigen}
                    onFocus={() => setMostrarDropdownHoteles(true)}
                    onChange={(e) => {
                      setBusquedaOrigen(e.target.value);
                      setMostrarDropdownHoteles(true);
                    }}
                    placeholder={isEs ? 'Busca tu hotel o resort...' : 'Search your hotel or resort...'}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-900 outline-none font-medium shadow-xs"
                  />

                  {mostrarDropdownHoteles && (
                    <div className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl divide-y divide-slate-100">
                      {hotelesFiltrados.length > 0 ? (
                        hotelesFiltrados.map((h, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setTransporteOrigen(h.nombre);
                              setBusquedaOrigen(h.nombre);
                              setMostrarDropdownHoteles(false);
                            }}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 text-xs sm:text-sm text-slate-700 flex items-center justify-between transition"
                          >
                            <span className="truncate font-medium">{h.nombre}</span>
                            <span className="text-[10px] text-blue-900 font-semibold ml-2 shrink-0">Zona {h.zona}</span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-slate-400 text-center">
                          {isEs ? 'No se encontraron hoteles' : 'No matching resorts found'}
                        </div>
                      )}
                    </div>
                  )}

                  {transporteOrigen && (
                    <div className="mt-1.5 flex items-center justify-between text-xs text-blue-900 font-bold">
                      <span>✓ {transporteOrigen}</span>
                      <span>+${costoTransporte} USD (Round-Trip)</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-bold mb-1.5 block flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-900" />
                    {isEs ? 'Hora de Recogida (Ida)' : 'Hotel Pickup Time'}
                  </label>
                  <input
                    type="time"
                    value={horaRecogidaHotel}
                    onChange={(e) => setHoraRecogidaHotel(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-900 outline-none font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-700 font-bold mb-1.5 block flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-900" />
                    {isEs ? 'Hora de Regreso (Abierto)' : 'Marina Return Time (Open)'}
                  </label>
                  <input
                    type="time"
                    value={horaRegresoMarina}
                    onChange={(e) => setHoraRegresoMarina(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-900 outline-none font-medium shadow-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RESUMEN DE COTIZACIÓN */}
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

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-700 mt-3">
                <span className="bg-white/90 border border-slate-200/90 px-2.5 py-1 rounded-lg font-medium shadow-2xs">
                  • {paqueteSeleccionado.hours}h {isEs ? 'chárter' : 'charter'} (${paqueteSeleccionado.price.toLocaleString()} USD)
                </span>
                {huespedesExtra > 0 && (
                  <span className="bg-blue-100/70 text-blue-950 border border-blue-200 px-2.5 py-1 rounded-lg font-bold">
                    • {huespedesExtra} {isEs ? 'pasajeros extra' : 'extra guests'} (+${costoHuespedesExtra.toLocaleString()} USD)
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
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => handleOpenInquire(paqueteSeleccionado)}
                className="w-full sm:w-auto shrink-0 whitespace-nowrap px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition border-2 border-slate-200 hover:border-slate-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail size={18} className="text-[#7c5e3c] shrink-0" />
                <span>{isEs ? 'Solicitar Propuesta' : 'Inquire Now'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:w-auto shrink-0 whitespace-nowrap px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm tracking-wide transition shadow-lg shadow-blue-600/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={18} className="stroke-[3] shrink-0" />
                <span>{isEs ? 'Añadir a mi Carrito' : 'Add to Cart'}</span>
              </button>

              <a
                href={`https://wa.me/526121943286?text=${mensajeWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0 p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center shadow-md shadow-emerald-600/20 active:scale-95"
                title={isEs ? 'Chat con Concierge VIP por WhatsApp' : 'Chat with VIP Concierge on WhatsApp'}
              >
                <MessageCircle size={20} />
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* EXPERIENCE THESE MOMENTS ON THE 30 FT BAJA THERAPY       */}
      {/* ======================================================== */}
      <div className="bg-[#faf6f0] border-y border-[#e6d7c3] text-slate-900 py-16 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isEs ? 'Vive estos momentos en el ' : 'Experience these moments on the '}
              <span className="text-[#c8a45d]">30 Ft Baja Therapy</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experienciasMomentos.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-[#e6d7c3] shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.img}
                      alt={isEs ? item.titleEs : item.titleEn}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white text-slate-900 font-black text-[10px] uppercase tracking-wider shadow-xs">
                      {isEs ? item.badgeEs : item.badgeEn}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#003865] mb-1.5">
                      {isEs ? item.durationEs : item.durationEn}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">
                      {isEs ? item.titleEs : item.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isEs ? item.descEs : item.descEn}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInquire(paquetes[idx === 0 ? 0 : 1])}
                    className="text-xs font-extrabold uppercase tracking-wider text-slate-900 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isEs ? 'VER EXPERIENCIA →' : 'VIEW EXPERIENCE →'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ABOUT THE YACHT, SUNSET CRUISE & HOW EXPERIENCE UNFOLDS  */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Columna Izquierda: About the Yacht & Sunset Cruise Cabo */}
          <div className="lg:col-span-7 space-y-8">

            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'Acerca de la Embarcación' : 'About the Yacht'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-5">
                {isEs
                  ? 'Sube a Bordo de "Baja Therapy", el Pontón de Lujo de Doble Piso en Los Cabos'
                  : 'Step Aboard "Baja Therapy", a Luxury Double-Deck Pontoon in Los Cabos'}
              </h2>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  {isEs
                    ? 'Sube a bordo de Baja Therapy, un pontón de lujo de doble piso diseñado para chárters privados inolvidables en Los Cabos. Perfecto para cumpleaños, despedidas de soltero y soltera, o celebraciones en grupo, este party boat ofrece la combinación ideal de comodidad, diversión y estilo.'
                    : 'Step aboard Baja Therapy, a luxury double-deck pontoon designed for unforgettable private charters in Los Cabos. Perfect for birthdays, bachelor and bachelorette parties, or group celebrations, this party boat delivers the perfect blend of comfort, fun, and style.'}
                </p>

                <p>
                  {isEs
                    ? 'Navega frente a los monumentos naturales más icónicos de Cabo San Lucas, incluyendo El Arco, Playa del Amor y la Colonia de Lobos Marinos, mientras disfrutas de vistas panorámicas del océano desde su espaciosa cubierta superior (segundo piso). Fondea en una bahía tranquila para nadar, hacer esnórquel o relajarte bajo el sol de Baja. Equipado con barra libre, sistema de sonido premium y tripulación profesional, Baja Therapy ofrece una experiencia privada de primer nivel para hasta 20 invitados.'
                    : 'Cruise past Cabo San Lucas’ most iconic landmarks, including El Arco, Lover’s Beach, and the Sea Lion Colony, while enjoying panoramic ocean views from the spacious upper deck. Anchor in a calm bay to swim, snorkel, or relax under the Baja sun. Featuring an open bar, premium sound system, and professional crew, Baja Therapy offers a top-tier private experience for up to 20 guests.'}
                </p>
              </div>
            </section>

            {/* Sunset Cruise Cabo Featured Block */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Sun size={14} />
                {isEs ? 'Crucero al Atardecer en Cabo' : 'Sunset Cruise Cabo'}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs
                  ? 'Un chárter privado al atardecer con una ruta sin prisas, servicio impecable y vistas cinematográficas alrededor de El Arco.'
                  : 'A private sunset charter with an unhurried route, polished service, and cinematic views around Land’s End.'}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Diseñado para huéspedes que desean cerrar el día con estilo en lugar de hacer una parada turística apresurada. Esta experiencia lleva un ritmo cuidadosamente planeado, asegurando el ambiente perfecto, atención continua y momentos inolvidables mientras el sol se oculta en el horizonte.'
                  : 'Designed for guests who want to wind down the day with style, rather than a rushed sightseeing stop. This experience is carefully paced, ensuring the perfect mood, seamless service, and unforgettable moments as the sun dips below the horizon.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  {
                    en: 'Couples celebrating in Cabo',
                    es: 'Parejas celebrando en Cabo'
                  },
                  {
                    en: 'Small & medium private groups',
                    es: 'Grupos privados y amigos'
                  },
                  {
                    en: 'Proposal or anniversary plans',
                    es: 'Propuestas de matrimonio o aniversarios'
                  }
                ].map((ideal, idx) => (
                  <div key={idx} className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 text-xs font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-700 shrink-0" />
                    <span>{isEs ? ideal.es : ideal.en}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* How Your Onboard Experience Unfolds (4-Step Timeline) */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isEs ? 'Cómo se desarrolla tu experiencia a bordo' : 'How your onboard experience unfolds'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {isEs
                    ? 'Cada momento está planeado para que tu grupo solo se enfoque en disfrutar. Duración total estimada: 2.3 a 3.3 horas.'
                    : 'Every moment is planned so your group only focuses on enjoying. Estimated total duration: 2.3 – 3.3 hours.'}
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    titleEn: 'Marina Welcome & Setup',
                    titleEs: 'Bienvenida en la Marina y Preparación',
                    timeEn: 'Approx. 15 min',
                    timeEs: 'Aprox. 15 min',
                    descEn: 'Board your yacht, settle in with a welcome drink, and let the crew set the perfect music and route before setting sail.',
                    descEs: 'Sube a bordo, acomódate con una bebida de bienvenida y deja que la tripulación configure la música y ruta perfecta antes de zarpar.'
                  },
                  {
                    step: '2',
                    titleEn: 'Scenic Coastal Cruising',
                    titleEs: 'Navegación Costera Escénica',
                    timeEn: 'Approx. 60–90 min',
                    timeEs: 'Aprox. 60–90 min',
                    descEn: 'Glide past Cabo’s iconic landmarks with plenty of time for photos and toasts as we position the yacht for the sunset or bay anchoring.',
                    descEs: 'Navega frente a los monumentos icónicos de Cabo con amplio tiempo para fotos y brindis desde el segundo piso.'
                  },
                  {
                    step: '3',
                    titleEn: 'Golden Hour Magic / Bay Swim',
                    titleEs: 'Magia de la Hora Dorada / Nado en Bahía',
                    timeEn: 'Approx. 45–60 min',
                    timeEs: 'Aprox. 45–60 min',
                    descEn: 'The crew secures the best vantage point for the sunset or calm bay anchoring, allowing you to soak in the views while enjoying uninterrupted, premium service.',
                    descEs: 'La tripulación asegura el mejor punto panorámico para el atardecer o fondeo en bahía mientras disfrutas servicio continuo de barra libre.'
                  },
                  {
                    step: '4',
                    titleEn: 'Relaxed Return',
                    titleEs: 'Regreso Relajado a la Marina',
                    timeEn: 'Approx. 15–30 min',
                    timeEs: 'Aprox. 15–30 min',
                    descEn: 'A smooth and social cruise back to the marina, perfectly transitioning you into the rest of your evening plans.',
                    descEs: 'Un regreso suave y festivo hacia la marina, conectando perfectamente con el resto de tus planes en Cabo.'
                  }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="w-9 h-9 rounded-xl bg-[#003865] text-white font-black text-sm flex items-center justify-center shrink-0">
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {isEs ? s.titleEs : s.titleEn}
                        </h4>
                        <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {isEs ? s.timeEs : s.timeEn}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {isEs ? s.descEs : s.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Columna Derecha: Included Experiences, Included Onboard & Specifications */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">
                  <Ship size={16} />
                  {isEs ? 'Especificaciones Oficiales' : 'Official Specifications'}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  30 Ft Baja Therapy
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between">
                    <span className="font-semibold text-slate-600">{isEs ? 'Capacidad Máxima:' : 'Maximum Capacity:'}</span>
                    <span className="font-black text-slate-900">{isEs ? '20 pasajeros' : '20 passengers'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between">
                    <span className="font-semibold text-slate-600">{isEs ? 'Pasajeros Incluidos:' : 'Guests Included:'}</span>
                    <span className="font-black text-slate-900">{isEs ? '10 pasajeros' : '10 passengers'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between">
                    <span className="font-semibold text-slate-600">{isEs ? 'Niveles de Cubierta:' : 'Deck Levels:'}</span>
                    <span className="font-black text-slate-900">{isEs ? '2 (Doble Piso)' : '2 (Double-Deck)'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between">
                    <span className="font-semibold text-slate-600">{isEs ? 'Tipo:' : 'Type:'}</span>
                    <span className="font-black text-slate-900">Custom Pontoon</span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex justify-between">
                    <span className="font-semibold text-blue-950">{isEs ? 'Persona Adicional (11–20):' : 'Additional Person (11–20):'}</span>
                    <span className="font-black text-blue-950">$130 USD</span>
                  </div>
                </div>
              </div>

              {/* Included Onboard */}
              <div>
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs mb-3">
                  {isEs ? 'Incluido a Bordo (Included Onboard):' : 'Included Onboard:'}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {[
                    {
                      en: 'Upper deck lounge & Shaded seating',
                      es: 'Terraza lounge en segundo piso y asientos con sombra'
                    },
                    {
                      en: 'Open bar & Professional crew',
                      es: 'Barra libre y tripulación profesional'
                    },
                    {
                      en: 'Premium sound system',
                      es: 'Sistema de sonido premium'
                    },
                    {
                      en: 'Snorkel gear, Paddleboard, Floating mat & Upper-deck slide',
                      es: 'Equipo de esnórquel, Paddleboard, Tapete flotante y Tobogán'
                    },
                    {
                      en: 'Arch tours & Sunset cruises',
                      es: 'Tours al Arco y cruceros al atardecer'
                    }
                  ].map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <CheckCircle2 size={17} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-semibold">{isEs ? inc.es : inc.en}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Included Experiences */}
              <div>
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs mb-3">
                  {isEs ? 'Experiencias Incluidas:' : 'Included Experiences:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    isEs ? 'Cabo Party Boat' : 'Cabo party boat experience',
                    isEs ? 'Tours al Arco' : 'Arch tours',
                    isEs ? 'Esnórquel y Actividades Acuáticas' : 'Snorkeling & water activities',
                    isEs ? 'Crucero al Atardecer' : 'Los Cabos sunset cruise',
                    isEs ? 'Eventos Privados' : 'Private events'
                  ].map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ready to Sail CTA Card */}
            <div className="bg-[#003865] text-white rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
                {isEs ? 'Listo para Zarpar en' : 'Ready to Sail on'}
              </div>
              <h3 className="text-2xl font-black">30 Ft Baja Therapy</h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                {isEs
                  ? 'Compártenos tus fechas, número de pasajeros y preferencias. Te enviaremos una propuesta personalizada para tu experiencia en Los Cabos.'
                  : 'Share your dates, number of passengers, and preferences with us. We will send you a personalized proposal for your Los Cabos experience.'}
              </p>
              <button
                type="button"
                onClick={() => handleOpenInquire(paqueteSeleccionado)}
                className="w-full py-3.5 rounded-xl bg-[#c8b273] hover:bg-[#b89f5d] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                {isEs ? 'Solicitar Propuesta Personalizada' : 'Request Personalized Proposal'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SIMILAR BOATS (SUGERENCIAS DE LOS OTROS YATES)           */}
      {/* ======================================================== */}
      <div className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-[#003865] text-center mb-10 tracking-tight">
            {isEs ? 'Barcos Similares' : 'Similar Boats'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* 1: 57 ft La Dolce Vita */}
            <Link href={`/${lang}/yachts/la-dolce-vita`} className="group block text-center">
              <div className="aspect-square w-full max-w-[220px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-3 bg-slate-100">
                <img
                  src="/yachts/LA DOLCE VITA/Luend-3_t1FqE6w_cropped.avif"
                  alt="57 ft La Dolce Vita Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-base leading-snug">
                <span className="text-slate-600 font-normal">57 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  La Dolce Vita
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-600 mt-0.5">Custom Yacht 2020</div>
              <div className="text-xs italic text-slate-500 mt-0.5">
                {isEs ? 'Desde $1,999' : 'Starting at $1,999'}
              </div>
            </Link>

            {/* 2: 80 ft Papillon 9 */}
            <Link href={`/${lang}/yachts/papillon-9`} className="group block text-center">
              <div className="aspect-square w-full max-w-[220px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-3 bg-slate-100">
                <img
                  src="/yachts/papillon-9/papillon-1.avif"
                  alt="80 ft Black Sunseeker Manhattan Papillon 9 Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-base leading-snug">
                <span className="text-slate-600 font-normal">80 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Papillon 9
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-600 mt-0.5">Sunseeker Manhattan</div>
              <div className="text-xs italic text-slate-500 mt-0.5">
                {isEs ? 'Desde $5,500' : 'Starting at $5,500'}
              </div>
            </Link>

            {/* 3: 85 ft Contessa */}
            <Link href={`/${lang}/yachts/contessa`} className="group block text-center">
              <div className="aspect-square w-full max-w-[220px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-3 bg-slate-100">
                <img
                  src="/yachts/contessa/contessa-1.jpg"
                  alt="85 ft Contessa Her Shine Marine Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-base leading-snug">
                <span className="text-slate-600 font-normal">85 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Contessa
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-600 mt-0.5">Her Shine Marine</div>
              <div className="text-xs italic text-slate-500 mt-0.5">
                {isEs ? 'Desde $3,700' : 'Starting at $3,700'}
              </div>
            </Link>

            {/* 4: 108 ft Neoprene */}
            <Link href={`/${lang}/yachts/neoprene`} className="group block text-center">
              <div className="aspect-square w-full max-w-[220px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-3 bg-slate-100">
                <img
                  src="/yachts/neopreno/neoprene-gallery-02.jpg"
                  alt="108 ft Matte-Black Mangusta Superyacht Neoprene Cabo Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-base leading-snug">
                <span className="text-slate-600 font-normal">108 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Neoprene
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-600 mt-0.5">Mangusta 108</div>
              <div className="text-xs italic text-slate-500 mt-0.5">
                {isEs ? 'Desde $6,700' : 'Starting at $6,700'}
              </div>
            </Link>

            {/* 5: 110 ft Aquaholic */}
            <Link href={`/${lang}/yachts/aquaholic`} className="group block text-center">
              <div className="aspect-square w-full max-w-[220px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-3 bg-slate-100">
                <img
                  src="/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-hero.webp"
                  alt="110 ft Aquaholic Horizon Yacht Cabo Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-base leading-snug">
                <span className="text-slate-600 font-normal">110 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Aquaholic
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-600 mt-0.5">Horizon Yachts</div>
              <div className="text-xs italic text-slate-500 mt-0.5">
                {isEs ? 'Desde $5,900' : 'Starting at $5,900'}
              </div>
            </Link>

            {/* 6: 116 ft Capella */}
            <Link href={`/${lang}/yachts`} className="group block text-center">
              <div className="aspect-square w-full max-w-[220px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-3 bg-slate-100">
                <img
                  src="/yachts/capella-aerial-overview.jpg"
                  alt="116 ft Capella Azimut-Benetti Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-base leading-snug">
                <span className="text-slate-600 font-normal">116 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Capella
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-600 mt-0.5">Azimut-Benetti</div>
              <div className="text-xs italic text-slate-500 mt-0.5">
                {isEs ? 'Desde $8,000' : 'Starting at $8,000'}
              </div>
            </Link>
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
                    ? `Gracias ${inquireData.firstName}. Nuestro equipo VIP concierge de Ballard Tours se comunicará contigo a la brevedad con tu propuesta personalizada para el 30 Ft "Baja Therapy".`
                    : `Thank you ${inquireData.firstName}. Our VIP concierge team at Ballard Tours will get in touch with you shortly with your personalized proposal aboard the 30 Ft "Baja Therapy".`}
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
                    {isEs ? 'Listo para Zarpar en 30 Ft Baja Therapy' : 'Ready to Sail on 30 Ft Baja Therapy'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
                    {isEs
                      ? 'Compártenos tus fechas, número de pasajeros y preferencias. Te enviaremos una propuesta personalizada.'
                      : 'Share your dates, number of passengers, and preferences with us. We will send you a personalized proposal.'}
                  </p>
                  <div className="w-full h-px bg-slate-200 mt-4"></div>
                </div>

                <form onSubmit={handleSubmitInquire} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder={isEs ? 'Nombre' : 'First Name'}
                      value={inquireData.firstName}
                      onChange={(e) => setInquireData({ ...inquireData, firstName: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder={isEs ? 'Apellido' : 'Last Name'}
                      value={inquireData.lastName}
                      onChange={(e) => setInquireData({ ...inquireData, lastName: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none"
                    />
                  </div>

                  <input
                    type="date"
                    required
                    value={inquireData.date}
                    onChange={(e) => setInquireData({ ...inquireData, date: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-700 bg-slate-50 focus:ring-2 focus:ring-[#003865] outline-none"
                  />

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

                  <input
                    type="email"
                    required
                    placeholder={isEs ? 'Correo Electrónico' : 'Email'}
                    value={inquireData.email}
                    onChange={(e) => setInquireData({ ...inquireData, email: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none"
                  />

                  <textarea
                    rows={3}
                    placeholder={isEs ? 'Preferencias o celebración especial...' : 'Your preferences or celebration details...'}
                    value={inquireData.message}
                    onChange={(e) => setInquireData({ ...inquireData, message: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none resize-none"
                  />

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                    <span>
                      <strong>{isEs ? 'Paquete:' : 'Package:'}</strong> {isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn} ({totalHuespedes} pax)
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
                30 Ft &ldquo;Baja Therapy&rdquo; Double-Deck Pontoon
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxAbierto(false)}
              className="p-2 sm:p-2.5 text-white hover:text-blue-400 transition rounded-full bg-white/10 hover:bg-white/20 cursor-pointer shadow-lg active:scale-95"
            >
              <X size={22} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden touch-pan-y">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all z-30 cursor-pointer shadow-2xl active:scale-90"
            >
              <ChevronLeft size={28} />
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
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all z-30 cursor-pointer shadow-2xl active:scale-90"
            >
              <ChevronRight size={28} />
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
          </div>
        </div>
      )}

    </div>
  );
}

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
