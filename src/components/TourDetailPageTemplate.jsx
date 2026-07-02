// src/components/TourDetailPageTemplate.jsx
'use client';

import React, { useMemo, useEffect } from 'react';
import { ArrowLeft, ImageIcon, CheckCircle, Check, Clock, Calendar, Users, AlertCircle, MapPin } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { toursData, toursLandingPages } from '../data/seoData';
import TourGuideSEO from './TourGuideSEO';

export default function TourDetailPageTemplate({ lang = 'es', tourId, slug }) {
  const {
    reserva,
    setReserva,
    setServicioSeleccionado,
    imagenTourDestacada,
    setImagenTourDestacada,
    handleParticipanteChange,
    puedeAvanzarPaso2,
    setPaso,
    lightboxAbierto,
    setLightboxAbierto,
    lightboxIndice,
    setLightboxIndice,
    currentUser
  } = useBooking();

  const router = useRouter();
  const { agregarAlCombo } = useCart();

  const tr = toursData.find(t => t.id === tourId);
  const tourSEO = toursLandingPages.find(t => t.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tr) {
      setReserva(prev => ({
        ...prev,
        tourId: tourId,
        pasajeros: Math.max(prev.pasajeros || 1, tr.minPax || 1)
      }));
      setServicioSeleccionado('tours');
      setImagenTourDestacada(tr.imagenUrl || '');
      setPaso(2);
    }
  }, [tourId, tr, setReserva, setServicioSeleccionado, setImagenTourDestacada, setPaso]);

  const handleChange = (e) => setReserva(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // 🧮 LÓGICA DE PRECIOS DEL TOUR
  const detallesPrecio = useMemo(() => {
    let subtotal = 0;

    if (tr && reserva.participantes.length > 0) {
      if (tr.precioNino && tr.precioAdulto) {
        reserva.participantes.forEach(p => {
          const edad = parseInt(p.edad);
          if (!isNaN(edad)) {
            if (edad <= (tr.edadNinoMax || 11)) {
              subtotal += Number(tr.precioNino);
            } else {
              subtotal += Number(tr.precioAdulto);
            }
          }
        });
      } else {
        subtotal = reserva.participantes.length * Number(tr.precioPx);
      }
    }

    return { total: subtotal };
  }, [reserva.participantes, tr]);

  const handleAddToCart = () => {
    agregarAlCombo({
      id: `tour-${Date.now()}`,
      titulo: tr.nombre[lang],
      subtitulo: `Pax: ${reserva.pasajeros} | Fecha: ${reserva.fechaLlegada}`,
      precio: detallesPrecio.total,
      tipoEspecial: 'tour',
      config: reserva
    });

    router.push(`/${lang}/cart`);
  };

  if (!tr) return null;

  // Validación de errores para bloquear el botón de manera silenciosa
  const hayErroresDeEdad = reserva.participantes.some(part => part.edad !== '' && parseInt(part.edad) < (tr.edadMinima || 0));
  const faltanDatos = !reserva.fechaLlegada || reserva.participantes.some(p => p.nombre === '' || p.edad === '');
  const botonBloqueado = hayErroresDeEdad || faltanDatos || reserva.pasajeros < tr.minPax;

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-slate-700">
      <div className="animate-fade-in max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8 relative pb-12">

        {/* ======================================================== */}
        {/* COLUMNA IZQUIERDA: INFO DEL TOUR (Estilo Premium)        */}
        {/* ======================================================== */}
        <div className="flex-1 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">

          {/* Hero de Imagen */}
          <div className="relative h-64 md:h-[400px] w-full group cursor-pointer bg-slate-100" onClick={() => {
            setLightboxIndice?.(0);
            setLightboxAbierto?.(true);
          }}>
            <img src={`/${imagenTourDestacada || tr.imagenUrl}`} alt={tr.nombre[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none"></div>

            <button onClick={(e) => {
              e.stopPropagation();
              setReserva(prev => ({ ...prev, tourId: '' }));
              setImagenTourDestacada('');
              setServicioSeleccionado('');
              setPaso(1);
              router.push(`/${lang}`);
            }} className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 flex items-center hover:bg-slate-900 hover:text-white transition-colors shadow-sm z-10 border border-slate-200/50">
              <ArrowLeft size={16} className="mr-2" /> {lang === 'es' ? 'Volver a Tours' : 'Back to Tours'}
            </button>

            <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none z-10">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tighter text-white drop-shadow-md">{tr.nombre[lang]}</h2>
            </div>
            <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <ImageIcon size={16} /> {lang === 'es' ? 'Galería' : 'Gallery'}
            </div>
          </div>

          {/* Detalles e Info */}
          <div className="p-6 md:p-10">
            {/* Tour Overview Section */}
            {tourSEO?.detalle && (
              <div className="mb-8 border-b border-slate-100 pb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{lang === 'es' ? 'Descripción del Tour' : 'Tour Overview'}</h3>
                <p className="text-slate-500 font-medium text-base leading-relaxed">{tourSEO.detalle}</p>
              </div>
            )}

            <p className="text-slate-500 font-medium text-base leading-relaxed mb-8">{tr.descripcion[lang]}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-6">
                <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-600" /> {lang === 'es' ? '¿Qué incluye?' : 'What\'s included?'}</h4>
                <ul className="space-y-3">
                  {tr.incluye && tr.incluye[lang] && tr.incluye[lang].map((item, idx) => (<li key={idx} className="flex items-start text-emerald-700/80 font-medium text-sm gap-2.5"><Check size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {item}</li>))}
                </ul>
              </div>
              <div className="bg-orange-50/40 border border-orange-100/80 rounded-xl p-6">
                <h4 className="font-bold text-orange-800 mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-orange-600" /> {lang === 'es' ? 'Requisitos' : 'Requirements'}</h4>
                <ul className="space-y-3">
                  {tr.requisitos && tr.requisitos[lang] && (Array.isArray(tr.requisitos[lang])
                    ? tr.requisitos[lang].map((item, idx) => (<li key={idx} className="flex items-start text-orange-700/80 font-medium text-sm gap-2.5"><span className="text-orange-500 font-bold mt-0.5">•</span> {item}</li>))
                    : <p className="text-orange-700/80 font-medium text-sm">{tr.requisitos[lang]}</p>
                  )}
                </ul>
              </div>
            </div>

            {/* Why Book With Us Section */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                {lang === 'es' ? '¿Por qué reservar esta experiencia con nosotros?' : 'Why Book This Experience With Us?'}
              </h3>
              <ul className="space-y-4 text-base">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} /> 
                  <span>
                    <strong className="text-slate-800">
                      {lang === 'es' ? 'Enfoque Privado y VIP:' : 'Private & VIP Focus:'}
                    </strong>{' '}
                    {lang === 'es' 
                      ? 'Evita autobuses masivos y abarrotados. Nos enfocamos en grupos pequeños y atención personalizada.' 
                      : 'Avoid massive, crowded buses. We focus on small groups and personalized attention.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} /> 
                  <span>
                    <strong className="text-slate-800">
                      {lang === 'es' ? 'Guías Certificados:' : 'Certified Guides:'}
                    </strong>{' '}
                    {lang === 'es' 
                      ? 'Expertos bilingües que priorizan tu seguridad y ofrecen un conocimiento local inigualable.' 
                      : 'Bilingual experts who prioritize your safety and deliver unmatched local knowledge.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} /> 
                  <span>
                    <strong className="text-slate-800">
                      {lang === 'es' ? 'Transportación de Ida y Vuelta:' : 'Round-Trip Transportation:'}
                    </strong>{' '}
                    {lang === 'es' 
                      ? 'Traslado de ida y vuelta al hotel incluido hasta el lugar de la actividad.' 
                      : 'Hotel pick-up and drop-off included to the activity location.'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-100 mb-8">
              <p className="text-slate-900 font-bold flex items-center gap-2"><Clock size={20} className="text-slate-400" /> {tr.duracion[lang]}</p>
              {tr.especial && <p className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 uppercase tracking-wide">{lang === 'es' ? `Mínimo ${tr.minPax} personas` : `Minimum ${tr.minPax} pax`}</p>}
            </div>

            {tr.galeria && tr.galeria.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-slate-400" />
                  {lang === 'es' ? 'Galería de Imágenes' : 'Image Gallery'}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tr.galeria.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-slate-200/60" onClick={() => {
                      setLightboxIndice?.(idx);
                      setLightboxAbierto?.(true);
                    }}>
                      <img src={imgUrl} alt={`${tr.nombre[lang]} ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMNA DERECHA: FORMULARIO DE RESERVA (Diseño Serio)    */}
        {/* ======================================================== */}
        <div className="w-full lg:w-[460px] flex-shrink-0 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 p-6 md:p-8 sticky top-28">

            {/* NUEVO HEADER CON SEGURIDAD Y LOGOS */}
            <div className="flex flex-col gap-4 mb-8 pb-5 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <MapPin className="text-blue-600" size={24} />
                {lang === 'es' ? 'Detalles de tu Reserva' : 'Booking Details'}
              </h2>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <img src="/datos-seguros.png" alt={lang === 'es' ? 'Datos Seguros' : 'Secure Data'} className="h-6 w-auto object-contain" />
                  <div className="flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {lang === 'es' ? 'Datos Protegidos' : 'Protected Data'}
                    </span>
                    <span className="text-xs font-black text-slate-700 leading-none">
                      {lang === 'es' ? 'Pago Seguro' : 'Secure Checkout'}
                    </span>
                  </div>
                </div>
                <img src="/pago-tarjetas.png" alt="Métodos de Pago" className="h-6 w-auto object-contain" />
              </div>
            </div>

            <div className="space-y-6">

              {/* 1. Selector de Fecha */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Fecha del Tour' : 'Tour Date'}</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="date" name="fechaLlegada" value={reserva.fechaLlegada || ''} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-slate-800 font-medium text-sm transition-all" />
                </div>
              </div>

              {/* 2. Selector de Número de Pasajeros */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
                  {lang === 'es' ? 'Pasajeros' : 'Passengers'} <span className="text-slate-400 font-medium tracking-normal normal-case">({lang === 'es' ? `Mín. ${tr.minPax}` : `Min. ${tr.minPax}`})</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    min={tr.minPax}
                    max="20"
                    name="pasajeros"
                    value={reserva.pasajeros}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 font-medium text-sm outline-none transition-all ${reserva.pasajeros < tr.minPax ? 'bg-red-50 border-red-300 text-red-700 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900'}`}
                  />
                </div>
              </div>

              {/* 3. Inputs Dinámicos para Nombre y Edad */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === 'es' ? 'Datos de pasajeros' : 'Passenger details'}</label>
                  {tr.edadMinima > 0 && (
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-wider">
                      {lang === 'es' ? `Edad mín: ${tr.edadMinima}` : `Min age: ${tr.edadMinima}`}
                    </span>
                  )}
                </div>

                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                  {(reserva.participantes || []).map((part, index) => {
                    const esEdadInvalida = part.edad !== '' && parseInt(part.edad) < (tr.edadMinima || 0);

                    return (
                      <div key={index} className="flex flex-col">
                        {/* Fila de Inputs */}
                        <div className="flex gap-2">
                          <div className={`w-10 flex-shrink-0 flex items-center justify-center rounded-lg text-sm font-bold border ${esEdadInvalida ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            {index + 1}
                          </div>

                          <input
                            type="text"
                            placeholder={lang === 'es' ? 'Nombre completo' : 'Full Name'}
                            value={part.nombre}
                            onChange={(e) => handleParticipanteChange(index, 'nombre', e.target.value)}
                            className={`flex-1 min-w-0 border rounded-lg px-3 py-2.5 text-sm outline-none transition-all placeholder-slate-400 font-medium ${esEdadInvalida ? "bg-red-50 border-red-300 text-red-900 focus:ring-1 focus:ring-red-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"}`}
                          />

                          <input
                            type="number"
                            placeholder={lang === 'es' ? 'Edad' : 'Age'}
                            min="1"
                            value={part.edad}
                            onChange={(e) => handleParticipanteChange(index, 'edad', e.target.value)}
                            className={`w-20 flex-shrink-0 border rounded-lg px-3 py-2.5 text-sm outline-none transition-all text-center placeholder-slate-400 font-medium ${esEdadInvalida ? "bg-red-50 border-red-400 text-red-700 font-bold focus:ring-1 focus:ring-red-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"}`}
                          />
                        </div>

                        {/* BURBUJA DE ERROR */}
                        {esEdadInvalida && (
                          <div className="flex justify-end mt-1.5 pr-1 animate-fade-in">
                            <div className="relative bg-slate-900 text-white text-[10px] font-bold tracking-wide uppercase px-3 py-1.5 rounded shadow-md flex items-center gap-1.5">
                              <div className="absolute bottom-full right-6 border-[5px] border-transparent border-b-slate-900"></div>
                              <AlertCircle size={12} className="text-red-400" />
                              {lang === 'es' ? `Edad mínima: ${tr.edadMinima} años` : `Min age: ${tr.edadMinima} yrs`}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Textarea de Recogida */}
              <div className="mt-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Lugar de recogida' : 'Pickup location'}</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium text-sm outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all placeholder-slate-400"
                  rows="2"
                  placeholder={lang === 'es' ? "Nombre del Hotel, Airbnb o Villa..." : "Hotel name, Airbnb or Villa..."}
                  value={reserva.comentarios || ''}
                  onChange={(e) => setReserva({ ...reserva, comentarios: e.target.value })}
                ></textarea>
              </div>

              {/* 5. Resumen de Precios y Botón */}
              <div className="border-t border-slate-100 pt-6 mt-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">${detallesPrecio.total?.toFixed(2)} <span className="text-xs text-slate-500 font-bold">USD</span></p>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={botonBloqueado}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all text-sm tracking-wide ${!botonBloqueado ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-[0.98]' : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  {lang === 'es' ? 'Agregar al carrito' : 'Add to cart'}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* LIGHTBOX OVERLAY */}
      {lightboxAbierto && tr.galeria && tr.galeria.length > 0 && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
          <button onClick={() => setLightboxAbierto(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full text-lg z-50">
            ✕
          </button>

          <button
            onClick={() => setLightboxIndice(prev => (prev === 0 ? tr.galeria.length - 1 : prev - 1))}
            className="absolute left-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-4 rounded-full font-black text-xl z-50"
          >
            ❮
          </button>

          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center z-40 relative">
            <img
              src={tr.galeria[lightboxIndice]}
              alt={`${tr.nombre[lang]} ${lightboxIndice + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10 animate-fade-in"
            />
            <p className="text-white/60 text-sm mt-4 font-semibold tracking-wider">
              {lightboxIndice + 1} / {tr.galeria.length}
            </p>
          </div>

          <button
            onClick={() => setLightboxIndice(prev => (prev === tr.galeria.length - 1 ? 0 : prev + 1))}
            className="absolute right-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-4 rounded-full font-black text-xl z-50"
          >
            ❯
          </button>
        </div>
      )}

      {/* GUÍAS DE TEXTO EXCLUSIVAS (Renderizadas desde el componente) */}
      <TourGuideSEO slug={slug} />

    </div>
  );
}
