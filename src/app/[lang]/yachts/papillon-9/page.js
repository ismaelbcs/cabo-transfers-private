// src/app/[lang]/yachts/papillon-9/page.js
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

export default function Papillon9BlackYachtPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const { agregarAlCombo } = useCart();

  // ==========================================
  // CONFIGURACIÓN DE PAQUETES - 80FT BLACK SUNSEEKER MANHATTAN "PAPILLON 9"
  // Regla aplicada:
  // - Tarifa Especial 3 Horas (hasta Dic 15): Original $4,500 + $1,000 = $5,500 USD (1 a 12 pasajeros)
  // - Tarifa Normal 3 Horas: Original $5,400 + $1,000 = $6,400 USD (1 a 12 pasajeros)
  // - Huésped Extra: Original $175 + $50 = $225 USD c/u (12 base + hasta 18 extra = 30 máx.)
  // - Hora Extra: $1,600 USD por hora ($1,500 base/hr + $100)
  // ==========================================
  const paquetes = [
    {
      id: 'special-3-hours',
      nameEn: '3 HOURS SPECIAL (UNTIL DEC 15)',
      nameEs: '3 HORAS TARIFA ESPECIAL (HASTA DIC 15)',
      hours: 3,
      price: 5500, // Original $4,500 + $1,000
      baseGuests: 12,
      maxGuests: 30,
      extraGuestPrice: 225, // Original $175 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: true, // Destacado
      descriptionEn: 'Special Rate until December 15th! 3-hour all-inclusive private charter for 1 to 12 base guests (up to 30 max capacity) aboard the iconic 80ft Black Sunseeker Manhattan "Papillon 9". Includes private chef, open bar, sushi/ceviche menu, JBL audio, and water toys.',
      descriptionEs: '¡Tarifa Especial hasta el 15 de Diciembre! Chárter privado todo incluido de 3 horas para 1 a 12 huéspedes base (capacidad máx. 30) a bordo del icónico Yate Negro Sunseeker Manhattan 80ft "Papillon 9". Incluye chef a bordo, barra libre, menú de sushi/ceviche, audio JBL y juguetes acuáticos.'
    },
    {
      id: 'normal-3-hours',
      nameEn: '3 HOURS NORMAL RATE',
      nameEs: '3 HORAS TARIFA NORMAL',
      hours: 3,
      price: 6400, // Original $5,400 + $1,000
      baseGuests: 12,
      maxGuests: 30,
      extraGuestPrice: 225,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Standard season 3-hour all-inclusive charter for 1 to 12 base guests (30 max capacity). Includes signature snacks, appetizers, gourmet meal selection (Option 1 or Option 2), premium open bar, and coastal cruise past El Arco.',
      descriptionEs: 'Tarifa estándar de temporada por 3 horas todo incluido para 1 a 12 invitados base (máx. 30). Incluye snacks de autor, aperitivos, comida gourmet a elegir (Opción 1 u Opción 2), barra libre premium y paseo por El Arco.'
    },
    {
      id: 'all-inclusive-4-hours',
      nameEn: '4 HOURS ALL INCLUSIVE',
      nameEs: '4 HORAS TODO INCLUIDO',
      hours: 4,
      price: 7100, // $5,500 + 1h ($1,600)
      baseGuests: 12,
      maxGuests: 30,
      extraGuestPrice: 225,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Extended 4-hour luxury charter with ample time to cruise Land’s End, anchor in Santa María or Pelican Rock for snorkeling, paddleboarding, floating mat relaxation, and freshly prepared chef dining.',
      descriptionEs: 'Chárter extendido de 4 horas con tiempo ideal para recorrer Finisterra, fondear en Roca Pelícano o Santa María para esnórquel, paddleboard, tapete flotante y comida recién preparada por el chef.'
    },
    {
      id: 'all-inclusive-6-hours',
      nameEn: '6 HOURS ALL INCLUSIVE',
      nameEs: '6 HORAS TODO INCLUIDO',
      hours: 6,
      price: 10300, // $5,500 + 3h ($4,800)
      baseGuests: 12,
      maxGuests: 30,
      extraGuestPrice: 225,
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'The ultimate half-day celebration or sportfishing & cruising combo for up to 30 guests. Enjoy indoor/outdoor kitchens, 4 luxury bedrooms, hydraulic swim platform, and sunset views over Cabo.',
      descriptionEs: 'La máxima celebración de medio día o combinación de paseo y pesca ligera para hasta 30 invitados. Disfruta de cocina interior/exterior, 4 recámaras de lujo, plataforma hidráulica y atardecer en Cabo.'
    }
  ];

  // ==========================================
  // ESTADOS DEL CONFIGURADOR / CALCULADORA
  // ==========================================
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(paquetes[0]); // 3 Horas Special ($5,500 USD) por defecto
  const [charterFecha, setCharterFecha] = useState('');
  const [totalHuespedes, setTotalHuespedes] = useState(12); // 12 huéspedes incluidos en la tarifa base
  const [horasExtras, setHorasExtras] = useState(0); // $1,600 USD por hora extra
  const PRECIO_HORA_EXTRA = 1600;

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

  // Cálculo de Huéspedes Extra (Base 12 incluidos, máximo 30 -> hasta 18 extras a $225 USD c/u)
  const huespedesExtra = Math.max(0, totalHuespedes - paqueteSeleccionado.baseGuests);
  const costoHuespedesExtra = huespedesExtra * paqueteSeleccionado.extraGuestPrice;

  // Cálculo de Horas Extras ($1,600 USD c/u)
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
  // FOTOS REALES DEL YATE NEGRO 80FT SUNSEEKER MANHATTAN "PAPILLON 9" (19 FOTOS ÚNICAS)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/yachts/papillon-9/papillon-1.avif',
      titleEn: 'Black 80ft Sunseeker Manhattan "Papillon 9" Cruising Directly in Front of El Arco',
      titleEs: 'Yate Negro 80ft Sunseeker Manhattan "Papillon 9" Frente al Arco de Cabo San Lucas',
      descEn: 'Explore Cabo like never before aboard this striking black 80ft Sunseeker Manhattan with hydraulic swim platform and sportfishing gear.',
      descEs: 'Explora Los Cabos como nunca antes a bordo de este imponente Sunseeker Manhattan negro de 80 pies con plataforma hidráulica y equipo de pesca.',
      labelEn: 'Arch & Profile',
      labelEs: 'Frente al Arco'
    },
    {
      src: '/yachts/papillon-9/papillon-3.avif',
      titleEn: '80ft Black Yacht Sunseeker Manhattan Anchored by Lover’s Beach & Land’s End',
      titleEs: 'Yate Negro Sunseeker Manhattan 80ft Frente a Playa del Amor y Finisterra',
      descEn: 'Sleek black hull, expansive front sunbeds, shaded flybridge, and stabilizing system for a serene journey.',
      descEs: 'Elegante casco negro, amplios camastros en proa, flybridge sombreado y estabilizadores para una navegación serena.',
      labelEn: 'Land’s End View',
      labelEs: 'Vista Finisterra'
    },
    {
      src: '/yachts/papillon-9/papillon-4.avif',
      titleEn: 'Aerial Bow View of Papillon 9 with Large Front Seating & Sunbathing Pads',
      titleEs: 'Vista Aérea de Proa del Papillon 9 con Amplia Sala y Asoleadero',
      descEn: 'Large front seating and sunbathing lounge framed by the iconic rock formations of Cabo San Lucas.',
      descEs: 'Amplia zona de asientos delanteros y camastros para tomar el sol enmarcados por las rocas del Arco.',
      labelEn: 'Bow Sunbed',
      labelEs: 'Proa y Asoleadero'
    },
    {
      src: '/yachts/papillon-9/papillon-5.avif',
      titleEn: 'Starboard Profile Showing Hydraulic Teak Swim Platform & Shaded Aft Deck',
      titleEs: 'Perfil Mostrando la Plataforma de Nado Hidráulica en Teca y Popa Sombreada',
      descEn: 'Hydraulic swim platform makes entering the turquoise ocean effortless for snorkeling, paddleboarding, and floating mat fun.',
      descEs: 'Su plataforma de nado hidráulica facilita el acceso al mar para practicar esnórquel, paddleboard y disfrutar del tapete flotante.',
      labelEn: 'Swim Platform',
      labelEs: 'Plataforma Hidráulica'
    },
    {
      src: '/yachts/papillon-9/papillon-15.avif',
      titleEn: 'Fresh Sushi Platter, Grilled Shrimp Skewers & Margaritas in Front of El Arco',
      titleEs: 'Charola de Sushi Fresco, Brochetas de Camarón y Margaritas Frente al Arco',
      descEn: 'Indulge in freshly prepared sushi, ceviche, grilled specialties, and premium open-bar cocktails with El Arco in the background.',
      descEs: 'Deléitate con sushi preparado a bordo, ceviche, brochetas a la parrilla y coctelería de barra libre frente al Arco.',
      labelEn: 'Chef & Open Bar',
      labelEs: 'Chef y Barra Libre'
    },
    {
      src: '/yachts/papillon-9/papillon-11.avif',
      titleEn: 'Private Chef Grilling Fresh Seafood & Steaks at the Outdoor Flybridge Kitchen',
      titleEs: 'Chef Privado Asando Mariscos y Cortes Frescos en la Cocina Exterior',
      descEn: 'Equipped with both indoor and outdoor kitchens so your private chef can prepare gourmet meals live on deck.',
      descEs: 'Equipado con cocina interior y exterior para que tu chef privado prepare platillos gourmet frente al mar.',
      labelEn: 'Outdoor Kitchen',
      labelEs: 'Cocina Exterior'
    },
    {
      src: '/yachts/papillon-9/papillon-18.avif',
      titleEn: 'Golden Cabo Sunset Dining with Handcrafted Cocktails & Gourmet Platter',
      titleEs: 'Cena al Atardecer en Los Cabos con Cócteles Artesanales y Alta Cocina',
      descEn: 'Unforgettable sunset cruises along the Baja coastline with top-tier culinary hospitality.',
      descEs: 'Cruceros inolvidables al atardecer por la costa de Baja California Sur con hospitalidad gastronómica de primer nivel.',
      labelEn: 'Sunset Dining',
      labelEs: 'Cena al Atardecer'
    },
    {
      src: '/yachts/papillon-9/papillon-2.avif',
      titleEn: 'Shaded Flybridge with Teak Dining Table, Helm Station & Panoramic Views',
      titleEs: 'Flybridge Sombreado con Mesa Comedor de Teca, Mando y Vistas Panorámicas',
      descEn: 'Spacious upper deck featuring a full teak dining table, shaded lounge seating, and JBL Bluetooth sound system.',
      descEs: 'Amplia cubierta superior con mesa comedor de teca, sala sombreada y sistema de sonido Bluetooth JBL.',
      labelEn: 'Flybridge Deck',
      labelEs: 'Cubierta Flybridge'
    },
    {
      src: '/yachts/papillon-9/papillon-10.avif',
      titleEn: 'Aft Teak Dining Table with Blue LED Ambient Lighting at Dusk',
      titleEs: 'Comedor de Popa en Teca con Iluminación Ambiental LED Azul al Anochecer',
      descEn: 'Shaded seating on the teak aft deck illuminated by vibrant blue LED lights looking out over Medano Bay.',
      descEs: 'Asientos sombreados en la cubierta de teca en popa iluminados con luces LED azules frente a la bahía.',
      labelEn: 'Aft Teak Dining',
      labelEs: 'Comedor de Popa'
    },
    {
      src: '/yachts/papillon-9/papillon-16.avif',
      titleEn: 'Luxury & Spacious Air-Conditioned Interior Salon with Arch Views',
      titleEs: 'Lujoso y Espacioso Salón Interior Climatizado con Vista al Arco',
      descEn: 'Plush leather sofas, dark hardwood floors, full air conditioning, Wi-Fi, 5 satellite TVs, and PlayStation onboard.',
      descEs: 'Sofás de piel, pisos de madera oscura, aire acondicionado total, Wi-Fi, 5 pantallas con TV satelital y PlayStation.',
      labelEn: 'Main Salon',
      labelEs: 'Salón Principal'
    },
    {
      src: '/yachts/papillon-9/papillon-17.avif',
      titleEn: 'Indoor Teak Dining Table & Helm Lounge in the Air-Conditioned Cabin',
      titleEs: 'Comedor Interior de Teca y Sala Climatizada Junto al Puente de Mando',
      descEn: 'Refined indoor dining area perfect for cooling off while enjoying panoramic ocean views.',
      descEs: 'Elegante comedor interior climatizado ideal para refrescarse disfrutando vistas panorámicas al océano.',
      labelEn: 'Indoor Dining',
      labelEs: 'Comedor Interior'
    },
    {
      src: '/yachts/papillon-9/papillon-9.avif',
      titleEn: 'Evening Blue Mood Lighting Connecting the Interior Salon & Aft Deck',
      titleEs: 'Iluminación Nocturna Azul Conectando el Salón Interior y la Cubierta de Popa',
      descEn: 'Seamless indoor-outdoor flow with custom LED ambiance and state-of-the-art JBL Bluetooth audio.',
      descEs: 'Conexión fluida entre el salón interior y la terraza de popa con iluminación LED y audio JBL.',
      labelEn: 'Evening Lounge',
      labelEs: 'Ambiente Nocturno'
    },
    {
      src: '/yachts/papillon-9/papillon-14.avif',
      titleEn: 'Expansive Salon Sofas & Dining Room Illuminated at Sunset',
      titleEs: 'Amplios Sofás del Salón y Comedor Interior Iluminados al Atardecer',
      descEn: 'Designed for groups of up to 30 guests to socialize in total climate-controlled luxury.',
      descEs: 'Diseñado para que grupos de hasta 30 invitados socialicen con total confort y aire acondicionado.',
      labelEn: 'Salon Sunset',
      labelEs: 'Salón al Atardecer'
    },
    {
      src: '/yachts/papillon-9/papillon-19.avif',
      titleEn: 'Full-Beam Master Suite #1 with King Bed, Wood Cabinetry & En-Suite Bath',
      titleEs: 'Suite Principal Master #1 con Cama King, Ebanistería Fina y Baño Privado',
      descEn: 'One of two luxurious master bedrooms aboard Papillon 9, complete with flat-screen satellite TV and private bathroom.',
      descEs: 'Una de las dos lujosas suites Master a bordo del Papillon 9, equipada con TV satelital y baño privado.',
      labelEn: 'Master Suite 1',
      labelEs: 'Suite Master 1'
    },
    {
      src: '/yachts/papillon-9/papillon-20.avif',
      titleEn: 'Master Suite #2 with Queen Bed, Panoramic Hull Windows & Private Bath',
      titleEs: 'Suite Principal Master #2 con Cama Queen, Ventanas al Mar y Baño en Suite',
      descEn: 'Spacious second master suite offering natural light, fine woodwork, and premium bathroom fittings.',
      descEs: 'Segunda suite principal con luz natural, acabados en madera fina y baño con grifería premium.',
      labelEn: 'Master Suite 2',
      labelEs: 'Suite Master 2'
    },
    {
      src: '/yachts/papillon-9/papillon-6.avif',
      titleEn: 'Guests Relaxing on the Bow Sunbeds While Cruising Cabo San Lucas',
      titleEs: 'Invitados Relajándose en el Asoleadero de Proa Navegando por Los Cabos',
      descEn: 'Smooth, stable cruising thanks to the Sunseeker Manhattan 80ft advanced stabilizing system.',
      descEs: 'Navegación suave y estable gracias al avanzado sistema estabilizador del Sunseeker Manhattan 80ft.',
      labelEn: 'Cruising Cabo',
      labelEs: 'Navegación en Cabo'
    },
    {
      src: '/yachts/papillon-9/papillon-12.avif',
      titleEn: '80ft Black Sunseeker Manhattan Cruising Turquoise Baja Waters',
      titleEs: 'Sunseeker Manhattan Negro de 80 Pies Navegando Aguas Turquesa',
      descEn: 'Striking black-and-silver profile that turns heads across the Cabo San Lucas bay.',
      descEs: 'Imponente silueta en negro y plata que roba miradas en toda la bahía de Cabo San Lucas.',
      labelEn: 'Starboard Cruise',
      labelEs: 'Perfil en Altamar'
    },
    {
      src: '/yachts/papillon-9/papillon-13.avif',
      titleEn: 'Forward Deck Walk-Around & Sunbathing Lounge at Golden Hour',
      titleEs: 'Pasillo de Cubierta y Asoleadero de Proa durante la Hora Dorada',
      descEn: 'Teak side decks leading to the expansive bow lounge overlooking the Pacific horizon.',
      descEs: 'Pasillos laterales de teca que conducen al amplio asoleadero de proa frente al Pacífico.',
      labelEn: 'Bow Horizon',
      labelEs: 'Horizonte en Proa'
    },
    {
      src: '/yachts/papillon-9/papillon-7.avif',
      titleEn: 'Sunset Reflection Along the Sleek Black Superstructure near Land’s End',
      titleEs: 'Reflejo del Atardecer sobre la Superestructura Negra frente al Finisterra',
      descEn: 'Experience the magic of Cabo San Lucas sunsets aboard the 80ft Black Sunseeker Manhattan.',
      descEs: 'Vive la magia de los atardeceres de Cabo San Lucas a bordo del Sunseeker Manhattan negro de 80 pies.',
      labelEn: 'Sunset Cruise',
      labelEs: 'Atardecer en el Arco'
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
      id: `yacht-papillon-9-${paqueteSeleccionado.id}-${Date.now()}`,
      tipo: 'yate',
      nombre: `80ft Black Sunseeker Manhattan "Papillon 9" - ${isEs ? paqueteSeleccionado.nameEs : paqueteSeleccionado.nameEn}`,
      fecha: charterFecha,
      horario: incluirTransporte ? `${horaRecogidaHotel} - ${horaRegresoMarina}` : `${totalHoras} Hours Charter`,
      pasajeros: totalHuespedes,
      precio: granTotalYate,
      detalles: {
        embarcacion: '80 Ft Black Sunseeker Manhattan "Papillon 9"',
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
          ? 'Aplica 16% de IVA en todos los pagos electrónicos (tarjetas y cuenta de cheques EE.UU.). Propinas no incluidas.'
          : 'A 16% VAT applies to all electronic payments (credit/debit cards and US checking account). Gratuity not included.'
      }
    });

    router.push(`/${lang}/checkout`);
  };

  const handleSubmitInquire = async (e) => {
    e.preventDefault();
    setEnviandoInquiry(true);

    try {
      const payload = {
        tipo: 'Yacht Charter Inquiry - 80ft Black Sunseeker Manhattan Papillon 9',
        embarcacion: '80ft Black Sunseeker Manhattan "Papillon 9"',
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
        subject: `🛥️ New Yacht Inquiry: 80ft Black Sunseeker "Papillon 9" (${payload.clienteNombre})`,
        html: `
          <h2>Solicitud de Reserva / Información - 80ft Black Sunseeker Manhattan "Papillon 9"</h2>
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
            <li><strong>Total Estimado:</strong> $${granTotalYate.toLocaleString()} USD (+ 16% VAT on electronic payments)</li>
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
      ? `¡Hola! Me interesa reservar el Yate Negro 80ft Sunseeker Manhattan "Papillon 9" en Cabo San Lucas.\n\n• Paquete: ${paqueteSeleccionado.nameEs}\n• Fecha: ${charterFecha || 'Por definir'}\n• Huéspedes: ${totalHuespedes} personas\n• Horas extra: ${horasExtras}\n• Transporte terrestre: ${incluirTransporte ? `Sí (${transporteOrigen})` : 'No'}\n• Total estimado: $${granTotalYate.toLocaleString()} USD`
      : `Hello! I'm interested in chartering the 80ft Black Sunseeker Manhattan "Papillon 9" yacht in Cabo San Lucas.\n\n• Package: ${paqueteSeleccionado.nameEn}\n• Date: ${charterFecha || 'TBD'}\n• Guests: ${totalHuespedes} guests\n• Extra hours: ${horasExtras}\n• Ground transport: ${incluirTransporte ? `Yes (${transporteOrigen})` : 'No'}\n• Estimated total: $${granTotalYate.toLocaleString()} USD`
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pb-24">

      {/* ======================================================== */}
      {/* HERO COMPACTO Y ELEGANTE                                 */}
      {/* ======================================================== */}
      <div className="relative pt-24 pb-6 sm:pt-28 sm:pb-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 border border-slate-700">
                <Anchor size={13} />
                <span>{isEs ? 'El Icónico Yate Negro de Cabo • Hasta 30 Invitados' : 'Black Yacht in Cabo • Sunseeker Manhattan 80ft • Up to 30 Guests'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                {isEs
                  ? 'Papillon 9 – Renta de Yate Negro Sunseeker Manhattan 80ft en Cabo San Lucas'
                  : 'Black Yacht in Cabo – 80ft Sunseeker Manhattan "Papillon 9" Charter'}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
                {isEs
                  ? 'Explora Los Cabos como nunca antes con confort y lujo a bordo del Sunseeker Manhattan negro de 80 pies: 4 recámaras (2 Master Suites), 4 baños, plataforma hidráulica, estabilizadores, chef a bordo, barra libre premium y equipo de pesca.'
                  : 'Explore Cabo like never before with comfort and luxury on board this black yacht Sunseeker Manhattan 80ft: 4 bedrooms (2 Master Suites), 4 bathrooms, hydraulic swim platform, stabilizers, private chef, premium open bar & fishing gear.'}
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
                {isEs ? 'Ver Precios' : 'View Pricing'}
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GALERÍA VISUAL INTERACTIVA (19 FOTOS REALES YATE NEGRO)  */}
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
                ? 'Black Yacht in Cabo 80ft Sunseeker Manhattan Papillon 9 luxury yacht charter in Cabo San Lucas Mexico'
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
      {/* SECCIÓN DE PAQUETES Y PRECIOS (1 A 12 INVITADOS INCL.)   */}
      {/* ======================================================== */}
      <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#003865] tracking-tight">
            {isEs ? 'Precios de Chárter (1 a 12 Invitados Todo Incluido)' : 'Charter Pricing (1 to 12 Guests All Inclusive)'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            {isEs
              ? 'Tarifa Especial hasta el 15 de Diciembre: $5,500 USD (3 Horas) • Tarifa Normal: $6,400 USD (3 Horas) para 1 a 12 huéspedes. Permite hasta 30 invitados en total ($225 USD por huésped extra).'
              : 'Special Rate until December 15th: $5,500 USD (3-Hour) • Normal Rate: $6,400 USD (3-Hour) for 1 to 12 guests. Max capacity 30 guests ($225 USD per extra guest).'
            }
          </p>
        </div>

        {/* Grid de 4 Tarjetas de Paquetes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {paquetes.map((pkg, idx) => {
            const isSelected = paqueteSeleccionado.id === pkg.id;

            const headerColors = [
              'bg-slate-900',  // 3 Hours Special (Black/Gold highlight)
              'bg-[#003865]',  // 3 Hours Normal Rate
              'bg-[#0d5ca8]',  // 4 Hours
              'bg-[#07427c]'   // 6 Hours
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
                {/* Etiqueta Especial */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c8b273] text-white text-xs font-extrabold px-4 py-1.5 rounded-t-md shadow-xs tracking-wide z-10 whitespace-nowrap">
                    {isEs ? 'Tarifa Especial hasta Dic 15' : 'Special Rate until Dec 15'}
                  </div>
                )}

                {/* Encabezado */}
                <div className={`${headerColors[idx]} text-white text-center py-3.5 px-4 rounded-t-[10px]`}>
                  <h3 className="font-extrabold text-xs sm:text-sm tracking-wider uppercase">
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
                          ? '1 a 12 invitados todo incluido'
                          : '1 to 12 guests all inclusive'}
                      </p>
                    </div>

                    {/* Lista de Detalles */}
                    <div className="space-y-2.5 text-xs border-t border-slate-200 pt-4">

                      {/* Guests */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Users size={15} className="text-[#003865]" />
                          {isEs ? 'Huéspedes Base' : 'Guests Included'}
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
                          {isEs ? `$${pkg.extraGuestPrice} c/u (máx 30)` : `$${pkg.extraGuestPrice} (max cap. 30)`}
                        </span>
                      </div>

                      {/* Hours */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Clock size={15} className="text-[#003865]" />
                          {isEs ? 'Horas' : 'Hours'}
                        </span>
                        <span className="font-bold text-slate-900">{pkg.hours}</span>
                      </div>

                      {/* Snacks & Appetizers */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Utensils size={15} className="text-[#003865]" />
                          {isEs ? 'Snacks y Aperitivos Gourmet' : 'Signature Snacks & Appetizers'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      {/* Premium Open Bar */}
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Wine size={15} className="text-[#003865]" />
                          {isEs ? 'Barra Libre Premium' : 'Premium Open Bar'}
                        </span>
                        <Check size={17} className="text-lime-600 stroke-[3]" />
                      </div>

                      {/* Chef Meal Option 1 or 2 */}
                      <div className="flex items-center justify-between py-1.5">
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Utensils size={15} className="text-[#003865]" />
                          {isEs ? 'Chef a Bordo (Sushi / Ceviche)' : 'Chef Onboard (Sushi / Ceviche)'}
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
                        : (isEs ? 'Seleccionar Paquete' : 'Select Package')
                      }
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Botón Central "INQUIRE NOW" y Nota de Pagos e Impuestos */}
        <div className="text-center mt-10 space-y-4">
          <button
            type="button"
            onClick={() => handleOpenInquire(paqueteSeleccionado)}
            className="px-10 py-3.5 bg-[#003865] hover:bg-[#002647] text-white font-extrabold text-sm uppercase tracking-widest rounded-md shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            {isEs ? 'SOLICITAR INFORMACIÓN AHORA' : 'INQUIRE NOW'}
          </button>

          <p className="text-xs sm:text-sm italic text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isEs
              ? 'Incluye de 1 a 12 invitados base; cada huésped adicional tiene un cargo de $225 USD (capacidad máxima 30 invitados). Aplica 16% de IVA a todos los pagos electrónicos (tarjetas de crédito/débito y cuenta de cheques de EE.UU.). Propinas para tripulación y choferes no incluidas.'
              : 'Includes 1 to 12 base guests; each extra guest is charged $225 USD (max capacity 30 guests). A 16% VAT applies to all electronic payments, including credit/debit cards and US checking account payments. Gratuity for the crew and drivers is not included.'
            }
          </p>
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
                {isEs ? 'Configura tu Chárter en el Papillon 9 (80ft)' : 'Configure Your 80ft Black Sunseeker Charter'}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {isEs
                  ? 'Tarifa base cubre de 1 a 12 invitados. Añade huéspedes adicionales (hasta 30 máx.), horas extras y traslado privado.'
                  : 'Base rate covers 1 to 12 guests. Add extra guests (up to 30 max), extra hours, and private resort transfers.'
                }
              </p>
            </div>

            {/* Selector de Paquete Activo */}
            <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-3.5 sm:p-4 w-full md:w-auto md:min-w-[340px] lg:min-w-[380px] shadow-2xs shrink-0">
              <label htmlFor="select-paquete-papillon" className="text-[11px] text-blue-900 font-extrabold uppercase tracking-wider block mb-1.5 flex items-center justify-between sm:justify-end gap-1.5">
                <span>{isEs ? 'Modificar Paquete Activo' : 'Active Package (Change)'}</span>
                <ChevronDown size={14} className="text-blue-900 shrink-0" />
              </label>
              <div className="relative">
                <select
                  id="select-paquete-papillon"
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
                {isEs ? 'Haz clic aquí para cambiar entre Tarifa Especial, Normal o más horas' : 'Click here to switch between Special Rate, Normal Rate, or extended hours'}
              </span>
            </div>
          </div>

          {/* 3 COLUMNAS DEL CONFIGURADOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">

            {/* 1. Selector de Fecha */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <label htmlFor="charter-fecha-papillon" className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                  <Calendar size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Fecha de navegación' : 'Charter Date'}</span>
                </label>
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  {isEs ? 'Seleccionar día' : 'Select day'}
                </span>
              </div>

              <div className="h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 flex items-center focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-blue-900 transition">
                <input
                  id="charter-fecha-papillon"
                  type="date"
                  value={charterFecha}
                  onChange={(e) => setCharterFecha(e.target.value)}
                  className="w-full bg-transparent text-slate-800 outline-none text-sm font-semibold cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Tarifa Especial válida hasta el 15 de Diciembre.'
                  : 'Special Rate valid for charters until December 15th.'
                }
              </p>
            </div>

            {/* 2. Selector de Huéspedes Totales (12 base incluidos, hasta 30 máx.) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Users size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Total de Huéspedes' : 'Total Guests'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {huespedesExtra > 0
                    ? `+${huespedesExtra} extra (+$${costoHuespedesExtra.toLocaleString()} USD)`
                    : (isEs ? '12 base incl.' : '12 base incl.')}
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
                  ? 'Tarifa cubre 1 a 12 personas. De 13 a 30 suma $225 USD c/u.'
                  : 'Rate covers 1 to 12 guests. Guests 13–30 add $225 USD each.'
                }
              </p>
            </div>

            {/* 3. Selector de Horas Extras ($1,600 USD/hr) */}
            <div className="flex flex-col">
              <div className="h-7 mb-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 truncate">
                  <Clock size={16} className="text-blue-900 shrink-0" />
                  <span>{isEs ? 'Horas Extras' : 'Extra Hours'}</span>
                </span>
                <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
                  {horasExtras > 0
                    ? `+${horasExtras}h (+$${costoHorasExtras.toLocaleString()} USD)`
                    : '$1,600 USD/hr'}
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
                  ? 'Agrega horas adicionales a tu recorrido ($1,600 USD por hora).'
                  : 'Add extra charter hours ($1,600 USD per additional hour).'
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
                      ? 'Traslado exclusivo ida y vuelta desde tu hotel o villa a la Marina de Cabo San Lucas en Suburban o Van de lujo.'
                      : 'Private round-trip SUV/Van transfer from your resort or private villa directly to Cabo San Lucas Marina.'
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
                    {isEs ? 'Directo al muelle del Papillon 9 en Marina CSL' : 'Direct to Papillon 9 slip at Cabo Marina'}
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
                  ? '* 16% IVA aplica a pagos electrónicos (tarjetas y cuenta de cheques EE.UU.). Propinas no incluidas.'
                  : '* 16% VAT applies to electronic payments (credit/debit cards & US checking account). Gratuity not included.'}
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
      {/* DESCRIPCIÓN, MENÚ DEL CHEF Y ESPECIFICACIONES COMPLETAS   */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        {/* FILA 1: ABOUT THIS YACHT, MENÚ GOURMET & YACHT FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">

          {/* Columna Izquierda: About This Yacht + Chef On Board & Premium Open Bar + Payment & Cancellation */}
          <div className="lg:col-span-7 space-y-8">

            {/* Sección 1: About This Yacht */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'Acerca de este Yate' : 'About This Yacht'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">
                {isEs
                  ? 'El Icónico Yate Negro Sunseeker Manhattan 80ft "Papillon 9" en Cabo San Lucas'
                  : 'Explore Cabo Like Never Before Aboard the 80ft Black Sunseeker Manhattan "Papillon 9"'
                }
              </h2>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  {isEs
                    ? 'Explora Los Cabos como nunca antes con absoluta comodidad y lujo a bordo de este imponente yate negro Sunseeker Manhattan de 80 pies ("Papillon 9"). Esta joya de la flota ofrece amplios alojamientos con 4 lujosas recámaras totalmente equipadas, incluyendo 2 suites principales (Master Suites) y 2 cabinas de huéspedes. Los 4 baños del yate están adornados con acabados y grifería de primera calidad, garantizando total comodidad y privacidad.'
                    : 'Explore Cabo like never before with comfort and luxury on board this black yacht Sunseeker Manhattan 80ft ("Papillon 9"). A true jewel in Cabo San Lucas, she offers spacious accommodations with 4 luxury and fully equipped bedrooms, including 2 master suites and 2 guest cabins. The yacht’s 4 bathrooms are adorned with premium fittings, ensuring comfort and privacy.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'El entretenimiento a bordo está garantizado con 5 pantallas planas de TV satelital para ver lo que desees, PlayStation, conexión Wi-Fi y un sistema de sonido JBL de última generación que puedes conectar fácilmente por Bluetooth desde tu teléfono. Además, el avanzado sistema estabilizador del yate ofrece una navegación serena y placentera, esencial para quienes buscan máxima estabilidad en el mar.'
                    : 'Entertainment on board features 5 flat-screen satellite TVs to watch anything you would like, PlayStation, Wi-Fi, and a state-of-the-art JBL sound system that you can connect easily to your phone via Bluetooth. The yacht’s advanced stabilizing system offers a serene journey, essential for those sensitive to the sea’s motion.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'Creemos en la personalización total: ya sea que busques una escapada tranquila frente al Arco, una fiesta privada en altamar o una aventura llena de acción con pesca deportiva, esnórquel y paddleboard, nuestro equipo se dedica a personalizar tu chárter a la medida de tus preferencias.'
                    : 'Whether you’re seeking a tranquil escape or an action-packed adventure, our team is dedicated to customizing your charter to your preferences, ensuring a premium yacht rental experience in Cabo San Lucas.'
                  }
                </p>
              </div>
            </section>

            {/* Sección 2: CHEF ON BOARD & PREMIUM OPEN BAR (MENÚ COMPLETO) */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
                  <Utensils size={14} />
                  {isEs ? 'Chef a Bordo y Barra Libre Premium' : 'Chef On Board & Premium Open Bar'}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isEs ? 'Viaje Culinario Todo Incluido Preparado en Vivo a Bordo' : 'Indulge in a Freshly Prepared Culinary Journey & Open Bar at Sea'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
                  {isEs
                    ? 'Cada platillo a bordo es una celebración de sabor y frescura. Nuestro menú está diseñado para realzar tu experiencia de chárter de lujo, presentando una selección de snacks orgánicos, aperitivos y platillos gourmet acompañados de bebidas refrescantes y barra libre premium.'
                    : 'Every dish is a celebration of flavor and freshness. Our menu is crafted to enhance your luxury charter experience, featuring a selection of gourmet dishes and refreshing open-bar beverages.'
                  }
                </p>
              </div>

              {/* Signature Snacks & Appetizers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#003865]">
                    {isEs ? 'Snacks de Autor (Signature Snacks)' : 'Signature Snacks'}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li>
                      <strong className="text-slate-900 block">
                        {isEs ? 'Dip Orgánico de Alcachofa y Queso:' : 'Organic Artichoke & Cheese Dip:'}
                      </strong>
                      {isEs ? 'Un comienzo cremoso y lleno de sabor para tu aventura en el mar.' : 'A creamy and flavorful start to your sea adventure.'}
                    </li>
                    <li>
                      <strong className="text-slate-900 block">
                        {isEs ? 'Plato de Fruta Fresca Local de Temporada:' : 'Fresh Local Seasonal Fruit Platter:'}
                      </strong>
                      {isEs ? 'Vibrante selección de las frutas más frescas elegidas a mano.' : 'A vibrant selection of the freshest fruits, handpicked for quality.'}
                    </li>
                    <li>
                      <strong className="text-slate-900 block">
                        {isEs ? 'Nueces Mixtas Orgánicas:' : 'Organic Mixed Nuts:'}
                      </strong>
                      {isEs ? 'Un bocado saludable y delicioso para acompañar tus bebidas.' : 'A healthy and satisfying nibble to complement your experience.'}
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#003865]">
                    {isEs ? 'Aperitivos (Appetizers)' : 'Appetizers'}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li>
                      <strong className="text-slate-900 block">
                        {isEs ? 'Quesadillas de Queso Fundido:' : 'Cheese Quesadillas:'}
                      </strong>
                      {isEs ? 'Queso derretido en tortilla dorada, un clásico irresistible.' : 'Melted cheese in a toasted tortilla, a simple yet delightful treat.'}
                    </li>
                    <li>
                      <strong className="text-slate-900 block">
                        {isEs ? 'Totopos con Guacamole y Salsa Casera:' : 'Chips with Guacamole & Salsa:'}
                      </strong>
                      {isEs ? 'Totopos crujientes servidos con nuestro guacamole fresco hecho a bordo y salsa mexicana.' : 'Crispy chips served with our homemade guacamole and salsa.'}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Gourmet Meals: Option 1 & Option 2 */}
              <div>
                <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 mb-3">
                  {isEs ? 'Comidas Gourmet – Elige tu Delicia Culinaria (Opción 1 u Opción 2):' : 'Gourmet Meals – Choose Your Culinary Delight:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1 */}
                  <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 space-y-2.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#003865] text-white font-extrabold text-[11px] uppercase">
                      {isEs ? 'Opción 1' : 'Option 1'}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li>
                        <strong className="text-slate-900">{isEs ? 'Selección de Ensalada:' : 'Salad Selection:'}</strong>{' '}
                        {isEs ? 'Elige entre Ensalada Griega, Italiana o César para un inicio fresco y ligero.' : 'Choose from Greek, Italian, or Caesar Salad for a fresh and light start.'}
                      </li>
                      <li>
                        <strong className="text-slate-900">{isEs ? 'Baguettes de Roast Beef y Pavo:' : 'Roast Beef & Turkey Sandwiches:'}</strong>{' '}
                        {isEs ? 'Servidos en baguette recién horneado con lechuga, tomate y queso Monterey Jack.' : 'Served on a freshly baked baguette with lettuce, tomato, and Monterey Jack cheese.'}
                      </li>
                      <li>
                        <strong className="text-slate-900">{isEs ? 'Ceviche Clásico:' : 'Classic Ceviche:'}</strong>{' '}
                        {isEs ? 'Platillo tradicional mexicano con mezcla de pescado y camarón, tomate, cebolla, cilantro y aguacate fresco.' : 'Traditional Mexican dish with a mix of fish and shrimp, tomato, onion, cilantro, and fresh avocado.'}
                      </li>
                    </ul>
                  </div>

                  {/* Option 2 */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-2.5">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-amber-600 text-white font-extrabold text-[11px] uppercase">
                      {isEs ? 'Opción 2' : 'Option 2'}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li>
                        <strong className="text-slate-900">{isEs ? 'Charola de Sushi Fresco:' : 'Sushi Platter:'}</strong>{' '}
                        {isEs ? 'Surtido de sushi Nigiri, maki y gunkan maki, preparado fresco a bordo por el chef.' : 'An assortment of Nigiri, maki, and gunkan maki sushi, prepared fresh on board.'}
                      </li>
                      <li>
                        <strong className="text-slate-900">{isEs ? 'Ceviche Clásico:' : 'Classic Ceviche:'}</strong>{' '}
                        {isEs ? 'El mismo delicioso ceviche mexicano de pescado y camarón con aguacate fresco.' : 'The same delightful Mexican-style fish and shrimp ceviche as in Option 1.'}
                      </li>
                      <li>
                        <strong className="text-slate-900">{isEs ? 'Alitas de Pollo (Chicken Wings):' : 'Chicken Wings:'}</strong>{' '}
                        {isEs ? 'Jugosas alitas disponibles en variedad de sabores: BBQ, dry rub, suave, medio y picante.' : 'A platter of juicy wings available in BBQ, dry rub, mild, medium, and hot.'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 3: Pesca Deportiva + Políticas de Pago, Seguridad y Cancelación */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-2">
                  <ShieldCheck size={14} />
                  {isEs ? 'Pesca Deportiva, Seguridad y Políticas' : 'Sportfishing, Safety & Cancellation Policy'}
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {isEs ? 'Equipo de Pesca, Seguridad a Bordo y Política de Cancelación Flexible' : 'Onboard Fishing Gear, Safety Equipment & Flexible Cancellation Policy'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  {isEs
                    ? 'El Sunseeker Manhattan 80ft "Papillon 9" también incluye equipo de pesca deportiva (Fishing Gear) para quienes deseen tirar las líneas durante su recorrido por la costa de Cabo San Lucas, además de tapete flotante, equipo de esnórquel y tabla de paddleboard. Todas las embarcaciones están totalmente equipadas con chalecos salvavidas, equipo de emergencia y botiquín de primeros auxilios.'
                    : 'The 80ft Black Sunseeker Manhattan "Papillon 9" also comes equipped with fishing gear for guests who wish to enjoy coastal trolling during their luxury charter, alongside a floating mat, snorkel gear, and paddleboard. All vessels are fully equipped with life jackets, emergency equipment, and first aid kits.'
                  }
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2 text-xs sm:text-sm text-slate-700">
                <h4 className="font-extrabold text-slate-900">
                  {isEs ? 'Política de Cancelación Oficial:' : 'Official Cancellation Policy:'}
                </h4>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {isEs
                        ? 'Cancelaciones o reprogramaciones hechas con más de 48 horas antes del chárter califican para un reembolso del 100% del depósito/pago.'
                        : 'Cancellations or reschedules made 48+ hours before the charter qualify for a full refund of the deposit/payment.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {isEs
                        ? 'Cancelaciones o reprogramaciones hechas entre 24 y 48 horas antes del chárter califican para un reembolso del 50%.'
                        : 'Cancellations or reschedules made 24–48 hours before the charter qualify for a 50% refund.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
                    <span>
                      {isEs
                        ? 'Cancelaciones realizadas con menos de 24 horas antes de la salida no son reembolsables.'
                        : 'Cancellations made less than 24 hours before departure are non-refundable.'}
                    </span>
                  </li>
                </ul>
              </div>
            </section>

          </div>

          {/* Columna Derecha: Yacht Features */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">
                <Ship size={16} />
                {isEs ? 'Especificaciones Oficiales' : 'Official Specifications'}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {isEs ? 'Yacht Features – Sunseeker 80ft' : 'Yacht Features'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {isEs
                  ? 'Características completas del Yate Negro Sunseeker Manhattan de 80 pies ("Papillon 9") en Cabo San Lucas.'
                  : 'Complete features aboard the 80ft Black Sunseeker Manhattan "Papillon 9" in Cabo San Lucas.'
                }
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-lg bg-slate-900 text-white flex items-center justify-between font-bold">
                  <span>{isEs ? 'Modelo:' : 'Yacht Model:'}</span>
                  <span className="text-amber-400">Sunseeker Manhattan 80ft</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 flex items-center justify-between text-blue-950 font-bold">
                  <span>{isEs ? 'Capacidad:' : 'Guest Capacity:'}</span>
                  <span>{isEs ? '1-12 Base • Hasta 30 Invitados Máx.' : '1-12 Base • Up to 30 Guests Max'}</span>
                </div>

                {[
                  { en: 'Air conditioned interior', es: 'Interior totalmente climatizado (Aire acondicionado)' },
                  { en: '2 Master bedrooms + 2 Guest bedrooms (4 total)', es: '2 Suites Master + 2 recámaras de huéspedes (4 en total)' },
                  { en: '4 full bathrooms with premium fittings', es: '4 baños completos con acabados de lujo' },
                  { en: 'Luxury & spacious interior salon', es: 'Salón interior lujoso y espacioso' },
                  { en: 'Indoor & Outdoor kitchen (Galley & Flybridge Grill)', es: 'Cocina interior y cocina/parrilla exterior' },
                  { en: 'Shaded seating on teak deck', es: 'Asientos sombreados en cubierta de teca' },
                  { en: 'Large front seating / sunbathing lounge', es: 'Amplia sala frontal y camastros para tomar el sol' },
                  { en: 'Hydraulic swim platform', es: 'Plataforma de nado hidráulica en popa' },
                  { en: 'Advanced Stabilizer system', es: 'Sistema estabilizador avanzado de navegación' },
                  { en: 'Bluetooth audio JBL system', es: 'Sistema de sonido JBL con conexión Bluetooth' },
                  { en: 'Indoor and outdoor teak dining tables', es: 'Mesas de comedor en teca interiores y exteriores' },
                  { en: 'Wi-Fi • 5 Satellite TVs • PlayStation', es: 'Wi-Fi • 5 Pantallas de TV Satelital • PlayStation' },
                  { en: 'Fishing Gear onboard', es: 'Equipo de pesca deportiva (Fishing Gear) a bordo' },
                  { en: 'Floating mat, Snorkel Gear & Paddleboard', es: 'Tapete flotante, equipo de esnórquel y paddleboard' }
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
                  {isEs ? 'Resumen de Precios Todo Incluido (1-12 Pax)' : 'All-Inclusive Pricing Summary (1-12 Guests)'}
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-300">{isEs ? 'Tarifa Especial 3 Horas (hasta Dic 15):' : 'Special Rate 3-Hour (until Dec 15):'}</span>
                  <span className="font-black text-amber-400">$5,500 USD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-300">{isEs ? 'Tarifa Normal 3 Horas:' : 'Normal Rate 3-Hour:'}</span>
                  <span className="font-bold text-white">$6,400 USD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-300">{isEs ? 'Huésped Extra (13 a 30 pax máx.):' : 'Extra Guest (max capacity 30):'}</span>
                  <span className="font-bold text-white">$225 USD</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-300">{isEs ? 'Hora Extra:' : 'Extra Hour:'}</span>
                  <span className="font-bold text-white">$1,600 USD</span>
                </div>
              </div>

              {/* Banner de Salida en Marina */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
                <MapPin className="text-blue-900 shrink-0" size={20} />
                <div>
                  <span className="font-bold text-slate-900 block">{isEs ? 'Muelle Exclusivo en Marina Cabo San Lucas' : 'Exclusive Slip in Cabo San Lucas Marina'}</span>
                  <span>{isEs ? 'Acceso VIP directo para grupos de hasta 30 invitados.' : 'Direct VIP gate embarkation for private groups up to 30 guests.'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* SECCIÓN SEO FAQ ESPECÍFICA PARA PAPILLON 9 (80FT)        */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2 border border-blue-200">
            <Info size={14} />
            {isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEs ? 'Preguntas Frecuentes sobre el Yate Negro Sunseeker Manhattan 80ft' : 'Frequently Asked Questions About the 80ft Black Sunseeker Manhattan'}
          </h3>
        </div>

        <div className="space-y-4">

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Cuántos pasajeros incluye el precio del Yate Negro Sunseeker 80ft?' : 'How many guests are included in the 80ft Black Sunseeker charter price?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Las tarifas base de 3 horas ($5,500 USD en Tarifa Especial hasta el 15 de diciembre o $6,400 USD en Tarifa Normal) incluyen de 1 a 12 huéspedes todo incluido. La embarcación permite hasta 30 invitados como capacidad máxima por $225 USD por cada huésped adicional.'
                : 'The 3-hour base rates ($5,500 USD Special Rate until December 15th, or $6,400 USD Normal Rate) include 1 to 12 guests all-inclusive. The yacht accommodates up to 30 guests maximum at $225 USD per extra guest.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué opciones de menú gourmet y bebidas están incluidas?' : 'What food and open-bar beverages are included onboard Papillon 9?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Todos los chárters incluyen barra libre premium, snacks de autor (dip orgánico de alcachofa y queso, plato de frutas de temporada y nueces mixtas), aperitivos (quesadillas y guacamole con totopos) y una comida gourmet a elegir entre la Opción 1 (ensalada griega/italiana/césar, baguettes de roast beef y pavo, y ceviche clásico) o la Opción 2 (charola de sushi preparado a bordo, ceviche clásico y alitas de pollo).'
                : 'All charters include a premium open bar, signature snacks (organic artichoke & cheese dip, fresh seasonal fruit platter, organic mixed nuts), appetizers (cheese quesadillas, chips with homemade guacamole & salsa), and your choice of Gourmet Meal Option 1 (Greek/Italian/Caesar salad, roast beef & turkey baguette sandwiches, classic ceviche) or Option 2 (freshly prepared sushi platter, classic ceviche, and chicken wings).'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿El Sunseeker Manhattan 80ft cuenta con estabilizadores y plataforma hidráulica?' : 'Does the 80ft Black Sunseeker Manhattan have stabilizers and a hydraulic swim platform?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Sí. Cuenta con un avanzado sistema estabilizador para brindar una navegación sumamente suave, además de plataforma de nado hidráulica en popa, 4 recámaras climatizadas (2 Master Suites y 2 cabinas), 4 baños, 5 TVs satelitales, PlayStation, Wi-Fi, sonido JBL Bluetooth, equipo de pesca, paddleboard, esnórquel y tapete flotante.'
                : 'Yes. Papillon 9 features an advanced stabilizing system for a smooth journey, a hydraulic teak swim platform, 4 air-conditioned bedrooms (2 Master Suites + 2 cabins), 4 bathrooms, 5 satellite TVs, PlayStation, Wi-Fi, Bluetooth JBL audio, fishing gear, paddleboard, snorkel gear, and a floating mat.'
              }
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Yate 1: 85 ft Contessa */}
            <Link
              href={`/${lang}/cabo-yacht-charters-contessa`}
              className="group block text-center"
            >
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
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">
                Her Shine Marine
              </div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $3,700' : 'Starting at $3,700'}
              </div>
            </Link>

            {/* Yate 2: 110 ft Aquaholic */}
            <Link
              href={`/${lang}/cabo-yacht-charters-aquaholic`}
              className="group block text-center"
            >
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
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">
                Horizon Yachts
              </div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $5,900' : 'Starting at $5,900'}
              </div>
            </Link>

            {/* Yate 3: 116 ft Capella */}
            <Link
              href={`/${lang}/cabo-yacht-charters`}
              className="group block text-center"
            >
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
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">
                Azimut-Benetti
              </div>
              <div className="text-xs sm:text-sm italic text-slate-500 mt-1">
                {isEs ? 'Desde $8,000' : 'Starting at $8,000'}
              </div>
            </Link>

            {/* Yate 4: 130 ft Sovereign */}
            <Link
              href={`/${lang}/cabo-yacht-charters-sovereign`}
              className="group block text-center"
            >
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
              <div className="text-sm sm:text-base font-extrabold text-slate-600 mt-0.5">
                Sovereign Yachts
              </div>
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
                    ? `Gracias ${inquireData.firstName}. Nuestro equipo VIP concierge de Ballard Tours se comunicará contigo a la brevedad para confirmar disponibilidad y los detalles de tu chárter en el Yate Negro Sunseeker 80ft "Papillon 9".`
                    : `Thank you ${inquireData.firstName}. Our VIP concierge team at Ballard Tours will get in touch with you shortly to confirm availability and itinerary details aboard the 80ft Black Sunseeker "Papillon 9".`
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
                    80ft Black Sunseeker Manhattan "Papillon 9"
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
                      placeholder={isEs ? 'Escribe aquí tu mensaje, preferencia de Menú Opción 1 u Opción 2, o alergias...' : 'Your Message (Menu Option 1 or 2 preference, allergies, questions...)'}
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
                80ft Black Sunseeker Manhattan "Papillon 9"
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

