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
          
          <Link href={`/${lang}/dinners`} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">🍽️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cenas y Restaurantes</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Disfruta tu velada sin preocuparte por el volante.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Configurar Traslado' : 'Configure Transfer'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </Link>

          <Link href={`/${lang}/nightlife`} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">🍸</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nightlife</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Transporte seguro para disfrutar la vida nocturna de Los Cabos.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Configurar Traslado' : 'Configure Transfer'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </Link>

          <Link href={`/${lang}/transfers`} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Car size={20} /></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hotel a Hotel</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Cambia de resort con comodidad y espacio para tu equipaje.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Configurar Traslado' : 'Configure Transfer'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </Link>

          <Link href={`/${lang}/golf`} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">⛳</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Campos de Golf</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Transporte ida y vuelta a los mejores campos de Los Cabos.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Configurar Traslado' : 'Configure Transfer'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </Link>

          <a href={`/${lang}/agencies`} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">💼</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Agencias de Viajes</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Asóciate con nosotros y obtén beneficios exclusivos.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Ver Información' : 'View Info'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </a>

          <a href={`/${lang}/weddings`} className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition flex flex-col h-full group">
            <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl">💍</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Bodas y Eventos</h3>
            <p className="text-sm text-slate-500 flex-grow mb-6">Todo lo que necesitas para tu evento especial en Cabo.</p>
            <div className="text-blue-900 font-bold text-sm flex items-center justify-between group-hover:text-blue-600">
              {lang === 'es' ? 'Ver Información' : 'View Info'} <span className="text-lg leading-none">&rsaquo;</span>
            </div>
          </a>

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