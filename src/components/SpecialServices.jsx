// src/components/SpecialServices.jsx
'use client';

import React, { useState } from 'react';
import { Car, Info, Plus, Briefcase, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { dict } from '../locales/dict';
import { useCart } from '../context/CartContext';
import { useBooking } from '../context/BookingContext';

export default function SpecialServices({ lang = 'es' }) {
  const t = dict[lang] || dict['en'];
  const { agregarAlCombo } = useCart();
  const { 
    setSubCategoria, 
    vistaEspecial, 
    setVistaEspecial 
  } = useBooking();

  // Estados locales para el formulario de Cenas
  const [cenaOrigen, setCenaOrigen] = useState('');
  const [cenaDestino, setCenaDestino] = useState('');
  const [cenaPax, setCenaPax] = useState('1-4');
  const [cenaRestauranteNombre, setCenaRestauranteNombre] = useState('');

  // Precios estáticos de tu lógica original
  const matrizPreciosCenas = {
    'sjc': { '1': 120, '2': 150, '3': 170, '4': 250 },
    'corredor': { '1': 140, '2': 120, '3': 150, '4': 200 },
    'csl': { '1': 170, '2': 150, '3': 140, '4': 220 },
    'pacifico': { '1': 250, '2': 230, '3': 220, '4': 220 }
  };
  const recargoCenas = { '1-4': 0, '5-8': 30, '9-10': 45 };

  // Cálculo matemático en tiempo real para Cenas
  let totalPrecioCena = 0;
  if (cenaOrigen && cenaDestino) {
    const zonaSeleccionada = String(cenaOrigen.split('|')[1]) || "1";
    const precioBase = Number(matrizPreciosCenas[cenaDestino]?.[zonaSeleccionada] || 0);
    totalPrecioCena = precioBase + Number(recargoCenas[cenaPax] || 0);
  }

  const handleAddCena = () => {
    agregarAlCombo({
      id: `cena-${Date.now()}`,
      titulo: `Traslado a Restaurante: ${cenaRestauranteNombre}`,
      subtitulo: `Pax: ${cenaPax} | Origen: Zona ${cenaOrigen.split('|')[1]}`,
      precio: totalPrecioCena,
      tipoEspecial: 'cena'
    });
    setVistaEspecial(null);
  };

  // ==========================================
  // VISTA A: TARJETAS PRINCIPALES
  // ==========================================
  if (!vistaEspecial) {
    return (
      <div className="w-full animate-fade-in">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 text-center mb-8">
          {lang === 'es' ? 'Servicios Especiales' : 'Special Services'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div onClick={() => setVistaEspecial('cenas')} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">🍽️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cenas y Restaurantes</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Disfruta tu velada sin preocuparte por el volante.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Configurar Traslado' : 'Configure Transfer'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </div>

          <div onClick={() => setVistaEspecial('nightlife')} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">🍸</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nightlife</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Transporte seguro para disfrutar la vida nocturna de Los Cabos.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Configurar Traslado' : 'Configure Transfer'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </div>

          <div onClick={() => setVistaEspecial('hotel')} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Car size={20} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hotel a Hotel</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Cambia de resort con comodidad y espacio para tu equipaje.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Configurar Traslado' : 'Configure Transfer'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </div>

          <div onClick={() => setVistaEspecial('golf')} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">⛳</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Campos de Golf</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Transporte ida y vuelta a los mejores campos de Los Cabos.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Configurar Traslado' : 'Configure Transfer'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </div>

          <Link href={`/${lang}/agencies`} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Briefcase size={20} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.agencies?.title || 'Agencias de Viajes'}</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">{t.agencies?.desc || 'Asóciate con nosotros y obtén descuentos.'}</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Ver Información' : 'View Info'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </Link>

          <Link href={`/${lang}/weddings`} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><HeartHandshake size={20} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.weddings?.title || 'Bodas y Eventos'}</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">{t.weddings?.desc || 'Todo para tu día especial en Los Cabos.'}</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Ver Información' : 'View Info'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA B: FORMULARIO DE CENAS
  // ==========================================
  if (vistaEspecial === 'cenas') {
    return (
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-6 md:p-10 animate-fade-in max-w-4xl mx-auto">
        <div className="w-full mb-6 flex justify-start">
          <button onClick={() => setVistaEspecial(null)} className="text-blue-600 font-bold flex items-center hover:text-blue-800 transition">
            <span className="mr-2">←</span> {lang === 'es' ? 'Volver a Servicios Especiales' : 'Back to Special Services'}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 text-sm font-semibold mb-8 flex items-start gap-3">
          <Info size={20} className="shrink-0 mt-0.5" />
          <p>El servicio de traslado para cenas contempla un <strong>máximo de 3 horas</strong> de espera en el restaurante.</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900">Reserva de Transporte para Cenas</h2>
          <p className="text-sm text-slate-500 mt-1">Completa los datos para calcular tu tarifa y asegurar tu traslado.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Origen (Zona)</label>
            <select value={cenaOrigen} onChange={(e) => setCenaOrigen(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-700 font-medium">
              <option value="" disabled>Selecciona tu zona actual...</option>
              <option value="Hotel|1">Zona 1 (San José del Cabo)</option>
              <option value="Hotel|2">Zona 2 (Corredor Turístico)</option>
              <option value="Hotel|3">Zona 3 (Cabo San Lucas)</option>
              <option value="Hotel|4">Zona 4 (Sitio Pacífico)</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Destino (Área del Restaurante)</label>
            <select value={cenaDestino} onChange={(e) => setCenaDestino(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-700 font-medium">
              <option value="" disabled>Selecciona destino...</option>
              <option value="sjc">San José del Cabo</option>
              <option value="corredor">Corredor Turístico</option>
              <option value="csl">Cabo San Lucas</option>
              <option value="pacifico">Sitio Pacífico</option>
            </select>
          </div>
          
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre exacto del Restaurante</label>
            <input type="text" placeholder="Ej. Flora Farms, Acre, etc." value={cenaRestauranteNombre} onChange={(e) => setCenaRestauranteNombre(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-700 font-medium" />
          </div>
          
          <div className="md:col-span-2 mt-4 bg-[#0f172a] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-xl">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Subtotal (USD)</p>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight">
                {totalPrecioCena > 0 ? `$${totalPrecioCena.toFixed(2)}` : '---'}
              </h3>
            </div>
            <button 
              disabled={!cenaDestino || !cenaRestauranteNombre || !cenaOrigen} 
              onClick={handleAddCena} 
              className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/50"
            >
              <Plus size={20} className="mr-2" /> Añadir a mi Combo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback temporal para Nightlife, Hotel y Golf
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 animate-fade-in max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4">Módulo en construcción</h2>
      <p className="text-slate-500 mb-8">El formulario para <strong>{vistaEspecial}</strong> se agregará aquí. Puedes usar el de Cenas como plantilla.</p>
      <button onClick={() => setVistaEspecial(null)} className="px-6 py-3 bg-blue-100 text-blue-900 font-bold rounded-xl hover:bg-blue-200 transition-colors">
        Volver a las tarjetas
      </button>
    </div>
  );
}