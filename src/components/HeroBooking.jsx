// src/components/HeroBooking.jsx
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin, Car, Users, PlaneLanding, PlaneTakeoff, RefreshCw,
  Compass, ArrowLeft, Clock, ChevronRight, Utensils, Wine, Flag, Briefcase, Heart,
  Plus, Info, AlertCircle, Calendar, Baby, Banknote
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useBooking } from '../context/BookingContext';
import { useCart } from '../context/CartContext';
import TrustBadges from './TrustBadges';
import UrgencyBanner from './UrgencyBanner';
import { catalogoHoteles, toursData } from '../data/seoData';

// Constante de vehículos para el formulario principal
const VEHICULOS = [
  { id: 'suburban', nombre: 'Luxury SUV', maxPax: 6, descripcion: { es: 'Elegancia y confort para familias o grupos pequeños.', en: 'Elegance and comfort for families or small groups.' } },
  { id: 'sprinter', nombre: 'Van', maxPax: 10, descripcion: { es: 'Amplitud y lujo para grupos grandes.', en: 'Spaciousness and luxury for large groups.' } },
];

export default function HeroBooking({ lang = 'es' }) {
  const router = useRouter();
  const { reserva, setReserva, servicioSeleccionado, setServicioSeleccionado, setPaso } = useBooking();
  const { agregarAlCombo } = useCart();

  const [busquedaHotelPrincipal, setBusquedaHotelPrincipal] = useState('');
  const [mostrarDropdownHotelPrincipal, setMostrarDropdownHotelPrincipal] = useState(false);

  // =========================================================
  // 👥 ESTADOS PARA SERVICIOS ESPECIALES
  // =========================================================
  const [vistaEspecial, setVistaEspecial] = useState(null);

  // 🍽️ Estados para Cenas
  const [cenaOrigen, setCenaOrigen] = useState('');
  const [cenaDestino, setCenaDestino] = useState('');
  const [cenaPax, setCenaPax] = useState('1-4');
  const [cenaFecha, setCenaFecha] = useState('');
  const [cenaHora, setCenaHora] = useState('');
  const [cenaHoraReserva, setCenaHoraReserva] = useState('');
  const [cenaHoraRegreso, setCenaHoraRegreso] = useState('');
  const [busquedaCenaOrigen, setBusquedaCenaOrigen] = useState('');
  const [cenaRestauranteNombre, setCenaRestauranteNombre] = useState('');
  const [mostrarDropdownCena, setMostrarDropdownCena] = useState(false);

  // 🏨 Estados para Traslado Hotel a Hotel (hh)
  const [hotelOrigen, setHotelOrigen] = useState('');
  const [hotelDestino, setHotelDestino] = useState('');
  const [hotelPax, setHotelPax] = useState('1-4');
  const [hotelNombre, setHotelNombre] = useState('');
  const [hotelFecha, setHotelFecha] = useState('');
  const [hotelHora, setHotelHora] = useState('');
  const [busquedaHhOrigen, setBusquedaHhOrigen] = useState('');
  const [mostrarDropdownHotelOrigen, setMostrarDropdownHotelOrigen] = useState(false);

  // ⛳ Estados para Golf
  const [golfOrigen, setGolfOrigen] = useState('');
  const [golfDestino, setGolfDestino] = useState('');
  const [golfPax, setGolfPax] = useState('1-4');
  const [golfNombre, setGolfNombre] = useState('');
  const [golfFecha, setGolfFecha] = useState('');
  const [golfHora, setGolfHora] = useState('');
  const [golfHoraReserva, setGolfHoraReserva] = useState('');
  const [golfHoraRegreso, setGolfHoraRegreso] = useState('');
  const [busquedaGolfOrigen, setBusquedaGolfOrigen] = useState('');
  const [mostrarDropdownGolfOrigen, setMostrarDropdownGolfOrigen] = useState(false);

  // 🍸 Estados para Nightlife
  const [nightlifeOrigen, setNightlifeOrigen] = useState('');
  const [nightlifeDestino, setNightlifeDestino] = useState('');
  const [nightlifePax, setNightlifePax] = useState('1-4');
  const [nightlifeFecha, setNightlifeFecha] = useState('');
  const [nightlifeHora, setNightlifeHora] = useState('');
  const [nightlifeHoraReserva, setNightlifeHoraReserva] = useState('');
  const [nightlifeHoraRegreso, setNightlifeHoraRegreso] = useState('');
  const [busquedaNightlifeOrigen, setBusquedaNightlifeOrigen] = useState('');
  const [nightlifeLugarNombre, setNightlifeLugarNombre] = useState('');
  const [mostrarDropdownNightlife, setMostrarDropdownNightlife] = useState(false);

  const SERVICIOS_ESPECIALES = [
    { id: 'cenas', icon: Utensils, titulo: { es: 'Cenas y Restaurantes', en: 'Dinners & Restaurants' }, desc: { es: 'Disfruta tu velada sin preocuparte por el volante.', en: 'Enjoy your evening without worrying about driving.' } },
    { id: 'nightlife', icon: Wine, titulo: { es: 'Nightlife', en: 'Nightlife' }, desc: { es: 'Transporte seguro para disfrutar la vida nocturna de Los Cabos.', en: 'Safe transportation to enjoy Los Cabos nightlife.' } },
    { id: 'hotel', icon: Car, titulo: { es: 'Traslado de Hotel a Hotel', en: 'Hotel to Hotel Transfer' }, desc: { es: 'Cambia de resort con total comodidad y espacio para tu equipaje.', en: 'Change resorts with total comfort and space for your luggage.' } },
    { id: 'golf', icon: Flag, titulo: { es: 'Campos de Golf', en: 'Golf Courses' }, desc: { es: 'Transporte ida y vuelta a los mejores campos de Los Cabos.', en: 'Round trip transportation to the best golf courses in Los Cabos.' } }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserva(prev => ({ ...prev, [name]: value }));
  };

  // =========================================================
  // 🚀 VALIDACIÓN ESTRICTA Y REDIRECCIONAMIENTO POR URL
  // =========================================================
  const avanzarPaso = (servicio) => {

    // Si hace clic en "Tours y Especiales", lo pasamos al Paso 2 PERO sin redirigir por URL
    if (servicio === 'experiencias' || servicio === 'tours') {
      setServicioSeleccionado('tours');
      setPaso(2);
      return; // Detenemos la función aquí para no ir a booking
    }

    // Para transporte regular, validamos que haya llenado el formulario
    if (!reserva.hotelId || !reserva.vehiculo || !reserva.fechaLlegada || !reserva.pasajeros) {
      toast.error(
        lang === 'es'
          ? 'Por favor completa los datos de arriba antes de continuar.'
          : 'Please complete all details above before continuing.'
      );
      return;
    }

    setServicioSeleccionado(servicio);
    setPaso(2); 
    router.push(`/${lang}/booking`);
  };

  // =========================================================
  // ✨ AUTO-LLENADO (PREFILL) DE SERVICIOS ESPECIALES
  // =========================================================
  const handleSeleccionEspecial = (id) => {
    let paxFormat = '1-4';
    const numPax = Number(reserva.pasajeros) || 1;
    if (numPax > 4 && numPax <= 8) paxFormat = '5-8';
    else if (numPax > 8) paxFormat = '9-10';

    const origenVal = reserva.hotelId ? `${reserva.hotelId}|${reserva.zonaId || 1}` : '';
    const busquedaVal = reserva.hotelId ? `${reserva.hotelId} (Zona ${reserva.zonaId || 1})` : '';

    if (id === 'cenas') {
      router.push(`/${lang}/dinners`);
      return;
    } else if (id === 'nightlife') {
      router.push(`/${lang}/nightlife`);
      return;
    } else if (id === 'hotel') {
      router.push(`/${lang}/transfers`);
      return;
    } else if (id === 'golf') {
      router.push(`/${lang}/golf`);
      return;
    }

    setVistaEspecial(id);
  };

  // =========================================================
  // ⏱️ CALCULADORAS DE LÍMITE DE ESPERA
  // =========================================================
  const calculoHorasCena = useMemo(() => {
    if (!cenaHoraReserva || !cenaHoraRegreso) return { error: false, diffMin: 0 };
    const [sH, sM] = cenaHoraReserva.split(':').map(Number);
    const [eH, eM] = cenaHoraRegreso.split(':').map(Number);
    let startMin = sH * 60 + sM; let endMin = eH * 60 + eM;
    if (endMin < startMin) endMin += 24 * 60;
    const diff = endMin - startMin; return { error: diff > 180, diffMin: diff };
  }, [cenaHoraReserva, cenaHoraRegreso]);

  const calculoHorasGolf = useMemo(() => {
    if (!golfHoraReserva || !golfHoraRegreso) return { error: false, diffMin: 0 };
    const [sH, sM] = golfHoraReserva.split(':').map(Number);
    const [eH, eM] = golfHoraRegreso.split(':').map(Number);
    let startMin = sH * 60 + sM; let endMin = eH * 60 + eM;
    if (endMin < startMin) endMin += 24 * 60;
    const diff = endMin - startMin; return { error: diff > 180, diffMin: diff };
  }, [golfHoraReserva, golfHoraRegreso]);

  const calculoHorasNightlife = useMemo(() => {
    if (!nightlifeHoraReserva || !nightlifeHoraRegreso) return { error: false, diffMin: 0 };
    const [sH, sM] = nightlifeHoraReserva.split(':').map(Number);
    const [eH, eM] = nightlifeHoraRegreso.split(':').map(Number);
    let startMin = sH * 60 + sM; let endMin = eH * 60 + eM;
    if (endMin < startMin) endMin += 24 * 60;
    const diff = endMin - startMin; return { error: diff > 240, diffMin: diff };
  }, [nightlifeHoraReserva, nightlifeHoraRegreso]);

  return (
    <div className="relative z-30 max-w-4xl mx-auto px-4 -mt-24 mb-16">
      <UrgencyBanner lang={lang} locationName="Los Cabos" />
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 md:p-10 border border-slate-200/60 transition-all duration-300">

        {servicioSeleccionado === 'tours' ? (
          /* VISTA 4: CATÁLOGO DE TOURS (Si entran desde el form en vez de URL) */
          <div className="animate-fade-in">
            <button
              onClick={() => setServicioSeleccionado('experiencias')}
              className="mb-6 text-slate-500 hover:text-slate-900 font-bold flex items-center text-sm transition-colors group"
            >
              <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" /> {lang === 'es' ? 'Volver a categorías' : 'Back to categories'}
            </button>

            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tighter" style={{ letterSpacing: '-0.03em' }}>
              {lang === 'es' ? 'Elige tu experiencia' : 'Choose your experience'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 pb-4">
              {toursData.filter(t => t.activo).map((tour) => (
                <div
                  key={tour.id}
                  onClick={() => {
                    setReserva(prev => ({ ...prev, tourId: tour.id }));
                    setPaso(2);
                    // Redirigir al Checkout si compran el tour directo desde aquí
                    router.push(`/${lang}/checkout`);
                  }}
                  className="group bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-slate-300 transition-all duration-300 flex flex-col min-h-[400px]"
                >
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 shrink-0">
                    <img src={`/${tour.imagenUrl}`} alt={tour.nombre[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                    <div className="absolute bottom-3 left-3 z-20 bg-white px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 flex items-center shadow-md">
                      <Clock size={14} className="mr-1.5 text-slate-400" /> {tour.duracion[lang]}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                    <h4 className="font-bold text-slate-900 text-xl leading-tight mb-3 tracking-tight group-hover:text-slate-600 transition-colors">{tour.nombre[lang]}</h4>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow font-medium leading-relaxed">
                      {tour.descripcion[lang]}
                    </p>
                    <div className="mt-auto pt-6 flex justify-between items-center border-t border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{lang === 'es' ? 'Precio desde' : 'Price from'}</p>
                        <p className="font-black text-slate-900 text-2xl leading-none">${tour.precioPx} <span className="text-xs text-slate-500 font-bold">USD</span></p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 text-slate-900 transition-colors duration-300">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : servicioSeleccionado === 'especiales' ? (
          /* ========================================================= */
          /* VISTA 3: MENÚ O FORMULARIOS DE SERVICIOS ESPECIALES       */
          /* ========================================================= */
          <div className="animate-fade-in">
            {vistaEspecial === null ? (
              /* PANEL GENERAL DE SERVICIOS ESPECIALES */
              <div>
                <button
                  onClick={() => setServicioSeleccionado('experiencias')}
                  className="mb-8 text-slate-500 hover:text-slate-900 font-bold flex items-center text-sm transition-colors group"
                >
                  <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" /> {lang === 'es' ? 'Volver a Categorías' : 'Back to Categories'}
                </button>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-10 tracking-tighter" style={{ letterSpacing: '-0.03em' }}>
                  {lang === 'es' ? 'Servicios Especiales.' : 'Special Services.'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SERVICIOS_ESPECIALES.map((esp) => {
                    const Icono = esp.icon;
                    const isCenas = esp.id === 'cenas';
                    const isNightlife = esp.id === 'nightlife';
                    const isHotel = esp.id === 'hotel';
                    const isGolf = esp.id === 'golf';
                    
                    if (isCenas || isNightlife || isHotel || isGolf) {
                      const linkHref = isCenas ? `/${lang}/dinners` : isNightlife ? `/${lang}/nightlife` : isHotel ? `/${lang}/transfers` : `/${lang}/golf`;
                      return (
                        <Link
                          key={esp.id}
                          href={linkHref}
                          className="group bg-slate-50 border border-slate-200/60 rounded-[1.5rem] p-6 hover:bg-white hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer flex flex-col min-h-[280px]"
                        >
                          <div className="w-12 h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center mb-6 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                            <Icono size={20} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight tracking-tight">{esp.titulo[lang]}</h4>
                          <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 flex-grow">{esp.desc[lang]}</p>
                          <div className="mt-auto flex items-center justify-between text-slate-400 font-bold text-xs uppercase tracking-widest w-full group-hover:text-slate-900 border-t border-slate-200/60 pt-4 transition-colors">
                            {lang === 'es' ? 'Configurar' : 'Configure'}
                            <ChevronRight size={16} />
                          </div>
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={esp.id}
                        onClick={() => handleSeleccionEspecial(esp.id)}
                        className="group bg-slate-50 border border-slate-200/60 rounded-[1.5rem] p-6 hover:bg-white hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer flex flex-col min-h-[280px]"
                      >
                        <div className="w-12 h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center mb-6 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                          <Icono size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight tracking-tight">{esp.titulo[lang]}</h4>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 flex-grow">{esp.desc[lang]}</p>
                        <div className="mt-auto flex items-center justify-between text-slate-400 font-bold text-xs uppercase tracking-widest w-full group-hover:text-slate-900 border-t border-slate-200/60 pt-4 transition-colors">
                          {lang === 'es' ? 'Configurar' : 'Configure'}
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* SECCIÓN DE FORMULARIOS DETALLADOS DE ESPECIALES */
              <div>


                {/* B. FORMULARIO DE HOTEL A HOTEL */}
                {vistaEspecial === 'hotel' && (
                  <div className="animate-fade-in">
                    <div className="w-full mb-8 flex justify-start">
                      <button onClick={() => { setVistaEspecial(null); setHotelOrigen(''); setHotelDestino(''); setHotelPax('1-4'); setHotelFecha(''); setBusquedaHhOrigen(''); setHotelHora(''); setHotelNombre(''); }} className="text-slate-500 hover:text-slate-900 font-bold flex items-center text-sm transition-colors group">
                        <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" /> {lang === 'es' ? 'Volver a Servicios Especiales' : 'Back to Special Services'}
                      </button>
                    </div>
                    {(() => {
                      const matrizPreciosHotel = {
                        'sjc': { '1': 50, '2': 80, '3': 110, '4': 140 },
                        'csl': { '1': 110, '2': 90, '3': 60, '4': 50 },
                        'corredor': { '1': 80, '2': 60, '3': 70, '4': 90 },
                        'pacifico': { '1': 200, '2': 180, '3': 160, '4': 160 }
                      };
                      const recargoHotel = { '1-4': 0, '5-8': 20, '9-10': 30 };
                      let totalPrecioHotel = 0;
                      if (hotelOrigen && hotelDestino) {
                        const zonaSeleccionada = hotelOrigen.split('|')[1] || "1";
                        const precioBase = Number(matrizPreciosHotel[hotelDestino]?.[zonaSeleccionada] || 0);
                        totalPrecioHotel = precioBase + Number(recargoHotel[hotelPax] || 0);
                      }

                      return (
                        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                          <div className="mb-8 border-b border-slate-100 pb-4">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{lang === 'es' ? 'Traslado entre Hoteles' : 'Hotel to Hotel Transfer'}</h2>
                            <p className="text-sm text-slate-500 font-medium mt-2">{lang === 'es' ? 'Indica tu resort de origen y las especificaciones del hotel de destino.' : 'Specify your current resort and the destination hotel details.'}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col relative md:col-span-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Hotel Origen (Check-out)' : 'Origin Hotel (Check-out)'}</label>
                              <input type="text" placeholder={lang === 'es' ? "Busca tu hotel actual..." : "Search current hotel..."} value={busquedaHhOrigen} onChange={(e) => { setBusquedaHhOrigen(e.target.value); setMostrarDropdownHotelOrigen(true); if (e.target.value === '') setHotelOrigen(''); }} onFocus={() => setMostrarDropdownHotelOrigen(true)} onBlur={() => setTimeout(() => setMostrarDropdownHotelOrigen(false), 200)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              {mostrarDropdownHotelOrigen && (
                                <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 top-[80px] max-h-52 overflow-y-auto custom-scrollbar">
                                  {catalogoHoteles.filter(h => (busquedaHhOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map(hotel => (
                                    <li key={hotel.id} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setHotelOrigen(`${hotel.nombre}|${zona}`); setBusquedaHhOrigen(`${hotel.nombre} (Zona ${zona})`); setMostrarDropdownHotelOrigen(false); }} className="p-4 hover:bg-slate-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 text-sm flex justify-between items-center transition-colors" >
                                      <span className="font-semibold">{hotel.nombre}</span><span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md border border-slate-200">Zona {hotel.zonaId || hotel.zona || 1}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Zona Destino' : 'Destination Area'}</label>
                              <select value={hotelDestino} onChange={(e) => setHotelDestino(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all">
                                <option value="" disabled>{lang === 'es' ? 'Selecciona zona...' : 'Select area...'}</option>
                                <option value="sjc">San José del Cabo</option>
                                <option value="csl">Cabo San Lucas</option>
                                <option value="corredor">{lang === 'es' ? 'Corredor Turístico' : 'Tourist Corridor'}</option>
                                <option value="pacifico">{lang === 'es' ? 'Zona del Pacífico' : 'Pacific Side'}</option>
                              </select>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Nombre Hotel Destino' : 'Destination Hotel Name'}</label>
                              <input type="text" value={hotelNombre} onChange={(e) => setHotelNombre(e.target.value)} placeholder="Ej. Hard Rock, Riu Palace..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Fecha del Traslado' : 'Transfer Date'}</label>
                              <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="date" value={hotelFecha} onChange={(e) => setHotelFecha(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Pasajeros' : 'Passengers'}</label>
                              <select value={hotelPax} onChange={(e) => setHotelPax(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all">
                                <option value="1-4">1 - 4 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                                <option value="5-8">5 - 8 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                                <option value="9-10">9 - 10 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                              </select>
                            </div>
                            <div className="flex flex-col md:col-span-2 pt-4 border-t border-slate-100">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Hora Pick-up' : 'Pick-up Time'}</label>
                              <input type="time" value={hotelHora} onChange={(e) => setHotelHora(e.target.value)} className="w-full md:w-1/3 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                            </div>
                            <div className="md:col-span-2 mt-6 bg-slate-900 rounded-[1.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800">
                              <div className="mb-6 md:mb-0 text-center md:text-left">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{lang === 'es' ? 'Costo del servicio (USD)' : 'Service Cost (USD)'}</p>
                                <h3 className="text-4xl font-black tracking-tighter">{totalPrecioHotel > 0 ? `$${totalPrecioHotel.toFixed(2)}` : '---'}</h3>
                              </div>
                              <button
                                disabled={!hotelOrigen || !hotelDestino || !hotelNombre || !hotelFecha || !hotelHora}
                                onClick={() => {
                                  agregarAlCombo({
                                    id: `hh-${Date.now()}`,
                                    titulo: lang === 'es' ? `Traslado Inter-Hotel` : `Inter-Hotel Transfer`,
                                    subtitulo: `${hotelOrigen.split('|')[0]} ➔ ${hotelNombre} | Fecha: ${hotelFecha} | ${hotelHora}`,
                                    precio: totalPrecioHotel,
                                    tipoEspecial: 'hotel-hotel',
                                    config: { hotelOrigen, hotelDestino, hotelPax, hotelFecha, hotelNombre, hotelHora }
                                  });
                                  setServicioSeleccionado('');
                                  setVistaEspecial(null);
                                  router.push(`/${lang}/cart`);
                                }}
                                className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95"
                              >
                                {lang === 'es' ? 'Añadir a mi Combo' : 'Add to Combo'} <Plus size={18} className="ml-2" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* C. FORMULARIO DE GOLF */}
                {vistaEspecial === 'golf' && (
                  <div className="animate-fade-in">
                    <div className="w-full mb-8 flex justify-start">
                      <button onClick={() => { setVistaEspecial(null); setGolfOrigen(''); setGolfDestino(''); setGolfPax('1-4'); setGolfFecha(''); setGolfNombre(''); setGolfHora(''); setGolfHoraReserva(''); setGolfHoraRegreso(''); setBusquedaGolfOrigen(''); }} className="text-slate-500 hover:text-slate-900 font-bold flex items-center text-sm transition-colors group">
                        <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" /> {lang === 'es' ? 'Volver a Servicios Especiales' : 'Back to Special Services'}
                      </button>
                    </div>
                    {(() => {
                      const matrizPreciosGolf = {
                        'sjc': { '1': 60, '2': 90, '3': 120, '4': 150 },
                        'csl': { '1': 110, '2': 85, '3': 65, '4': 50 },
                        'corredor': { '1': 80, '2': 60, '3': 70, '4': 95 },
                        'pacifico': { '1': 160, '2': 140, '3': 120, '4': 80 }
                      };
                      const recargoGolf = { '1-4': 0, '5-8': 40, '9-10': 60 };
                      let totalPrecioGolf = 0;
                      if (golfOrigen && golfDestino) {
                        const zonaSeleccionada = golfOrigen.split('|')[1] || "1";
                        const precioBase = Number(matrizPreciosGolf[golfDestino]?.[zonaSeleccionada] || 0);
                        totalPrecioGolf = precioBase + Number(recargoGolf[golfPax] || 0);
                      }

                      return (
                        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 flex items-start gap-4">
                            <Info size={20} className="shrink-0 text-slate-400 mt-0.5" />
                            <p className="text-sm font-medium text-slate-600">{lang === 'es' ? 'El traslado para campos de golf contempla un máximo de 3 horas de espera de cortesía. Organiza tus horarios tomando esto en cuenta.' : 'Golf transfer service features a maximum of 3 hours complimentary waiting time. Please plan your return accordingly.'}</p>
                          </div>
                          <div className="mb-8 border-b border-slate-100 pb-4"><h2 className="text-2xl font-bold text-slate-900 tracking-tight">{lang === 'es' ? 'Traslado a Campos de Golf' : 'Golf Course Transportation'}</h2></div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col relative md:col-span-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Tu Hotel' : 'Your Hotel'}</label>
                              <input type="text" placeholder={lang === 'es' ? "Busca tu hotel..." : "Search your hotel..."} value={busquedaGolfOrigen} onChange={(e) => { setBusquedaGolfOrigen(e.target.value); setMostrarDropdownGolfOrigen(true); if (e.target.value === '') setGolfOrigen(''); }} onFocus={() => setMostrarDropdownGolfOrigen(true)} onBlur={() => setTimeout(() => setMostrarDropdownGolfOrigen(false), 200)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              {mostrarDropdownGolfOrigen && (
                                <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 top-[80px] max-h-52 overflow-y-auto custom-scrollbar">
                                  {catalogoHoteles.filter(h => (busquedaGolfOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map(hotel => (
                                    <li key={hotel.id} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setGolfOrigen(`${hotel.nombre}|${zona}`); setBusquedaGolfOrigen(`${hotel.nombre} (Zona ${zona})`); setMostrarDropdownGolfOrigen(false); }} className="p-4 hover:bg-slate-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 text-sm flex justify-between items-center transition-colors" >
                                      <span className="font-semibold">{hotel.nombre}</span><span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md border border-slate-200">Zona {hotel.zonaId || hotel.zona || 1}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Zona del Campo' : 'Course Area'}</label>
                              <select value={golfDestino} onChange={(e) => setGolfDestino(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all">
                                <option value="" disabled>{lang === 'es' ? 'Selecciona zona...' : 'Select area...'}</option>
                                <option value="sjc">San José del Cabo</option>
                                <option value="csl">Cabo San Lucas</option>
                                <option value="corredor">{lang === 'es' ? 'Corredor Turístico' : 'Tourist Corridor'}</option>
                                <option value="pacifico">{lang === 'es' ? 'Sitio Pacífico' : 'Pacific Side'}</option>
                              </select>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Nombre del Campo' : 'Course Name'}</label>
                              <input type="text" value={golfNombre} onChange={(e) => setGolfNombre(e.target.value)} placeholder="Ej. Quivira, Cabo del Sol..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Fecha del Servicio' : 'Service Date'}</label>
                              <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="date" value={golfFecha} onChange={(e) => setGolfFecha(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Pasajeros' : 'Passengers'}</label>
                              <select value={golfPax} onChange={(e) => setGolfPax(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all">
                                <option value="1-4">1 - 4 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                                <option value="5-8">5 - 8 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                                <option value="9-10">9 - 10 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                              </select>
                            </div>
                            <div className="flex flex-col md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                              <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{lang === 'es' ? 'Pick-up (Hotel)' : 'Pick-up (Hotel)'}</label>
                                <input type="time" value={golfHora} onChange={(e) => setGolfHora(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{lang === 'es' ? 'Tee Time' : 'Tee Time'}</label>
                                <input type="time" value={golfHoraReserva} onChange={(e) => setGolfHoraReserva(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{lang === 'es' ? 'Regreso' : 'Return Time'}</label>
                                <input type="time" value={golfHoraRegreso} onChange={(e) => setGolfHoraRegreso(e.target.value)} className={`w-full p-4 rounded-xl outline-none text-sm font-medium transition-all ${calculoHorasGolf.error ? 'border-2 border-red-400 bg-red-50 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900'}`} />
                              </div>
                              {calculoHorasGolf.error && (
                                <div className="md:col-span-3 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700 font-bold text-sm shadow-sm">
                                  <AlertCircle size={18} />
                                  <span>{lang === 'es' ? `Máximo 3 horas permitidas. Estás seleccionando: ${Math.floor(calculoHorasGolf.diffMin / 60)}h ${calculoHorasGolf.diffMin % 60}m.` : `Maximum 3 hours allowed. You selected: ${Math.floor(calculoHorasGolf.diffMin / 60)}h ${calculoHorasGolf.diffMin % 60}m.`}</span>
                                </div>
                              )}
                            </div>
                            <div className="md:col-span-2 mt-6 bg-slate-900 rounded-[1.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800">
                              <div className="mb-6 md:mb-0 text-center md:text-left">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{lang === 'es' ? 'Costo del servicio (USD)' : 'Service Cost (USD)'}</p>
                                <h3 className="text-4xl font-black tracking-tighter">{totalPrecioGolf > 0 ? `$${totalPrecioGolf.toFixed(2)}` : '---'}</h3>
                              </div>
                              <button
                                disabled={!golfOrigen || !golfDestino || !golfNombre || !golfFecha || !golfHora || !golfHoraReserva || !golfHoraRegreso || calculoHorasGolf.error}
                                onClick={() => {
                                  agregarAlCombo({
                                    id: `golf-${Date.now()}`,
                                    titulo: lang === 'es' ? `Transporte Golf: ${golfNombre}` : `Golf Transport: ${golfNombre}`,
                                    subtitulo: `Fecha: ${golfFecha} | Pax: ${golfPax} | Tee Time: ${golfHoraReserva} | Ret: ${golfHoraRegreso}`,
                                    precio: totalPrecioGolf,
                                    tipoEspecial: 'golf',
                                    config: { golfOrigen, golfDestino, golfPax, golfFecha, golfNombre, golfHora, golfHoraReserva, golfHoraRegreso }
                                  });
                                  setServicioSeleccionado('');
                                  setVistaEspecial(null);
                                  router.push(`/${lang}/cart`);
                                }}
                                className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95"
                              >
                                {lang === 'es' ? 'Añadir a mi Combo' : 'Add to Combo'} <Plus size={18} className="ml-2" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* D. FORMULARIO DE NIGHTLIFE */}
                {vistaEspecial === 'nightlife' && (
                  <div className="animate-fade-in">
                    <div className="w-full mb-8 flex justify-start">
                      <button onClick={() => { setVistaEspecial(null); setNightlifeOrigen(''); setNightlifeDestino(''); setNightlifePax('1-4'); setNightlifeFecha(''); setNightlifeLugarNombre(''); setNightlifeHora(''); setNightlifeHoraReserva(''); setNightlifeHoraRegreso(''); setBusquedaNightlifeOrigen(''); }} className="text-slate-500 hover:text-slate-900 font-bold flex items-center text-sm transition-colors group">
                        <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" /> {lang === 'es' ? 'Volver a Servicios Especiales' : 'Back to Special Services'}
                      </button>
                    </div>
                    {(() => {
                      const matrizPreciosNightlife = {
                        'sjc': { '1': 200, '2': 250, '3': 300, '4': 350 },
                        'corredor': { '1': 250, '2': 200, '3': 250, '4': 300 },
                        'csl': { '1': 300, '2': 250, '3': 200, '4': 250 },
                        'pacifico': { '1': 380, '2': 330, '3': 280, '4': 200 }
                      };
                      const recargoNightlife = { '1-4': 0, '5-8': 40, '9-10': 50 };
                      let totalPrecioNightlife = 0;
                      if (nightlifeOrigen && nightlifeDestino) {
                        const zonaSeleccionada = String(nightlifeOrigen.split('|')[1]) || "1";
                        const precioBase = Number(matrizPreciosNightlife[nightlifeDestino]?.[zonaSeleccionada] || 0);
                        totalPrecioNightlife = precioBase + Number(recargoNightlife[nightlifePax] || 0);
                      }

                      return (
                        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 flex items-start gap-4">
                            <Info size={20} className="shrink-0 text-slate-400 mt-0.5" />
                            <p className="text-sm font-medium text-slate-600">{lang === 'es' ? 'El servicio para vida nocturna contempla un máximo de 4 horas de espera. Por favor, organiza tus horarios de regreso tomando esto en cuenta.' : 'Nightlife transfer service includes a maximum of 4 waiting hours. Please manage your schedule with this parameters.'}</p>
                          </div>
                          <div className="mb-8 border-b border-slate-100 pb-4"><h2 className="text-2xl font-bold text-slate-900 tracking-tight">{lang === 'es' ? 'Transporte Nightlife' : 'Nightlife Transport'}</h2></div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col relative md:col-span-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? '¿De dónde sales?' : 'Departing from?'}</label>
                              <input type="text" placeholder={lang === 'es' ? "Busca tu hotel..." : "Search your hotel..."} value={busquedaNightlifeOrigen} onChange={(e) => { setBusquedaNightlifeOrigen(e.target.value); setMostrarDropdownNightlife(true); if (e.target.value === '') setNightlifeOrigen(''); }} onFocus={() => setMostrarDropdownNightlife(true)} onBlur={() => setTimeout(() => setMostrarDropdownNightlife(false), 200)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              {mostrarDropdownNightlife && (
                                <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 top-[80px] max-h-52 overflow-y-auto custom-scrollbar">
                                  {catalogoHoteles.filter(h => (busquedaNightlifeOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map(hotel => (
                                    <li key={hotel.id} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setNightlifeOrigen(`${hotel.nombre}|${zona}`); setBusquedaNightlifeOrigen(`${hotel.nombre} (Zona ${zona})`); setMostrarDropdownNightlife(false); }} className="p-4 hover:bg-slate-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 text-sm flex justify-between items-center transition-colors" >
                                      <span className="font-semibold">{hotel.nombre}</span><span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md border border-slate-200">Zona {hotel.zonaId || hotel.zona || 1}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Área del lugar' : 'Venue area'}</label>
                              <select value={nightlifeDestino} onChange={(e) => setNightlifeDestino(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all">
                                <option value="" disabled>{lang === 'es' ? 'Selecciona área...' : 'Select area...'}</option>
                                <option value="sjc">San José del Cabo</option>
                                <option value="corredor">{lang === 'es' ? 'Corredor Turístico' : 'Tourist Corridor'}</option>
                                <option value="csl">Cabo San Lucas</option>
                                <option value="pacifico">{lang === 'es' ? 'Sitio Pacífico' : 'Pacific Side'}</option>
                              </select>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Nombre del club/bar' : 'Club/Bar Name'}</label>
                              <input type="text" placeholder="Ej. Squid Roe, Mandala..." value={nightlifeLugarNombre} onChange={(e) => setNightlifeLugarNombre(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Fecha del Servicio' : 'Service Date'}</label>
                              <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="date" value={nightlifeFecha} onChange={(e) => setNightlifeFecha(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Pasajeros' : 'Passengers'}</label>
                              <select value={nightlifePax} onChange={(e) => setNightlifePax(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all">
                                <option value="1-4">1 - 4 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                                <option value="5-8">5 - 8 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                                <option value="9-10">9 - 10 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                              </select>
                            </div>
                            <div className="flex flex-col md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                              <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{lang === 'es' ? 'Pick-up (Hotel)' : 'Pick-up (Hotel)'}</label>
                                <input type="time" value={nightlifeHora} onChange={(e) => setNightlifeHora(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{lang === 'es' ? 'Ingreso al club' : 'Club Entry Time'}</label>
                                <input type="time" value={nightlifeHoraReserva} onChange={(e) => setNightlifeHoraReserva(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{lang === 'es' ? 'Hora de regreso' : 'Return Time'}</label>
                                <input type="time" value={nightlifeHoraRegreso} onChange={(e) => setNightlifeHoraRegreso(e.target.value)} className={`w-full p-4 rounded-xl outline-none text-sm font-medium transition-all ${calculoHorasNightlife.error ? 'border-2 border-red-400 bg-red-50 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900'}`} />
                              </div>
                              {calculoHorasNightlife.error && (
                                <div className="md:col-span-3 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700 font-bold text-sm shadow-sm">
                                  <AlertCircle size={18} />
                                  <span>{lang === 'es' ? `Máximo 4 horas permitidas. Estás seleccionando: ${Math.floor(calculoHorasNightlife.diffMin / 60)}h ${calculoHorasNightlife.diffMin % 60}m.` : `Maximum 4 hours allowed. You selected: ${Math.floor(calculoHorasNightlife.diffMin / 60)}h ${calculoHorasNightlife.diffMin % 60}m.`}</span>
                                </div>
                              )}
                            </div>
                            <div className="md:col-span-2 mt-6 bg-slate-900 rounded-[1.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800">
                              <div className="mb-6 md:mb-0 text-center md:text-left">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{lang === 'es' ? 'Costo del servicio (USD)' : 'Service Cost (USD)'}</p>
                                <h3 className="text-4xl font-black tracking-tighter">{totalPrecioNightlife > 0 ? `$${totalPrecioNightlife.toFixed(2)}` : '---'}</h3>
                              </div>
                              <button
                                disabled={!nightlifeOrigen || !nightlifeDestino || !nightlifeLugarNombre || !nightlifeFecha || !nightlifeHora || !nightlifeHoraReserva || !nightlifeHoraRegreso || calculoHorasNightlife.error}
                                onClick={() => {
                                  agregarAlCombo({
                                    id: `nightlife-${Date.now()}`,
                                    titulo: lang === 'es' ? `Servicio Nightlife: ${nightlifeLugarNombre}` : `Nightlife Service: ${nightlifeLugarNombre}`,
                                    subtitulo: `Fecha: ${nightlifeFecha} | Pax: ${nightlifePax} | Out: ${nightlifeHoraReserva} | Ret: ${nightlifeHoraRegreso}`,
                                    precio: totalPrecioNightlife,
                                    tipoEspecial: 'nightlife',
                                    config: { nightlifeOrigen, nightlifeDestino, nightlifePax, nightlifeFecha, nightlifeLugarNombre, nightlifeHora, nightlifeHoraReserva, nightlifeHoraRegreso }
                                  });
                                  setServicioSeleccionado('');
                                  setVistaEspecial(null);
                                  router.push(`/${lang}/cart`);
                                }}
                                className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95"
                              >
                                {lang === 'es' ? 'Añadir a mi Combo' : 'Add to Combo'} <Plus size={18} className="ml-2" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

        ) : (
          /* ========================================================= */
          /* VISTA 1: FORMULARIO PRINCIPAL DE TRANSPORTE REGULAR       */
          /* ========================================================= */
          <div className="animate-fade-in">

            {/* HEADER DEL WIDGET */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <MapPin className="text-blue-600" size={24} />
                {lang === 'es' ? 'Detalles de tu Reserva' : 'Booking Details'}
              </h2>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center gap-2">
                  <img src="/datos-seguros.png" alt="Secure Data" className="h-6 w-auto object-contain" />
                  <div className="flex flex-col justify-center">
                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{lang === 'es' ? 'Datos Protegidos' : 'Protected Data'}</span>
                    <span className="text-[10px] sm:text-xs font-black text-slate-700 leading-none">{lang === 'es' ? 'Pago Seguro' : 'Secure Checkout'}</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                <img src="/pago-tarjetas.png" alt="Métodos de Pago" className="h-5 sm:h-6 w-auto object-contain" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* BUSCADOR DE HOTEL */}
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Selecciona tu hotel' : 'Select your hotel'}</label>
                <input type="text" placeholder={lang === 'es' ? "Escribe para buscar tu hotel..." : "Type to search your hotel..."} value={busquedaHotelPrincipal} onChange={(e) => { setBusquedaHotelPrincipal(e.target.value); setMostrarDropdownHotelPrincipal(true); }} onFocus={() => setMostrarDropdownHotelPrincipal(true)} onBlur={() => setTimeout(() => setMostrarDropdownHotelPrincipal(false), 200)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-800 font-medium transition-all" />
                {mostrarDropdownHotelPrincipal && (
                  <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 top-[80px] max-h-60 overflow-y-auto custom-scrollbar">
                    {catalogoHoteles.filter(h => h.nombre && (busquedaHotelPrincipal || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map(hotel => (
                      <li key={hotel.id || hotel.nombre} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setReserva({ ...reserva, hotelId: hotel.nombre, zonaId: zona }); setBusquedaHotelPrincipal(hotel.nombre); setMostrarDropdownHotelPrincipal(false); }} className="p-4 hover:bg-slate-50 cursor-pointer text-slate-700 border-b border-slate-100 transition-colors flex justify-between items-center" >
                        <span className="font-semibold text-sm">{hotel.nombre}</span><span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">Zona {hotel.zonaId || hotel.zona || 1}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* TIPO DE VEHÍCULO */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{lang === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {VEHICULOS.map(v => (
                    <div
                      key={v.id}
                      onClick={() => setReserva(prev => ({ ...prev, vehiculo: v.id }))}
                      className={`cursor-pointer border-2 rounded-2xl p-5 transition-all duration-300 ${reserva.vehiculo === v.id
                          ? 'border-slate-900 bg-slate-50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] scale-[1.02]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900 text-lg tracking-tight">{v.nombre}</span>
                        <Car className={reserva.vehiculo === v.id ? 'text-slate-900' : 'text-slate-400'} size={20} />
                      </div>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed font-medium h-8">{v.descripcion[lang]}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users size={14} className={reserva.vehiculo === v.id ? "text-slate-900" : "text-slate-400"} />
                        {lang === 'es' ? `Máx ${v.maxPax} pax` : `Max ${v.maxPax} pax`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FECHA Y PASAJEROS */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Fecha de Llegada' : 'Arrival Date'}</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="date" name="fechaLlegada" value={reserva.fechaLlegada || ''} onChange={handleChange} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-800 font-medium transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Pasajeros' : 'Passengers'}</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="number" min="1" max="10" name="pasajeros" value={reserva.pasajeros || ''} onChange={handleChange} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-800 font-medium transition-all" />
                </div>
              </div>
            </div>

            {/* SELECCIÓN DE SERVICIOS */}
            <div className="border-t border-slate-100 pt-8 mt-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">{lang === 'es' ? 'Elige un servicio para continuar' : 'Select a service to continue'}</label>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                <button
                  onClick={() => avanzarPaso('aeropuerto_hotel')}
                  className={`flex flex-col items-center justify-center rounded-2xl p-5 transition-all duration-300 group ${servicioSeleccionado === 'aeropuerto_hotel'
                      ? 'bg-slate-50 border-2 border-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] scale-[1.02]'
                      : 'bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md'
                    }`}
                >
                  <div className={`p-3.5 rounded-xl mb-4 transition-colors border ${servicioSeleccionado === 'aeropuerto_hotel' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                    <PlaneLanding size={24} />
                  </div>
                  <span className={`font-bold text-xs sm:text-sm text-center leading-tight tracking-tight transition-colors ${servicioSeleccionado === 'aeropuerto_hotel' ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {lang === 'es' ? 'Aeropuerto → Hotel' : 'Airport → Hotel'}
                  </span>
                </button>

                <button
                  onClick={() => avanzarPaso('hotel_aeropuerto')}
                  className={`flex flex-col items-center justify-center rounded-2xl p-5 transition-all duration-300 group ${servicioSeleccionado === 'hotel_aeropuerto'
                      ? 'bg-slate-50 border-2 border-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] scale-[1.02]'
                      : 'bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md'
                    }`}
                >
                  <div className={`p-3.5 rounded-xl mb-4 transition-colors border ${servicioSeleccionado === 'hotel_aeropuerto' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                    <PlaneTakeoff size={24} />
                  </div>
                  <span className={`font-bold text-xs sm:text-sm text-center leading-tight tracking-tight transition-colors ${servicioSeleccionado === 'hotel_aeropuerto' ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {lang === 'es' ? 'Hotel → Aeropuerto' : 'Hotel → Airport'}
                  </span>
                </button>

                <button
                  onClick={() => avanzarPaso('redondo')}
                  className={`flex flex-col items-center justify-center rounded-2xl p-5 transition-all duration-300 group ${servicioSeleccionado === 'redondo'
                      ? 'bg-slate-50 border-2 border-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] scale-[1.02]'
                      : 'bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md'
                    }`}
                >
                  <div className={`p-3.5 rounded-xl mb-4 transition-colors border ${servicioSeleccionado === 'redondo' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                    <RefreshCw size={24} />
                  </div>
                  <span className={`font-bold text-xs sm:text-sm text-center leading-tight tracking-tight transition-colors ${servicioSeleccionado === 'redondo' ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {lang === 'es' ? 'Viaje Redondo' : 'Round Trip'}
                  </span>
                </button>

                {/* BOTÓN OSCURO DE EXPERIENCIAS */}
                <button
                  onClick={() => avanzarPaso('tours')}
                  className={`flex flex-col items-center justify-center rounded-2xl p-5 transition-all duration-300 group ${['experiencias', 'tours', 'especiales'].includes(servicioSeleccionado)
                      ? 'bg-slate-950 border-2 border-slate-900 shadow-[0_8px_30px_rgba(15,23,42,0.3)] scale-[1.02]'
                      : 'bg-slate-900 border border-slate-900 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20'
                    }`}
                >
                  <div className={`p-3.5 rounded-xl mb-4 transition-transform ${['experiencias', 'tours', 'especiales'].includes(servicioSeleccionado)
                      ? 'bg-white text-slate-900 scale-110'
                      : 'bg-white/10 text-white group-hover:scale-110'
                    }`}>
                    <Compass size={24} />
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm text-center leading-tight tracking-tight">
                    {lang === 'es' ? 'Tours y Especiales' : 'Tours & Specials'}
                  </span>
                </button>

              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="mb-6 text-center">
                <h3 className="text-slate-900 font-bold text-lg mb-1 tracking-tight">
                  {lang === 'es' ? 'Servicios Exclusivos' : 'Exclusive Services'}
                </h3>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                  {lang === 'es' ? 'Opciones premium' : 'Premium options'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${lang}/agencies`}
                  className="group relative overflow-hidden bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-800 w-full px-5 py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-md hover:border-blue-200 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <div className="bg-blue-50 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>{lang === 'es' ? 'Agencias de Viajes' : 'Travel Agencies'}</span>
                </Link>

                <Link
                  href={`/${lang}/weddings`}
                  className="group relative overflow-hidden bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-800 w-full px-5 py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-md hover:border-pink-200 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <div className="bg-pink-50 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 text-pink-500" />
                  </div>
                  <span>{lang === 'es' ? 'Bodas y Eventos' : 'Weddings & Events'}</span>
                </Link>
              </div>
            </div>

          </div>
        )}

        {/* ========================================= */}
        {/* TRUST BADGES PARA EL HERO PRINCIPAL */}
        {/* ========================================= */}
        <div className="mt-8">
          <TrustBadges lang={lang} showFlightMonitoring={true} />
        </div>
      </div>
    </div>
  );
}