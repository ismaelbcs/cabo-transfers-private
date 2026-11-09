// src/app/[lang]/yachts/neoprene/page.js
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
  Utensils,
  Wine,
  Waves,
  Compass,
  X,
  MessageCircle,
  Maximize2,
  Ship,
  Star,
  Mail,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  Award
} from 'lucide-react';
import { useCart } from '../../../../context/CartContext';
import { catalogoHoteles } from '../../../../data/seoData';
import { COUNTRIES, POPULAR_COUNTRY_CODES } from '../../../../data/countryCallingCodes';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { sendEmail } from '../../../../utils/sendEmail';
import TrustedPartners from '../../../../components/TrustedPartners';
import HeroReviewsBadge from '../../../../components/HeroReviewsBadge';

export default function NeopreneYachtPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const { agregarAlCombo } = useCart();

  // ==========================================
  // CONFIGURACIÓN DE PAQUETES - 108FT MANGUSTA "NEOPRENE"
  // Regla aplicada:
  // - Paquete Base 3 Horas: Original $5,700 ($1,900/hr x 3h) + $1,000 = $6,700 USD (1 a 10 pasajeros base)
  // - Hora Extra: Original $1,900 + $100 = $2,000 USD por hora
  // - Huésped Extra (11 a 30 pasajeros):
  //   • Adultos / 13+ años: Original $150 + $50 = $200 USD por pasajero
  //   • Niños 4–12 años: Original $75 + $50 = $125 USD por pasajero
  //   • Bebés 0–3 años: Sin cargo ($0 USD)
  // ==========================================
  const paquetes = [
    {
      id: 'charter-3-hours',
      nameEn: '3 HOURS ALL INCLUSIVE',
      nameEs: '3 HORAS TODO INCLUIDO',
      hours: 3,
      price: 6700, // Original $5,700 + $1,000
      baseGuests: 10,
      maxGuests: 30,
      extraGuestPrice: 200, // Original $150 + $50 (Ages 13+)
      childExtraPrice: 125, // Original $75 + $50 (Ages 4-12)
      popular: true,
      descriptionEn:
        '3-hour minimum private charter aboard the iconic matte-black 108ft Mangusta Superyacht "Neoprene" for up to 10 base guests (30 max day charter capacity). Includes Private Chef Christian, personal bartender, top-shelf open bar, 4 staterooms + master suite, Seabob, kayaks, paddleboards, lily pad & snorkel gear.',
      descriptionEs:
        'Chárter privado mínimo de 3 horas a bordo del icónico superyate negro mate Mangusta de 108 pies "Neoprene" para hasta 10 huéspedes base (capacidad máx. 30 en chárter de día). Incluye Chef privado Christian, bartender personal, barra libre premium, 4 camarotes + suite master, Seabob, kayaks, paddleboards, lily pad y equipo de esnórquel.'
    },
    {
      id: 'charter-4-hours',
      nameEn: '4 HOURS ALL INCLUSIVE',
      nameEs: '4 HORAS TODO INCLUIDO',
      hours: 4,
      price: 8700, // 3h ($6,700) + 1h extra ($2,000)
      baseGuests: 10,
      maxGuests: 30,
      extraGuestPrice: 200,
      childExtraPrice: 125,
      popular: false,
      descriptionEn:
        'Extended 4-hour half-day superyacht charter past El Arco and Lover’s Beach with anchoring at Santa María or Chileno Bay. Enjoy the onboard beach club, Seabob, paddleboards, kayaks, top-shelf open bar, and freshly cooked cuisine by Chef Christian.',
      descriptionEs:
        'Chárter de superyate de 4 horas por El Arco y Playa del Amor con fondeo en Bahía Santa María o Chileno. Disfruta del club de playa a bordo, Seabob, paddleboards, kayaks, barra libre premium y alta cocina preparada al momento por el Chef Christian.'
    },
    {
      id: 'charter-6-hours',
      nameEn: '6 HOURS ALL INCLUSIVE',
      nameEs: '6 HORAS TODO INCLUIDO',
      hours: 6,
      price: 12700, // 3h ($6,700) + 3h extra ($6,000)
      baseGuests: 10,
      maxGuests: 30,
      extraGuestPrice: 200,
      childExtraPrice: 125,
      popular: false,
      descriptionEn:
        '6-hour luxury superyacht experience along the Los Cabos coastline. Relax on the foredeck sun pads under the canopy, enjoy al fresco dining on deck, swim from the beach club platform, and savor multi-course gourmet dining.',
      descriptionEs:
        'Experiencia de 6 horas en superyate por la costa de Los Cabos. Relájate en los camastros de proa bajo el toldo, disfruta de comedor al aire libre en cubierta, plataforma beach club y menú gourmet de varios tiempos.'
    },
    {
      id: 'charter-8-hours',
      nameEn: '8 HOURS ALL INCLUSIVE',
      nameEs: '8 HORAS TODO INCLUIDO',
      hours: 8,
      price: 16700, // 3h ($6,700) + 5h extra ($10,000)
      baseGuests: 10,
      maxGuests: 30,
      extraGuestPrice: 200,
      childExtraPrice: 125,
      popular: false,
      descriptionEn:
        'Full-day 8-hour flagship Mangusta 108 charter for up to 30 guests. The ultimate VIP statement in Cabo San Lucas with bespoke menu by Chef Christian, personal bartender, Seabob, water toys, and golden sunset cruise.',
      descriptionEs:
        'Chárter insignia de día completo (8 horas) en el Mangusta 108 para hasta 30 invitados. La máxima experiencia VIP en Cabo San Lucas con menú a medida del Chef Christian, bartender personal, Seabob, juguetes acuáticos y crucero al atardecer.'
    }
  ];

  // ==========================================
  // ESTADOS DEL CONFIGURADOR / CALCULADORA
  // ==========================================
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(paquetes[0]); // 3 Horas ($6,700 USD) por defecto
  const [charterFecha, setCharterFecha] = useState('');
  const [totalHuespedes, setTotalHuespedes] = useState(10);
  const [horasExtras, setHorasExtras] = useState(0); // $2,000 USD por hora extra ($1,900 + $100)
  const PRECIO_HORA_EXTRA = 2000;

  // Estados de Transportación Terrestre
  const [incluirTransporte, setIncluirTransporte] = useState(false);
  const [transporteOrigen, setTransporteOrigen] = useState('');
  const [busquedaOrigen, setBusquedaOrigen] = useState('');
  const [mostrarDropdownHoteles, setMostrarDropdownHoteles] = useState(false);
  const [horaRecogidaHotel, setHoraRecogidaHotel] = useState('11:00');
  const [horaRegresoMarina, setHoraRegresoMarina] = useState('17:00');

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

  // Cálculo de Horas Extras ($2,000 USD c/u)
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
  // FOTOS REALES DEL SUPERYATE 108FT MANGUSTA "NEOPRENE" (/yachts/neopreno/)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/yachts/neopreno/neoprene-gallery-02.jpg',
      titleEn: '108ft Matte-Black Mangusta Superyacht "Neoprene" in Cabo San Lucas',
      titleEs: 'Superyate Mangusta 108 Negro Mate "Neoprene" en Cabo San Lucas',
      descEn: 'The matte-black Mangusta 108. She doesn’t just arrive — she makes an entrance. The most distinctive vessel on the water in Cabo.',
      descEs: 'El Mangusta 108 negro mate. No solo llega: hace una entrada triunfal. La embarcación más distintiva en las aguas de Los Cabos.',
      labelEn: '108ft Mangusta Flagship',
      labelEs: 'Buque Insignia 108ft'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-03.jpg',
      titleEn: '108ft Neoprene Cruising Past Land’s End & El Arco in Cabo San Lucas',
      titleEs: '108ft Neoprene Navegando frente al Finisterra y El Arco de Cabo San Lucas',
      descEn: 'Sleek Italian open-style superyacht performance combined with more outdoor living space than any yacht in the bay.',
      descEs: 'Diseño italiano de alto desempeño combinado con más espacio exterior al aire libre que cualquier otro yate en la bahía.',
      labelEn: 'Cruising Cabo Bay',
      labelEs: 'Navegando en Cabo'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-05.jpg',
      titleEn: 'Iconic Matte-Black Profile of the 108ft Mangusta Superyacht',
      titleEs: 'Icónico Perfil Negro Mate del Superyate Mangusta de 108 Pies',
      descEn: 'Up to 30 guests for day charters and up to 10 guests for overnight charters with 4 staterooms and a spacious master suite.',
      descEs: 'Capacidad para hasta 30 invitados en chárters de día y 10 en pernocta con 4 camarotes y una amplia suite principal.',
      labelEn: 'Side Profile',
      labelEs: 'Perfil Lateral'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-01.jpg',
      titleEn: 'Commanding Bow & Expansive Foredeck Sun Pads',
      titleEs: 'Imponente Proa y Amplios Camastros de Sol en Cubierta Frontal',
      descEn: 'Oversized sun pads on the foredeck under an optional canopy for 360-degree views of Cabo’s coastline.',
      descEs: 'Amplios camastros en la cubierta de proa con toldo opcional para vistas de 360 grados de la costa de Cabo.',
      labelEn: 'Foredeck & Bow',
      labelEs: 'Proa y Asoleadero'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-04.jpg',
      titleEn: 'Aerial Drone View of 108ft Neoprene Carving Through Turquoise Waters',
      titleEs: 'Vista Aérea con Dron del 108ft Neoprene en Aguas Turquesa',
      descEn: 'Expansive teak decks from bow to stern, featuring foredeck sun lounges, shaded cockpit dining, and swim platform beach club.',
      descEs: 'Amplias cubiertas de teca de proa a popa, con asoleadero frontal, comedor sombreado y plataforma beach club.',
      labelEn: 'Aerial Overview',
      labelEs: 'Vista Aérea'
    },
    {
      src: '/yachts/neopreno/DSC03705.jpg',
      titleEn: 'Brightly Lit Main Saloon, Indoor Dining & Custom "NEOPRENE" Bar',
      titleEs: 'Salón Principal Iluminado, Comedor Interior y Barra Personalizada "NEOPRENE"',
      descEn: 'Climate-controlled luxury saloon with panoramic windows, skylight ceiling, plush lounges, formal dining table, and full bar.',
      descEs: 'Salón de lujo climatizado con ventanas panorámicas, techo con tragaluz, salas lounge, comedor formal y barra completa.',
      labelEn: 'Main Saloon & Bar',
      labelEs: 'Salón Principal y Bar'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-06.jpg',
      titleEn: 'Expansive Teak Aft Deck Lounge & Shaded Al Fresco Dining Space',
      titleEs: 'Amplia Cubierta de Popa en Teca y Comedor Al Fresco Sombreado',
      descEn: 'Seamless indoor-outdoor flow from the main saloon to the teak aft deck and onboard beach club.',
      descEs: 'Conexión perfecta entre el salón interior, la terraza de popa en madera de teca y el club de playa a bordo.',
      labelEn: 'Aft Deck Lounge',
      labelEs: 'Terraza de Popa'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-07.jpg',
      titleEn: 'Al Fresco Dining Table Prepared for Chef Christian’s Onboard Cuisine',
      titleEs: 'Mesa de Comedor Al Fresco Lista para la Alta Cocina del Chef Christian',
      descEn: 'Not caterers, not pre-made trays. Your menu is prepared fresh on board, built around your group before you ever step on deck.',
      descEs: 'Sin catering externo ni charolas prefabricadas. Tu menú se prepara fresco a bordo, diseñado a la medida de tu grupo.',
      labelEn: 'Al Fresco Dining',
      labelEs: 'Comedor Al Fresco'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-08.jpg',
      titleEn: 'Aft Deck Dining & Onboard Beach Club Access to the Water',
      titleEs: 'Comedor en Cubierta y Acceso Directo al Club de Playa y Plataforma de Nado',
      descEn: 'Enjoy top-shelf cocktails from your personal bartender while overlooking the water.',
      descEs: 'Disfruta cócteles premium preparados por tu bartender personal frente al mar.',
      labelEn: 'Deck & Beach Club',
      labelEs: 'Cubierta y Beach Club'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-11.jpg',
      titleEn: 'Foredeck Sun Pads & Teak Walkaround at Cabo San Lucas Marina',
      titleEs: 'Camastros de Proa y Pasillos de Teca en la Marina de Cabo San Lucas',
      descEn: 'More outdoor living space than any yacht in the bay, docked at her home slip in Cabo San Lucas Marina.',
      descEs: 'Más espacio exterior que cualquier otro yate en la bahía, en su muelle base en la Marina de Cabo San Lucas.',
      labelEn: 'Foredeck Sun Pads',
      labelEs: 'Camastros de Proa'
    },
    {
      src: '/yachts/neopreno/neoprene-gallery-09.jpg',
      titleEn: 'Matte-Black Hull Badging & Wide Teak Walkaround Decks',
      titleEs: 'Acabado Negro Mate "NEOPRENE" y Amplios Pasillos Laterales de Teca',
      descEn: 'Impeccable Italian Mangusta build quality and unmistakable matte-black styling.',
      descEs: 'Impecable manufactura italiana Mangusta y su inconfundible acabado negro mate.',
      labelEn: 'Mangusta Detailing',
      labelEs: 'Detalles Mangusta'
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
      id: `yacht-neoprene-${paqueteSeleccionado.id}-${Date.now()}`,
      tipo: 'yate',
      nombre: `108ft Mangusta "Neoprene" - ${isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn}`,
      fecha: charterFecha,
      horario: incluirTransporte ? `${horaRecogidaHotel} - ${horaRegresoMarina}` : `${totalHoras} Hours Charter`,
      pasajeros: totalHuespedes,
      precio: granTotalYate,
      detalles: {
        embarcacion: '108ft Mangusta Superyacht "Neoprene"',
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
          ? '16% IVA y propina para la tripulación no incluidos. El IVA es obligatorio en todos los pagos electrónicos (tarjeta de crédito aplica 3.5% de comisión).'
          : '16% VAT and crew gratuity not included. VAT is required on all forms of electronic payment (credit card 3.5% processing fee).'
      }
    });

    router.push(`/${lang}/checkout`);
  };

  const handleSubmitInquire = async (e) => {
    e.preventDefault();
    setEnviandoInquiry(true);

    try {
      const payload = {
        tipo: 'Yacht Charter Inquiry - 108ft Mangusta Neoprene',
        embarcacion: '108ft Mangusta Superyacht "Neoprene"',
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
        subject: `🛥️ New Superyacht Inquiry: 108ft Mangusta "Neoprene" (${payload.clienteNombre})`,
        html: `
          <h2>Solicitud de Reserva / Información - 108ft Mangusta Superyacht "Neoprene"</h2>
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
            <li><strong>Total Estimado:</strong> $${granTotalYate.toLocaleString()} USD (+ 16% VAT / Crew Gratuity)</li>
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
      ? `¡Hola! Me interesa reservar el Superyate de 108ft Mangusta "Neoprene" en Cabo San Lucas.\n\n• Paquete: ${paqueteSeleccionado.nameEs}\n• Fecha: ${charterFecha || 'Por definir'}\n• Huéspedes: ${totalHuespedes} personas\n• Horas extra: ${horasExtras}\n• Transporte terrestre: ${incluirTransporte ? `Sí (${transporteOrigen})` : 'No'}\n• Total estimado: $${granTotalYate.toLocaleString()} USD`
      : `Hello! I'm interested in chartering the 108ft Mangusta Superyacht "Neoprene" in Cabo San Lucas.\n\n• Package: ${paqueteSeleccionado.nameEn}\n• Date: ${charterFecha || 'TBD'}\n• Guests: ${totalHuespedes} guests\n• Extra hours: ${horasExtras}\n• Ground transport: ${incluirTransporte ? `Yes (${transporteOrigen})` : 'No'}\n• Estimated total: $${granTotalYate.toLocaleString()} USD`
  );

  // ==========================================
  // EXPERIENCIAS Y AMENIDADES A BORDO DEL NEOPRENE 108FT
  // ==========================================
  const aventurasIncluidas = [
    {
      titleEn: 'CHEF CHRISTIAN ONBOARD',
      titleEs: 'CHEF PRIVADO CHRISTIAN',
      descEn: 'Not caterers, not pre-made trays. Fresh gourmet cuisine cooked on board and tailored to your group.',
      descEs: 'Sin catering ni charolas prefabricadas. Alta cocina preparada fresca a bordo y a la medida de tu grupo.',
      img: '/yachts/neopreno/neoprene-gallery-07.jpg'
    },
    {
      titleEn: 'TOP-SHELF OPEN BAR & BARTENDER',
      titleEs: 'BARRA LIBRE PREMIUM Y BARTENDER',
      descEn: 'Personal bartender serving handcrafted cocktails and premium spirits at the saloon bar and on deck.',
      descEs: 'Bartender personal sirviendo coctelería de autor y licores premium en la barra interior y en cubierta.',
      img: '/yachts/neopreno/DSC03705.jpg'
    },
    {
      titleEn: 'SEABOB, KAYAKS & WATER TOYS',
      titleEs: 'SEABOB, KAYAKS Y JUGUETES ACUÁTICOS',
      descEn: 'Equipped with Seabob, kayaks, stand-up paddleboards, floating lily pad, and full snorkel gear.',
      descEs: 'Equipado con Seabob, kayaks, tablas de paddleboard, tapete flotante lily pad y equipo de esnórquel.',
      img: '/yachts/neopreno/neoprene-gallery-04.jpg'
    },
    {
      titleEn: 'ONBOARD BEACH CLUB & PLATFORM',
      titleEs: 'BEACH CLUB Y PLATAFORMA DE NADO',
      descEn: 'Expansive swimming platform and onboard beach club giving your group ultimate access to the ocean.',
      descEs: 'Amplia plataforma de nado y club de playa a bordo que brinda a tu grupo acceso total al mar.',
      img: '/yachts/neopreno/neoprene-gallery-06.jpg'
    },
    {
      titleEn: 'FOREDECK SUN PADS WITH CANOPY',
      titleEs: 'ASOLEADERO DE PROA CON TOLDO',
      descEn: 'Oversized sun pads on the bow with optional shade canopy and panoramic views of El Arco.',
      descEs: 'Camastros gigantes en proa con toldo de sombra opcional y vistas panorámicas hacia El Arco.',
      img: '/yachts/neopreno/neoprene-gallery-11.jpg'
    },
    {
      titleEn: '4 STATEROOMS & MASTER SUITE',
      titleEs: '4 CAMAROTES Y SUITE MASTER',
      descEn: 'Four staterooms plus a spacious master suite for up to 30 day charter guests or 10 overnight guests.',
      descEs: 'Cuatro camarotes más una amplia suite principal para hasta 30 invitados de día o 10 en pernocta.',
      img: '/yachts/neopreno/neoprene-gallery-02.jpg'
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Anchor size={13} />
                <span>
                  {isEs
                    ? 'Buque Insignia • Mangusta 108 Negro Mate • Hasta 30 Invitados'
                    : 'Cabo Yacht Charters • Flagship Matte-Black Mangusta 108'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                {isEs
                  ? '108ft "Neoprene" – Superyate Mangusta Negro Mate en Cabo San Lucas'
                  : '108ft "Neoprene" – Matte-Black Mangusta Superyacht in Cabo San Lucas'}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
                {isEs
                  ? 'El Mangusta 108 negro mate. No solo llega: hace una entrada triunfal. 4 Camarotes + Suite Master • Chef Privado Christian y Bartender Personal • Seabob, Kayaks, Paddleboards y Beach Club • Hasta 30 Invitados.'
                  : 'The matte-black Mangusta 108. She doesn’t just arrive — she makes an entrance. 4 Staterooms & Spacious Master Suite • Private Chef Christian & Personal Bartender • Seabob, Kayaks, Paddleboards & Onboard Beach Club • Up to 30 Guests.'}
              </p>
            </div>

            {/* Botones rápidos en el tope */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenInquire(paqueteSeleccionado)}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                {isEs ? 'Solicitar Disponibilidad' : 'Check Availability'}
              </button>

              <a
                href="#packages-section"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <Sparkles size={15} className="text-amber-600" />
                {isEs ? 'Ver Tarifas' : 'View Pricing'}
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GALERÍA VISUAL INTERACTIVA (11 FOTOS REALES DEL NEOPRENE) */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">

        {/* Imagen Principal Activa */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />

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
              <span className="inline-block px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider mb-1.5">
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
              <span>{isEs ? `Mostrar las ${fotosGaleria.length} fotos` : `Show all ${fotosGaleria.length} photos`}</span>
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
      {/* BARRA DE ESPECIFICACIONES RÁPIDAS (SPECS BAR)            */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-[#0b1524] text-white rounded-2xl py-6 px-4 sm:px-8 shadow-md grid grid-cols-2 sm:grid-cols-5 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          <div className="pt-2 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              108 <span className="text-sm font-sans text-amber-400 font-semibold">FT</span>
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
              {isEs ? 'Superyate Mangusta' : 'Mangusta Superyacht'}
            </div>
          </div>

          <div className="pt-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">30</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
              {isEs ? 'Invitados · Chárter de Día' : 'Guests · Day Charter'}
            </div>
          </div>

          <div className="pt-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">4 + 1</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
              {isEs ? 'Camarotes + Suite Master' : 'Staterooms + Master Suite'}
            </div>
          </div>

          <div className="pt-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">10</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
              {isEs ? 'Invitados · Pernocta' : 'Guests · Overnight'}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 pt-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              3 <span className="text-sm font-sans text-amber-400 font-semibold">HR</span>
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
              {isEs ? 'Chárter Mínimo' : 'Minimum Charter'}
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
      {/* SECCIÓN DE PAQUETES Y TARIFAS (DESDE 3 HORAS $6,700 USD)  */}
      {/* ======================================================== */}
      <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 scroll-mt-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles size={13} />
            <span>{isEs ? 'Precios Transparentes • Todo Incluido' : 'Transparent Pricing • One Rate. Everything Included.'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#003865] tracking-tight">
            {isEs ? 'Tarifas del Superyate 108ft "Neoprene"' : 'Pricing for 108ft Mangusta "Neoprene"'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl mx-auto">
            {isEs
              ? 'Chárter mínimo de 3 horas desde $6,700 USD para hasta 10 pasajeros base (hasta 30 invitados en chárter de día). Incluye paquete de alimentos gourmet con el Chef privado Christian, barra libre premium con bartender personal y todos los juguetes acuáticos.'
              : 'Starting at $6,700 USD based on a 3-hour minimum charter for up to 10 base passengers (up to 30 guests for day charters). Food & premium beverage package, Private Chef Christian, personal bartender, designated staff, and all water toys included.'}
          </p>
        </div>

        {/* Grid de 4 Tarjetas de Paquetes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {paquetes.map((pkg, idx) => {
            const isSelected = paqueteSeleccionado.id === pkg.id;

            const headerColors = [
              'bg-[#0b1524]', // 3 Hours Base (Flagship Matte-Black / Navy)
              'bg-[#003865]', // 4 Hours
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
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c8b273] text-white text-xs font-extrabold px-5 py-1.5 rounded-t-md shadow-xs tracking-wide z-10 whitespace-nowrap">
                    {isEs ? 'Mínimo 3 Horas • Más Popular' : '3-Hour Minimum • Most Popular'}
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
                          ? 'Para hasta 10 invitados base • + IVA'
                          : 'Based on up to 10 guests • + VAT'}
                      </p>
                    </div>

                    <div className="space-y-2.5 text-xs border-t border-slate-200 pt-4">
                      {/* Base Guests */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Users size={15} className="text-[#003865]" />
                          {isEs ? 'Huéspedes Base' : 'Base Guests'}
                        </span>
                        <span className="font-bold text-slate-900">1 - {pkg.baseGuests}</span>
                      </div>

                      {/* Extra Guests (11-30) */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Users size={15} className="text-[#003865]" />
                          {isEs ? 'Huésped Extra (11–30)' : 'Extra Guest (11–30)'}
                        </span>
                        <span className="font-medium text-slate-600 text-right">
                          {isEs ? `$${pkg.extraGuestPrice} USD (máx 30)` : `$${pkg.extraGuestPrice} USD (max 30)`}
                        </span>
                      </div>

                      {/* Hours */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Clock size={15} className="text-[#003865]" />
                          {isEs ? 'Duración' : 'Hours'}
                        </span>
                        <span className="font-bold text-slate-900">{pkg.hours}h</span>
                      </div>

                      {/* Private Chef Christian */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Utensils size={15} className="text-[#003865]" />
                          {isEs ? 'Chef Privado Christian y Menú' : 'Private Chef Christian & Menu'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      {/* Personal Bartender & Top-Shelf Open Bar */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Wine size={15} className="text-[#003865]" />
                          {isEs ? 'Bartender y Barra Libre Top-Shelf' : 'Bartender & Top-Shelf Open Bar'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      {/* Seabob, Kayaks, Paddleboards & Lily Pad */}
                      <div className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Waves size={15} className="text-[#003865]" />
                          {isEs ? 'Seabob, Kayaks, SUP y Lily Pad' : 'Seabob, Kayaks, SUP & Lily Pad'}
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

        {/* Botón Central "INQUIRE NOW" y Nota Importante de Precios */}
        <div className="text-center mt-10 space-y-4">
          <button
            type="button"
            onClick={() => handleOpenInquire(paqueteSeleccionado)}
            className="px-10 py-3.5 bg-[#003865] hover:bg-[#002647] text-white font-extrabold text-sm uppercase tracking-widest rounded-md shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            {isEs ? 'VERIFICAR DISPONIBILIDAD AHORA' : 'CHECK AVAILABILITY NOW'}
          </button>

          <div className="max-w-3xl mx-auto bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-0.5">
              {isEs ? 'Tarifa Transparente y Reglas de Grupos (11 a 30 Pasajeros):' : 'Transparent Pricing & Groups of 11+ Passengers:'}
            </strong>
            {isEs
              ? 'Hora Adicional: $2,000 USD/hora • Grupos de 11 a 30 pasajeros: Edades 0–3 años sin cargo ($0 USD) · Edades 4–12 años: $125 USD por pasajero · Edades 13+ años: $200 USD por pasajero. 16% IVA y propina para la tripulación no incluidos.'
              : 'Additional Hour: $2,000 USD/hour • Groups of 11–30 passengers: Ages 0–3 no charge ($0 USD) · Ages 4–12: $125 USD per passenger · Ages 13+: $200 USD per passenger. 16% VAT and crew gratuity not included.'}
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
                {isEs ? 'Configura tu Chárter en el 108ft "Neoprene"' : 'Configure Your 108ft "Neoprene" Charter'}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {isEs
                  ? 'Personaliza tu grupo (hasta 30 invitados), añade horas extras ($2,000 USD/hr) y traslado privado desde tu hotel.'
                  : 'Customize your group size (up to 30 guests), add extra hours ($2,000 USD/hr), and round-trip private resort transfers.'}
              </p>
            </div>

            {/* Selector de Paquete Activo */}
            <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-3.5 sm:p-4 w-full md:w-auto md:min-w-[340px] lg:min-w-[380px] shadow-2xs shrink-0">
              <label htmlFor="select-paquete-neoprene" className="text-[11px] text-blue-900 font-extrabold uppercase tracking-wider block mb-1.5 flex items-center justify-between sm:justify-end gap-1.5">
                <span>{isEs ? 'Modificar Paquete Activo' : 'Active Package (Change)'}</span>
                <ChevronDown size={14} className="text-blue-900 shrink-0" />
              </label>
              <div className="relative">
                <select
                  id="select-paquete-neoprene"
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
                <label htmlFor="charter-fecha-neoprene" className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                  <Calendar size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Fecha de navegación' : 'Charter Date'}</span>
                </label>
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  {isEs ? 'Seleccionar día' : 'Select day'}
                </span>
              </div>

              <div className="h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 flex items-center focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 transition">
                <input
                  id="charter-fecha-neoprene"
                  type="date"
                  value={charterFecha}
                  onChange={(e) => setCharterFecha(e.target.value)}
                  className="w-full bg-transparent text-slate-800 outline-none text-sm font-semibold cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Disponibilidad confirmada en horas (chárters el mismo día a menudo posibles).'
                  : 'Availability confirmed within hours — same-day charters often possible.'}
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
                  ? 'Incluye 1 a 10 personas. De 11 a 30 suma $200 USD/adulto (niños 4-12: $125 USD, 0-3 gratis).'
                  : 'Covers 1–10 guests. Guests 11–30 add $200 USD/adult (ages 4–12: $125 USD, 0–3 free).'}
              </p>
            </div>

            {/* 3. Selector de Horas Extras ($2,000 USD/hr) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Clock size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Horas Extras' : 'Extra Hours'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {horasExtras > 0
                    ? `+${horasExtras}h (+$${costoHorasExtras.toLocaleString()} USD)`
                    : '$2,000 USD/hr'}
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
                  ? 'Extiende tu chárter por $2,000 USD por cada hora adicional todo incluido.'
                  : 'Extend your charter for $2,000 USD per additional all-inclusive hour.'}
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
                      ? 'Traslado exclusivo ida y vuelta desde tu hotel o villa a la Marina de Cabo San Lucas (muelle base de Neoprene) en Suburban o Sprinter de lujo.'
                      : 'Private round-trip SUV/Sprinter transfer from your resort or private villa directly to Neoprene’s home slip at Cabo San Lucas Marina.'}
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
                    {isEs ? 'Directo al muelle de Neoprene en Marina CSL' : 'Direct to Neoprene slip at Cabo San Lucas Marina'}
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
                  ? '* 16% IVA y propina de tripulación no incluidos. El IVA es requerido en todas las formas de pago electrónico.'
                  : '* 16% VAT and crew gratuity not included. VAT is required on all forms of electronic payment.'}
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
      {/* AVENTURAS Y EXPERIENCIAS INCLUIDAS EN CADA CHÁRTER        */}
      {/* ======================================================== */}
      <div className="bg-[#faf6f0] border-y border-[#e6d7c3] text-slate-900 py-16 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#7c5e3c] text-xs font-bold uppercase tracking-widest mb-3 border border-[#dccbb5] shadow-2xs">
              <Compass size={14} />
              {isEs ? 'Todo a Bordo • Nada que Organizar' : 'Everything on Board • Nothing to Arrange'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#003865] tracking-tight mb-4">
              {isEs
                ? 'Incluido con Cada Chárter en el 108ft "Neoprene"'
                : 'Included with Every 108ft "Neoprene" Charter'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs
                ? 'Una tripulación profesional dedicada eleva cada minuto a bordo: barra libre top-shelf, bartender personal, el Chef privado Christian cocinando en vivo con los mejores mariscos locales e ingredientes frescos, y acceso total al mar desde nuestro club de playa a bordo.'
                : 'A dedicated professional staff elevates the experience further — top-shelf open bar, personal bartender, and Private Chef Christian preparing your menu fresh on board with the best local seafood and freshest ingredients.'}
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
                <div className="-mt-6 z-10 bg-white text-slate-950 px-6 py-3 rounded-xl shadow-md border border-[#dccbb5] min-w-[240px] max-w-[92%] text-center">
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
      {/* DESCRIPCIÓN COMPLETA, ONBOARD DINING, POLÍTICAS Y DETALLES */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">

          {/* Columna Izquierda: The Yacht, Onboard Dining & Included List */}
          <div className="lg:col-span-7 space-y-8">

            {/* 1. The Yacht */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'El Yate' : 'The Yacht'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">
                {isEs
                  ? 'La embarcación más distintiva en las aguas de Cabo.'
                  : 'The most distinctive vessel on the water in Cabo.'}
              </h2>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  {isEs
                    ? 'Cada minuto a bordo se siente así. Cuatro camarotes y una espaciosa suite principal (master suite), un salón y comedor brillantemente iluminados, y más espacio de vida al aire libre que cualquier otro yate en la bahía.'
                    : 'Every minute on board feels like it. Four staterooms and a spacious master suite, a brightly lit saloon and dining area, and more outdoor living space than any yacht in the bay.'}
                </p>

                <p>
                  {isEs
                    ? 'Camastros de sol en la cubierta de proa bajo un toldo opcional. Comedor al fresco en cubierta. Una plataforma de nado y club de playa a bordo que brindan a tu grupo el máximo acceso al agua.'
                    : 'Sun pads on the foredeck under an optional canopy. Al fresco dining on deck. A swimming platform and onboard beach club that give your group ultimate access to the water.'}
                </p>

                <p>
                  {isEs
                    ? 'Un equipo profesional dedicado eleva aún más la experiencia: barra libre top-shelf, bartender personal y un chef privado que prepara tu menú con los mejores mariscos locales y los ingredientes más frescos.'
                    : 'A dedicated professional staff elevates the experience further — top-shelf open bar, personal bartender, and a private chef preparing your menu with the best local seafood and freshest ingredients.'}
                </p>
              </div>
            </section>

            {/* 2. Onboard Dining — Chef Christian + Reseña TripAdvisor */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Utensils size={14} />
                {isEs ? 'Gastronomía a Bordo' : 'Onboard Dining'}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs
                  ? 'El Chef Christian cocina mientras navegas.'
                  : 'Chef Christian cooks while you sail.'}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Sin servicios de catering externos, sin charolas prefabricadas. Tu menú se prepara fresco a bordo, diseñado alrededor de los gustos de tu grupo antes siquiera de que subas a cubierta.'
                  : 'Not caterers, not pre-made trays. Your menu is prepared fresh on board, built around your group before you ever step on deck.'}
              </p>

              {/* Cita Destacada de Justin C · TripAdvisor */}
              <div className="bg-[#faf6f0] border-l-4 border-[#c8b273] rounded-r-2xl p-5 sm:p-6">
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  <Star size={16} className="fill-amber-500" />
                  <Star size={16} className="fill-amber-500" />
                  <Star size={16} className="fill-amber-500" />
                  <Star size={16} className="fill-amber-500" />
                  <Star size={16} className="fill-amber-500" />
                </div>
                <blockquote className="text-slate-800 font-serif italic text-sm sm:text-base leading-relaxed">
                  {isEs
                    ? '“El Chef Christian merece un reconocimiento especial. Preparó una de las mejores comidas que probamos durante toda nuestra semana en Cabo.”'
                    : '“Chef Christian deserves special recognition. He prepared some of the best food we had during our entire week in Cabo.”'}
                </blockquote>
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mt-3">
                  Justin C · TripAdvisor · July 2026 · 108ft Neoprene
                </div>
              </div>
            </section>

            {/* 3. Included with Every Charter */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
                  <CheckCircle2 size={14} />
                  {isEs ? 'Incluido con Cada Chárter' : 'Included with Every Charter'}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isEs ? 'Todo a bordo. Nada que organizar.' : 'Everything on board. Nothing to arrange.'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                {[
                  {
                    en: 'Private chef — menu tailored to your group',
                    es: 'Chef privado — menú diseñado a la medida de tu grupo'
                  },
                  {
                    en: 'Personal bartender & top-shelf open bar',
                    es: 'Bartender personal y barra libre premium top-shelf'
                  },
                  {
                    en: 'Dedicated professional staff',
                    es: 'Tripulación y staff profesional dedicado'
                  },
                  {
                    en: '4 staterooms & spacious master suite',
                    es: '4 camarotes y espaciosa suite principal (master suite)'
                  },
                  {
                    en: 'Onboard beach club & swim platform',
                    es: 'Club de playa a bordo y plataforma de nado'
                  },
                  {
                    en: 'Al fresco dining space & indoor saloon dining',
                    es: 'Comedor al fresco en cubierta y comedor en salón interior'
                  },
                  {
                    en: 'Kayaks, paddleboards & floating lily pad',
                    es: 'Kayaks, tablas de paddleboard y tapete flotante lily pad'
                  },
                  {
                    en: 'Seabob, snorkel gear & water toys',
                    es: 'Seabob, equipo de esnórquel y juguetes acuáticos'
                  },
                  {
                    en: 'Foredeck sun pads with optional canopy',
                    es: 'Camastros de sol en proa con toldo opcional'
                  },
                  {
                    en: 'Marina & dock fees at Cabo San Lucas Marina included',
                    es: 'Tarifas de muelle en Marina Cabo San Lucas incluidas'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80"
                  >
                    <CheckCircle2 size={17} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-800">{isEs ? item.es : item.en}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Columna Derecha: Transparent Pricing, Good to Know, Upgrades, Not Included & Booking Policies */}
          <div className="lg:col-span-5 space-y-6">

            {/* Transparent Pricing Summary Card */}
            <div className="bg-[#0b1524] text-white rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                <Award size={16} />
                {isEs ? 'Tarifa Transparente' : 'Transparent Pricing'}
              </div>
              <h3 className="text-2xl font-black text-white mb-1">
                {isEs ? 'Una tarifa. Todo incluido.' : 'One rate. Everything included.'}
              </h3>

              <div className="my-5 pb-5 border-b border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-amber-400">$6,700 USD</span>
                  <span className="text-xs text-slate-300 font-semibold">
                    {isEs ? '/ mínimo 3 horas' : '/ 3-hour minimum'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 font-medium">
                  {isEs
                    ? '$2,000 USD / hora adicional · Hasta 10 pasajeros base incluidos'
                    : '$2,000 USD / extra hour · 3-hour minimum · up to 10 base passengers'}
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>{isEs ? 'Paquete de alimentos gourmet y bebidas premium incluido' : 'Food & premium beverage package included'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>{isEs ? 'Chef privado Christian, bartender personal y staff asignado' : 'Private chef, personal bartender & designated staff'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>{isEs ? 'Hasta 30 invitados para chárters de día' : 'Up to 30 guests for day charters'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>{isEs ? 'Hasta 10 invitados para chárters nocturnos (pernocta)' : 'Up to 10 guests for overnight charters'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={16} className="text-amber-400 shrink-0 mt-0.5 stroke-[3]" />
                  <span>{isEs ? 'Juguetes acuáticos: Seabob, kayaks, paddleboards, lily pad y esnórquel' : 'Water toys: Seabob, kayaks, paddleboards, lily pad & snorkel gear'}</span>
                </li>
              </ul>
            </div>

            {/* Good to Know: Groups of 11+ & Upgrades */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-1">
                  <Info size={15} />
                  {isEs ? 'Bueno Saber' : 'Good to Know'}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {isEs ? 'Grupos de 11+ Pasajeros y Mejoras' : 'Groups of 11+ Passengers & Upgrades'}
                </h3>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs sm:text-sm">
                  <div className="font-extrabold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1.5">
                    {isEs ? 'Grupos de 11 a 30 pasajeros:' : 'Groups of 11+ passengers (up to 30):'}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">{isEs ? 'Edades 0–3 años' : 'Ages 0–3'}</span>
                    <span className="font-bold text-emerald-700">{isEs ? 'Sin cargo ($0 USD)' : 'No charge'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">{isEs ? 'Edades 4–12 años' : 'Ages 4–12'}</span>
                    <span className="font-bold text-slate-900">{isEs ? '$125 USD por pasajero' : '$125 USD per passenger'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-700">{isEs ? 'Edades 13+ años' : 'Ages 13+'}</span>
                    <span className="font-bold text-slate-900">{isEs ? '$200 USD por pasajero' : '$200 USD per passenger'}</span>
                  </div>
                </div>
              </div>

              {/* Upgrades */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 space-y-2.5 text-xs sm:text-sm">
                <div className="font-extrabold text-amber-950 uppercase tracking-wider text-xs border-b border-amber-200/80 pb-1.5">
                  {isEs ? 'Mejoras Opcionales (Upgrades):' : 'Upgrades:'}
                </div>
                <div className="flex justify-between items-center py-1 border-b border-amber-100">
                  <span className="font-semibold text-slate-800">{isEs ? 'Cola de langosta jumbo' : 'Jumbo lobster tail'}</span>
                  <span className="font-bold text-slate-950">{isEs ? '$49 USD c/u' : '$49 USD each'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-800">{isEs ? 'Solicitudes de bebidas especiales' : 'Special beverage requests'}</span>
                  <span className="font-bold text-slate-950">{isEs ? 'Costo + 25%' : 'Cost + 25%'}</span>
                </div>
              </div>

              {/* Not Included */}
              <div className="space-y-2 text-xs sm:text-sm">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                  {isEs ? 'No Incluido:' : 'Not Included:'}
                </h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-400">•</span>
                    <span>{isEs ? '16% de IVA (VAT)' : '16% VAT'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-400">•</span>
                    <span>{isEs ? 'Propina para la tripulación (Crew gratuity)' : 'Crew gratuity'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-400">•</span>
                    <span>
                      {isEs
                        ? 'Las tarifas de marina y muelle en la marina base de Neoprene (Marina de Cabo San Lucas) están incluidas; las salidas desde la otra marina conllevan un cargo de reubicación (combustible/muelle) de $500 USD.'
                        : 'Marina and dock fees at Neoprene’s home marina, Cabo San Lucas Marina, are included; departures from the other marina carry a $500 USD relocation (fuel/slip) fee.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Booking & Cancellation */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest">
                <ShieldCheck size={16} />
                {isEs ? 'Reserva y Cancelación' : 'Booking & Cancellation'}
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {isEs ? 'Políticas de Reserva y Pago' : 'Booking & Cancellation Terms'}
              </h3>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-900 shrink-0 mt-0.5" />
                  <span>
                    {isEs
                      ? 'Un depósito del 50% confirma tu fecha; el saldo restante vence 48 horas antes de la salida.'
                      : '50% deposit confirms your date; balance due 48 hours before departure.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-900 shrink-0 mt-0.5" />
                  <span>
                    {isEs
                      ? 'Métodos de pago: Tarjeta de crédito (comisión de procesamiento del 3.5%), ACH, transferencia bancaria (wire), Venmo o efectivo.'
                      : 'Credit card (3.5% processing fee), ACH, wire, Venmo or cash.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-900 shrink-0 mt-0.5" />
                  <span>
                    {isEs
                      ? 'Cancelación 7+ días antes: reembolso del 100% · De 7 días a 48 horas antes: reembolso del 50% · Menos de 48 horas: no reembolsable, a menos que Capitanía de Puerto cierre el puerto (en cuyo caso aplica reprogramación completa o reembolso total).'
                      : 'Cancel 7+ days before: full refund · 7 days to 48 hours: 50% refund · under 48 hours: non-refundable, unless the Port Captain closes the port — then a full reschedule or refund.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-900 shrink-0 mt-0.5" />
                  <span>
                    {isEs
                      ? 'El 16% de IVA es obligatorio en todas las formas de pago electrónico. Tarifas en USD. Disponibilidad confirmada en cuestión de horas (chárters para el mismo día suelen ser posibles).'
                      : 'VAT is required on all forms of electronic payment. Rates in USD. Availability confirmed within hours — same-day charters often possible.'}
                  </span>
                </li>
              </ul>
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

            {/* 4: 110 ft Aquaholic */}
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

            {/* 5: 116 ft Capella */}
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

            {/* 6: 130 ft Sovereign */}
            <Link href={`/${lang}/yachts/sovereign`} className="group block text-center">
              <div className="aspect-square w-full max-w-[220px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-3 bg-slate-100">
                <img
                  src="/yachts/sovereign/sovereign-6.jpg"
                  alt="130 ft Sovereign Yachts Cabo Superyacht Charter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-base leading-snug">
                <span className="text-slate-600 font-normal">130 ft </span>
                <span className="font-extrabold text-[#003865] group-hover:text-blue-700 transition-colors">
                  Sovereign
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-600 mt-0.5">Sovereign Yachts</div>
              <div className="text-xs italic text-slate-500 mt-0.5">
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
                    ? `Gracias ${inquireData.firstName}. Nuestro equipo VIP concierge de Ballard Tours se comunicará contigo a la brevedad para confirmar disponibilidad y tu menú con el Chef Christian a bordo del 108ft Mangusta "Neoprene".`
                    : `Thank you ${inquireData.firstName}. Our VIP concierge team at Ballard Tours will get in touch with you shortly to confirm availability and custom menu details aboard the 108ft Mangusta "Neoprene".`}
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
                    {isEs ? 'Verificar Disponibilidad' : 'Check Availability'}
                  </h3>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    108ft Mangusta Superyacht &ldquo;Neoprene&rdquo;
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
                    {isEs
                      ? 'Disponibilidad confirmada en cuestión de horas. Déjanos tus datos y nuestro concierge VIP te contactará de inmediato.'
                      : 'Availability confirmed within hours — same-day charters often possible. Leave us your details below.'}
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
                      placeholder={isEs ? 'Escribe aquí tu mensaje, preferencias de menú o preguntas...' : 'Your Message / Menu Preferences'}
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
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs shadow-md">
                {fotoActiva + 1} / {fotosGaleria.length}
              </span>
              <span className="text-slate-300 font-bold hidden sm:inline">
                108ft Mangusta Superyacht &ldquo;Neoprene&rdquo;
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLightboxAbierto(false)}
                className="p-2 sm:p-2.5 text-white hover:text-amber-400 transition rounded-full bg-white/10 hover:bg-white/20 cursor-pointer shadow-lg active:scale-95"
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
