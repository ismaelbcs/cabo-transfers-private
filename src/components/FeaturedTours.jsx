// src/components/FeaturedTours.jsx
'use client';

import React from 'react';
import { Clock, ChevronRight, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBooking } from '../context/BookingContext';
import { toursData } from '../data/seoData';

export default function FeaturedTours({ lang = 'es', t }) {
  const { setLightboxAbierto, setLightboxIndice } = useBooking();
  const router = useRouter();
  
  // Filtramos solo los activos
  const toursActivos = toursData.filter(tour => tour.activo);

  if (toursActivos.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div id="tours" className="mb-24 scroll-mt-24">
        
        {/* Encabezado Emil Kowalski / Taste Style */}
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest mb-4">
            <Compass size={14} className="text-blue-600" /> 
            {lang === 'es' ? 'Descubre la Baja' : 'Discover Baja'}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tighter" style={{ letterSpacing: '-0.03em' }}>
            {lang === 'es' 
              ? 'Experiencias y Excursiones.' 
              : 'Featured Tours & Excursions.'}
          </h2>
          
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {lang === 'es' 
              ? 'Reserva las mejores aventuras y explora la magia de Los Cabos con guías expertos.' 
              : 'Book the best adventures and explore the magic of Los Cabos with expert guides.'}
          </p>
        </div>

        {/* Grid de Tarjetas (Ajuste visual limpio) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {toursActivos.slice(0, 6).map((tr) => (
            <div 
              key={tr.id} 
              onClick={() => router.push(`/${lang}/tours/${tr.slug}`)} 
              className="snap-center shrink-0 w-[85vw] sm:w-[350px] lg:w-auto group cursor-pointer rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col min-h-[400px]"
            >
              <div className="relative h-60 overflow-hidden shrink-0 bg-slate-100">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                <div 
                  className="relative w-full h-full" 
                  onClick={(e) => {
                    e.stopPropagation();
                    // FIX: Se agregó encadenamiento opcional (?.) para evitar el crasheo
                    setLightboxIndice?.(0);
                    setLightboxAbierto?.(true);
                  }}
                >
                  <img 
                    src={`/${tr.imagenUrl}`} 
                    alt={tr.nombre[lang]} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </div>
                {/* Badge de tiempo refinado */}
                <div className="absolute bottom-4 left-4 z-20 bg-white text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Clock size={14} className="text-slate-400" /> {tr.duracion[lang]}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow bg-white">
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-slate-600 transition-colors">
                  {tr.nombre[lang]}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-8 flex-grow font-medium leading-relaxed">
                  {tr.descripcion[lang]}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                      {t?.step1?.price_from || (lang === 'es' ? 'Precio desde' : 'Price from')}
                    </p>
                    <p className="text-2xl font-black text-slate-900 leading-none">
                      ${tr.precioPx} <span className="text-xs font-bold text-slate-500">USD</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}