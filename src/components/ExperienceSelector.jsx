// src/components/ExperienceSelector.jsx
'use client';

import React from 'react';
import { Compass, Car, ChevronLeft, CheckCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function ExperienceSelector({ lang = 'es' }) {
  const { reserva, setServicioSeleccionado, setPaso, setSubCategoria } = useBooking();

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4">
      
      {/* COLUMNA IZQUIERDA: MENÚ DE CATEGORÍAS */}
      <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
          <Compass className="text-blue-900" size={28} /> Selecciona una Experiencia
        </h3>

        <div className="max-w-4xl mx-auto mb-4 animate-fade-in">
          
          {/* Botón Volver al Inicio */}
          <div className="w-full mb-8 flex justify-start">
            <button 
              onClick={() => { setServicioSeleccionado(''); setPaso(1); window.scrollTo(0,0); }} 
              className="text-blue-600 font-bold flex items-center hover:text-blue-800 transition"
            >
              <span className="mr-2">←</span> Volver al inicio
            </button>
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-8">
            Selecciona una categoría
          </h2>
          
          {/* Tarjetas de Selección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tarjeta 1: TOURS */}
            <button 
              onClick={() => setSubCategoria('tours')} 
              className="bg-white border-2 border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all text-left w-full cursor-pointer flex flex-col group"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Compass size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-900 transition-colors mb-2">Tours</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Explora Los Cabos con nuestras expediciones guiadas de primer nivel.</p>
            </button>
            
            {/* Tarjeta 2: SERVICIOS ESPECIALES */}
            <button 
              onClick={() => setSubCategoria('especiales')} 
              className="bg-white border-2 border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all text-left w-full cursor-pointer flex flex-col group"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Car size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-900 transition-colors mb-2">Servicios Especiales</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Transporte a tu medida para Cenas, Campos de Golf y traslados de Hotel a Hotel.</p>
            </button>

          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: WIDGET OSCURO (ResumenFlotante) */}
      <div className="w-full lg:w-[400px] flex-shrink-0 animate-fade-in mb-24 lg:mb-0">
        <div className="bg-[#0f172a] rounded-[2rem] shadow-2xl p-8 text-white lg:sticky lg:top-28 border border-slate-800">
          <h3 className="text-xl font-black mb-8 border-b border-slate-800 pb-4">Resumen de Cotización</h3>

          <div className="space-y-4 text-sm mb-8 text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-4">
              <span className="font-bold text-white uppercase tracking-wider">TOURS / ESPECIALES</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">Pasajeros:</span> 
              <span className="font-black text-white bg-slate-800 px-3 py-1 rounded-lg">{reserva.pasajeros}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mb-8">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Subtotal del Servicio (USD)</p>
            <p className="text-5xl font-black text-white">$0.00</p>
            <p className="text-xs text-slate-400 mt-3 flex items-center font-medium gap-1">
              <CheckCircle size={14} className="text-green-500" /> Impuestos incluidos
            </p>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => { setServicioSeleccionado(''); setPaso(1); window.scrollTo(0,0); }} 
              className="px-5 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition flex items-center font-bold gap-1 active:scale-95"
            >
              <ChevronLeft size={20} /> Atrás
            </button>
            <button 
              disabled={true} 
              className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center transition-all bg-slate-800 text-slate-500 cursor-not-allowed"
            >
              Añadir a mi combo +
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}