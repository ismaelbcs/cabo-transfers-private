// src/app/[lang]/yachts/sovereign/page.js
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

export default function SovereignYachtPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const { agregarAlCombo } = useCart();

  // ==========================================
  // CONFIGURACIÓN DE PAQUETES - SOVEREIGN 130FT (PRECIOS ACTUALIZADOS)
  // Regla: +$1,000 USD al paquete, +$50 USD por huésped extra ($250+$50=$300), +$100 USD a hora extra
  // ==========================================
  const paquetes = [
    {
      id: 'all-inclusive-4',
      nameEn: '4 HOURS ALL INCLUSIVE',
      nameEs: '4 HORAS TODO INCLUIDO',
      hours: 4,
      price: 15000, // Original $14,000 + $1,000
      baseGuests: 10,
      maxGuests: 25, // 10 base + 15 extra max
      extraMax: 15,
      extraGuestPrice: 300, // Original $250 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Cruise past El Arco and Land’s End aboard the 130ft Sovereign superyacht with 2 Sea-Doo Sparks, 18ft Runabout tender, custom chef dining, and open bar.',
      descriptionEs: 'Navega frente al Arco y Finisterra a bordo del superyate Sovereign de 130 pies con 2 motos acuáticas Sea-Doo Spark, tender de 18 pies, chef privado y barra libre.'
    },
    {
      id: 'all-inclusive-6',
      nameEn: '6 HOURS ALL INCLUSIVE',
      nameEs: '6 HORAS TODO INCLUIDO',
      hours: 6,
      price: 20000, // Original $19,000 + $1,000
      baseGuests: 10,
      maxGuests: 25,
      extraMax: 15,
      extraGuestPrice: 300, // Original $250 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: false,
      descriptionEn: 'Extended luxury sportfishing and cruising voyage. Target trophy game fish with 20 Custom Talica Shimano reels or anchor in Santa María Bay with the floating ocean pool.',
      descriptionEs: 'Travesía extendida de pesca deportiva de lujo y crucero. Busca especies trofeo con 20 carretes Shimano Talica o ancla en Bahía Santa María con alberca flotante.'
    },
    {
      id: 'all-inclusive-8',
      nameEn: '8 HOURS ALL INCLUSIVE',
      nameEs: '8 HORAS TODO INCLUIDO',
      hours: 8,
      price: 25000, // Original $24,000 + $1,000
      baseGuests: 10,
      maxGuests: 25,
      extraMax: 15,
      extraGuestPrice: 300, // Original $250 + $50
      appetizers: true,
      beverages: true,
      customMeal: true,
      popular: true, // Tag "Most Popular"
      descriptionEn: 'The ultimate 130ft superyacht & tournament sportfisher experience in Cabo San Lucas. Full-day offshore fishing, Sea-Doo Sparks, 18ft Runabout, Zero-Speed stabilizers, and multi-course dining.',
      descriptionEs: 'La máxima experiencia de día completo en el superyate y pescador deportivo de 130 pies. Pesca de altura, Sea-Doo Sparks, tender de 18ft, estabilizadores Zero-Speed y alta cocina.'
    }
  ];

  // ==========================================
  // ESTADOS DEL CONFIGURADOR / CALCULADORA
  // ==========================================
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(paquetes[2]); // 8 Horas por defecto
  const [charterFecha, setCharterFecha] = useState('');
  const [totalHuespedes, setTotalHuespedes] = useState(10);
  const [horasExtras, setHorasExtras] = useState(0);
  const PRECIO_HORA_EXTRA = 2600; // Base $2,500 + $100 USD

  // Estados de Transportación Terrestre
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

  // Cálculo del Costo de Huéspedes Adicionales ($300 USD c/u, hasta 15 extra = 25 máx)
  const huespedesExtra = Math.max(0, totalHuespedes - paqueteSeleccionado.baseGuests);
  const costoHuespedesExtra = huespedesExtra * paqueteSeleccionado.extraGuestPrice;

  // Cálculo de Horas Extras ($2,600 USD c/u)
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
  // FOTOS REALES DEL SUPERYATE SOVEREIGN 130FT (16 FOTOS DE ALTA RESOLUCIÓN)
  // ==========================================
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const fotosGaleria = [
    {
      src: '/yachts/sovereign/sovereign-6.jpg',
      titleEn: 'Aerial View of 130ft Sovereign Yachts Superyacht Cruising Cabo San Lucas',
      titleEs: 'Vista Aérea del Superyate Sovereign de 130ft Navegando en Cabo San Lucas',
      descEn: 'Totally rebuilt in 2018 with all-new decks, electronics, and Zero-Speed stabilizers—a 130ft luxury sportfisher and cruising superyacht in one.',
      descEs: 'Totalmente reconstruido en 2018 con cubiertas, electrónica y estabilizadores Zero-Speed nuevos: un superyate de crucero y pesca deportiva de 130 pies.',
      labelEn: 'Aerial View',
      labelEs: 'Vista Aérea'
    },
    {
      src: '/yachts/sovereign/sovereign-2.jpg',
      titleEn: '130ft Sovereign Anchored Directly in Front of El Arco at Land’s End',
      titleEs: 'Superyate Sovereign 130ft Anclado Frente al Arco de Cabo San Lucas',
      descEn: 'Commanding gold-and-white 130ft profile framed by the iconic rock formations of El Arco and Lover’s Beach.',
      descEs: 'Imponente silueta de 130 pies en dorado y blanco enmarcada por el icónico Arco de Cabo San Lucas y Playa del Amor.',
      labelEn: 'Arch Profile',
      labelEs: 'Frente al Arco'
    },
    {
      src: '/yachts/sovereign/sovereign-3.jpg',
      titleEn: 'Top-Down Aerial View with Floating Ocean Pool & Sea-Doo Sparks',
      titleEs: 'Vista Cenital con Alberca Flotante en el Mar y Motos Acuáticas Sea-Doo',
      descEn: 'Bird’s-eye view showcasing Sovereign’s 130-foot length, foredeck lounge, and stern floating sea pool.',
      descEs: 'Vista de pájaro mostrando los 130 pies de eslora del Sovereign, asoleadero de proa y alberca flotante en popa.',
      labelEn: 'Top-Down',
      labelEs: 'Cenital'
    },
    {
      src: '/yachts/sovereign/sovereign-9.jpg',
      titleEn: 'Tournament Cockpit with 20 Custom Talica Shimano Reels & Fighting Chair',
      titleEs: 'Cockpit de Torneo con 20 Carretes Shimano Talica y Silla de Pelea',
      descEn: 'Unmatched luxury sportfishing setup featuring 20 Custom Talica Shimano reels and a professional fighting chair overlooking Land’s End.',
      descEs: 'Equipamiento de pesca deportiva sin rival con 20 carretes personalizados Shimano Talica y silla de pelea profesional frente al Finisterra.',
      labelEn: '20 Shimano Reels',
      labelEs: '20 Shimano'
    },
    {
      src: '/yachts/sovereign/sovereign-4.jpg',
      titleEn: 'Shaded Aft Deck Dining & Lounge Next to the Sportfishing Cockpit',
      titleEs: 'Comedor y Sala Sombreada en Popa Junto al Área de Pesca Deportiva',
      descEn: 'Watch the fishing action in complete luxury from plush aft deck seating with chilled champagne service.',
      descEs: 'Observa la acción de pesca con absoluto lujo desde los sillones de popa con servicio de champaña bien fría.',
      labelEn: 'Aft Deck',
      labelEs: 'Cubierta Popa'
    },
    {
      src: '/yachts/sovereign/sovereign-8.jpg',
      titleEn: 'Expansive Flybridge Deck with Triple Helm Chairs & Skylight',
      titleEs: 'Amplia Cubierta Superior Flybridge con Triple Silla de Mando y Domo',
      descEn: 'Outfitted with Furuno NavNet TZtouch2, 6ft Array Radar, Sonos surround audio, and custom teak dining tables.',
      descEs: 'Equipada con Furuno NavNet TZtouch2, Radar de 6 pies, sonido envolvente Sonos y mesas de teca.',
      labelEn: 'Flybridge',
      labelEs: 'Flybridge'
    },
    {
      src: '/yachts/sovereign/sovereign-1.jpg',
      titleEn: 'Illuminated Teak Foredeck & Bow Sunpad Facing Land’s End',
      titleEs: 'Proa Iluminada en Teca y Asoleadero Frente a las Rocas del Finisterra',
      descEn: 'Elevated bow sunbathing lounge accessed by illuminated teak steps with panoramic views of Cabo’s coastline.',
      descEs: 'Asoleadero elevado en proa con escalones iluminados en teca y vistas panorámicas a los acantilados de Cabo.',
      labelEn: 'Bow Sunpad',
      labelEs: 'Asoleadero Proa'
    },
    {
      src: '/yachts/sovereign/sovereign-7.jpg',
      titleEn: 'Floating Ocean Pool, Sea-Doo Spark & 18ft Fiberglass Runabout Tender',
      titleEs: 'Alberca Flotante, Sea-Doo Spark y Tender de 18ft con Motor Yamaha 150 HP',
      descEn: 'Includes two 2018 Sea-Doo Sparks, floating sea pool, and an 18ft fiberglass runabout powered by a Yamaha 150 HP 4-stroke.',
      descEs: 'Incluye dos motos acuáticas Sea-Doo Spark, alberca flotante en el mar y lancha auxiliar de 18 pies con motor Yamaha 150 HP.',
      labelEn: 'Tender & Toys',
      labelEs: 'Tender y Jetskis'
    },
    {
      src: '/yachts/sovereign/sovereign-5.jpg',
      titleEn: 'Wide Walk-Around Teak Side Deck Overlooking Lover’s Beach',
      titleEs: 'Amplio Pasillo Lateral en Teca Frente a Playa del Amor',
      descEn: 'Impeccable 2018 refit craftsmanship with wide walk-around teak decks and stationary side deck security cameras.',
      descEs: 'Acabados impecables de su remodelación total con amplios pasillos de teca y cámaras de monitoreo Maretron.',
      labelEn: 'Side Deck',
      labelEs: 'Pasillo Teca'
    },
    {
      src: '/yachts/sovereign/sovereign-15.jpg',
      titleEn: 'Forward Bow Pulpit, Teak Steps & Chrome Ship’s Bell',
      titleEs: 'Púlpito de Proa, Escalones de Teca y Campana Náutica en Cromo',
      descEn: 'Commanding bow vantage point ideal for dolphin watching and sunset photography on the Pacific and Sea of Cortez.',
      descEs: 'Punto panorámico en la punta de proa ideal para avistar delfines, ballenas y fotografiar el atardecer.',
      labelEn: 'Bow Pulpit',
      labelEs: 'Punta Proa'
    },
    {
      src: '/yachts/sovereign/sovereign-14.jpg',
      titleEn: 'Contemporary Open-Plan Main Salon & Full Wet Bar',
      titleEs: 'Salón Principal Contemporáneo de Concepto Abierto y Wet Bar Completo',
      descEn: 'Completely rebuilt interior featuring wrap-around plush sofas, marble bar, 65" flat-screen lift TV, and Sonos audio.',
      descEs: 'Interior totalmente reconstruido con sofás envolventes, barra de mármol, pantalla retráctil de 65" y audio Sonos.',
      labelEn: 'Main Salon',
      labelEs: 'Salón Principal'
    },
    {
      src: '/yachts/sovereign/sovereign-13.jpg',
      titleEn: 'Spacious Salon & Indoor Dining Opening Directly to the Ocean',
      titleEs: 'Amplio Salón y Comedor Interior con Apertura Directa Hacia el Mar',
      descEn: 'Floor-to-ceiling sliding glass doors seamlessly connect the air-conditioned salon and bar with the aft deck.',
      descEs: 'Puertas corredizas de piso a techo conectan el salón climatizado y el bar directamente con la terraza de popa.',
      labelEn: 'Salon & Bar',
      labelEs: 'Salón y Bar'
    },
    {
      src: '/yachts/sovereign/sovereign-16.jpg',
      titleEn: 'Formal Dining Table for 10 with Backlit Onyx Feature Wall',
      titleEs: 'Comedor Formal para 10 Personas con Muro de Ónix Retroiluminado',
      descEn: 'Exquisite formal dining room accented by natural backlit onyx stone, custom woodwork, and oceanfront windows.',
      descEs: 'Exquisito comedor formal realzado por piedra de ónix retroiluminada, ebanistería fina y ventanales al océano.',
      labelEn: 'Onyx Dining',
      labelEs: 'Comedor Ónix'
    },
    {
      src: '/yachts/sovereign/sovereign-11.jpg',
      titleEn: 'Chef’s Gourmet Galley with Granite Island & Ocean Views',
      titleEs: 'Cocina Gourmet del Chef con Isla de Granito y Vista al Mar',
      descEn: 'Residential-scale galley outfitted with granite countertops, stainless steel appliances, and ocean-view windows.',
      descEs: 'Cocina de escala residencial equipada con isla de granito, electrodomésticos de acero inoxidable y vista al mar.',
      labelEn: 'Chef Galley',
      labelEs: 'Cocina Chef'
    },
    {
      src: '/yachts/sovereign/sovereign-12.jpg',
      titleEn: 'VIP King Stateroom Suite with Contemporary Woodwork',
      titleEs: 'Suite VIP con Cama King y Acabados Contemporáneos en Madera',
      descEn: 'Sovereign accommodates 10 overnight guests across 5 luxurious cabins (1 VIP King, 2 Queen, and 2 Twin cabins).',
      descEs: 'Sovereign aloja a 10 huéspedes de pernocta en 5 cabinas de lujo (1 VIP King, 2 Queen y 2 Twin más literas Pullman).',
      labelEn: 'VIP King Suite',
      labelEs: 'Suite VIP King'
    },
    {
      src: '/yachts/sovereign/sovereign-10.jpg',
      titleEn: 'Lower Deck Hardwood Companionway & Guest Staterooms',
      titleEs: 'Pasillo Inferior en Madera Fina y Acceso a Camarotes de Invitados',
      descEn: 'Handcrafted hardwood spiral staircase and companionway leading to the private air-conditioned guest suites.',
      descEs: 'Escalera artesanal de madera y pasillo inferior que conduce a las suites climatizadas para invitados.',
      labelEn: 'Guest Cabins',
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

    const emailSubject = `NUEVA CONSULTA DE YATE: Sovereign 130ft - ${inquireData.firstName} ${inquireData.lastName}`;
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: #0f172a; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Ballard Tours • Private Yacht Charters</h1>
            <p style="color: #0284c7; margin: 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">130ft Sovereign Yachts "Sovereign"</p>
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
            Solicitud generada a través de caboprivateairporttransfers.com / Sovereign 130ft
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
          yachtName: '130ft Sovereign Yachts Sovereign',
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
      id: `yacht-sovereign-${Date.now()}`,
      titulo: isEs ? `Chárter en Superyate Sovereign 130ft (${paqueteSeleccionado.nameEs})` : `Sovereign 130ft Superyacht Charter (${paqueteSeleccionado.nameEn})`,
      subtitulo: isEs
        ? `${totalHuespedes} Pasajeros | ${paqueteSeleccionado.hours} Horas${horasExtras > 0 ? ` + ${horasExtras}h extra` : ''} | Fecha: ${charterFecha || 'Por confirmar'}${incluirTransporte ? ` | Con Traslado VIP desde ${busquedaOrigen}` : ''}`
        : `${totalHuespedes} Guests | ${paqueteSeleccionado.hours} Hours${horasExtras > 0 ? ` + ${horasExtras}h extra` : ''} | Date: ${charterFecha || 'To be confirmed'}${incluirTransporte ? ` | VIP Round-Trip Transfer from ${busquedaOrigen}` : ''}`,
      precio: granTotalYate,
      tipoEspecial: 'yacht',
      config: {
        yachtName: 'Sovereign 130ft Sovereign Yachts',
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
      ? `Hola Ballard Tours, deseo consultar disponibilidad para el Superyate Sovereign 130ft.\n- Paquete: ${paqueteSeleccionado.nameEs} ($${paqueteSeleccionado.price.toLocaleString()} USD)\n- Huéspedes: ${totalHuespedes}\n- Fecha estimada: ${charterFecha || 'Por coordinar'}\n- Horas extras: ${horasExtras}\n- Traslado terrestre: ${incluirTransporte ? `SÍ (${busquedaOrigen || 'Hotel'})` : 'NO'}\n- Cotización estimada: $${granTotalYate.toLocaleString()} USD.\n¿Me pueden confirmar horarios y detalles?`
      : `Hello Ballard Tours, I would like to check availability for the 130ft Sovereign Yachts "Sovereign".\n- Package: ${paqueteSeleccionado.nameEn} ($${paqueteSeleccionado.price.toLocaleString()} USD)\n- Guests: ${totalHuespedes}\n- Target Date: ${charterFecha || 'TBD'}\n- Extra hours: ${horasExtras}\n- Ground Transfer: ${incluirTransporte ? `YES (${busquedaOrigen || 'Hotel'})` : 'NO'}\n- Estimated Quote: $${granTotalYate.toLocaleString()} USD.\nPlease let me know availability.`
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">

      {/* ======================================================== */}
      {/* HERO BANNER - TEMA CLARO Y ELEGANTE                      */}
      {/* ======================================================== */}
      <div className="relative pt-28 pb-14 md:pt-32 md:pb-16 px-4 bg-gradient-to-b from-blue-50/80 via-white to-slate-50 border-b border-slate-200/90 mb-10 overflow-hidden">

        <div className="relative max-w-5xl mx-auto text-center z-10">

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
              <span className="text-blue-900 font-extrabold">130ft Sovereign Yachts "Sovereign"</span>
            </div>

            <div className="flex justify-center items-center gap-4 mb-3 text-slate-400">
              <Ship size={24} className="text-blue-900" />
              <span className="border-t border-dashed border-slate-300 w-16"></span>
              <MapPin size={24} className="text-amber-500" />
            </div>

            {/* Título Principal H1 con palabras clave SEO */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-tight text-slate-900">
              {isEs
                ? 'Sovereign – Superyate de Lujo y Pesca Deportiva de 130 Pies en Cabo San Lucas'
                : 'Sovereign – 130 Ft Luxury Superyacht & Sportfishing Charter in Cabo San Lucas'
              }
            </h1>

            <HeroReviewsBadge lang={lang} />

            <p className="text-base sm:text-lg md:text-xl text-blue-900 font-extrabold mt-3 max-w-3xl mx-auto leading-relaxed">
              {isEs
                ? 'Un Superyate de Crucero de 130 Pies y Pescador Deportivo de Torneo en Uno Solo.'
                : 'A 130-Foot Luxury Cruising Superyacht and Tournament Sportfisher in One.'
              }
            </p>

            <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl mx-auto leading-relaxed font-normal">
              {isEs
                ? 'El superyate de lujo SOVEREIGN de 130 pies fue totalmente reconstruido en 2018 con interiores, electrónica, cubiertas y sala de máquinas completamente nuevos; básicamente es un yate nuevo. Con un espacio increíble, diseño contemporáneo, estabilizadores Zero-Speed, 20 carretes personalizados Shimano Talica, silla de pelea profesional, 2 Sea-Doo Sparks y lancha rápida de 18 pies, ofrece la máxima experiencia en Cabo San Lucas para hasta 25 invitados.'
                : 'The 130ft SOVEREIGN luxury yacht was totally rebuilt in 2018 with all-new interior, electronics, decks, and engine room upgrades—basically she is a brand-new superyacht. Featuring incredible space, a contemporary and comfortable interior, Zero-Speed stabilizers, 20 Custom Talica Shimano reels, a professional fighting chair, 2 Sea-Doo Sparks, and an 18ft fiberglass runabout, she is a luxury sportfisher and cruising yacht in one.'
              }
            </p>
          </div>

          {/* Selector de Galería de Fotos Reales con Visor Grande */}
          <div className="mt-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4 text-xs text-slate-600">
              <span className="font-extrabold flex items-center gap-1.5 text-sm sm:text-base text-slate-900">
                <CameraIcon size={18} className="text-blue-600" />
                {isEs ? 'Fotos Reales del Superyate Sovereign 130ft' : 'Real 130ft Sovereign Yacht Photos'}
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
                    ? `Sovereign 130ft superyate de lujo y pesca deportiva en Cabo San Lucas México - ${fotosGaleria[fotoActiva].titleEs}`
                    : `Sovereign 130ft luxury superyacht and sportfishing charter in Cabo San Lucas Mexico - ${fotosGaleria[fotoActiva].titleEn}`
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

            {/* MINIATURAS INTERACTIVAS (16 FOTOS REALES DEL SOVEREIGN) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-16 gap-1.5 sm:gap-2">
              {fotosGaleria.map((foto, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFotoActiva(idx)}
                  className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${fotoActiva === idx
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
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Eslora / Refit' : 'Length & Refit'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">130 Ft Sovereign</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Users className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Capacidad Día' : 'Day Capacity'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? 'Hasta 25 Personas' : 'Up to 25 Guests'}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Anchor className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Pesca de Torneo' : 'Tournament Tackle'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">20 Talica Shimano</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Waves className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Tender y Jetskis' : 'Tender & Jet Skis'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">18ft Boat + 2 Sea-Doos</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <Sparkles className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Camarotes' : 'Accommodations'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">{isEs ? '5 Suites (10 Noche)' : '5 Suites (10 Sleep)'}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center hover:shadow-md transition">
            <MapPin className="text-blue-900 mb-2" size={24} />
            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{isEs ? 'Punto de Salida' : 'Departure Point'}</p>
            <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">Marina Cabo San Lucas</p>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SECCIÓN DE PAQUETES (3 PAQUETES FIELES AL SCREENSHOT)    */}
      {/* ======================================================== */}
      <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-28">

        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <Anchor size={14} />
            {isEs ? 'Paquetes de Chárter en Los Cabos' : 'All-Inclusive Superyacht Packages'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isEs ? 'Paquetes Exclusivos Todo Incluido' : 'Packages'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {isEs
              ? 'Tarifas base para hasta 10 invitados. Permite hasta 15 huéspedes extra a bordo ($300 USD c/u, 25 personas máx.).'
              : 'Base rates for up to 10 guests. Allows up to 15 extra guests on board ($300 USD each, 25 guests max).'
            }
          </p>
        </div>

        {/* Rejilla de 3 Tarjetas de Paquetes centradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {paquetes.map((pkg) => {
            const esSeleccionado = paqueteSeleccionado.id === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => setPaqueteSeleccionado(pkg)}
                className={`relative rounded-2xl bg-white text-slate-900 border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${esSeleccionado
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

                {/* Header Azul del Paquete */}
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
                      <Check size={18} className="text-emerald-600 stroke-[3]" />
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
                      className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition text-center border ${esSeleccionado
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

        {/* Nota de Huéspedes Adicionales idéntica al screenshot */}
        <p className="text-center text-xs sm:text-sm text-slate-600 italic mt-8 max-w-3xl mx-auto">
          {isEs
            ? 'Esta embarcación permite hasta 15 huéspedes extra a bordo; cada huésped adicional tiene un cargo de $300 USD + Impuestos. Impuesto mexicano del 16% (IVA) no incluido.'
            : 'This boat allows for 15 extra guests on board; each extra guest is charged $300 + Tax. Mexican Sales Tax of 16% not included.'
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
                {isEs ? 'Configura tu Chárter en el Sovereign 130ft' : 'Configure Your Sovereign 130ft Charter'}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {isEs
                  ? 'Añade invitados adicionales (hasta 15 extra / 25 total), horas extras y servicio de traslado privado ida y vuelta desde tu resort.'
                  : 'Add extra guests (up to 15 extra / 25 total), additional charter hours, and round-trip private resort ground transfers.'
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

          {/* 3 COLUMNAS DEL CONFIGURADOR */}
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

            {/* 2. Selector de Huéspedes Totales (Máx 25: 10 base + 15 extra) */}
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
                  onClick={() => setTotalHuespedes(prev => Math.min(25, prev + 1))}
                  disabled={totalHuespedes >= 25}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition font-bold shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Increase Guests"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 font-medium min-h-[32px] leading-tight">
                {isEs
                  ? 'Tarifa cubre 10 personas. De 11 a 25 suma $300 USD c/u (15 extra máx).'
                  : 'Rate covers 10 guests. From 11 to 25 adds $300 USD each (15 extra max).'
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
                    : `$${PRECIO_HORA_EXTRA.toLocaleString()} USD/hr`}
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
                  ? `Agrega las horas extras que desees ($${PRECIO_HORA_EXTRA.toLocaleString()} USD por hora).`
                  : `Add as many extra hours as you want ($${PRECIO_HORA_EXTRA.toLocaleString()} USD per hour).`
                }
              </p>
            </div>

          </div>

          {/* MÓDULO DE TRANSPORTE TERRESTRE OPCIONAL */}
          <div className={`border-2 rounded-2xl p-5 sm:p-6 mb-8 transition-all duration-300 ${incluirTransporte ? 'bg-blue-50/80 border-blue-300 shadow-sm' : 'bg-slate-50/70 border-slate-200'
            }`}>
            <div
              onClick={() => setIncluirTransporte(prev => !prev)}
              className="flex items-start justify-between gap-4 cursor-pointer select-none"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-colors ${incluirTransporte ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                  <Car size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {isEs ? '¿Deseas agregar Transportación Terrestre Privada VIP?' : 'Add VIP Private Round-Trip Ground Transportation?'}
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${incluirTransporte ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
                      }`}>
                      {incluirTransporte ? (isEs ? '✓ Activo' : '✓ Active') : (isEs ? 'Opcional' : 'Optional')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {isEs
                      ? 'Traslado exclusivo ida y vuelta desde tu hotel o villa a la Marina de Cabo San Lucas en Suburban o Sprinter de lujo. Horario 100% flexible sin tiempo límite.'
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
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${incluirTransporte ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                role="switch"
                aria-checked={incluirTransporte}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${incluirTransporte ? 'translate-x-7' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {incluirTransporte && (
              <div className="pt-5 mt-5 border-t border-blue-200/80 grid grid-cols-1 md:grid-cols-3 gap-4">

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
                {isEs ? '* Impuestos mexicanos (16% IVA) no incluidos.' : '* Mexican Sales Tax (16%) not included.'}
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
      {/* DESCRIPCIÓN Y ESPECIFICACIONES COMPLETAS (TEMA CLARO)     */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        {/* FILA 1: DETALLES DE LUJO Y EQUIPAMIENTO DEPORTIVO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">

          {/* Columna Izquierda: Descripción, Reconstrucción 2018, Alojamientos y Pesca */}
          <div className="lg:col-span-7 space-y-8">

            {/* Sección 1: Descripción General */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3">
                <Anchor size={14} />
                {isEs ? 'Descripción del Superyate' : 'Description'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">
                {isEs
                  ? '130 Pies de Lujo Contemporáneo y Pesca Deportiva de Torneo en Uno Solo'
                  : '130ft Luxury Sport Fisher and Cruising Superyacht in One'
                }
              </h2>

              <div className="prose prose-slate text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  {isEs
                    ? 'El superyate de lujo SOVEREIGN de 130 pies fue totalmente reconstruido en 2018 con interiores, electrónica de navegación, cubiertas de teca y mejoras en la sala de máquinas completamente nuevos; básicamente es un yate flamante. Ofrece un espacio increíble con un diseño interior contemporáneo y sumamente confortable. Es un pescador deportivo de lujo y un superyate de crucero en una sola embarcación.'
                    : 'The 130ft SOVEREIGN Luxury yacht was totally rebuilt in 2018 with all new interior, electronics, decks, engine room upgrades, basically she is a brand new yacht. Incredible space, contemporary and comfortable interior. This is a luxury sport fisher and cruising yacht in one.'
                  }
                </p>

                <p>
                  {isEs
                    ? 'Con capacidad para alojar cómodamente a 10 huéspedes de pernocta en 5 lujosas cabinas (1 Suite VIP con cama King, 2 cabinas con cama Queen y 2 cabinas con camas individuales Twin, más 1 litera Pullman superior y 1 inferior) y recibir hasta 25 invitados en chárters de día (10 base + 15 extra), Sovereign representa la cúspide de la navegación privada en Cabo San Lucas.'
                    : 'Accommodating 10 overnight guests across five luxurious cabins (1 VIP King, 2 Queen, and 2 Twin bed cabins, plus 1 Upper Pullman and 1 Lower) and up to 25 guests for private day charters (10 base + 15 extra), Sovereign represents the pinnacle of private yachting in Cabo San Lucas.'
                  }
                </p>
              </div>
            </section>

            {/* Sección 2: Interiores Contemporáneos, Ónix Retroiluminado y Entretenimiento */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Sparkles size={14} />
                {isEs ? 'Remodelación Integral y Tecnología' : '2018 Complete Refit & Onboard Technology'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs ? 'Salón Panorámico, Comedor de Ónix y Estabilizadores Zero-Speed' : 'Panoramic Salon, Backlit Onyx Dining & Zero-Speed Stabilizers'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'El salón principal de concepto abierto cuenta con puertas corredizas de cristal de piso a techo que conectan el wet bar de mármol y la sala directamente con la cubierta de popa. Su comedor formal destaca por un impresionante muro de piedra de ónix retroiluminado, mientras que su cocina (galley) de escala residencial cuenta con isla central de granito y vista panorámica al océano.'
                  : 'The open-plan main salon features floor-to-ceiling sliding glass doors that seamlessly connect the full marble wet bar and plush lounge with the aft deck. Her formal dining room showcases a striking backlit onyx stone wall, while the residential-scale chef’s galley boasts a central granite island and panoramic ocean views.'
                }
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Para el máximo confort tanto navegando como fondeado en bahías como Chileno o Santa María, Sovereign está equipado con estabilizadores Zero-Speed, sistema de sonido envolvente Sonos, pantallas planas retráctiles (Lift TV) de 65 pulgadas en el salón y cubierta superior, TV satelital Intellian, e iluminación y audio inteligentes en toda la embarcación.'
                  : 'For unmatched comfort both underway and at anchor in Santa María or Chileno Bay, Sovereign is outfitted with Zero-Speed stabilizers, a Sonos surround sound system, 65-inch flat-screen lift TVs in both the salon and upper deck, Intellian Satellite TV, and integrated lighting and audio control throughout the vessel.'
                }
              </p>
            </section>

            {/* Sección 3: Chárter de Pesca Deportiva de Torneo y Juguetes Acuáticos */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Waves size={14} />
                {isEs ? 'Pesca de Altura Nivel Torneo y Aventura' : 'Tournament-Grade Sportfishing & Water Toys'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isEs ? '20 Carretes Shimano Talica, Silla de Pelea, 2 Sea-Doos y Lancha de 18ft' : '20 Custom Talica Shimano Reels, Fighting Chair, 2 Sea-Doos & 18ft Runabout'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'A diferencia de cualquier otro superyate de 130 pies en México, Sovereign posee un cockpit de pesca deportiva de nivel profesional equipado con 20 carretes personalizados Shimano Talica, silla de pelea profesional, sonar a color Furuno, sondas de pesca Furuno y radar de matriz abierta de 6 pies con ARPA. Puedes salir en busca de marlín azul, marlín rayado, atún aleta amarilla, dorado y wahoo disfrutando de las comodidades de un megayate.'
                  : 'Unlike any other 130-foot superyacht in Mexico, Sovereign features a tournament-grade sportfishing cockpit armed with 20 Custom Talica Shimano reels, a professional fighting chair, Furuno Colour Sonar, Furuno Fish Finder color sounders, and a 6-foot array radar with ARPA. Target blue marlin, striped marlin, yellowfin tuna, dorado, and wahoo while enjoying superyacht luxury.'
                }
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {isEs
                  ? 'Además, incluye una embarcación auxiliar (Runabout) de fibra de vidrio de 18 pies con motor Yamaha de 150 HP de 4 tiempos (equipada con sonda Lowrance, GPS y audio), dos motos acuáticas Sea-Doo Spark y alberca flotante en el mar.'
                  : 'For water sports and coastal exploration, Sovereign carries an 18-foot fiberglass runabout tender powered by a Yamaha 150 HP 4-stroke engine (with Lowrance depth sounder, GPS, charting navigation, and AV), two Sea-Doo Spark wave runners, and a floating ocean pool.'
                }
              </p>
            </section>

          </div>

          {/* Columna Derecha: Yacht Highlights (Fishing Gear & Boat Features) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Tarjeta de Yacht Highlights */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">
                <Waves size={16} />
                {isEs ? 'Especificaciones Oficiales' : 'Official Specifications'}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {isEs ? 'Yacht Highlights' : 'Yacht Highlights'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {isEs
                  ? 'Equipamiento completo de pesca deportiva de torneo, electrónica Furuno de última generación y amenidades de superyate reconstruidas en 2018.'
                  : 'Tournament-class sportfishing arsenal, state-of-the-art Furuno navigation electronics, and luxury superyacht amenities rebuilt in 2018.'
                }
              </p>

              {/* BLOQUE 1: FISHING GEAR */}
              <div className="mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                  <Anchor size={15} />
                  {isEs ? 'Equipo de Pesca (Fishing Gear)' : 'Fishing Gear'}
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 flex items-center gap-2.5 text-blue-950 font-bold">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>20 Custom Talica Shimano Reels</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Professional Fighting Chair</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Furuno Colour Sonar</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Furuno Fish Finder Color Sounders</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Yamaha 150 HP 4 Stroke / Lowrance Depth Sounder, GPS, Charting Navigation and AV</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Furuno Satellite Compass and GPS</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Furuno Nav Net TZ Touch BB2</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 font-medium">
                    <CheckCircle size={16} className="text-blue-900 shrink-0" />
                    <span>Furuno 6′ Array Radar BB with ARPA</span>
                  </div>
                </div>
              </div>

              {/* BLOQUE 2: BOAT FEATURES */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                  <Ship size={15} />
                  {isEs ? 'Características del Barco (Boat Features)' : 'Boat Features'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>2018 Complete Refit</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>Zero Speed Stabilizer</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium sm:col-span-2">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>Cabins (VIP 1 King, 2 Queen & 2 Twin Bed + 1 Upper & 1 Lower Pullman)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>2 2018 Sea-Doo Spark</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>18ft Fiberglass Runabout</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>Sonos Surround System</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>Intellian Satellite TV</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium sm:col-span-2">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>65″ Flat Screen Lift TV (Salon & Upper Deck)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium sm:col-span-2">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>Control Lighting & Audio throughout Vessel</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-slate-700 font-medium sm:col-span-2">
                    <CheckCircle size={15} className="text-blue-900 shrink-0" />
                    <span>Maretron Onboard Monitoring, Furuno Auto Pilots & 7 Security Cameras</span>
                  </div>
                </div>
              </div>

              {/* Banner de Salida en Marina */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
                <MapPin className="text-blue-900 shrink-0" size={20} />
                <div>
                  <span className="font-bold text-slate-900 block">{isEs ? 'Muelle Exclusivo en Marina Cabo San Lucas' : 'Exclusive Slip in Cabo San Lucas Marina'}</span>
                  <span>{isEs ? 'Acceso VIP directo sin filas. Capacidad para hasta 25 invitados.' : 'Direct VIP gate embarkation for up to 25 charter guests.'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* FILA 2: EXPERIENCIAS DE SUPERYATE Y PESCA DE ALTURA */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
              <Compass size={14} />
              {isEs ? 'Doble Experiencia en Cabo San Lucas' : 'Dual Superyacht & Sportfishing Experience'}
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              {isEs
                ? 'Crucero en Megayate de 130 Pies y Pesca de Altura de Torneo en un Mismo Viaje'
                : '130ft Megayacht Cruising & Tournament Offshore Fishing in One Charter'
              }
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
              {isEs
                ? 'Sovereign es la única embarcación de 130 pies en Los Cabos que permite combinar un chárter de superyate para hasta 25 invitados con pesca deportiva profesional usando 20 cañas Shimano Talica, silla de pelea, motos acuáticas Sea-Doo Spark y alberca flotante.'
                : 'Sovereign is the premier 130-foot vessel in Los Cabos engineered to combine a 25-guest luxury superyacht charter with tournament-level offshore sportfishing featuring 20 Custom Talica Shimano setups, a professional fighting chair, Sea-Doo Sparks, and a floating ocean pool.'
              }
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  01
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'Pesca con 20 Shimano Talica' : '20 Talica Shimano Reels'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Silla de pelea profesional y sonar Furuno a color para marlín, atún y dorado.' : 'Professional fighting chair and Furuno colour sonar for marlin, tuna, and dorado.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  02
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? '2 Sea-Doo Sparks & Pool' : '2 Sea-Doos & Sea Pool'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Diversión en bahías tranquilas con 2 motos acuáticas y alberca flotante.' : '2 Sea-Doo Spark wave runners, floating ocean pool, and 18ft Runabout tender.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  03
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'Estabilizadores Zero-Speed' : 'Zero-Speed Stabilizers'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Estabilidad total tanto navegando en altamar como fondeado frente a la playa.' : 'Maximum stability both underway offshore and while anchored in calm bays.'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center mb-2 font-bold text-xs">
                  04
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {isEs ? 'Gastronomía y Barra Libre' : 'Chef Dining & Open Bar'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isEs ? 'Menú personalizado por nuestro chef en el comedor de ónix o en cubierta.' : 'Custom chef-prepared meals served in the backlit onyx dining room or al fresco.'}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* FILA 3: CTA - RESERVA TU EXPERIENCIA EN EL SOVEREIGN 130FT */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 sm:p-12 text-center shadow-md relative overflow-hidden mb-16">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-bold text-blue-900 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {isEs ? 'Reserva Exclusiva' : 'Book Your 130ft Superyacht Charter in Los Cabos'}
            </span>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-4 mb-4 tracking-tight">
              {isEs
                ? 'Vive la Máxima Experiencia en Cabo San Lucas a Bordo del Sovereign 130ft'
                : 'Book Your Private Charter Aboard the 130ft Sovereign in Cabo San Lucas'
              }
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              {isEs
                ? 'Ya sea para una celebración familiar o corporativa de hasta 25 invitados, un día de lujo frente al Arco o una expedición de pesca de altura con confort de megayate, Sovereign de 130 pies ofrece una experiencia inigualable en Baja California Sur.'
                : 'Whether you are planning a luxury group celebration for up to 25 guests, an all-inclusive cruise past Land’s End, or a tournament-level offshore fishing expedition in superyacht comfort, the 130ft Sovereign delivers an extraordinary day at sea.'
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
      {/* SECCIÓN SEO FAQ ESPECÍFICA PARA SOVEREIGN 130FT          */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase mb-2 border border-blue-200">
            <Info size={14} />
            {isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isEs ? 'Preguntas Frecuentes sobre el Superyate Sovereign 130ft' : 'Frequently Asked Questions About the 130ft Sovereign Yacht'}
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            {isEs
              ? 'Todo lo que necesitas saber para reservar el superyate Sovereign de 130 pies en Cabo San Lucas'
              : 'Everything you need to know about chartering the 130ft Sovereign superyacht and sportfisher'
            }
          </p>
        </div>

        <div className="space-y-4">

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Cuántos pasajeros admite el superyate Sovereign de 130 pies?' : 'How many guests can the 130ft Sovereign yacht accommodate?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Las tarifas base de los paquetes incluyen hasta 10 invitados, y la embarcación permite hasta 15 huéspedes adicionales a bordo ($300 USD + IVA cada uno), alcanzando una capacidad máxima de 25 invitados en chárters de día y 10 huéspedes en pernocta.'
                : 'Package base rates include 10 guests, and Sovereign allows up to 15 extra guests on board ($300 USD + Tax each), for a total capacity of up to 25 day charter guests and 10 overnight sleeping guests.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué hace único al Sovereign 130ft frente a otros yates en Los Cabos?' : 'What makes the 130ft Sovereign unique among Cabo yachts?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Sovereign fue totalmente reconstruido en 2018 y combina las dimensiones de un megayate de 130 pies (con estabilizadores Zero-Speed, comedor de ónix, 5 suites y sonido Sonos) con un cockpit profesional de pesca deportiva equipado con 20 carretes Shimano Talica, silla de pelea, sonar Furuno a color, 2 Sea-Doo Sparks y una lancha auxiliar de 18 pies.'
                : 'Completely rebuilt in 2018, Sovereign combines 130-foot megayacht luxury (Zero-Speed stabilizers, backlit onyx dining room, 5 staterooms, and Sonos surround sound) with a tournament sportfishing cockpit featuring 20 Custom Talica Shimano reels, a fighting chair, Furuno colour sonar, 2 Sea-Doo Sparks, and an 18ft fiberglass runabout.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Qué incluyen los paquetes Todo Incluido del Sovereign?' : 'What is included in Sovereign’s All-Inclusive packages?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Todos los paquetes (4, 6 y 8 horas) incluyen bocadillos gourmet (appetizers), barra libre de bebidas (beverages), selección de menú personalizado preparado a bordo por el chef (custom meal selection), tripulación completa, juguetes acuáticos y equipo de pesca.'
                : 'All 4, 6, and 8-hour packages include gourmet appetizers, open-bar beverages, custom meal selection prepared fresh onboard, full professional crew, water toys, and tournament fishing gear.'
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-sm shadow-xs">
            <h4 className="font-bold text-slate-900 mb-2 text-base">
              {isEs ? '¿Cómo están distribuidos los camarotes del Sovereign?' : 'What is the cabin layout aboard the 130ft Sovereign?'}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isEs
                ? 'Sovereign cuenta con 5 cabinas de lujo para alojar a 10 huéspedes: 1 Suite VIP con cama King, 2 cabinas con cama Queen y 2 cabinas con camas Twin, además de 1 litera Pullman superior y 1 inferior.'
                : 'Sovereign features 5 luxurious staterooms accommodating 10 guests: 1 VIP King cabin, 2 Queen cabins, and 2 Twin-bed cabins, plus 1 Upper Pullman and 1 Lower Pullman berth.'
              }
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SIMILAR BOATS (SUGERENCIAS DE LOS OTROS DOS YATES)        */}
      {/* ======================================================== */}
      <div className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black text-[#003865] text-center mb-10 tracking-tight">
            {isEs ? 'Barcos Similares' : 'Similar Boats'}
          </h3>

          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
            {/* Yate 1: 116 ft Capella */}
            <Link
              href={`/${lang}/cabo-yacht-charters`}
              className="group block text-center"
            >
              <div className="aspect-square w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
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

            {/* Yate 2: 85 ft Contessa */}
            <Link
              href={`/${lang}/cabo-yacht-charters-contessa`}
              className="group block text-center"
            >
              <div className="aspect-square w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-md border border-slate-200/80 mb-4 bg-slate-100">
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
                    ? `Gracias ${inquireData.firstName}. Nuestro equipo VIP concierge de Ballard Tours se comunicará contigo a la brevedad para confirmar disponibilidad y los detalles de tu chárter en el Sovereign 130ft.`
                    : `Thank you ${inquireData.firstName}. Our VIP concierge team at Ballard Tours will get in touch with you shortly to confirm availability and itinerary details aboard the 130ft Sovereign.`
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
                    130ft Sovereign Yachts "Sovereign"
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
                    {isEs
                      ? 'Si estás interesado en reservar este superyate o deseas más información por favor déjanos un mensaje aquí'
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
                130ft Sovereign Yachts "Sovereign"
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

