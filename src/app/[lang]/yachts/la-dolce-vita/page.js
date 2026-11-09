// src/app/[lang]/yachts/la-dolce-vita/page.js
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

export default function LaDolceVitaYachtPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const { agregarAlCombo } = useCart();

  // ==========================================
  // CONFIGURACIÓN DE PAQUETES - 57FT YACHT "LA DOLCE VITA"
  // Regla aplicada:
  // - 2 Horas (Quarter-Day): Original $999 + $1,000 = $1,999 USD (1 a 12 pasajeros incluidos)
  // - 4 Horas (Half-Day): Original $3,260 + $1,000 = $4,260 USD (1 a 12 pasajeros incluidos)
  // - 8 Horas (Full-Day): Original $6,500 + $1,000 = $7,500 USD (1 a 12 pasajeros incluidos)
  // - Hora Extra: $910 USD/hr (Base $810/hr + $100 USD)
  // ==========================================
  const paquetes = [
    {
      id: 'charter-2-hours',
      nameEn: '2 HOURS QUARTER-DAY CHARTER',
      nameEs: '2 HORAS PASEO PRIVADO',
      hours: 2,
      price: 1999, // Original $999 + $1,000
      baseGuests: 12,
      maxGuests: 12,
      extraGuestPrice: 0,
      popular: true,
      descriptionEn:
        'Private 2-hour VIP charter aboard the 57-foot yacht "La Dolce Vita" for up to 12 guests. Cruise past El Arco and Lover’s Beach while enjoying the sun deck, open bar refreshments, snorkeling gear, paddleboards, captain, and fuel included.',
      descriptionEs:
        'Chárter privado VIP de 2 horas a bordo del yate de 57 pies "La Dolce Vita" para hasta 12 invitados. Navega frente a El Arco y Playa del Amor disfrutando del asoleadero, bebidas incluidas, equipo de esnórquel, paddleboards, capitán y combustible.'
    },
    {
      id: 'charter-4-hours',
      nameEn: '4 HOURS HALF-DAY CHARTER',
      nameEs: '4 HORAS MEDIO DÍA PRIVADO',
      hours: 4,
      price: 4260, // Original $3,260 + $1,000
      baseGuests: 12,
      maxGuests: 12,
      extraGuestPrice: 0,
      popular: false,
      descriptionEn:
        'Half-day 4-hour private yacht charter for up to 12 guests. Explore Cabo’s iconic coastline, anchor in turquoise coves like Pelican Rock or Santa María Bay for snorkeling and paddleboarding, and relax on the spacious sun deck.',
      descriptionEs:
        'Chárter privado de medio día (4 horas) para hasta 12 personas. Explora la icónica costa de Los Cabos, fondea en bahías turquesa como Roca Pelícano o Bahía Santa María para esnórquel y paddleboard, y relájate en cubierta.'
    },
    {
      id: 'charter-8-hours',
      nameEn: '8 HOURS FULL-DAY CHARTER',
      nameEs: '8 HORAS DÍA COMPLETO VIP',
      hours: 8,
      price: 7500, // Original $6,500 + $1,000
      baseGuests: 12,
      maxGuests: 12,
      extraGuestPrice: 0,
      popular: false,
      descriptionEn:
        'Full-day 8-hour private luxury charter for up to 12 guests. Experience the ultimate day on the water with coastal sightseeing, multiple swimming and snorkeling stops, paddleboarding, and golden sunset cruising past Land’s End.',
      descriptionEs:
        'Chárter privado de día completo (8 horas) para hasta 12 invitados. Vive la máxima experiencia en el mar con recorrido costero, múltiples paradas para nadar y hacer esnórquel, paddleboard y atardecer frente al Finisterra.'
    }
  ];

  // ==========================================
  // ESTADOS DEL CONFIGURADOR / CALCULADORA
  // ==========================================
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(paquetes[0]); // 2 Horas ($1,999 USD) por defecto
  const [charterFecha, setCharterFecha] = useState('');
  const [totalHuespedes, setTotalHuespedes] = useState(11);
  const [horasExtras, setHorasExtras] = useState(0);
  const PRECIO_HORA_EXTRA = 910; // Base $810 + $100 USD

  // Estados de Transportación Terrestre
  const [incluirTransporte, setIncluirTransporte] = useState(false);
  const [transporteOrigen, setTransporteOrigen] = useState('');
  const [busquedaOrigen, setBusquedaOrigen] = useState('');
  const [mostrarDropdownHoteles, setMostrarDropdownHoteles] = useState(false);
  const [horaRecogidaHotel, setHoraRecogidaHotel] = useState('10:00');
  const [horaRegresoMarina, setHoraRegresoMarina] = useState('14:00');

  // Matriz de precios de transporte hacia Cabo San Lucas Marina ('csl')
  const matrizPreciosMarinaCSL = { '1': 220, '2': 200, '3': 160, '4': 250, '5': 320, '6': 420 };

  const calcularRecargoTransporte = (pax) => {
    if (pax <= 4) return 0;
    if (pax <= 8) return 30;
    if (pax <= 10) return 45;
    return 90; // 11-12 pax
  };

  const costoTransporte = useMemo(() => {
    if (!incluirTransporte || !transporteOrigen) return 0;
    const hotel = catalogoHoteles.find((h) => h.nombre === transporteOrigen);
    const zona = hotel ? String(hotel.zona) : '3';
    const precioBaseZona = matrizPreciosMarinaCSL[zona] || 200;
    const recargoPax = calcularRecargoTransporte(totalHuespedes);
    return precioBaseZona + recargoPax;
  }, [incluirTransporte, transporteOrigen, totalHuespedes]);

  const huespedesExtra = Math.max(0, totalHuespedes - paqueteSeleccionado.baseGuests);
  const costoHuespedesExtra = huespedesExtra * paqueteSeleccionado.extraGuestPrice;
  const costoHorasExtras = horasExtras * PRECIO_HORA_EXTRA;
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
  // FOTOS REALES DEL YATE 57FT "LA DOLCE VITA" (9 FOTOS EN /yachts/LA DOLCE VITA)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/yachts/LA DOLCE VITA/Luend-3_t1FqE6w_cropped.avif',
      titleEn: '57ft Yacht "La Dolce Vita" Cruising Past Land’s End & El Arco',
      titleEs: 'Yate de 57 Pies "La Dolce Vita" Navegando Frente al Finisterra y El Arco',
      descEn: 'Enjoy a VIP experience aboard this 57-foot yacht designed for both elegance and comfort along Cabo’s iconic coastline.',
      descEs: 'Disfruta una experiencia VIP a bordo de este yate de 57 pies diseñado para la elegancia y el confort en la costa de Cabo San Lucas.',
      labelEn: '57ft Profile',
      labelEs: 'Perfil 57ft'
    },
    {
      src: '/yachts/LA DOLCE VITA/Luend-6_tJNgFCz_cropped.avif',
      titleEn: 'Bow Sundeck & Flybridge View Cruising Cabo’s Turquoise Waters',
      titleEs: 'Asoleadero de Proa y Flybridge Navegando las Aguas Turquesa de Cabo',
      descEn: 'Spacious front sunpads and elevated flybridge offering panoramic views of Lover’s Beach and the Arch.',
      descEs: 'Amplios camastros en proa y flybridge elevado con vistas panorámicas a Playa del Amor y El Arco.',
      labelEn: 'Bow & Sundeck',
      labelEs: 'Proa y Asoleadero'
    },
    {
      src: '/yachts/LA DOLCE VITA/Luend-7.avif',
      titleEn: 'Stern View of "La Dolce Vita" with Swim Platform & Water Toys',
      titleEs: 'Vista de Popa de "La Dolce Vita" con Plataforma de Nado y Juguetes Acuáticos',
      descEn: 'Easy water access from the swim platform with paddleboards, floating mat, and snorkeling equipment ready for your group.',
      descEs: 'Fácil acceso al mar desde la plataforma de nado con tablas de paddleboard, tapete flotante y equipo de esnórquel.',
      labelEn: 'Swim Platform',
      labelEs: 'Plataforma y Popa'
    },
    {
      src: '/yachts/LA DOLCE VITA/Luend-3.avif',
      titleEn: 'Cruising Past Cabo San Lucas Rock Formations & Pelican Rock',
      titleEs: 'Navegando Frente a las Formaciones Rocosas y Roca Pelícano',
      descEn: 'Ideal for romantic getaways, birthdays, or small group celebrations of up to 12 guests.',
      descEs: 'Ideal para escapadas románticas, cumpleaños o celebraciones privadas de hasta 12 invitados.',
      labelEn: 'Land’s End Cruise',
      labelEs: 'Paseo Finisterra'
    },
    {
      src: '/yachts/LA DOLCE VITA/Luen-1.avif',
      titleEn: 'Expansive Exterior Deck & Sunbathing Lounge',
      titleEs: 'Amplia Cubierta Exterior y Área de Asoleadero',
      descEn: 'Relax on the cushioned forward sun deck while your captain guides you along the Baja coast.',
      descEs: 'Relájate en el asoleadero acolchado de proa mientras el capitán te guía por la costa de Baja California Sur.',
      labelEn: 'Sun Deck',
      labelEs: 'Cubierta Solar'
    },
    {
      src: '/yachts/LA DOLCE VITA/Luen-17.avif',
      titleEn: 'Elevated Flybridge Seating & Captain’s Helm',
      titleEs: 'Sala en Flybridge Elevado y Puente de Mando del Capitán',
      descEn: 'Covered upper deck seating area with 360-degree ocean vistas and dedicated crew service.',
      descEs: 'Área de asientos techada en la cubierta superior con vistas de 360 grados al mar y atención personalizada.',
      labelEn: 'Flybridge',
      labelEs: 'Flybridge'
    },
    {
      src: '/yachts/LA DOLCE VITA/Luen-20.avif',
      titleEn: 'Comfortable Interior Salon & Cabin Lounge',
      titleEs: 'Cómodo Salón Interior y Cabina de Descanso',
      descEn: 'Features 1 private cabin and 1 bathroom so your group can relax in shaded comfort between swimming stops.',
      descEs: 'Cuenta con 1 cabina privada y 1 baño para que tu grupo descanse con total comodidad entre paradas de nado.',
      labelEn: 'Interior Cabin',
      labelEs: 'Cabina Interior'
    },
    {
      src: '/yachts/LA DOLCE VITA/Luen-54.avif',
      titleEn: 'Aft Deck & Cockpit Social Area',
      titleEs: 'Área Social en Cubierta de Popa y Cockpit',
      descEn: 'Enjoy bottled water, assorted Coca-Cola sodas, and open bar refreshments in the shaded cockpit.',
      descEs: 'Disfruta de agua embotellada, refrescos Coca-Cola surtidos y bebidas refrescantes en la popa techada.',
      labelEn: 'Cockpit & Aft',
      labelEs: 'Popa y Cockpit'
    },
    {
      src: '/yachts/LA DOLCE VITA/Luen-781.avif',
      titleEn: 'Private Charter Experience in Cabo San Lucas Marina',
      titleEs: 'Experiencia de Chárter Privado en la Marina de Cabo San Lucas',
      descEn: '2020 Custom build 57ft motor yacht powered by twin 200 HP engines for a smooth coastal ride.',
      descEs: 'Yate a motor de 57 pies (construcción 2020) impulsado por dos motores de 200 HP para una navegación suave.',
      labelEn: 'Marina & Details',
      labelEs: 'Marina y Detalles'
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
    return catalogoHoteles.filter((h) =>
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
      setInquireData((prev) => ({ ...prev, date: charterFecha }));
    }
    setInquiryEnviado(false);
    setModalAbierto(true);
  };

  const handleAddToCart = () => {
    if (!charterFecha) {
      alert(
        isEs
          ? 'Por favor selecciona una fecha para tu chárter privado.'
          : 'Please select a date for your private yacht charter.'
      );
      return;
    }
    if (incluirTransporte && !transporteOrigen) {
      alert(
        isEs
          ? 'Por favor selecciona tu hotel o punto de recogida para el transporte terrestre.'
          : 'Please select your hotel or pickup location for the ground transfer.'
      );
      return;
    }

    const totalHoras = paqueteSeleccionado.hours + horasExtras;

    agregarAlCombo({
      id: `yacht-la-dolce-vita-${paqueteSeleccionado.id}-${Date.now()}`,
      tipo: 'yate',
      nombre: `57ft Yacht "La Dolce Vita" - ${isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn}`,
      fecha: charterFecha,
      horario: incluirTransporte ? `${horaRecogidaHotel} - ${horaRegresoMarina}` : `${totalHoras} Hours Charter`,
      pasajeros: totalHuespedes,
      precio: granTotalYate,
      detalles: {
        embarcacion: '57 Ft Yacht "La Dolce Vita" (Custom 2020)',
        paqueteBase: isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn,
        horasBase: paqueteSeleccionado.hours,
        horasExtras,
        costoHorasExtras,
        huespedesBase: 12,
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
        tipo: 'Yacht Charter Inquiry - 57ft Yacht La Dolce Vita',
        embarcacion: '57ft Yacht "La Dolce Vita"',
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
        subject: `🛥️ New Yacht Inquiry: 57ft "La Dolce Vita" (${payload.clienteNombre})`,
        html: `
          <h2>Solicitud de Reserva / Información - 57ft Yacht "La Dolce Vita"</h2>
          <p><strong>Cliente:</strong> ${payload.clienteNombre}</p>
          <p><strong>Email:</strong> ${payload.clienteEmail}</p>
          <p><strong>Teléfono:</strong> ${payload.clienteTelefono}</p>
          <p><strong>Fecha deseada:</strong> ${payload.clienteFecha}</p>
          <p><strong>¿Cómo nos conoció?:</strong> ${payload.comoNosConocio}</p>
          <hr />
          <h3>Configuración Seleccionada:</h3>
          <ul>
            <li><strong>Paquete:</strong> ${payload.paqueteInteres} ($${paqueteSeleccionado.price.toLocaleString()} USD)</li>
            <li><strong>Pasajeros:</strong> ${totalHuespedes} (Máx. 12 incluidos)</li>
            <li><strong>Horas Extra:</strong> ${horasExtras} (+$${costoHorasExtras.toLocaleString()} USD)</li>
            <li><strong>Transporte Privado Hotel-Marina-Hotel:</strong> ${incluirTransporte ? `Sí, desde ${transporteOrigen} (+$${costoTransporte} USD)` : 'No'}</li>
            <li><strong>Total Estimado:</strong> $${granTotalYate.toLocaleString()} USD (16% VAT on card / cash tax-free)</li>
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
      ? `¡Hola! Me interesa reservar el yate privado de 57ft "La Dolce Vita" en Cabo San Lucas.\n\n• Paquete: ${paqueteSeleccionado.nameEs}\n• Fecha: ${charterFecha || 'Por definir'}\n• Huéspedes: ${totalHuespedes} personas\n• Horas extra: ${horasExtras}\n• Transporte terrestre: ${incluirTransporte ? `Sí (${transporteOrigen})` : 'No'}\n• Total estimado: $${granTotalYate.toLocaleString()} USD`
      : `Hello! I'm interested in chartering the 57ft private yacht "La Dolce Vita" in Cabo San Lucas.\n\n• Package: ${paqueteSeleccionado.nameEn}\n• Date: ${charterFecha || 'TBD'}\n• Guests: ${totalHuespedes} guests\n• Extra hours: ${horasExtras}\n• Ground transport: ${incluirTransporte ? `Yes (${transporteOrigen})` : 'No'}\n• Estimated total: $${granTotalYate.toLocaleString()} USD`
  );

  // ==========================================
  // 6 AVENTURAS PRIVADAS INCLUIDAS
  // ==========================================
  const aventurasIncluidas = [
    {
      titleEn: 'VISIT TO EL ARCO & LOVER’S BEACH',
      titleEs: 'VISITA AL ARCO Y PLAYA DEL AMOR',
      descEn: 'Cruise past Cabo’s iconic natural landmarks including El Arco, Lover’s Beach, and Land’s End.',
      descEs: 'Navega frente a los monumentos naturales más icónicos de Cabo incluyendo El Arco y Playa del Amor.',
      img: '/yachts/LA DOLCE VITA/Luend-3_t1FqE6w_cropped.avif'
    },
    {
      titleEn: 'SNORKELING ADVENTURE',
      titleEs: 'AVENTURA DE ESNÓRQUEL',
      descEn: 'Full use of onboard snorkeling equipment in crystal-clear turquoise bays teeming with marine life.',
      descEs: 'Uso completo de equipo de esnórquel a bordo en bahías de aguas cristalinas llenas de vida marina.',
      img: '/yachts/LA DOLCE VITA/Luend-6_tJNgFCz_cropped.avif'
    },
    {
      titleEn: 'PADDLEBOARDS & WATER FUN',
      titleEs: 'PADDLEBOARDS Y DIVERSIÓN EN EL MAR',
      descEn: 'Enjoy onboard amenities including stand-up paddleboards, floating mat, and easy swim platform access.',
      descEs: 'Disfruta amenidades a bordo incluyendo tablas de paddleboard, tapete flotante y plataforma de nado.',
      img: '/yachts/LA DOLCE VITA/Luend-7.avif'
    },
    {
      titleEn: 'SUN DECK RELAXATION',
      titleEs: 'RELAJACIÓN EN EL ASOLEADERO',
      descEn: 'Lounge on the spacious forward sun deck with plush cushions while soaking in the Baja sunshine.',
      descEs: 'Descansa en el amplio asoleadero de proa con cómodos cojines mientras disfrutas del sol de Baja.',
      img: '/yachts/LA DOLCE VITA/Luen-1.avif'
    },
    {
      titleEn: 'COASTAL SIGHTSEEING & SUNSET',
      titleEs: 'PASEO COSTERO Y ATARDECER',
      descEn: 'The perfect mix of relaxation, sightseeing, and indulgence—ideal for romantic getaways or celebrations.',
      descEs: 'La combinación perfecta de relajación, vistas espectaculares y celebración para grupos de hasta 12 personas.',
      img: '/yachts/LA DOLCE VITA/Luend-3.avif'
    },
    {
      titleEn: 'REFRESHMENTS & OPEN BAR',
      titleEs: 'BEBIDAS Y REFRESCOS A BORDO',
      descEn: 'Includes bottled water, assorted Coca-Cola sodas, refreshments, fuel, and a dedicated captain & crew.',
      descEs: 'Incluye agua embotellada, refrescos Coca-Cola surtidos, bebidas, combustible, capitán y tripulación.',
      img: '/yachts/LA DOLCE VITA/Luen-54.avif'
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
                    ? 'Yate Privado 57 Pies • Custom Build 2020 • Hasta 12 Invitados'
                    : '57ft Private Motor Yacht • Custom Build 2020 • Up to 12 Guests'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                {isEs
                  ? 'Cabo San Lucas Yate Privado 57ft "La Dolce Vita" con Barra Libre y Snorkel'
                  : 'Cabo San Lucas Private 57ft Yacht "La Dolce Vita" with Open Bar & Snorkel'}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                {isEs
                  ? '57 Pies • Hasta 12 Invitados • 1 Cabina • 1 Baño • Capitán y Combustible Incluidos • Equipo de Esnórquel y Paddleboards.'
                  : '57 Feet • 12 Guests Max Capacity • 1 Cabin • 1 Bathroom • Captain & Fuel Included • Snorkeling Gear & Paddleboards.'}
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
                {isEs ? 'Ver Tarifas (2h, 4h, 8h)' : 'View Rates (2h, 4h, 8h)'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GALERÍA VISUAL INTERACTIVA (9 FOTOS REALES LA DOLCE VITA)*/}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
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
                ? 'Cabo San Lucas Private 57ft Yacht La Dolce Vita with Open Bar & Snorkel'
                : isEs
                ? fotosGaleria[fotoActiva].titleEs
                : fotosGaleria[fotoActiva].titleEn
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

          {/* Contador y botón de pantalla completa */}
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
      {/* BARRA RÁPIDA DE ESPECIFICACIONES (COMO EN LA IMAGEN 1)    */}
      {/* ======================================================== */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="flex flex-col items-center justify-center p-2">
            <Ship size={22} className="text-[#003865] mb-1.5" />
            <span className="font-black text-slate-900 text-sm sm:text-base">57 feet</span>
            <span className="text-[11px] text-slate-500 font-medium">{isEs ? 'Eslora' : 'Length'}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <Users size={22} className="text-[#003865] mb-1.5" />
            <span className="font-black text-slate-900 text-sm sm:text-base">12 {isEs ? 'Invitados' : 'Guests'}</span>
            <span className="text-[11px] text-slate-500 font-medium">{isEs ? 'Capacidad Máx.' : 'Max Capacity'}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <Award size={22} className="text-[#003865] mb-1.5" />
            <span className="font-black text-slate-900 text-sm sm:text-base">1 {isEs ? 'Cabina' : 'Cabin'}</span>
            <span className="text-[11px] text-slate-500 font-medium">{isEs ? 'Interior' : 'Accommodations'}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <Sparkles size={22} className="text-[#003865] mb-1.5" />
            <span className="font-black text-slate-900 text-sm sm:text-base">1 {isEs ? 'Baño' : 'Bathroom'}</span>
            <span className="text-[11px] text-slate-500 font-medium">{isEs ? 'A bordo' : 'Onboard'}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-2">
            <ShieldCheck size={22} className="text-emerald-600 mb-1.5" />
            <span className="font-black text-slate-900 text-sm sm:text-base">{isEs ? 'Con Capitán' : 'Captained'}</span>
            <span className="text-[11px] text-slate-500 font-medium">{isEs ? 'Y Combustible Incl.' : '& Fuel Included'}</span>
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
      {/* SECCIÓN DE PAQUETES Y TARIFAS (2H $1,999, 4H $4,260, 8H $7,500) */}
      {/* ======================================================== */}
      <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#003865] tracking-tight">
            {isEs ? 'Tarifas Oficiales de Chárter Privado' : 'Private Charter Packages & Pricing'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            {isEs
              ? 'Elige entre 2 horas (cuarto de día), 4 horas (medio día) u 8 horas (día completo). Todas las tarifas incluyen hasta 12 invitados, capitán, combustible, equipo de esnórquel, paddleboards y bebidas.'
              : 'Choose between a 2-hour quarter-day, 4-hour half-day, or 8-hour full-day private charter. All rates cover up to 12 guests and include captain, fuel, snorkeling equipment, paddleboards, and refreshments.'}
          </p>
        </div>

        {/* Grid de 3 Tarjetas de Paquetes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {paquetes.map((pkg, idx) => {
            const isSelected = paqueteSeleccionado.id === pkg.id;

            const headerColors = [
              'bg-[#003865]', // 2 Hours
              'bg-[#1877d2]', // 4 Hours
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
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c8b273] text-white text-xs font-extrabold px-5 py-1.5 rounded-t-md shadow-xs tracking-wide z-10 whitespace-nowrap">
                    {isEs ? 'Más Popular • 2 Horas' : 'Most Popular • 2 Hours'}
                  </div>
                )}

                <div className={`${headerColors[idx]} text-white text-center py-3.5 px-4 rounded-t-[10px]`}>
                  <h3 className="font-extrabold text-sm tracking-wider uppercase">
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
                          ? `Por ${pkg.hours} horas • Hasta 12 invitados incluidos`
                          : `Per ${pkg.hours} hours • Up to 12 guests included`}
                      </p>
                    </div>

                    <div className="space-y-2.5 text-xs border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Users size={15} className="text-[#003865]" />
                          {isEs ? 'Capacidad Incluida' : 'Guests Included'}
                        </span>
                        <span className="font-bold text-slate-900">1 - 12 {isEs ? 'Invitados' : 'Guests'}</span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Clock size={15} className="text-[#003865]" />
                          {isEs ? 'Duración' : 'Duration'}
                        </span>
                        <span className="font-bold text-slate-900">
                          {pkg.hours} {isEs ? 'Horas' : 'Hours'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <ShieldCheck size={15} className="text-[#003865]" />
                          {isEs ? 'Capitán y Combustible' : 'Captain & Fuel'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Wine size={15} className="text-[#003865]" />
                          {isEs ? 'Agua, Refrescos Coca-Cola y Barra' : 'Water, Coca-Cola Sodas & Open Bar'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      <div className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Waves size={15} className="text-[#003865]" />
                          {isEs ? 'Esnórquel y Paddleboards' : 'Snorkeling Gear & Paddleboards'}
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
                        ? isEs
                          ? '✓ Paquete Seleccionado'
                          : '✓ Selected Package'
                        : isEs
                        ? 'Seleccionar Fechas'
                        : 'Select Dates'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón Central "INQUIRE NOW" y Nota Importante */}
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
              ? 'Capacidad máxima: 12 invitados incluidos en el precio del chárter • Hora Extra: $910 USD. Las propinas (gratuities) y los impuestos no están incluidos en los precios listados. Para pagos con tarjeta de crédito aplica el 16% de IVA, mientras que los pagos en efectivo están libres de impuestos.'
              : 'Maximum capacity: 12 guests included in charter price • Extra Hour: $910 USD. Gratuities and taxes are not included in the prices listed. For credit card payments, a 16% VAT tax will apply, while cash payments are tax-free.'}
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
                {isEs ? 'Configura tu Chárter en "La Dolce Vita" 57ft' : 'Configure Your 57ft "La Dolce Vita" Charter'}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {isEs
                  ? 'Selecciona tu duración (2, 4 u 8 horas), número de invitados (hasta 12 incluidos) y añade traslado privado opcional desde tu hotel.'
                  : 'Select your duration (2, 4, or 8 hours), number of guests (up to 12 included), and optional private round-trip hotel transportation.'}
              </p>
            </div>

            {/* Selector de Paquete Activo */}
            <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-3.5 sm:p-4 w-full md:w-auto md:min-w-[340px] lg:min-w-[380px] shadow-2xs shrink-0">
              <label
                htmlFor="select-paquete-dolce-vita"
                className="text-[11px] text-blue-900 font-extrabold uppercase tracking-wider block mb-1.5 flex items-center justify-between sm:justify-end gap-1.5"
              >
                <span>{isEs ? 'Duración Seleccionada' : 'Selected Duration (Change)'}</span>
                <ChevronDown size={14} className="text-blue-900 shrink-0" />
              </label>
              <div className="relative">
                <select
                  id="select-paquete-dolce-vita"
                  value={paqueteSeleccionado.id}
                  onChange={(e) => {
                    const selected = paquetes.find((p) => p.id === e.target.value);
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
                {isEs ? 'Capitán y Combustible Incluidos' : 'Captain & Fuel Included'}
              </span>
            </div>
          </div>

          {/* 3 COLUMNAS DEL CONFIGURADOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
            {/* 1. Selector de Fecha */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <label
                  htmlFor="charter-fecha-dolce-vita"
                  className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Fecha de navegación' : 'Charter Date'}</span>
                </label>
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  {isEs ? 'Seleccionar día' : 'Select dates'}
                </span>
              </div>

              <div className="h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 flex items-center focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 transition">
                <input
                  id="charter-fecha-dolce-vita"
                  type="date"
                  value={charterFecha}
                  onChange={(e) => setCharterFecha(e.target.value)}
                  className="w-full bg-transparent text-slate-800 outline-none text-sm font-semibold cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Cancelación flexible: reembolso total hasta 3 días antes.'
                  : 'Flexible cancellation: full refund up to 3 days before trip.'}
              </p>
            </div>

            {/* 2. Selector de Huéspedes Totales (1 a 12 incluidos) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Users size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Invitados' : 'Guests'}</span>
                </span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                  {isEs ? '1 a 12 incluidos' : '1–12 included'}
                </span>
              </div>

              <div className="h-[52px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-1.5 transition">
                <button
                  type="button"
                  onClick={() => setTotalHuespedes((prev) => Math.max(1, prev - 1))}
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
                  onClick={() => setTotalHuespedes((prev) => Math.min(12, prev + 1))}
                  disabled={totalHuespedes >= 12}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Increase Guests"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Capacidad máxima de 12 pasajeros sin cargo extra por persona.'
                  : 'Maximum capacity of 12 people with no extra per-person fee.'}
              </p>
            </div>

            {/* 3. Selector de Horas Extras ($910 USD/hr) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Clock size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Horas Extras' : 'Extra Hours'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {horasExtras > 0 ? `+${horasExtras}h (+$${costoHorasExtras.toLocaleString()} USD)` : '$910 USD/hr'}
                </span>
              </div>

              <div className="h-[52px] flex items-center bg-slate-50 border border-slate-200 rounded-xl px-1.5 transition">
                <button
                  type="button"
                  onClick={() => setHorasExtras((prev) => Math.max(0, prev - 1))}
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
                  onClick={() => setHorasExtras((prev) => Math.min(6, prev + 1))}
                  disabled={horasExtras >= 6}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Increase Extra Hours"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Extiende tu recorrido por $910 USD por cada hora adicional.'
                  : 'Extend your charter for $910 USD per additional hour.'}
              </p>
            </div>
          </div>

          {/* MÓDULO DE TRANSPORTE TERRESTRE OPCIONAL */}
          <div
            className={`border-2 rounded-2xl p-5 sm:p-6 mb-8 transition-all duration-300 ${
              incluirTransporte ? 'bg-blue-50/80 border-blue-300 shadow-sm' : 'bg-slate-50/70 border-slate-200'
            }`}
          >
            <div
              onClick={() => setIncluirTransporte((prev) => !prev)}
              className="flex items-start justify-between gap-4 cursor-pointer select-none"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-colors ${
                    incluirTransporte ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <Car size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {isEs
                        ? '¿Deseas agregar Transportación Terrestre Privada VIP?'
                        : 'Add VIP Private Round-Trip Ground Transportation?'}
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                        incluirTransporte
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {incluirTransporte ? (isEs ? '✓ Activo' : '✓ Active') : isEs ? 'Opcional' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {isEs
                      ? 'Traslado exclusivo ida y vuelta desde tu hotel o villa a la Marina de Cabo San Lucas en Suburban o Sprinter de lujo. Horario 100% flexible.'
                      : 'Private round-trip SUV/Sprinter transfer from your resort or private villa directly to Cabo San Lucas Marina. 100% flexible schedule.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIncluirTransporte((prev) => !prev);
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
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {isEs ? 'Directo al muelle de La Dolce Vita en Marina CSL' : 'Direct to La Dolce Vita slip at Cabo Marina'}
                  </span>
                </div>

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
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                  • {totalHuespedes} {isEs ? 'invitados incluidos' : 'guests included'}
                </span>
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
                  ? '* Capitán y combustible incluidos. Propinas e impuestos no incluidos (16% IVA con tarjeta / efectivo libre de impuestos).'
                  : '* Captain and fuel included. Gratuities and taxes not included (16% VAT on card / cash tax-free).'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => handleOpenInquire(paqueteSeleccionado)}
                className="w-full sm:w-auto shrink-0 whitespace-nowrap px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition border-2 border-slate-200 hover:border-slate-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail size={18} className="text-[#7c5e3c] shrink-0" />
                <span>{isEs ? 'Solicitar Información' : 'Inquire Now'}</span>
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
      {/* AVENTURAS PRIVADAS INCLUIDAS                             */}
      {/* ======================================================== */}
      <div className="bg-[#faf6f0] border-y border-[#e6d7c3] text-slate-900 py-16 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#7c5e3c] text-xs font-bold uppercase tracking-widest mb-3 border border-[#dccbb5] shadow-2xs">
              <Compass size={14} />
              {isEs ? 'Experiencia VIP en Cabo San Lucas' : 'VIP Experience in Cabo San Lucas'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#003865] tracking-tight mb-4">
              {isEs
                ? 'Aventuras Privadas a Bordo del 57ft "La Dolce Vita"'
                : 'Private Adventures Aboard the 57ft "La Dolce Vita"'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs
                ? 'Navega frente a monumentos naturales como El Arco y Playa del Amor mientras disfrutas en el asoleadero. Con una tripulación dedicada y un ambiente de lujo, este recorrido ofrece la mezcla perfecta de relajación, vistas espectaculares y diversión en el mar.'
                : 'Cruise past natural landmarks including El Arco and Lover’s Beach while enjoying on the sun deck. With a dedicated crew and a luxurious setting, this tour offers the perfect mix of relaxation, sightseeing, and indulgence—ideal for romantic getaways, birthdays, or small group celebrations.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {aventurasIncluidas.map((item, index) => (
              <div key={index} className="group relative flex flex-col items-center">
                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#dccbb5] shadow-lg bg-white">
                  <img
                    src={item.img}
                    alt={isEs ? item.titleEs : item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="-mt-6 z-10 bg-white text-slate-950 px-6 py-3 rounded-xl shadow-md border border-[#dccbb5] min-w-[230px] text-center">
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
      {/* DESCRIPCIÓN, QUÉ INCLUYE, DETALLES TÉCNICOS Y POLÍTICAS  */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Columna Izquierda: About this boat, What's included/excluded, Policies & Boat Rules */}
          <div className="lg:col-span-7 space-y-8">
            {/* About this boat / Description */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'Acerca de este Yate' : 'About This Boat'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">
                {isEs
                  ? 'Disfruta una Experiencia VIP a Bordo de un Yate de 57 Pies Diseñado para la Elegancia y el Confort'
                  : 'Enjoy a VIP Experience Aboard a 57-Foot Yacht Designed for Both Elegance and Comfort'}
              </h2>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  {isEs
                    ? 'Disfruta de una experiencia VIP a bordo de un yate de 57 pies diseñado tanto para la elegancia como para la comodidad. Este chárter privado ofrece una manera íntima de explorar la icónica costa de Cabo San Lucas con servicio personalizado y amenidades a bordo como equipo de esnórquel y tablas de paddleboard.'
                    : 'Enjoy a VIP experience aboard a 57-foot yacht designed for both elegance and comfort. This private charter offers an intimate way to explore Cabo’s iconic coastline with personalized service and onboard amenities like snorkeling gear and paddleboards.'}
                </p>

                <p>
                  {isEs
                    ? 'Navega frente a monumentos naturales como El Arco y Playa del Amor mientras te relajas en el asoleadero. Con una tripulación dedicada y un entorno lujoso, este tour ofrece la combinación perfecta de relajación, recorrido escénico e indulgencia—ideal para escapadas románticas, cumpleaños o celebraciones de grupos pequeños de hasta 12 personas.'
                    : 'Cruise past natural landmarks including El Arco and Lover’s Beach while enjoying on the sun deck. With a dedicated crew and a luxurious setting, this tour offers the perfect mix of relaxation, sightseeing, and indulgence—ideal for romantic getaways, birthdays, or small group celebrations.'}
                </p>
              </div>
            </section>

            {/* What's Included & What's Excluded */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 size={14} />
                {isEs ? 'Lo Que Incluye y Excluye' : "What's Included & Excluded"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <h3 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    {isEs ? 'Qué Incluye:' : "What's Included:"}
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    {[
                      {
                        en: 'Private use of 57-foot yacht (2, 4, or 8 hours)',
                        es: 'Uso privado del yate de 57 pies (2, 4 u 8 horas)'
                      },
                      {
                        en: 'Certified Captain & Dedicated Crew',
                        es: 'Capitán certificado y tripulación dedicada'
                      },
                      {
                        en: 'Fuel included',
                        es: 'Combustible incluido'
                      },
                      {
                        en: 'Use of snorkeling equipment & paddleboards',
                        es: 'Uso de equipo de esnórquel y tablas de paddleboard'
                      },
                      {
                        en: 'Bottled water & Open Bar refreshments',
                        es: 'Agua embotellada y bebidas de barra libre'
                      },
                      {
                        en: 'Assorted Coca-Cola sodas',
                        es: 'Refrescos Coca-Cola surtidos'
                      },
                      {
                        en: 'Life jackets & First aid kit',
                        es: 'Chalecos salvavidas y botiquín de primeros auxilios'
                      }
                    ].map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{isEs ? inc.es : inc.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
                      <Info size={18} className="text-amber-600" />
                      {isEs ? 'Qué No Incluye:' : "What's Excluded:"}
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <li className="flex items-start gap-2">
                        <X size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{isEs ? 'Propinas para la tripulación (Gratuities)' : 'Gratuities'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>
                          {isEs
                            ? '16% IVA en pagos con tarjeta (Efectivo libre de impuestos)'
                            : '16% VAT on credit card payments (Cash is tax-free)'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-900 block mb-1">
                      {isEs ? 'Alojamiento y Cabinas:' : 'Accommodations & Cabin Details:'}
                    </strong>
                    {isEs
                      ? 'Esta embarcación tiene una capacidad máxima de 12 personas. Cuenta con 1 cabina (Cabin #1 para uso diurno de huéspedes, capacidad nocturna: 0) y 1 baño a bordo.'
                      : 'This boat has a maximum capacity of 12 people. It features 1 cabin (Cabin #1 for guests day use, overnight sleeping capacity of 0) and 1 bathroom.'}
                  </div>
                </div>
              </div>
            </section>

            {/* Policies & Boat Rules */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <ShieldCheck size={14} />
                {isEs ? 'Políticas y Reglas del Barco' : 'Policies & Boat Rules'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5">
                  <h4 className="font-black text-emerald-950 text-sm sm:text-base mb-2">
                    {isEs ? 'Política de Cancelación: Flexible' : 'Cancellation Policy: Flexible'}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        {isEs
                          ? 'Reembolso completo (100%) si el cliente cancela 3 días o más antes de la fecha de inicio del viaje.'
                          : 'Full refund if renter cancels 3 days or more before the trip start date.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        {isEs
                          ? 'Sin reembolso si se cancela 2 días o menos antes de la fecha de inicio del viaje.'
                          : 'No refund if renter cancels 2 days or less before the trip start date.'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <h4 className="font-black text-slate-900 text-sm sm:text-base">
                    {isEs ? 'Accesibilidad y Restricciones de Salud' : 'Accessibility & Health Restrictions'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• {isEs ? 'No accesible en silla de ruedas.' : 'Not wheelchair accessible.'}</li>
                    <li>• {isEs ? 'Los bebés deben viajar en el regazo.' : 'Infants must sit on laps.'}</li>
                    <li>
                      •{' '}
                      {isEs
                        ? 'No recomendado para viajeros con problemas de espalda, embarazadas o afecciones cardíacas graves.'
                        : 'Not recommended for travelers with back problems, pregnant travelers, or serious heart/medical conditions.'}
                    </li>
                    <li className="font-semibold text-slate-800">
                      • {isEs ? 'Nivel de dificultad: La mayoría de los viajeros pueden participar.' : 'Level of difficulty: Most travelers can participate.'}
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Columna Derecha: Technical Details & Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">
                <Ship size={16} />
                {isEs ? 'Ficha Técnica Oficial' : 'Boat Details & Specifications'}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {isEs ? 'Detalles – 57ft "La Dolce Vita"' : 'Details – 57ft "La Dolce Vita"'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {isEs
                  ? 'Especificaciones técnicas, motorización y amenidades a bordo para tu chárter privado en Cabo San Lucas.'
                  : 'Complete specifications, accommodations, and onboard amenities for your private charter in Cabo San Lucas.'}
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm">
                {[
                  { labelEn: 'Boat Name', labelEs: 'Nombre del Yate', valEn: 'La Dolce Vita (57ft)', valEs: 'La Dolce Vita (57ft)' },
                  { labelEn: 'Manufacturer', labelEs: 'Fabricante', valEn: 'Custom', valEs: 'Custom' },
                  { labelEn: 'Model', labelEs: 'Modelo', valEn: 'Custom Build (57ft Motor Boat)', valEs: 'Custom Build (57ft Motor Boat)' },
                  { labelEn: 'Build Year', labelEs: 'Año de Construcción', valEn: '2020', valEs: '2020' },
                  { labelEn: 'Length', labelEs: 'Eslora', valEn: '57 feet', valEs: '57 pies' },
                  { labelEn: 'Max Capacity', labelEs: 'Capacidad Máxima', valEn: '12 Guests', valEs: '12 Invitados' },
                  { labelEn: 'Number of Engines', labelEs: 'Número de Motores', valEn: '2 Engines', valEs: '2 Motores' },
                  { labelEn: 'Horsepower per Engine', labelEs: 'Potencia por Motor', valEn: '200 HP', valEs: '200 HP' },
                  { labelEn: 'Cabins', labelEs: 'Cabinas', valEn: '1 Cabin (Day Use)', valEs: '1 Cabina (Uso Diurno)' },
                  { labelEn: 'Bathrooms', labelEs: 'Baños', valEn: '1 Bathroom', valEs: '1 Baño' },
                  { labelEn: 'Crew & Fuel', labelEs: 'Capitán y Combustible', valEn: 'Captain & Fuel Included', valEs: 'Capitán y Combustible Incluidos' }
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-slate-700"
                  >
                    <span className="font-semibold text-slate-600">{isEs ? spec.labelEs : spec.labelEn}:</span>
                    <span className="font-bold text-slate-900">{isEs ? spec.valEs : spec.valEn}</span>
                  </div>
                ))}
              </div>

              {/* Resumen de Precios en Tarjeta Lateral */}
              <div className="mt-6 p-5 rounded-2xl bg-[#faf6f0] border-2 border-[#dccbb5] text-slate-800 space-y-2.5 text-xs shadow-xs">
                <div className="inline-block px-3 py-1 rounded-lg bg-[#7c5e3c] text-white font-extrabold uppercase tracking-wider text-[11px] mb-1">
                  {isEs ? 'Resumen de Tarifas (1–12 Invitados)' : 'Charter Pricing Summary (1–12 Guests)'}
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#e6d7c3]">
                  <span className="text-slate-700 font-medium">
                    {isEs ? '2 Horas (Quarter-Day):' : '2 Hours (Quarter-Day):'}
                  </span>
                  <span className="font-black text-[#7c5e3c] text-sm">$1,999 USD</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#e6d7c3]">
                  <span className="text-slate-700 font-medium">
                    {isEs ? '4 Horas (Half-Day):' : '4 Hours (Half-Day):'}
                  </span>
                  <span className="font-black text-[#003865] text-sm">$4,260 USD</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#e6d7c3]">
                  <span className="text-slate-700 font-medium">
                    {isEs ? '8 Horas (Full-Day):' : '8 Hours (Full-Day):'}
                  </span>
                  <span className="font-black text-[#003865] text-sm">$7,500 USD</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-700 font-medium">{isEs ? 'Hora Extra:' : 'Extra Hour:'}</span>
                  <span className="font-bold text-[#003865]">$910 USD</span>
                </div>
              </div>

              {/* Banner de Salida en Marina */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
                <MapPin className="text-blue-900 shrink-0" size={20} />
                <div>
                  <span className="font-bold text-slate-900 block">
                    {isEs ? 'Salida desde Marina Cabo San Lucas' : 'Departs from Cabo San Lucas Marina'}
                  </span>
                  <span>
                    {isEs
                      ? 'Podemos recogerte directamente en tu hotel o villa con transporte privado opcional.'
                      : 'Optional door-to-dock private SUV/Sprinter pickup available from any Los Cabos resort.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECCIÓN DE PREGUNTAS FRECUENTES (FAQS Y CUSTOMER Q&A)     */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2 border border-blue-200">
            <Info size={14} />
            {isEs ? 'Preguntas Frecuentes y Respuestas' : 'Customer Questions & FAQs'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEs
              ? 'Preguntas Frecuentes sobre el Yate de 57ft "La Dolce Vita"'
              : 'Frequently Asked Questions About the 57ft Yacht "La Dolce Vita"'}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Cuánto dura el alquiler del yate?' : 'How long does a rental last?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'La renta diaria básica se estructura como cuarto de día (2 horas por $1,999 USD), medio día (4 horas por $4,260 USD) o día completo (8 horas por $7,500 USD). También puedes agregar horas adicionales ($910 USD/hr) o solicitar un itinerario personalizado con nuestro equipo.'
                : 'The basic daily rental is structured as either a quarter-, half-, or full-day. A quarter-day is two hours ($1,999 USD), a half-day is four hours ($4,260 USD), and a full-day is eight hours ($7,500 USD). You can also add custom hours ($910 USD/hr) or discuss a custom trip with our concierge team.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué debo llevar a bordo?' : 'What should I bring?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Ropa cómoda adecuada para la temporada, traje de baño, sombrero, lentes de sol y protector solar. Ten en cuenta que en el agua suele refrescar unos grados al atardecer, por lo que una chamarra ligera o rompevientos siempre es buena idea. Coordina con nosotros cualquier alimento o bebida adicional que desees subir a bordo.'
                : 'Bring yourself and comfortable clothes suitable to the season you are going to be out on the water. Please keep in mind that it is often 10 degrees cooler out on the water, so a jacket or windbreaker is never a bad idea. We also recommend bringing a hat, sunscreen, sunglasses, and a swimsuit. Please coordinate with our team regarding any special food or drinks that you wish to bring aboard.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs
                ? '¿Pueden recogerme en mi hotel y cuántos chalecos salvavidas tienen?'
                : 'Can you pick me up at my resort, and how many life-jackets do you have?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? '¡Sí! Puedes activar la opción de Transportación Terrestre Privada VIP directamente en nuestra calculadora para que una Suburban o Sprinter privada te recoja en tu hotel o villa y te lleve directo al muelle en la Marina de Cabo San Lucas. El barco cuenta con chalecos salvavidas certificados para los 12 pasajeros y botiquín de primeros auxilios.'
                : 'Yes! You can toggle our VIP Private Round-Trip Ground Transportation directly in the booking calculator above for door-to-dock service from any hotel or villa in Los Cabos. The yacht is fully equipped with certified life jackets for all 12 guests and a first aid kit.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué tipo de yate debo elegir?' : 'What type of yacht should I charter?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Sin importar qué embarcación elijas, tendrás un día inolvidable en el mar. El yate a motor de 57 pies "La Dolce Vita" es ideal para grupos de hasta 12 personas que buscan lujo privado, rapidez para recorrer El Arco y las bahías de esnórquel, y un amplio asoleadero. Si tienes un grupo más grande (hasta 25 o 30 personas), también contamos con nuestros yates de 80ft, 85ft, 110ft, 116ft y 130ft.'
                : 'No matter what type of yacht you choose to charter, you will have a fantastic time on the water. The 57ft "La Dolce Vita" motor yacht is ideal for groups of up to 12 guests looking for an exclusive, intimate VIP experience with snorkeling, paddleboards, and spacious sundecks. For larger groups (up to 25–30 guests), explore our 80ft, 85ft, 110ft, 116ft, and 130ft superyachts below.'}
            </p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
            {/* Yate: 30 ft Baja Therapy */}
            <Link href={`/${lang}/yachts/baja-therapy`} className="group block text-center">
              <div className="aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/Baja Therapy/cover.Bzegnl3K_1cRkvD.webp"
                  alt="30 ft Baja Therapy Double-Deck Pontoon Cabo Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg font-normal leading-snug">
                <span className="text-slate-600">30 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Baja Therapy
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">Double-Deck Pontoon</div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $1,560' : 'Starting at $1,560'}
              </div>
            </Link>

            {/* Yate: 108 ft Neoprene */}
            <Link href={`/${lang}/yachts/neoprene`} className="group block text-center">
              <div className="aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/neopreno/neoprene-gallery-02.jpg"
                  alt="108 ft Matte-Black Mangusta Superyacht Neoprene Cabo Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg font-normal leading-snug">
                <span className="text-slate-600">108 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Neoprene
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">Mangusta 108</div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $6,700' : 'Starting at $6,700'}
              </div>
            </Link>

            {/* Yate 1: 80 ft Papillon 9 */}
            <Link href={`/${lang}/yachts/papillon-9`} className="group block text-center">
              <div className="aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/papillon-9/papillon-1.avif"
                  alt="80 ft Black Sunseeker Manhattan Papillon 9 Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg font-normal leading-snug">
                <span className="text-slate-600">80 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Papillon 9
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">Sunseeker Manhattan</div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $5,500' : 'Starting at $5,500'}
              </div>
            </Link>

            {/* Yate 2: 85 ft Contessa */}
            <Link href={`/${lang}/yachts/contessa`} className="group block text-center">
              <div className="aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/contessa/contessa-1.jpg"
                  alt="85 ft Contessa Her Shine Marine Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg font-normal leading-snug">
                <span className="text-slate-600">85 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Contessa
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">Her Shine Marine</div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $3,700' : 'Starting at $3,700'}
              </div>
            </Link>

            {/* Yate 3: 110 ft Aquaholic */}
            <Link href={`/${lang}/yachts/aquaholic`} className="group block text-center">
              <div className="aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-hero.webp"
                  alt="110 ft Aquaholic Horizon Yacht Cabo Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg font-normal leading-snug">
                <span className="text-slate-600">110 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Aquaholic
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">Horizon Yachts</div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $5,900' : 'Starting at $5,900'}
              </div>
            </Link>

            {/* Yate 4: 116 ft Capella */}
            <Link href={`/${lang}/yachts`} className="group block text-center">
              <div className="aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/capella-aerial-overview.jpg"
                  alt="116 ft Capella Azimut-Benetti Cabo Yacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg font-normal leading-snug">
                <span className="text-slate-600">116 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Capella
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">Azimut-Benetti</div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $8,000' : 'Starting at $8,000'}
              </div>
            </Link>

            {/* Yate 5: 130 ft Sovereign */}
            <Link href={`/${lang}/yachts/sovereign`} className="group block text-center">
              <div className="aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
                <img
                  src="/yachts/sovereign/sovereign-6.jpg"
                  alt="130 ft Sovereign Yachts Cabo Superyacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-lg font-normal leading-snug">
                <span className="text-slate-600">130 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Sovereign
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">Sovereign Yachts</div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
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
                    ? `Gracias ${inquireData.firstName}. Nuestro equipo VIP concierge de Ballard Tours se comunicará contigo a la brevedad para confirmar disponibilidad y los detalles de tu chárter en el Yate de 57ft "La Dolce Vita".`
                    : `Thank you ${inquireData.firstName}. Our VIP concierge team at Ballard Tours will get in touch with you shortly to confirm availability and itinerary details aboard the 57ft Yacht "La Dolce Vita".`}
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
                  <p className="text-sm font-bold text-slate-800 mt-0.5">57ft Yacht &ldquo;La Dolce Vita&rdquo;</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
                    {isEs
                      ? 'Si estás interesado en reservar este yate o deseas más información por favor déjanos un mensaje aquí'
                      : 'If you are interested to book this yacht or just want more information please leave us a message here'}
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
                      {POPULAR_COUNTRY_CODES.map((code) => {
                        const c = COUNTRIES.find((x) => x.code === code);
                        return c ? (
                          <option key={c.code} value={c.dialCode}>
                            {c.flag} {c.dialCode}
                          </option>
                        ) : null;
                      })}
                      <option disabled>──────────</option>
                      {COUNTRIES.filter((x) => !POPULAR_COUNTRY_CODES.includes(x.code)).map((c) => (
                        <option key={c.code} value={c.dialCode}>
                          {c.flag} {c.dialCode} ({c.name})
                        </option>
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
                      placeholder={
                        isEs ? 'Escribe aquí tu mensaje, horario deseado o preguntas...' : 'Your Message'
                      }
                      value={inquireData.message}
                      onChange={(e) => setInquireData({ ...inquireData, message: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-[#003865] outline-none resize-none"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                    <span>
                      <strong>{isEs ? 'Paquete seleccionado:' : 'Selected Package:'}</strong>{' '}
                      {isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn} ({totalHuespedes} pax)
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
                      {enviandoInquiry
                        ? isEs
                          ? 'Enviando...'
                          : 'Submitting...'
                        : isEs
                        ? 'Enviar Solicitud'
                        : 'Submit'}
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
              <span className="text-slate-300 font-bold hidden sm:inline">57ft Yacht &ldquo;La Dolce Vita&rdquo;</span>
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

function CameraIcon({ size = 16, className = '' }) {
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
