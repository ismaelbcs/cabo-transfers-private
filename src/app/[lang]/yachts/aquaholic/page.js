// src/app/[lang]/yachts/aquaholic/page.js
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
  ShieldCheck,
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

export default function AquaholicYachtPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const { agregarAlCombo } = useCart();

  // ==========================================
  // CONFIGURACIÓN DE PAQUETES - 110FT HORIZON "AQUAHOLIC"
  // Regla aplicada:
  // - Paquete Base 3 Horas: Original $4,900 + $1,000 = $5,900 USD (1 a 10 pasajeros)
  // - Huésped Extra: Original $175 + $50 = $225 USD c/u (Capacidad máx: 30 pasajeros -> 20 extras)
  // - Hora Extra: Original $1,650 + $100 = $1,750 USD por hora
  // ==========================================
  const paquetes = [
    {
      id: 'charter-3-hours',
      nameEn: '3 HOURS ALL INCLUSIVE',
      nameEs: '3 HORAS TODO INCLUIDO',
      hours: 3,
      price: 5900, // Original $4,900 + $1,000
      baseGuests: 10,
      maxGuests: 30,
      extraGuestPrice: 225, // Original $175 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: true, // Paquete Principal Destacado
      descriptionEn: 'Exclusive 3-hour private charter aboard the 110ft Horizon "Aquaholic" for up to 10 base guests (30 max capacity). Includes professional chef, mixologist/bartender, open bar, gourmet dining, Arch visit, and water toys.',
      descriptionEs: 'Chárter privado exclusivo de 3 horas a bordo del Horizon "Aquaholic" de 110 pies para 10 huéspedes base (capacidad máx. 30). Incluye chef profesional, mixólogo/bartender, barra libre, alta cocina, visita al Arco y juguetes acuáticos.'
    },
    {
      id: 'charter-4-hours',
      nameEn: '4 HOURS ALL INCLUSIVE',
      nameEs: '4 HORAS TODO INCLUIDO',
      hours: 4,
      price: 7650, // 3h ($5,900) + 1h extra ($1,750)
      baseGuests: 10,
      maxGuests: 30,
      extraGuestPrice: 225,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Extended 4-hour luxury cruise past El Arco and Lover’s Beach with private snorkeling stop, paddleboards, handcrafted cocktails by your onboard mixologist, and freshly prepared chef cuisine.',
      descriptionEs: 'Crucero de lujo extendido de 4 horas por El Arco y Playa del Amor con parada privada de esnórquel, paddleboards, cócteles de autor preparados por tu mixólogo y alta cocina del chef.'
    },
    {
      id: 'charter-6-hours',
      nameEn: '6 HOURS ALL INCLUSIVE',
      nameEs: '6 HORAS TODO INCLUIDO',
      hours: 6,
      price: 11150, // 3h ($5,900) + 3h extra ($5,250)
      baseGuests: 10,
      maxGuests: 30,
      extraGuestPrice: 225,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Half-day superyacht adventure to Santa María or Chileno Bay. Enjoy swimming in crystal-clear coves, whale watching (seasonal), flybridge lounging, and multi-course dining.',
      descriptionEs: 'Aventura de medio día hacia Bahía Santa María o Chileno. Disfruta nadando en aguas cristalinas, avistamiento de ballenas (en temporada), descanso en el flybridge y comida de varios tiempos.'
    },
    {
      id: 'charter-8-hours',
      nameEn: '8 HOURS ALL INCLUSIVE',
      nameEs: '8 HORAS TODO INCLUIDO',
      hours: 8,
      price: 14650, // 3h ($5,900) + 5h extra ($8,750)
      baseGuests: 10,
      maxGuests: 30,
      extraGuestPrice: 225,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Full-day VIP celebration for up to 30 guests. Chart your own course along the Cabo coastline with beach stops, snorkeling, sunset views, full open bar, and private chef hospitality.',
      descriptionEs: 'Celebración VIP de día completo para hasta 30 invitados. Traza tu propia ruta por la costa de Los Cabos con paradas en playa, esnórquel, atardecer, barra libre y chef privado.'
    }
  ];

  // ==========================================
  // ESTADOS DEL CONFIGURADOR / CALCULADORA
  // ==========================================
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(paquetes[0]); // 3 Horas ($5,900 USD) por defecto
  const [charterFecha, setCharterFecha] = useState('');
  const [totalHuespedes, setTotalHuespedes] = useState(10);
  const [horasExtras, setHorasExtras] = useState(0); // $1,750 USD por hora extra ($1,650 + $100)
  const PRECIO_HORA_EXTRA = 1750;

  // Estados de Transportación Terrestre
  const [incluirTransporte, setIncluirTransporte] = useState(false);
  const [transporteOrigen, setTransporteOrigen] = useState('');
  const [busquedaOrigen, setBusquedaOrigen] = useState('');
  const [mostrarDropdownHoteles, setMostrarDropdownHoteles] = useState(false);
  const [horaRecogidaHotel, setHoraRecogidaHotel] = useState('11:00');
  const [horaRegresoMarina, setHoraRegresoMarina] = useState('18:00');

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

  // Cálculo de Huéspedes Extra (Máximo 20 extra -> 30 total)
  const huespedesExtra = Math.max(0, totalHuespedes - paqueteSeleccionado.baseGuests);
  const costoHuespedesExtra = huespedesExtra * paqueteSeleccionado.extraGuestPrice;

  // Cálculo de Horas Extras ($1,750 USD c/u)
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
  // FOTOS REALES DEL YATE 110FT HORIZON "AQUAHOLIC" (CARPETA HORIZON)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-hero.webp',
      titleEn: '110ft Horizon Yacht "Aquaholic" luxury charter profile in Cabo San Lucas Mexico',
      titleEs: 'Perfil Completo del Yate de Lujo 110ft Horizon "Aquaholic" en Cabo San Lucas',
      descEn: 'Step aboard the exquisite 110ft Horizon yacht "Aquaholic", designed for the pinnacle of luxury and private group adventures up to 30 guests.',
      descEs: 'Sube a bordo del exquisito yate Horizon de 110 pies "Aquaholic", diseñado para la cúspide del lujo y celebraciones privadas de hasta 30 invitados.',
      labelEn: '110ft Profile',
      labelEs: 'Perfil 110ft'
    },
    {
      src: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-2.webp',
      titleEn: 'Sleek Exterior & Expansive Bow of the 110ft Horizon Yacht Aquaholic',
      titleEs: 'Diseño Exterior Elegante y Amplia Proa del Yate Horizon 110ft Aquaholic',
      descEn: 'Timeless craftsmanship with expansive front seating, sunbathing deck, and panoramic salon windows.',
      descEs: 'Artesanía atemporal con amplios asientos delanteros, asoleadero en proa y ventanales panorámicos en el salón.',
      labelEn: 'Bow & Profile',
      labelEs: 'Proa y Exterior'
    },
    {
      src: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-5.webp',
      titleEn: 'Expansive Flybridge with Wet Bar, Barstools, Curved Seating & Sunpads',
      titleEs: 'Amplio Flybridge con Barra, Bancos de Bar, Sala Curva y Camastros',
      descEn: 'Lounge on the expansive sundeck while your private mixologist prepares handcrafted cocktails with 360-degree ocean views.',
      descEs: 'Relájate en el amplio flybridge mientras tu mixólogo privado prepara cócteles artesanales con vistas de 360 grados al mar.',
      labelEn: 'Flybridge Lounge',
      labelEs: 'Flybridge y Bar'
    },
    {
      src: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-3.webp',
      titleEn: 'Shaded Aft Deck & Twin Staircases Leading to the Swim Platform',
      titleEs: 'Cubierta de Popa Sombreada y Doble Escalera hacia la Plataforma de Nado',
      descEn: 'Shaded back seating and cockpit with direct ocean access for snorkeling, paddleboarding, and swimming.',
      descEs: 'Asientos traseros sombreados y cockpit con acceso directo al mar para practicar esnórquel, paddleboard y nadar.',
      labelEn: 'Aft Deck & Stern',
      labelEs: 'Popa y Plataforma'
    },
    {
      src: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-4.webp',
      titleEn: 'Commanding Bow & Upper Deck Vantage Point Aboard Aquaholic 110ft',
      titleEs: 'Imponente Vista Frontal de Proa y Cubierta Superior del Aquaholic 110ft',
      descEn: 'Enjoy front-row views of Cabo’s turquoise waters, El Arco, and Lover’s Beach from the forward sundeck.',
      descEs: 'Disfruta vistas en primera fila de las aguas turquesa de Cabo, El Arco y Playa del Amor desde la cubierta de proa.',
      labelEn: 'Front View',
      labelEs: 'Vista Frontal'
    },
    {
      src: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-7.webp',
      titleEn: 'Air-Conditioned Formal Dining Room & Open-Concept Luxury Interior',
      titleEs: 'Comedor Formal Climatizado e Interior de Lujo de Concepto Abierto',
      descEn: 'Adorned with sleek natural wood finishes, marble floors, crystal glassware display, and formal dining prepared by your private chef.',
      descEs: 'Adornado con finos acabados en madera natural, pisos de mármol, vitrina de cristalería y comedor formal atendido por tu chef privado.',
      labelEn: 'Formal Dining',
      labelEs: 'Comedor Interior'
    },
    {
      src: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-6.webp',
      titleEn: 'Full-Beam Master Stateroom with King Bed, Natural Wood & Vanity Lounge',
      titleEs: 'Camarote Principal Master Full-Beam con Cama King y Sala Privada',
      descEn: 'One of four luxurious air-conditioned bedrooms offering ultimate comfort, privacy, and en-suite bathroom.',
      descEs: 'Una de las cuatro lujosas habitaciones climatizadas que brindan máximo confort, privacidad y baño privado.',
      labelEn: 'Master Cabin',
      labelEs: 'Camarote Master'
    },
    {
      src: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-8.webp',
      titleEn: 'Luxurious VIP Stateroom with King Bed & En-Suite Bathroom',
      titleEs: 'Lujosa Cabina Principal VIP con Cama King y Baño en Suite',
      descEn: 'Second main cabin featuring plush bedding, natural wood cabinetry, stainless portholes, and full climate control.',
      descEs: 'Segunda cabina principal equipada con cama de lujo, ebanistería fina, ojos de buey en acero inoxidable y aire acondicionado.',
      labelEn: 'VIP Cabin',
      labelEs: 'Cabina VIP'
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
      id: `yacht-aquaholic-${paqueteSeleccionado.id}-${Date.now()}`,
      tipo: 'yate',
      nombre: `110ft Horizon "Aquaholic" - ${isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn}`,
      fecha: charterFecha,
      horario: incluirTransporte ? `${horaRecogidaHotel} - ${horaRegresoMarina}` : `${totalHoras} Hours Charter`,
      pasajeros: totalHuespedes,
      precio: granTotalYate,
      detalles: {
        embarcacion: '110 Ft Horizon "Aquaholic"',
        paqueteBase: isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn,
        horasBase: paqueteSeleccionado.hours,
        horasExtras,
        costoHorasExtras,
        huespedesBase: 10,
        huespedesExtra,
        costoHuespedesExtra,
        incluyeTransporte: incluirTransporte,
        hotelOrigen: incluirTransporte ? transporteOrigen : 'No Ground Transfer (Direct at Marina)',
        horaIda: incluirTransporte ? horaRecogidaHotel : null,
        horaVuelta: incluirTransporte ? horaRegresoMarina : null,
        costoTransporte,
        notaFiscal: isEs
          ? 'Propinas e impuestos no incluidos. Pagos con tarjeta aplican 16% IVA; pagos en efectivo libres de impuestos.'
          : 'Gratuity and taxes not included. Credit card payments apply 16% VAT; cash payments are tax-free.'
      }
    });

    router.push(`/${lang}/checkout`);
  };

  const handleSubmitInquire = async (e) => {
    e.preventDefault();
    setEnviandoInquiry(true);

    try {
      const payload = {
        tipo: 'Yacht Charter Inquiry - 110ft Horizon Aquaholic',
        embarcacion: '110ft Horizon "Aquaholic"',
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

      await addDoc(collection(db, 'yacht_inquiries'), payload);

      await sendEmail({
        to: 'ballardtours@gmail.com',
        subject: `🛥️ New Yacht Inquiry: 110ft Horizon "Aquaholic" (${payload.clienteNombre})`,
        html: `
          <h2>Solicitud de Reserva / Información - 110ft Horizon "Aquaholic"</h2>
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
            <li><strong>Total Estimado:</strong> $${granTotalYate.toLocaleString()} USD (16% VAT on card / cash tax-free)</li>
          </ul>
          <p><strong>Mensaje del cliente:</strong><br/>${payload.mensaje || 'Sin mensaje adicional'}</p>
        `
      });

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
      ? `¡Hola! Me interesa reservar el yate de lujo 110ft Horizon "Aquaholic" en Cabo San Lucas.\n\n• Paquete: ${paqueteSeleccionado.nameEs}\n• Fecha: ${charterFecha || 'Por definir'}\n• Huéspedes: ${totalHuespedes} personas\n• Horas extra: ${horasExtras}\n• Transporte terrestre: ${incluirTransporte ? `Sí (${transporteOrigen})` : 'No'}\n• Total estimado: $${granTotalYate.toLocaleString()} USD`
      : `Hello! I'm interested in chartering the 110ft Horizon "Aquaholic" luxury yacht in Cabo San Lucas.\n\n• Package: ${paqueteSeleccionado.nameEn}\n• Date: ${charterFecha || 'TBD'}\n• Guests: ${totalHuespedes} guests\n• Extra hours: ${horasExtras}\n• Ground transport: ${incluirTransporte ? `Yes (${transporteOrigen})` : 'No'}\n• Estimated total: $${granTotalYate.toLocaleString()} USD`
  );

  // ==========================================
  // 6 AVENTURAS PRIVADAS INCLUIDAS (DE LAS IMÁGENES DEL USUARIO)
  // ==========================================
  const aventurasIncluidas = [
    {
      titleEn: 'SNORKEL TOUR',
      titleEs: 'TOUR DE ESNÓRQUEL',
      descEn: 'Private snorkeling tour in crystal-clear turquoise bays teeming with marine life.',
      descEs: 'Tour privado de esnórquel en bahías turquesa de aguas cristalinas llenas de vida marina.',
      img: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-3.webp'
    },
    {
      titleEn: 'VISIT TO THE ARCH',
      titleEs: 'VISITA AL ARCO',
      descEn: 'Front-row views of El Arco, Lover’s Beach, Pelican Rock, and Land’s End formations.',
      descEs: 'Vistas en primera fila de El Arco, Playa del Amor, Roca Pelícano y el Finisterra.',
      img: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-4.webp'
    },
    {
      titleEn: 'WHALE WATCHING',
      titleEs: 'AVISTAMIENTO DE BALLENAS',
      descEn: 'Unforgettable private whale watching encounters in Cabo waters during season.',
      descEs: 'Encuentros privados inolvidables con ballenas jorobadas y grises en temporada.',
      img: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-hero.webp'
    },
    {
      titleEn: 'WATER TOYS',
      titleEs: 'JUGUETES ACUÁTICOS',
      descEn: 'Exciting water toys including stand-up paddleboards, floating mats, and snorkel gear.',
      descEs: 'Divertidos juguetes acuáticos incluyendo tablas de paddleboard y equipo de esnórquel.',
      img: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-2.webp'
    },
    {
      titleEn: 'SUNSET CRUISE',
      titleEs: 'CRUCERO AL ATARDECER',
      descEn: 'Sail into Cabo’s legendary golden sunset with handcrafted cocktails from your mixologist.',
      descEs: 'Navega bajo el legendario atardecer de Los Cabos con cócteles de autor de tu mixólogo.',
      img: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-5.webp'
    },
    {
      titleEn: 'BEACH STOP',
      titleEs: 'PARADA EN PLAYA',
      descEn: 'Chart your own course with anchoring stops at calm, swimmable Baja beaches.',
      descEs: 'Traza tu propia ruta con paradas frente a playas tranquilas y cristalinas para nadar.',
      img: '/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-7.webp'
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
                <span>{isEs ? 'Superyate de Lujo • Capacidad hasta 30 Invitados' : '110ft Luxury Motor Yacht • Up to 30 Guests Capacity'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                {isEs
                  ? 'Aquaholic – Renta de Yate de Lujo 110ft Horizon en Cabo San Lucas'
                  : '110 Ft Horizon "Aquaholic" – Luxury Yacht Charter in Cabo San Lucas'}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                {isEs
                  ? '4 Camarotes • 3 Baños • Chef Privado y Mixólogo a Bordo • Amplio Flybridge y Asoleadero • Desde 3 Horas Todo Incluido hasta 30 Pasajeros.'
                  : '4 Staterooms • 3 Bathrooms • Private Chef & Mixologist Onboard • Expansive Flybridge & Sundeck • Up to 30 Guests in Cabo San Lucas.'}
              </p>
            </div>

            {/* Botones rápidos en el tope */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenInquire(paqueteSeleccionado)}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                {isEs ? 'Solicitar Información' : 'Inquire'}
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
      {/* GALERÍA VISUAL INTERACTIVA (8 FOTOS REALES DEL HORIZON)  */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">

        {/* Imagen Principal Activa */}
        <div
          className="relative h-[320px] sm:h-[460px] md:h-[540px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-lg group bg-slate-900 mb-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={fotosGaleria[fotoActiva].src}
            alt={
              fotoActiva === 0
                ? 'Aquaholic 110ft Horizon luxury yacht charter in Cabo San Lucas Mexico'
                : (isEs ? fotosGaleria[fotoActiva].titleEs : fotosGaleria[fotoActiva].titleEn)
            }
            className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
            onClick={() => setLightboxAbierto(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20 pointer-events-none" />

          {/* Flecha Izquierda */}
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

          {/* Flecha Derecha */}
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

          {/* Contador y botón de pantalla completa arriba a la derecha */}
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

          {/* Descripción de la foto abajo */}
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
              <span>{isEs ? `Ver las ${fotosGaleria.length} fotos` : `View all ${fotosGaleria.length} photos`}</span>
            </button>
          </div>
        </div>

        {/* Carrusel de Miniaturas */}
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
      {/* SECCIÓN DE RESEÑAS Y SOCIOS DE CONFIANZA                 */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <HeroReviewsBadge isEs={isEs} />
      </div>

      <div className="mb-12">
        <TrustedPartners isEs={isEs} />
      </div>

      {/* ======================================================== */}
      {/* SECCIÓN DE PAQUETES Y TARIFAS (DESDE 3 HORAS $5,900 USD)  */}
      {/* ======================================================== */}
      <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#003865] tracking-tight">
            {isEs ? 'Tarifas para este Chárter Exclusivo' : 'Pricing for This Exclusive Yacht Charter'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            {isEs
              ? 'Paquete base de 3 Horas Todo Incluido para 1 a 10 invitados (capacidad máxima 30 pasajeros). Incluye chef profesional, mixólogo/bartender, barra libre y juguetes acuáticos.'
              : 'Base 3-Hour All-Inclusive Charter for 1 to 10 guests (max. capacity 30 guests). Includes professional chef, mixologist/bartender, open bar, and water toys.'
            }
          </p>
        </div>

        {/* Grid de 4 Tarjetas de Paquetes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {paquetes.map((pkg, idx) => {
            const isSelected = paqueteSeleccionado.id === pkg.id;

            const headerColors = [
              'bg-[#003865]', // 3 Hours Base (Featured)
              'bg-[#1877d2]', // 4 Hours
              'bg-[#0d5ca8]', // 6 Hours
              'bg-[#07427c]'  // 8 Hours
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
                {/* Etiqueta Most Popular / Base Charter */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c8b273] text-white text-xs font-extrabold px-5 py-1.5 rounded-t-md shadow-xs tracking-wide z-10 whitespace-nowrap">
                    {isEs ? 'Paquete Base 3 Horas' : 'Base 3-Hour Charter'}
                  </div>
                )}

                {/* Encabezado Azul */}
                <div className={`${headerColors[idx]} text-white text-center py-3.5 px-4 rounded-t-[10px]`}>
                  <h3 className="font-extrabold text-sm tracking-wider uppercase">
                    {isEs ? pkg.nameEs : pkg.nameEn}
                  </h3>
                </div>

                {/* Cuerpo de la Tarjeta */}
                <div className="p-6 flex-1 flex flex-col justify-between text-slate-800">

                  <div>
                    {/* Precio Principal */}
                    <div className="text-center mb-5">
                      <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                        ${pkg.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <p className="text-[11px] italic text-slate-500 mt-1">
                        {isEs
                          ? 'Para 1 a 10 invitados • Impuestos no incluidos'
                          : 'For 1 to 10 guests • Taxes not included'}
                      </p>
                    </div>

                    {/* Lista de Detalles */}
                    <div className="space-y-2.5 text-xs border-t border-slate-200 pt-4">

                      {/* Guests */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Users size={15} className="text-[#003865]" />
                          {isEs ? 'Huéspedes Base' : 'Guests'}
                        </span>
                        <span className="font-bold text-slate-900">1 - {pkg.baseGuests}</span>
                      </div>

                      {/* Extra Guests */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Users size={15} className="text-[#003865]" />
                          {isEs ? 'Huésped Extra' : 'Extra Guest'}
                        </span>
                        <span className="font-medium text-slate-600 text-right">
                          {isEs ? `$${pkg.extraGuestPrice} c/u (máx 30)` : `$${pkg.extraGuestPrice} (max. cap. 30)`}
                        </span>
                      </div>

                      {/* Hours */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Clock size={15} className="text-[#003865]" />
                          {isEs ? 'Duración' : 'Hours'}
                        </span>
                        <span className="font-bold text-slate-900">{pkg.hours}</span>
                      </div>

                      {/* Chef & Gourmet Dining */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Utensils size={15} className="text-[#003865]" />
                          {isEs ? 'Chef Privado y Comida Gourmet' : 'Private Chef & Gourmet Dining'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      {/* Open Bar & Mixologist */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Wine size={15} className="text-[#003865]" />
                          {isEs ? 'Barra Libre y Mixólogo' : 'Open Bar & Mixologist'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      {/* Water Toys & Arch Visit */}
                      <div className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Waves size={15} className="text-[#003865]" />
                          {isEs ? 'Arco, Snorkel y Paddleboards' : 'Arch, Snorkel & Paddleboards'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                    </div>
                  </div>

                  {/* Botón de Selección dentro de la tarjeta */}
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
                        : (isEs ? 'Seleccionar y Cotizar' : 'Select & Customize')
                      }
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Botón Central "INQUIRE NOW" y Nota Importante de Impuestos */}
        <div className="text-center mt-10 space-y-4">
          <button
            type="button"
            onClick={() => handleOpenInquire(paqueteSeleccionado)}
            className="px-10 py-3.5 bg-[#003865] hover:bg-[#002647] text-white font-extrabold text-sm uppercase tracking-widest rounded-md shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            {isEs ? 'SOLICITAR INFORMACIÓN AHORA' : 'INQUIRE NOW'}
          </button>

          <div className="max-w-2xl mx-auto bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-0.5">
              {isEs ? 'Información Importante para todos los barcos:' : 'Important Information for all boats:'}
            </strong>
            {isEs
              ? 'Huésped Extra: $225 USD por persona (capacidad máx. 30 invitados) • Hora Extra: $1,750 USD. Las propinas y los impuestos no están incluidos en los precios listados. Para pagos con tarjeta de crédito aplica el 16% de IVA, mientras que los pagos en efectivo están libres de impuestos.'
              : 'Extra Guest: $225 USD per guest (max. cap. 30) • Extra Hour: $1,750 USD. Gratuity and taxes are not included in the prices listed. For credit card payments, a 16% VAT tax will apply, while cash payments are tax-free.'
            }
          </div>
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
                {isEs ? 'Configura tu Chárter en el Aquaholic 110ft' : 'Configure Your 110ft Aquaholic Charter'}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {isEs
                  ? 'Personaliza tu grupo (hasta 30 invitados), añade horas extras ($1,750 USD/hr) y traslado privado desde tu hotel.'
                  : 'Customize your group size (up to 30 guests), add extra hours ($1,750 USD/hr), and round-trip private resort transfers.'
                }
              </p>
            </div>

            {/* Selector de Paquete Activo */}
            <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-3.5 sm:p-4 w-full md:w-auto md:min-w-[340px] lg:min-w-[380px] shadow-2xs shrink-0">
              <label htmlFor="select-paquete-aquaholic" className="text-[11px] text-blue-900 font-extrabold uppercase tracking-wider block mb-1.5 flex items-center justify-between sm:justify-end gap-1.5">
                <span>{isEs ? 'Modificar Paquete Activo' : 'Active Package (Change)'}</span>
                <ChevronDown size={14} className="text-blue-900 shrink-0" />
              </label>
              <div className="relative">
                <select
                  id="select-paquete-aquaholic"
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
                {isEs ? 'Haz clic aquí para cambiar la duración base' : 'Click here to switch package duration'}
              </span>
            </div>
          </div>

          {/* 3 COLUMNAS DEL CONFIGURADOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">

            {/* 1. Selector de Fecha */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <label htmlFor="charter-fecha-aquaholic" className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                  <Calendar size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Fecha de navegación' : 'Charter Date'}</span>
                </label>
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  {isEs ? 'Seleccionar día' : 'Select day'}
                </span>
              </div>

              <div className="h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 flex items-center focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 transition">
                <input
                  id="charter-fecha-aquaholic"
                  type="date"
                  value={charterFecha}
                  onChange={(e) => setCharterFecha(e.target.value)}
                  className="w-full bg-transparent text-slate-800 outline-none text-sm font-semibold cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Elige la fecha deseada para confirmar disponibilidad del yate.'
                  : 'Select desired date to check Aquaholic availability.'
                }
              </p>
            </div>

            {/* 2. Selector de Huéspedes Totales (Hasta 30 pasajeros: 10 base + 20 extra) */}
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
                  onClick={() => setTotalHuespedes(prev => Math.min(30, prev + 1))}
                  disabled={totalHuespedes >= 30}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Increase Guests"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Incluye 1 a 10 personas. De 11 a 30 suma $225 USD por huésped extra.'
                  : 'Covers 1 to 10 guests. Guests 11–30 add $225 USD per extra guest.'
                }
              </p>
            </div>

            {/* 3. Selector de Horas Extras ($1,750 USD/hr) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Clock size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Horas Extras' : 'Extra Hours'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {horasExtras > 0
                    ? `+${horasExtras}h (+$${costoHorasExtras.toLocaleString()} USD)`
                    : '$1,750 USD/hr'}
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
                  onClick={() => setHorasExtras(prev => Math.min(10, prev + 1))}
                  disabled={horasExtras >= 10}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Increase Extra Hours"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Extiende tu recorrido por $1,750 USD por cada hora adicional.'
                  : 'Extend your charter for $1,750 USD per additional hour.'
                }
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
                      ? 'Traslado exclusivo ida y vuelta desde tu hotel o villa a la Marina de Cabo San Lucas en Suburban o Sprinter de lujo. Horario 100% flexible.'
                      : 'Private round-trip SUV/Sprinter transfer from your resort or private villa directly to Cabo San Lucas Marina. 100% flexible schedule.'
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

                {/* Buscador de Hotel */}
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

                {/* Hora de Recogida en el Hotel */}
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
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {isEs ? 'Directo al muelle del Aquaholic en Marina CSL' : 'Direct to Aquaholic slip at Cabo Marina'}
                  </span>
                </div>

                {/* Hora de Regreso desde la Marina */}
                <div className="flex flex-col justify-between">
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

                  <span className="text-[11px] text-emerald-700 mt-1 font-semibold">
                    {isEs ? '✓ Sin límite de tiempo: tú eliges la hora exacta.' : '✓ No time limit: choose your exact return schedule.'}
                  </span>
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
                {isEs
                  ? '* Propinas e impuestos no incluidos. Pagos con tarjeta aplican 16% IVA; pagos en efectivo libres de impuestos.'
                  : '* Gratuity and taxes not included. Credit card payments apply 16% VAT; cash payments are tax-free.'}
              </p>
            </div>

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
      {/* AVENTURAS PRIVADAS INCLUIDAS (DE LAS IMÁGENES DEL USUARIO) */}
      {/* ======================================================== */}
      <div className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest mb-3 border border-white/15">
              <Compass size={14} />
              {isEs ? 'Aventuras Privadas Incluidas' : 'Private Adventures Included in our Yacht Rentals'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              {isEs
                ? 'Aventuras Privadas Incluidas en tu Renta de Yate'
                : 'Private Adventures Included in our Yacht Rentals'
              }
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {isEs
                ? 'Todas nuestras rentas de yates en Los Cabos incluyen actividades opcionales como tour privado de esnórquel, visita al Arco, Playa del Amor y todas las formaciones rocosas en el camino, avistamiento de ballenas, experiencia de navegación, parada en playa y mucho más. Al ser una experiencia 100% privada, eres libre de trazar tu propio rumbo.'
                : 'All our yacht rentals in Cabo include optional activities such as a private snorkeling tour, visit to the Arch, Lover’s Beach and all the rock formations on the way, whale watching, sailing experience, beach stop and more. As this is a private experience, you are free to chart your own course, deciding whether to spend more time swimming in crystal-clear waters or cruising aboard our stunning vessels.'
              }
            </p>
          </div>

          {/* Grid de 6 Tarjetas estilo Foto con Etiqueta Blanca Inferior */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {aventurasIncluidas.map((item, index) => (
              <div key={index} className="group relative flex flex-col items-center">
                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-slate-900">
                  <img
                    src={item.img}
                    alt={isEs ? item.titleEs : item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="-mt-6 z-10 bg-white text-slate-950 px-6 py-3 rounded-xl shadow-lg border border-slate-200 min-w-[230px] text-center">
                  <h3 className="font-black text-sm sm:text-base tracking-wider uppercase text-[#003865]">
                    {isEs ? item.titleEs : item.titleEn}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                    {isEs ? item.descEs : item.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESCRIPCIÓN Y ESPECIFICACIONES COMPLETAS (TEMA CLARO)     */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        {/* FILA 1: DESCRIPCIÓN, INTERIOR DE LUJO, EXTERIOR ESPACIOSO Y KEY FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">

          {/* Columna Izquierda: Descripción, Luxury Interior, Spacious Exterior y World-Class Amenities */}
          <div className="lg:col-span-7 space-y-8">

            {/* Sección 1: Descripción General */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'Descripción del Yate' : 'Description'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">
                {isEs
                  ? 'Sube a Bordo del "Aquaholic", un Exquisito Yate Horizon de 110 Pies en Cabo San Lucas'
                  : 'Step Aboard the "Aquaholic", an Exquisite 110ft Horizon Yacht in Cabo San Lucas'
                }
              </h2>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  {isEs
                    ? 'Sube a bordo del "Aquaholic", un exquisito yate Horizon de 110 pies diseñado para quienes buscan la cúspide del lujo y la aventura en las impresionantes aguas de Cabo San Lucas, México. Con su diseño estilizado, interiores elegantes y amenidades de clase mundial, este yate ofrece la experiencia definitiva de chárter privado.'
                    : 'Step aboard the "Aquaholic", an exquisite 110ft Horizon yacht designed for those who seek the pinnacle of luxury and adventure in the stunning waters of Cabo San Lucas, Mexico. With its sleek design, elegant interiors, and world-class amenities, this yacht offers the ultimate private charter experience.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'Ya sea que estés celebrando una ocasión especial, organizando una reunión exclusiva de hasta 30 invitados o simplemente disfrutando de una escapada serena, este yate brinda una combinación perfecta de comodidad, sofisticación e impresionantes vistas al océano. Totalmente equipado con amplias salas de estar, áreas de comedor premium y servicio de primer nivel con chef y mixólogo a bordo, es el escenario perfecto para momentos inolvidables en el mar. Embárcate en un viaje hecho a la medida y permítenos crear una experiencia que supere tus expectativas.'
                    : 'Whether you’re celebrating a special occasion, hosting an exclusive gathering, or simply indulging in a serene escape, Aquaholic provides a seamless blend of comfort, sophistication, and breathtaking ocean views. Fully equipped with spacious lounges, premium dining areas, and top-tier service, this yacht is the perfect setting for unforgettable moments at sea. Embark on a tailor-made journey and let us craft an experience that exceeds your expectations.'
                  }
                </p>
              </div>
            </section>

            {/* Sección 2: Luxury Interior */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Sparkles size={14} />
                {isEs ? 'Interior de Lujo Climatizado' : 'Luxury Interior'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs ? 'Concepto Abierto, Acabados en Madera Natural y Ventanas Panorámicas' : 'Open-Concept Elegance, Natural Wood Finishes & Panoramic Windows'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Sumérgete en un ambiente de elegancia inigualable. Este yate de 110 pies en Los Cabos cuenta con un interior climatizado de concepto abierto, adornado con elegantes acabados en madera natural, mobiliario de lujo y una decoración sofisticada. Cada detalle está diseñado para proporcionar el equilibrio perfecto entre comodidad y estilo, creando un entorno refinado y acogedor. Con amplios espacios de sala, una cocina totalmente equipada y espectaculares ventanas panorámicas, tú y tus invitados disfrutarán de una verdadera experiencia de primera clase mientras navegan por las aguas de Cabo San Lucas.'
                  : 'Immerse yourself in an ambiance of unparalleled elegance. This 110ft yacht in Cabo features an open-concept interior, adorned with sleek natural wood finishes, plush furnishings, and sophisticated décor. Every detail is designed to provide the perfect balance of comfort and style, creating a refined yet inviting setting. With expansive living spaces, a fully equipped galley, and stunning panoramic windows, you and your guests can indulge in a truly first-class experience while cruising the breathtaking waters of Cabo San Lucas.'
                }
              </p>
            </section>

            {/* Sección 3: Spacious Exterior & World-Class Amenities */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Waves size={14} />
                {isEs ? 'Exterior Espacioso y Amenidades de Clase Mundial' : 'Spacious Exterior & World-Class Amenities'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs ? 'Amplio Flybridge, Popa Sombreada, Proa con Asoleadero y Servicio Todo Incluido' : 'Expansive Sundeck, Shaded Aft Deck, Bow Seating & World-Class Amenities'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Las áreas exteriores están diseñadas tanto para la relajación como para el entretenimiento, ofreciendo los mejores puntos panorámicos para admirar la costa de Cabo San Lucas. Descansa en el amplio sundeck/flybridge, disfruta cócteles artesanales en la cubierta trasera sombreada o contempla vistas en primera fila de las aguas turquesa desde la espaciosa área de asientos y asoleadero en proa.'
                  : 'The outdoor areas are designed for both relaxation and entertainment, offering the best vantage points to soak in the stunning Cabo San Lucas coastline. Lounge on the expansive sundeck, sip handcrafted cocktails on the shaded aft deck, or enjoy front-row views of the turquoise waters from the spacious bow seating area. Whether you’re basking in the sun, socializing under the stars, or taking a refreshing dip in the ocean, every moment onboard is designed to be unforgettable.'
                }
              </p>

              <div className="pt-2">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mb-3">
                  {isEs ? 'Amenidades de Clase Mundial a Bordo del "Aquaholic":' : 'World-Class Amenities Aboard the "Aquaholic":'}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <CheckCircle2 size={18} className="text-blue-900 shrink-0 mt-0.5" />
                    <span>
                      {isEs
                        ? 'Amplios comedores tanto en el interior como al aire libre, perfectos para reuniones íntimas o grandes celebraciones.'
                        : 'Spacious dining areas both indoors and outdoors, perfect for intimate gatherings or lively celebrations.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <CheckCircle2 size={18} className="text-blue-900 shrink-0 mt-0.5" />
                    <span>
                      {isEs
                        ? 'Cuatro lujosos camarotes (incluyendo 2 cabinas principales Master y VIP) y tres baños completos para máxima comodidad y privacidad.'
                        : 'Four luxurious staterooms (including 2 main cabins) with en-suite bathrooms for ultimate comfort and privacy.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <CheckCircle2 size={18} className="text-blue-900 shrink-0 mt-0.5" />
                    <span>
                      {isEs
                        ? 'Barra libre premium y experiencia gastronómica gourmet con chef profesional y mixólogo/bartender preparando platillos y coctelería fresca a bordo.'
                        : 'An open bar and gourmet dining experience with a professional chef and mixologist/bartender, featuring a curated selection of premium beverages and freshly prepared cuisine.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <CheckCircle2 size={18} className="text-blue-900 shrink-0 mt-0.5" />
                    <span>
                      {isEs
                        ? 'Emocionantes juguetes acuáticos, incluyendo equipo de esnórquel y tablas de paddleboard, para elevar tu aventura en el mar.'
                        : 'Exciting water toys, including snorkeling gear and paddleboards, to enhance your adventure on the water.'}
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                {isEs
                  ? 'Con su artesanía atemporal, servicio de primer nivel y espectacular entorno frente al mar, este yate redefine los chárters de lujo en Cabo San Lucas. Ya sea para una escapada romántica, una celebración con amigos o una aventura familiar, es la forma definitiva de vivir la magia del mar con estilo.'
                  : 'With its timeless craftsmanship, top-tier service, and stunning oceanfront setting, this yacht redefines luxury yacht charters in Cabo San Lucas. Whether for a romantic getaway, a celebration with friends, or a family adventure, this yacht is the ultimate way to experience the magic of the sea in style.'
                }
              </p>
            </section>

          </div>

          {/* Columna Derecha: Key Features */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">
                <Ship size={16} />
                {isEs ? 'Características Principales' : 'Official Specifications'}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {isEs ? 'Key Features – 110ft Horizon' : 'Key Features'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {isEs
                  ? 'Equipamiento completo de superyate de 110 pies con capacidad para hasta 30 invitados en chárters privados.'
                  : 'Complete 110ft Horizon superyacht features designed for private luxury charters up to 30 guests.'
                }
              </p>

              {/* LISTA COMPLETA DE KEY FEATURES DEL USUARIO */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 flex items-center justify-between text-blue-950 font-bold">
                  <span>{isEs ? 'Embarcación:' : 'Yacht Model:'}</span>
                  <span>110ft Horizon "Aquaholic"</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 flex items-center justify-between text-blue-950 font-bold">
                  <span>{isEs ? 'Capacidad Máxima:' : 'Maximum Capacity:'}</span>
                  <span>{isEs ? 'Hasta 30 Invitados (10 base + 20 extra)' : 'Up to 30 Guests (10 base + 20 extra)'}</span>
                </div>

                {[
                  { en: 'Air conditioned interior', es: 'Interior totalmente climatizado (Aire acondicionado)' },
                  { en: 'Four bedrooms (4 luxurious staterooms)', es: 'Cuatro recámaras / camarotes de lujo' },
                  { en: '2 main cabins (Full-Beam Master & VIP Suites)', es: '2 cabinas principales (Suites Master y VIP)' },
                  { en: 'Three bathrooms', es: 'Tres baños completos a bordo' },
                  { en: 'Large interior living room', es: 'Amplia sala de estar interior panorámica' },
                  { en: 'Fully equipped kitchen (Commercial Galley)', es: 'Cocina (galley) totalmente equipada' },
                  { en: 'Professional chef onboard', es: 'Chef profesional privado a bordo' },
                  { en: 'Mixologist / Bartender onboard', es: 'Mixólogo / Bartender profesional a bordo' },
                  { en: 'Flybridge with seating and laying', es: 'Flybridge con sala lounge, barra y camastros' },
                  { en: 'Large front seating / sunbathing area', es: 'Amplia sala frontal y asoleadero en proa' },
                  { en: 'Shaded back seating (Aft Deck)', es: 'Cubierta trasera (popa) con asientos sombreados' },
                  { en: 'Cockpit & Swim Platform', es: 'Cockpit y plataforma de nado con doble escalera' },
                  { en: 'High quality Bluetooth speakers', es: 'Sistema de sonido Bluetooth de alta fidelidad' }
                ].map((feat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>{isEs ? feat.es : feat.en}</span>
                  </div>
                ))}
              </div>

              {/* Resumen de Precios en Tarjeta Lateral */}
              <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
                <div className="text-amber-400 font-extrabold uppercase tracking-wider text-[11px]">
                  {isEs ? 'Resumen de Tarifas Oficiales' : 'Official Charter Pricing Summary'}
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-300">{isEs ? 'Chárter Base 3 Horas (1-10 pax):' : '3-Hours Base Charter (1-10 guests):'}</span>
                  <span className="font-black text-white">$5,900 USD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-300">{isEs ? 'Huésped Extra (máx. 30 pax):' : 'Extra Guest (max. cap. 30):'}</span>
                  <span className="font-bold text-white">$225 USD</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-300">{isEs ? 'Hora Extra:' : 'Extra Hour:'}</span>
                  <span className="font-bold text-white">$1,750 USD</span>
                </div>
              </div>

              {/* Banner de Salida en Marina */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
                <MapPin className="text-blue-900 shrink-0" size={20} />
                <div>
                  <span className="font-bold text-slate-900 block">{isEs ? 'Muelle Exclusivo en Marina Cabo San Lucas' : 'Exclusive Slip in Cabo San Lucas Marina'}</span>
                  <span>{isEs ? 'Acceso VIP directo para grupos de hasta 30 personas.' : 'Direct VIP gate embarkation for private groups up to 30 guests.'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* CTA - RESERVA TU EXPERIENCIA EN EL AQUAHOLIC 110FT */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 sm:p-12 text-center shadow-md relative overflow-hidden mb-16">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-bold text-blue-900 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {isEs ? 'Reserva Exclusiva' : 'Book Your 110ft Horizon Yacht Charter in Los Cabos'}
            </span>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-4 mb-4 tracking-tight">
              {isEs
                ? 'Vive el Lujo del Horizon "Aquaholic" de 110 Pies en Cabo San Lucas'
                : 'Book Your Private Charter Aboard the 110ft Horizon "Aquaholic"'
              }
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              {isEs
                ? 'Ideal para grupos de hasta 30 invitados, despedidas, bodas íntimas, eventos corporativos o escapadas familiares con chef privado y mixólogo a bordo.'
                : 'Ideal for groups of up to 30 guests, milestone celebrations, corporate gatherings, or family adventures with an onboard private chef and mixologist.'
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
      {/* SECCIÓN SEO FAQ ESPECÍFICA PARA AQUAHOLIC 110FT          */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2 border border-blue-200">
            <Info size={14} />
            {isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEs ? 'Preguntas Frecuentes sobre el Yate Horizon "Aquaholic" 110ft' : 'Frequently Asked Questions About the 110ft Horizon "Aquaholic"'}
          </h3>
        </div>

        <div className="space-y-4">

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Cuál es el precio y duración mínima del yate Aquaholic 110ft?' : 'What is the base price and duration for chartering the 110ft Aquaholic?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'El chárter privado de 3 horas tiene un precio de $5,900 USD para 1 a 10 invitados. Cada huésped adicional tiene un costo de $225 USD (hasta una capacidad máxima de 30 invitados) y cada hora adicional cuesta $1,750 USD.'
                : 'The 3-hour private charter starts at $5,900 USD for 1 to 10 guests. Each extra guest is $225 USD (up to a maximum capacity of 30 guests), and each extra hour is $1,750 USD.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué incluye el alquiler del yate Aquaholic en Cabo San Lucas?' : 'What is included with the 110ft Horizon Aquaholic yacht rental?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Incluye chef profesional, mixólogo/bartender, barra libre de bebidas premium, comidas gourmet recién preparadas a bordo, equipo de esnórquel, tablas de paddleboard, sistema de sonido Bluetooth, visita al Arco y Playa del Amor, avistamiento de ballenas (en temporada) y paradas para nadar en bahías cristalinas.'
                : 'Every charter includes a professional chef, onboard mixologist/bartender, premium open bar, freshly prepared gourmet dining, snorkeling gear, stand-up paddleboards, high-quality Bluetooth audio, Arch & Lover’s Beach tour, seasonal whale watching, and beach swimming stops.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Cómo funcionan los impuestos y métodos de pago?' : 'How do taxes and payment methods work?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Las propinas y los impuestos no están incluidos en los precios listados. Para pagos con tarjeta de crédito se aplica el 16% de IVA, mientras que los pagos en efectivo están libres de impuestos.'
                : 'Gratuity and taxes are not included in the prices listed. For credit card payments, a 16% VAT tax will apply, while cash payments are tax-free.'
              }
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SIMILAR BOATS (SUGERENCIAS DE LOS OTROS YATES)           */}
      {/* ======================================================== */}
      <div className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-[#003865] text-center mb-10 tracking-tight">
            {isEs ? 'Barcos Similares' : 'Similar Boats'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Yate 0: 80 ft Papillon 9 (Black Sunseeker) */}
            <Link
              href={`/${lang}/cabo-yacht-charters-papillon-9`}
              className="group block text-center"
            >
              <div className="aspect-square w-full max-w-[260px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/papillon-9/papillon-1.avif"
                  alt="80 ft Black Sunseeker Manhattan Papillon 9 Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg sm:text-xl leading-snug">
                <span className="text-slate-600 font-normal">80 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Papillon 9
                </span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-600 mt-0.5">
                Sunseeker Manhattan
              </div>
              <div className="text-sm sm:text-base italic text-slate-500 mt-1">
                {isEs ? 'Desde $5,500' : 'Starting at $5,500'}
              </div>
            </Link>

            {/* Yate 1: 85 ft Contessa */}
            <Link
              href={`/${lang}/cabo-yacht-charters-contessa`}
              className="group block text-center"
            >
              <div className="aspect-square w-full max-w-[260px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/contessa/contessa-1.jpg"
                  alt="85 ft Contessa Her Shine Marine Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg sm:text-xl leading-snug">
                <span className="text-slate-600 font-normal">85 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Contessa
                </span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-600 mt-0.5">
                Her Shine Marine
              </div>
              <div className="text-sm sm:text-base italic text-slate-500 mt-1">
                {isEs ? 'Desde $3,700' : 'Starting at $3,700'}
              </div>
            </Link>

            {/* Yate 2: 116 ft Capella */}
            <Link
              href={`/${lang}/cabo-yacht-charters`}
              className="group block text-center"
            >
              <div className="aspect-square w-full max-w-[260px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/capella-aerial-overview.jpg"
                  alt="116 ft Capella Azimut-Benetti Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg sm:text-xl leading-snug">
                <span className="text-slate-600 font-normal">116 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Capella
                </span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-600 mt-0.5">
                Azimut-Benetti
              </div>
              <div className="text-sm sm:text-base italic text-slate-500 mt-1">
                {isEs ? 'Desde $8,000' : 'Starting at $8,000'}
              </div>
            </Link>

            {/* Yate 3: 130 ft Sovereign */}
            <Link
              href={`/${lang}/cabo-yacht-charters-sovereign`}
              className="group block text-center"
            >
              <div className="aspect-square w-full max-w-[260px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/sovereign/sovereign-6.jpg"
                  alt="130 ft Sovereign Yachts Cabo Superyacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg sm:text-xl leading-snug">
                <span className="text-slate-600 font-normal">130 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Sovereign
                </span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-600 mt-0.5">
                Sovereign Yachts
              </div>
              <div className="text-sm sm:text-base italic text-slate-500 mt-1">
                {isEs ? 'Desde $15,000' : 'Starting at $15,000'}
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
                    ? `Gracias ${inquireData.firstName}. Nuestro equipo VIP concierge de Ballard Tours se comunicará contigo a la brevedad para confirmar disponibilidad y los detalles de tu chárter en el Aquaholic 110ft.`
                    : `Thank you ${inquireData.firstName}. Our VIP concierge team at Ballard Tours will get in touch with you shortly to confirm availability and itinerary details aboard the 110ft Aquaholic.`
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
                    110ft Horizon Yacht "Aquaholic"
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
                110ft Horizon "Aquaholic"
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLightboxAbierto(false)}
                className="p-2 sm:p-2.5 text-white hover:text-blue-400 transition rounded-full bg-white/10 hover:bg-white/20 cursor-pointer shadow-lg active:scale-95"
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
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all z-30 cursor-pointer shadow-2xl active:scale-90 group backdrop-blur-xs"
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

