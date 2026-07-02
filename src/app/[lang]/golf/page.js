'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Calendar, Plus, CheckCircle } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useBooking } from '../../../context/BookingContext';
import { catalogoHoteles } from '../../../data/seoData';

export default function GolfPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const lang = resolvedParams?.lang || 'en';

  const { agregarAlCombo } = useCart();
  const { setServicioSeleccionado, setPaso, setSubCategoria } = useBooking();

  const [golfOrigen, setGolfOrigen] = useState('');
  const [busquedaGolfOrigen, setBusquedaGolfOrigen] = useState('');
  const [mostrarDropdownGolf, setMostrarDropdownGolf] = useState(false);

  const [golfDestino, setGolfDestino] = useState('');
  const [golfLugarNombre, setGolfLugarNombre] = useState('');
  const [golfFecha, setGolfFecha] = useState('');
  const [golfPax, setGolfPax] = useState('1-4');

  const [golfHora, setGolfHora] = useState(''); // Pick-up
  const [golfHoraRegreso, setGolfHoraRegreso] = useState(''); // Return

  const matrizPreciosGolf = {
    'sjc': { '1': 160, '2': 200, '3': 220, '4': 250 },
    'corredor': { '1': 200, '2': 160, '3': 200, '4': 250 },
    'csl': { '1': 220, '2': 200, '3': 160, '4': 250 },
    'pacifico': { '1': 250, '2': 250, '3': 250, '4': 180 }
  };

  const recargoGolf = { '1-4': 0, '5-8': 30, '9-10': 45 };

  let totalPrecioGolf = 0;
  if (golfOrigen && golfDestino) {
    const zonaSeleccionada = String(golfOrigen.split('|')[1]) || "1";
    const precioBase = Number(matrizPreciosGolf[golfDestino]?.[zonaSeleccionada] || 0);
    totalPrecioGolf = precioBase + Number(recargoGolf[golfPax] || 0);
  }

  const granTotalGolf = totalPrecioGolf > 0 ? totalPrecioGolf : 0;

  const calculoHorasGolf = useMemo(() => {
    if (!golfHora || !golfHoraRegreso) return { error: false, diffMin: 0 };
    const [sH, sM] = golfHora.split(':').map(Number);
    const [eH, eM] = golfHoraRegreso.split(':').map(Number);
    let startMin = sH * 60 + sM; 
    let endMin = eH * 60 + eM;
    if (endMin < startMin) endMin += 24 * 60;
    const diff = endMin - startMin; 
    return { error: diff > 300, diffMin: diff }; // 5 hours limit
  }, [golfHora, golfHoraRegreso]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="w-full mb-6 flex justify-between items-center">
          <button onClick={() => router.push(`/${lang}`)} className="text-slate-500 font-bold flex items-center hover:text-slate-800 transition text-sm">
            <span className="mr-2">←</span> {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </button>
          
          <button 
            onClick={() => {
              setPaso(2);
              setServicioSeleccionado('tours');
              setSubCategoria('especiales');
              router.push(`/${lang}`);
            }} 
            className="text-blue-600 font-bold flex items-center hover:text-blue-800 transition bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full text-sm border border-blue-100"
          >
            {lang === 'es' ? 'Otros Servicios Especiales' : 'Other Special Services'} <span className="ml-2">→</span>
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 animate-fade-in relative">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 text-sm font-semibold mb-6 flex items-start gap-3">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p>{lang === 'es' ? 'El servicio de traslado para campos de golf contempla un ' : 'The Golf transfer service includes a '}<strong>{lang === 'es' ? 'máximo de 4 horas' : 'maximum of 4 hours'}</strong>{lang === 'es' ? ' de espera en el campo (más 1 hora de traslado).' : ' of wait time at the course (plus 1 hour of transit).'}</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">{lang === 'es' ? 'Reserva de Transporte para Campos de Golf' : 'Golf Course Transportation Booking'}</h1>
            <p className="text-sm text-gray-500">{lang === 'es' ? 'Completa los datos para calcular tu tarifa y asegurar tu traslado.' : 'Fill out the details to calculate your rate and secure your transfer.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col relative">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? '¿De dónde sales?' : 'Where are you departing from?'}</label>
              <input type="text" placeholder={lang === 'es' ? 'Escribe para buscar tu hotel...' : 'Type to search your hotel...'} value={busquedaGolfOrigen} onChange={(e) => { setBusquedaGolfOrigen(e.target.value); setMostrarDropdownGolf(true); if (e.target.value === '') setGolfOrigen(''); }} onFocus={() => setMostrarDropdownGolf(true)} onBlur={() => setTimeout(() => setMostrarDropdownGolf(false), 200)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition text-gray-700" />
              {mostrarDropdownGolf && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 top-[76px] max-h-60 overflow-y-auto">
                  {catalogoHoteles.filter(h => (busquedaGolfOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map((hotel, idx) => (
                    <li key={`${hotel.id}-${idx}`} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setGolfOrigen(`${hotel.nombre}|${zona}`); setBusquedaGolfOrigen(`${hotel.nombre} (Zona ${zona})`); setMostrarDropdownGolf(false); }} className="p-3 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-0 transition flex justify-between">
                      <span>{hotel.nombre}</span><span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-1 rounded-md">{lang === 'es' ? 'Zona' : 'Zone'} {hotel.zonaId || hotel.zona || 1}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? '¿En qué área está el campo de golf?' : 'Golf Course Area?'}</label>
              <select value={golfDestino} onChange={(e) => setGolfDestino(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700">
                <option value="" disabled>{lang === 'es' ? 'Selecciona una opción...' : 'Select an option...'}</option>
                <option value="sjc">San José del Cabo</option>
                <option value="corredor">{lang === 'es' ? 'Corredor Turístico' : 'Tourist Corridor'}</option>
                <option value="csl">Cabo San Lucas</option>
                <option value="pacifico">{lang === 'es' ? 'Sitio Pacífico' : 'Pacific Side'}</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Nombre exacto del campo de golf' : 'Exact Golf Course Name'}</label>
              <input type="text" placeholder={lang === 'es' ? 'Ej. Quivira, Diamante, etc.' : 'E.g. Quivira, Diamante, etc.'} value={golfLugarNombre} onChange={(e) => setGolfLugarNombre(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Fecha del Servicio' : 'Service Date'}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="date" value={golfFecha} onChange={(e) => setGolfFecha(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Número de Pasajeros' : 'Number of Passengers'}</label>
              <select value={golfPax} onChange={(e) => setGolfPax(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700">
                <option value="1-4">1 a 4 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                <option value="5-8">5 a 8 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                <option value="9-10">9 a 10 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Hora de recogida del hotel' : 'Pick-up time (Hotel)'}</label>
                <input type="time" value={golfHora} onChange={(e) => { setGolfHora(e.target.value); if (!e.target.value) setGolfHoraRegreso(''); }} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
              </div>
              <div className="flex flex-col relative">
                <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Hora de recogida del campo (regreso)' : 'Pick-up time (Golf return)'}</label>
                <input 
                  type="time" 
                  value={golfHoraRegreso} 
                  onChange={(e) => setGolfHoraRegreso(e.target.value)} 
                  disabled={!golfHora}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed ${calculoHorasGolf.error ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-200'}`} 
                />
                {calculoHorasGolf.error && (
                  <div className="absolute top-full left-0 mt-2 p-3 bg-red-600 text-white text-xs font-bold rounded-lg shadow-xl z-10 animate-fade-in max-w-sm">
                    <div className="absolute -top-1 left-4 w-3 h-3 bg-red-600 transform rotate-45"></div>
                    ⚠️ {lang === 'es' ? 'No puedes exceder del horario que damos de 4 horas por servicio.' : 'You cannot exceed the 4 hour wait time per service.'}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 mt-4 bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-md">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className="text-sm text-gray-400 font-medium mb-1">{lang === 'es' ? 'Costo de este servicio (USD)' : 'Service Cost (USD)'}</p>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {granTotalGolf > 0 ? `$${granTotalGolf.toFixed(2)}` : '---'}
                </h3>
                {granTotalGolf === 0 ? (
                  <p className="text-xs text-yellow-400 mt-2 font-medium">{lang === 'es' ? 'Selecciona área del campo para calcular' : 'Select golf course area to calculate'}</p>
                ) : (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 flex items-center justify-center md:justify-start"><CheckCircle size={14} className="mr-1" /> {lang === 'es' ? 'Impuestos incluidos' : 'Taxes included'}</p>
                  </div>
                )}
              </div>
              <button
                disabled={!golfOrigen || !golfDestino || !golfLugarNombre || !golfFecha || !golfHora || !golfHoraRegreso || calculoHorasGolf.error}
                onClick={() => {
                  agregarAlCombo({
                    id: `golf-${Date.now()}`,
                    titulo: lang === 'es' ? `Golf: ${golfLugarNombre}` : `Golf: ${golfLugarNombre}`,
                    subtitulo: `Fecha: ${golfFecha} | Pax: ${golfPax} | ${golfHora} - ${golfHoraRegreso}`,
                    precio: granTotalGolf,
                    tipoEspecial: 'golf',
                    config: { golfOrigen, golfDestino, golfPax, golfFecha, golfLugarNombre, golfHora, golfHoraRegreso }
                  });
                  router.push(`/${lang}/cart`);
                }}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus size={20} className="mr-2" /> {lang === 'es' ? 'Añadir a mi Combo' : 'Add to Combo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
