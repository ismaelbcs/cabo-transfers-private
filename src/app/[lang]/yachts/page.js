// src/app/[lang]/yachts/page.js
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
      maxGuests: 20,
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
      maxGuests: 20,
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
      maxGuests: 20,
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
  // FOTOS REALES DEL YATE CAPELLA (16 FOTOS DE ALTA RESOLUCIÓN)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/yachts/capella-aerial-overview.jpg',
      titleEn: 'Aerial View of 116ft Capella Cruising Past Land\'s End',
      titleEs: 'Vista Aérea del Superyate Capella de 116ft Navegando en Finisterra',
      descEn: 'Rare 116ft Azimut-Benetti tri-deck yacht cruising the deep blue waters of Cabo San Lucas.',
      descEs: 'Exclusivo superyate Azimut-Benetti de 116 pies navegando las aguas azules de Cabo San Lucas.',
      labelEn: 'Aerial View',
      labelEs: 'Vista Aérea'
    },
    {
      src: '/yachts/capella-stern-cruising-arch.jpg',
      titleEn: 'Capella Cruising Past Land\'s End & Lover\'s Beach',
      titleEs: 'Superyate Capella Navegando en Finisterra y Playa del Amor',
      descEn: 'Aerial stern three-quarter view showing all three luxurious decks against Cabo\'s famous rock formations.',
      descEs: 'Vista aérea de popa mostrando sus tres cubiertas frente a las imponentes formaciones del Finisterra.',
      labelEn: 'Stern & Arch',
      labelEs: 'Popa & Arco'
    },
    {
      src: '/yachts/capella-aft-deck-dining.jpg',
      titleEn: 'Aft Deck Formal Dining with Land\'s End Arch View',
      titleEs: 'Comedor de Popa al Aire Libre con Vista al Arco y Finisterra',
      descEn: 'Teak dining table set for 12 guests with panoramic ocean views and private chef service.',
      descEs: 'Mesa de teca para 12 comensales con vistas panorámicas al Arco y servicio de chef privado.',
      labelEn: 'Aft Dining',
      labelEs: 'Comedor Popa'
    },
    {
      src: '/yachts/capella-flybridge-sky-lounge.jpg',
      titleEn: 'Expansive Upper Flybridge Sky Lounge with Jacuzzi',
      titleEs: 'Amplio Lounge en Cubierta Superior Flybridge con Jacuzzi',
      descEn: 'Generous wrap-around seating, retractable sunroof, private bar, and 8-person jacuzzi.',
      descEs: 'Amplia sala lounge envolvente, techo corredizo, barra privada y jacuzzi para 8 personas.',
      labelEn: 'Sky Lounge',
      labelEs: 'Lounge Terraza'
    },
    {
      src: '/yachts/capella-bow-lounge-terrace.jpg',
      titleEn: 'Bow Sunbathing Terrace with VIP Cushions & Sunset Service',
      titleEs: 'Terraza y Asoleadero de Proa con Cojines VIP y Servicio Gourmet',
      descEn: 'Spacious bow sunbed with plush pillows, charcuterie, and chilled champagne under Baja sun.',
      descEs: 'Asoleadero espacioso en proa con finos cojines, tabla de canapés y champaña bajo el sol de Baja.',
      labelEn: 'Bow Terrace',
      labelEs: 'Terraza Proa'
    },
    {
      src: '/yachts/capella-master-marble-bath.jpg',
      titleEn: 'Master En-Suite Bathroom with Double Marble Vanity & Bathtub',
      titleEs: 'Baño Principal En-Suite con Doble Lavabo de Mármol y Tina Jacuzzi',
      descEn: 'Elegantly appointed bathroom featuring imported Italian marble, rain shower, and jacuzzi tub.',
      descEs: 'Elegante baño con mármol italiano importado, regadera de lluvia y tina de hidromasaje.',
      labelEn: 'Marble Bath',
      labelEs: 'Baño Mármol'
    },
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
      src: '/yachts/capella-wheelhouse-helm.jpg',
      titleEn: 'High-Tech Navigation Bridge & Captain\'s Helm Station',
      titleEs: 'Puente de Mando y Cabina de Navegación de Alta Tecnología',
      descEn: 'State-of-the-art navigation helm with panoramic ocean vistas of Cabo San Lucas.',
      descEs: 'Puente de mando vanguardista con visión panorámica de 180° sobre las aguas de Cabo.',
      labelEn: 'Helm Bridge',
      labelEs: 'Cabina Mando'
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
      src: '/yachts/capella-twin-stateroom.jpg',
      titleEn: 'Guest Stateroom Suite with Twin Beds & Fine Cherry Wood',
      titleEs: 'Camarote Suite de Invitados con Dos Camas Individuales y Madera de Cerezo',
      descEn: 'Spacious guest suite featuring plush bedding, en-suite marble bathroom, and entertainment system.',
      descEs: 'Espaciosa suite para invitados con camas individuales, baño privado de mármol y climatización.',
      labelEn: 'Twin Suite',
      labelEs: 'Suite Twin'
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
      src: '/yachts/capella-mosaic-companionway.jpg',
      titleEn: 'Hand-Laid Mosaic Tile Companionway',
      titleEs: 'Pasillo Principal con Mosaicos Artesanales Hechos a Mano',
      descEn: 'Stunning artisan tile mosaic companionway accented with polished cherry wood.',
      descEs: 'Impresionante pasillo de mosaicos artesanales con acentos en madera de cerezo pulida.',
      labelEn: 'Mosaic Tile',
      labelEs: 'Mosaicos'
    },
    {
      src: '/yachts/capella-bow-sunpad.jpg',
      titleEn: 'Expansive Bow Sunbathing Pad',
      titleEs: 'Amplio Asoleadero en Proa con Cojines de Lujo',
      descEn: 'Ideal for sun lounging with fresh drinks by day and romantic stargazing by night.',
      descEs: 'Ideal para tomar el sol de día y admirar las estrellas por la noche.',
      labelEn: 'Bow Sunpad',
      labelEs: 'Proa'
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
      // Deslizó hacia la izquierda -> Siguiente foto (infinito)
      handleNextPhoto();
    } else if (distance < -minSwipeDistance) {
      // Deslizó hacia la derecha -> Foto anterior (infinito)
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

            {/* Título Principal H1 con palabras clave SEO */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-tight text-slate-900">
              {isEs ? 'Capella – Renta de Yate de Lujo en Cabo San Lucas, México' : 'Capella – Luxury Yacht Charter in Cabo San Lucas, Mexico'}
            </h1>
            
            <HeroReviewsBadge lang={lang} />

            <p className="text-base sm:text-lg md:text-xl text-blue-900 font-extrabold mt-3 max-w-3xl mx-auto leading-relaxed">
              {isEs 
                ? 'Calidad, máximo lujo y excelencia italiana para navegar las aguas de Los Cabos.'
                : "Quality, luxury, and Italian excellence for cruising Baja's deep blue seas."
              }
            </p>

            <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl mx-auto leading-relaxed font-normal">
              {isEs
                ? 'Vive la máxima experiencia de chárter de yates de lujo en Cabo San Lucas a bordo del Capella, un majestuoso superyate Azimut-Benetti de 116 pies. Uno de solo tres navíos de este modelo construidos en la historia, Capella combina artesanía italiana de renombre mundial, interiores amplios, diseño refinado y un servicio personalizado inigualable.'
                : 'Experience the ultimate luxury yacht charter in Cabo San Lucas aboard Capella, a magnificent 116-foot Azimut-Benetti yacht. One of only three vessels of this particular model ever built, Capella offers an extraordinary combination of Italian craftsmanship, spacious interiors, elegant design, and personalized service.'
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
                    ? `Capella 116-foot Azimut-Benetti renta de yate de lujo en Cabo San Lucas, Los Cabos, México - ${fotosGaleria[fotoActiva].titleEs}`
                    : `Capella 116-foot Azimut-Benetti luxury yacht charter in Cabo San Lucas, Los Cabos, Mexico - ${fotosGaleria[fotoActiva].titleEn}`
                  } 
                  className="w-full h-full object-cover transition-all duration-500 ease-out select-none"
                  draggable={false}
                />
                
                {/* Gradiente inferior para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

                {/* Flecha Anterior (Infinito) */}
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

                {/* Flecha Siguiente (Infinito) */}
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

            {/* MINIATURAS INTERACTIVAS (16 FOTOS REALES) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-16 gap-1.5 sm:gap-2">
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
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? 'Hasta 20 Personas' : 'Up to 20 Guests'}</p>
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

            {/* 2. Selector de Huéspedes Totales */}
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
                  onClick={() => setTotalHuespedes(prev => Math.min(20, prev + 1))}
                  disabled={totalHuespedes >= 20}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Increase Guests"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs 
                  ? 'Tarifa cubre 10 personas. A partir de 11 suma $300 USD c/u (hasta 20).' 
                  : 'Rate covers 10 guests. From 11+ adds $300 USD each (up to 20).'
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
                  ? 'Agrega las horas extras que desees ($1,600 USD por hora).' 
                  : 'Add as many extra hours as you want ($1,600 USD per hour).'
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
          
          {/* Columna Izquierda: Arquitectura, Lujo y Servicio */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Sección: Descripción General */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'Excelencia Italiana en Cabo San Lucas' : 'Italian Excellence in Baja'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">
                {isEs 
                  ? 'La Embarcación en la que Todos Desean Estar' 
                  : 'The Vessel Everybody Wishes They Were On'
                }
              </h2>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  <strong className="text-slate-900">Capella</strong> {isEs 
                    ? 'es un majestuoso superyate Azimut-Benetti de 116 pies (35.4 metros), uno de tan solo tres ejemplares de este modelo específico construidos en todo el mundo. Este navío excepcional posee sin duda alguna el factor “WOW”. Tan pronto como subes a bordo, te encuentras rodeado de lujo, calidez y espacios diáfanos decorados con un gusto impecable.'
                    : 'is a magnificent 116-foot Azimut-Benetti yacht, one of only three vessels of this particular model ever built. This fine vessel definitely has the wow factor. As soon as you step on board, you find yourself surrounded by luxury, sophistication, and light airy spaces decorated with impeccable Italian craftsmanship.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'Ya sea que estés planeando un chárter privado en Los Cabos, una escapada de lujo con familiares y amigos, o un día inolvidable explorando las costas de Baja California Sur, Capella ofrece una experiencia inigualable sobre el agua. Su ingeniosa distribución cuenta con amplias áreas de entretenimiento de concepto abierto, camarotes sumamente espaciosos, una cocina sobredimensionada para alta gastronomía y líneas elegantes que roban miradas dondequiera que navega. De hecho, nuestros huéspedes internacionales comentan sistemáticamente que se siente como un yate mucho más grande.'
                    : 'Whether you are planning a private yacht charter in Los Cabos, a luxury getaway with family and friends, or an unforgettable day exploring the beautiful coastline of Baja California Sur, Capella delivers an exceptional experience on the water. Her impressive layout features expansive entertainment areas, spacious staterooms, an oversized galley, and graceful lines that turn heads wherever she goes. International guests consistently comment that Capella feels much larger than her actual size.'
                  }
                </p>
              </div>
            </section>

            {/* Sección: Exceptional Luxury and Comfort */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Sparkles size={14} />
                {isEs ? 'Confort y Espacios de Primer Nivel' : 'Exceptional Luxury and Comfort'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs ? 'Lujo y Confort Excepcional en Cada Rincón' : 'Exceptional Luxury and Comfort'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Capella cuenta con una espaciosa cubierta de popa con mesa para 12 comensales, un confortable salón principal con wet bar completo y comedor formal para 10 personas, así como un camarote principal full-beam (de manga completa) equipado con regadera de lluvia y tina de hidromasaje jacuzzi.'
                  : 'Capella features a spacious aft deck with dining accommodations for 12 guests, a comfortable salon with a full wet bar and dining for 10, and a full-beam master stateroom featuring a rain shower and jacuzzi bathtub.'
                }
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'El yate ofrece cinco camarotes hermosamente decorados, cada uno con baño privado en suite revestido con elegantes acentos de mármol, además de cuatro cabinas para la tripulación. Uno de los detalles más distintivos del Capella es su hermoso pasillo con mosaicos colocados a mano, aportando un toque inigualable de distinción italiana. En la proa, los invitados pueden relajarse en el amplio asoleadero acolchonado, un lugar ideal para contemplar el océano de día o maravillarse con las estrellas de noche.'
                  : 'The yacht offers five beautifully appointed staterooms, each with a private bathroom featuring elegant marble accents, as well as four crew cabins. One of Capella\'s most distinctive details is her beautiful hand-laid mosaic tile companionway, adding a unique touch of Italian elegance. At the bow, guests can relax on the spacious sunbathing pad, an ideal place to enjoy the ocean views or gaze at the stars.'
                }
              </p>
            </section>

            {/* Sección: Exclusive Upper Deck Experience */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Waves size={14} />
                {isEs ? 'Cubierta Superior Flybridge' : 'Exclusive Upper Deck Experience'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs ? 'Experiencia Exclusiva en la Cubierta Superior' : 'Exclusive Upper Deck Experience'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'La cubierta superior es uno de los espacios más aclamados del Capella y el escenario perfecto para deleitarse con la costa de Baja California. Con un techo corredizo retráctil, barra privada, amplios camastros para asolearse, jacuzzi con capacidad para hasta ocho personas y cómodos asientos para albergar holgadamente a más de 25 invitados, esta área brinda la atmósfera ideal para relajarse, socializar y disfrutar de cócteles y canapés de autor.'
                  : 'The upper deck is one of Capella\'s most popular spaces and the perfect setting for enjoying the Baja California coastline. Featuring a retractable sunroof, private bar, spacious sun loungers, a jacuzzi accommodating up to eight people, and generous seating for more than 25 guests, this area provides the ideal atmosphere for relaxing, socializing, and enjoying cocktails and canapés.'
                }
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Ya sea que prefieras tomar el sol bajo el cielo despejado de Los Cabos o disfrutar de una velada bajo las estrellas, Capella ofrece un entorno excepcional para cada celebración.'
                  : 'Whether you prefer soaking up the Mexican sunshine or enjoying an evening under the stars, Capella offers an exceptional setting for every occasion.'
                }
              </p>
            </section>

            {/* Sección: Servicio Personalizado y Chef */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="text-blue-900" size={22} />
                {isEs ? 'Servicio Personalizado y Tripulación Profesional' : 'Personalized Service and Professional Crew'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isEs
                  ? 'Lo que verdaderamente distingue al Capella es la minuciosa atención al detalle. Desde toallas frescas y aromáticas al abordar hasta finas sábanas italianas Frette en cada camarote, cada elemento ha sido cuidadosamente seleccionado para brindar una experiencia de superyate inigualable.'
                  : 'What truly sets Capella apart is the attention to detail. From fresh, cool towels upon boarding to premium Frette linens in every cabin, every element has been carefully considered to provide an exceptional luxury yacht experience.'
                }
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isEs
                  ? 'Su tripulación profesional de siete personas incluye azafatas experimentadas que anticipan cada necesidad manteniendo el equilibrio perfecto entre un servicio atento y absoluta privacidad. El chef galardonado a bordo se especializa en gastronomía internacional, incluyendo platos tailandeses, indios, mexicanos e italianos, junto con platillos tradicionales estadounidenses. Cada comida se prepara al momento con pasión, creatividad y excelencia.'
                  : 'Her professional crew of seven includes experienced stewardesses who anticipate your needs while maintaining the perfect balance between attentive service and privacy. The award-winning onboard chef specializes in international cuisine, including Thai, Indian, Mexican, and Italian dishes, alongside traditional American favorites. Every meal is prepared with passion, creativity, and attention to detail.'
                }
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    {isEs ? 'Tripulación de 7 Especialistas' : 'Dedicated Crew of Seven'}
                  </span>
                  <span className="text-slate-500">
                    {isEs ? 'Capitán titular, marineros certificados y azafatas de hospitalidad VIP.' : 'Master captain, certified deckhands, and discreet VIP stewardesses.'}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">
                    {isEs ? 'Chef Privado Internacional' : 'Award-Winning Private Chef'}
                  </span>
                  <span className="text-slate-500">
                    {isEs ? 'Cocina tailandesa, india, mexicana, italiana y delicias del mar.' : 'Thai, Indian, Mexican, Italian, and fresh catch fine dining.'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Juguetes Acuáticos y Tender Pursuit */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tarjeta de Juguetes Acuáticos y Tender */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">
                <Waves size={16} />
                {isEs ? 'Juguetes Acuáticos y Equipamiento de Aventura' : 'Water Toys & Adventure Equipment'}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {isEs ? 'Yacht Highlights – Onboard Equipment' : 'Yacht Highlights – Onboard Equipment'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {isEs
                  ? 'Capella combina el máximo lujo con la aventura, ofreciendo una impresionante selección de juguetes acuáticos y equipo de primer nivel para aprovechar cada segundo en el mar.'
                  : 'Capella combines luxury with adventure, offering an impressive selection of water toys and equipment for guests who want to make the most of their time at sea.'
                }
              </p>

              <div className="space-y-3.5 text-sm">
                
                {/* Tender Pursuit 31' destacado */}
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 mt-0.5 font-black text-sm shadow-xs">
                    31'
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm sm:text-base">31-foot Pursuit Fishing & Activity Tender</span>
                    <span className="text-xs text-slate-600">
                      {isEs 
                        ? 'Embarcación auxiliar de 31 pies equipada con dos motores Yamaha de 300 HP para pesca de altura y actividades acuáticas.' 
                        : 'Powered by twin Yamaha 300 HP engines for offshore sportfishing, coastal exploration, and beach landings.'
                      }
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>12-foot Dinghy</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>2 Seabobs (Underwater Scooters)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Dive Compressor Onboard</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>4 Stand-Up Paddleboards</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>2 Ocean Kayaks</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Professional Fishing Equipment</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Snorkeling Equipment</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Various Inflatable Toys & Floaties</span>
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
                ? 'Explora lo Mejor de Baja California Sur a Bordo de Capella' 
                : 'Explore the Best of Baja California Sur Aboard Capella'
              }
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
              {isEs
                ? 'Descubre la belleza de Los Cabos desde una perspectiva completamente diferente. Un chárter de yate privado es la forma más exclusiva de explorar las aguas cristalinas del Mar de Cortés y la costa del Pacífico de Baja California Sur. Ya sea que busques relajación absoluta, aventura acuática o una celebración VIP inolvidable, Capella brinda el entorno perfecto.'
                : 'Discover the beauty of Los Cabos from a completely different perspective aboard Capella. A private yacht charter is an exceptional way to explore the crystal-clear waters of the Sea of Cortez and the Pacific coastline of Baja California Sur. Whether you are looking for relaxation, adventure, or an exclusive celebration, Capella provides the perfect setting for an unforgettable experience.'
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
                  {isEs ? 'Snorkel & Seabobs' : 'Snorkeling & Seabobs'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Natación en aguas cristalinas y exploración subacuática de alta velocidad.' : 'Swimming in turquoise coves and high-speed underwater propulsion.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  03
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'Pesca Deportiva y SUP' : 'Sportfishing & Paddling'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Pesca privada en el tender Pursuit de 31 pies y paseos en kayak o paddleboard.' : 'Private fishing in the 31ft Pursuit tender, ocean kayaking, and SUP.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  04
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'Atardeceres del Pacífico' : 'Pacific Sunsets & Jacuzzi'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Atardeceres legendarios sobre el océano mientras disfrutas del jacuzzi y canapés.' : 'Spectacular sunsets while relaxing on deck with gourmet dining and open bar.'}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* FILA 3: POR QUÉ ELEGIR CAPELLA PARA TU CHÁRTER */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
              <Award size={14} />
              {isEs ? 'Ventajas Exclusivas' : 'Why Choose Capella for Your Cabo Yacht Charter?'}
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {isEs ? '¿Por qué elegir Capella para tu chárter en Los Cabos?' : 'Why Choose Capella for Your Cabo Yacht Charter?'}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {isEs 
                ? 'Elegir el yate adecuado es fundamental para unas vacaciones de lujo inolvidables en Los Cabos. Capella se distingue por su tamaño, diseño italiano único, tripulación profesional y un equipamiento insuperable.'
                : 'Choosing the right yacht is essential when planning a luxury vacation in Los Cabos. Capella stands out for her impressive size, exclusive design, professional crew, and extensive selection of onboard amenities.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Yate Azimut-Benetti Exclusivo' : 'Rare Azimut-Benetti Yacht'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Uno de tan solo tres yates de este modelo en particular construidos en la historia náutica mundial.' 
                  : 'One of only three yachts of this particular model ever built in worldwide maritime history.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? '116 Pies de Máximo Lujo' : '116 Feet of Luxury'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Interiores sumamente espaciosos y áreas de entretenimiento al aire libre que superan las expectativas.' 
                  : 'Spacious interiors and expansive outdoor entertainment areas that feel much larger than its size.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Tripulación Profesional de Siete' : 'Professional Crew of Seven'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Atención personalizada, hospitalidad impecable y el balance perfecto entre servicio y privacidad.' 
                  : 'Personalized attention, seamless hospitality, and the perfect balance between attentive service and privacy.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Cinco Camarotes Privados' : 'Five Private Staterooms'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Suites elegantes con baños privados de mármol, sábanas italianas Frette y acabados de primera.' 
                  : 'Comfortable accommodations with private en-suite marble bathrooms and luxury Frette linens.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                5
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Alta Cocina a Bordo' : 'Luxury Onboard Dining'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Chef privado galardonado con especialidad en cocina tailandesa, india, mexicana, italiana y del mar.' 
                  : 'An award-winning chef specializing in international cuisine tailored to your group’s tastes.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                6
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                {isEs ? 'Actividades Acuáticas Premium' : 'Premium Water Activities'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEs 
                  ? 'Tender Pursuit de 31 pies con 600 hp, Seabobs submarinos, kayaks, paddleboards y equipo de pesca.' 
                  : '31ft Pursuit tender, Seabobs, paddleboards, kayaks, dive compressor, and pro fishing equipment.'
                }
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition md:col-span-2 lg:col-span-3">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-base shrink-0 border border-amber-200">
                  7
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">
                    {isEs ? 'Espacios Exclusivos de Entretenimiento' : 'Exclusive Entertainment Spaces'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isEs 
                      ? 'Jacuzzi en cubierta para 8 personas, asoleadero de proa para ver las estrellas, wet bar privado y cubiertas con capacidad para más de 25 invitados. Capella está diseñado para quienes aprecian la privacidad, el servicio excepcional y la libertad de disfrutar del océano con total confort.' 
                      : 'Upper deck jacuzzi for 8 guests, sunbathing bow pad, private bar, and spacious decks accommodating 25+ guests. Capella is designed for guests who appreciate privacy, exceptional service, and the freedom to experience the ocean in complete comfort.'
                    }
                  </p>
                </div>
              </div>
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
                ? 'Haz que tu Visita a Cabo San Lucas sea Inolvidable a Bordo del Capella' 
                : 'Book Your Private Luxury Yacht Experience in Los Cabos'
              }
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              {isEs
                ? 'Ya sea que estés planeando una escapada privada, unas vacaciones familiares, una celebración especial o un día exclusivo en altamar, este excepcional yate Azimut-Benetti ofrece la combinación perfecta de lujo, aventura y hospitalidad personalizada. Descubre por qué un chárter privado en Cabo San Lucas es una de las experiencias más memorables de Baja California Sur. Contáctanos para consultar disponibilidad y diseñar tu itinerario a la medida.'
                : 'Make your visit to Cabo San Lucas truly unforgettable aboard Capella. Whether you are planning a private getaway, a family vacation, a special celebration, or an exclusive day at sea, this exceptional Azimut-Benetti yacht offers the perfect combination of luxury, adventure, and personalized hospitality. Discover why a private yacht charter in Cabo San Lucas is one of the most memorable experiences in Baja California Sur. Contact our team to inquire about availability, charter options, and your personalized yacht experience aboard Capella.'
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
      {/* SECCIÓN SEO FAQ (7 PREGUNTAS CLAVE PARA GOOGLE)           */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2 border border-blue-200">
            <Info size={14} />
            {isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEs ? 'Preguntas Frecuentes sobre el Chárter en Capella' : 'Frequently Asked Questions About Capella Yacht Charter'}
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            {isEs 
              ? 'Todo lo que necesitas saber para rentar el yate de lujo Capella en Cabo San Lucas' 
              : 'Everything you need to know about booking the 116ft Capella luxury yacht charter'
            }
          </p>
        </div>

        <div className="space-y-4">
          
          {/* FAQ 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Dónde puedo rentar un yate de lujo en Cabo San Lucas?' : 'Where can I rent a luxury yacht in Cabo San Lucas?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs 
                ? 'Puedes disfrutar de un exclusivo chárter de yates de lujo en Cabo San Lucas a bordo del Capella, un yate Azimut-Benetti de 116 pies que ofrece amplias áreas de entretenimiento, servicio personalizado y actividades acuáticas de primer nivel directamente desde la prestigiosa Marina de Cabo San Lucas.'
                : 'You can enjoy an exclusive luxury yacht charter in Cabo San Lucas aboard Capella, a 116-foot Azimut-Benetti yacht offering spacious entertainment areas, personalized service, and premium water activities departing directly from the world-class Marina Cabo San Lucas.'
              }
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué tan grande es el yate de lujo Capella?' : 'How big is the Capella luxury yacht?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Capella es un superyate Azimut-Benetti de 116 pies (35.4 metros) que cuenta con cinco camarotes privados de lujo, amplias áreas de entretenimiento interiores y al aire libre, jacuzzi en la cubierta superior y una tripulación profesional dedicada de siete personas.'
                : 'Capella is a 116-foot (35.4-meter) Azimut-Benetti yacht featuring five staterooms, spacious indoor and outdoor entertainment areas, a jacuzzi, and a professional crew of seven.'
              }
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué actividades se pueden disfrutar a bordo del Capella?' : 'What activities can you enjoy aboard Capella?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Los huéspedes pueden disfrutar de esnórquel en bahías cristalinas, paddleboarding, paseos en kayak, exploración submarina con Seabobs de alta tecnología, pesca deportiva con el tender Pursuit de 31 pies, natación y relajación absoluta mientras navegan a lo largo de la hermosa costa de Los Cabos.'
                : 'Guests can enjoy snorkeling, paddleboarding, kayaking, Seabob underwater exploration, fishing with the 31ft Pursuit tender, swimming, and relaxing while cruising along the beautiful coastline of Los Cabos.'
              }
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Tiene jacuzzi el yate Capella?' : 'Does Capella have a jacuzzi?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Sí. Capella cuenta con un jacuzzi en la cubierta superior con capacidad para hasta ocho personas, ofreciendo un lugar excepcional para relajarse y disfrutar de vistas panorámicas inigualables del océano y el atardecer.'
                : 'Yes. Capella features a jacuzzi on the upper deck that accommodates up to eight people, offering an exceptional place to relax and enjoy ocean views and sunsets.'
              }
            </p>
          </div>

          {/* FAQ 5 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Tiene Capella un chef profesional a bordo?' : 'Does Capella have a professional chef?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Sí. Capella cuenta con un chef ejecutivo a bordo galardonado, especializado en alta cocina internacional incluyendo platillos mexicanos, italianos, tailandeses, indios y clásicos estadounidenses, diseñando menús a la medida de los gustos de cada grupo.'
                : 'Yes. Capella has an award-winning onboard chef specializing in international cuisine, including Mexican, Italian, Thai, Indian, and traditional American dishes, preparing custom multi-course menus fresh at sea.'
              }
            </p>
          </div>

          {/* FAQ 6 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Es adecuado Capella para chárters privados y eventos?' : 'Is Capella suitable for private yacht charters?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Capella está diseñado para brindar una experiencia de yate sumamente exclusiva con amplias áreas de entretenimiento para más de 25 invitados, cinco camarotes, servicio de tripulación profesional y una amplia gama de amenidades. Puedes contactar a nuestro equipo de chárter para consultar disponibilidad y opciones personalizadas.'
                : 'Capella is designed to provide an exclusive yacht experience with spacious entertainment areas for 25+ guests, five staterooms, professional crew service, and a wide range of onboard amenities. Contact the charter team for guest capacity and available charter arrangements.'
              }
            </p>
          </div>

          {/* FAQ 7 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué hace que Capella sea diferente de otros alquileres de yates en Cabo?' : 'What makes Capella different from other yacht rentals in Cabo?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Capella se distingue por su exclusivo diseño Azimut-Benetti (solo 3 en el mundo), 116 pies de eslora, lujosos alojamientos con baños de mármol, una tripulación profesional de siete especialistas dedicados, jacuzzi en cubierta, chef galardonado y una extensa colección de juguetes acuáticos que incluye Seabobs y un tender Pursuit de 31 pies con 600 hp.'
                : 'Capella stands out for her rare Azimut-Benetti design (one of only three ever built), 116-foot length, luxurious accommodations, professional crew of seven, onboard jacuzzi, award-winning chef, and extensive collection of water sports equipment including Seabobs and a 31ft Pursuit fishing tender.'
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
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-3 sm:p-6 md:p-8 animate-fade-in select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header Superior del Lightbox */}
          <div className="flex justify-between items-center text-white z-40 px-2">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-md">
                {fotoActiva + 1} / {fotosGaleria.length}
              </span>
              <span className="text-slate-300 font-bold hidden sm:inline">
                Capella 116ft Azimut-Benetti
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

          {/* Área Central de Imagen con Flechas Flotantes Laterales y Soporte Táctil */}
          <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden touch-pan-y">
            
            {/* Botón Flotante Izquierdo (Foto Anterior - Infinito) */}
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

            {/* Imagen Grande Activa */}
            <img 
              key={fotosGaleria[fotoActiva].src}
              src={fotosGaleria[fotoActiva].src} 
              alt={fotosGaleria[fotoActiva].titleEn} 
              className="max-h-[72vh] sm:max-h-[76vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 ease-out select-none pointer-events-none"
              draggable={false}
            />

            {/* Botón Flotante Derecho (Foto Siguiente - Infinito) */}
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

          {/* Pie de Foto y Botones Inferiores */}
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
