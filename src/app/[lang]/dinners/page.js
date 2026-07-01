'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Calendar, Plus } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useBooking } from '../../../context/BookingContext';
import { catalogoHoteles } from '../../../data/seoData';

export default function DinnersPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const lang = resolvedParams?.lang || 'en';

  const { agregarAlCombo } = useCart();
  const { setServicioSeleccionado, setPaso, setSubCategoria } = useBooking();

  const [cenaOrigen, setCenaOrigen] = useState('');
  const [busquedaCenaOrigen, setBusquedaCenaOrigen] = useState('');
  const [mostrarDropdownCena, setMostrarDropdownCena] = useState(false);

  const [cenaDestino, setCenaDestino] = useState('');
  const [cenaRestauranteNombre, setCenaRestauranteNombre] = useState('');
  const [cenaFecha, setCenaFecha] = useState('');
  const [cenaPax, setCenaPax] = useState('1-4');

  const [cenaHora, setCenaHora] = useState('');
  const [cenaHoraRegreso, setCenaHoraRegreso] = useState('');

  const [reserva, setReserva] = useState({
    rosas: false,
    vino: false,
    vinoEspumoso: false
  });

  const matrizPreciosCenas = {
    'sjc': { '1': 120, '2': 140, '3': 170, '4': 250 },
    'corredor': { '1': 140, '2': 120, '3': 140, '4': 220 },
    'csl': { '1': 170, '2': 140, '3': 120, '4': 220 },
    'pacifico': { '1': 250, '2': 220, '3': 220, '4': 180 }
  };

  const recargoCenas = { '1-4': 0, '5-8': 30, '9-10': 45 };

  let totalPrecioCena = 0;
  if (cenaOrigen && cenaDestino) {
    const zonaSeleccionada = String(cenaOrigen.split('|')[1]) || "1";
    const precioBase = Number(matrizPreciosCenas[cenaDestino]?.[zonaSeleccionada] || 0);
    totalPrecioCena = precioBase + Number(recargoCenas[cenaPax] || 0);
  }

  const costoExtras = (reserva.rosas ? 50 : 0) + (reserva.vino ? 70 : 0) + (reserva.vinoEspumoso ? 70 : 0);
  const granTotalCena = totalPrecioCena > 0 ? totalPrecioCena + costoExtras : 0;

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

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 animate-fade-in">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 text-sm font-semibold mb-6 flex items-start gap-3">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p>{lang === 'es' ? 'El servicio de traslado para cenas contempla un ' : 'The dinner transfer service includes a '}<strong>{lang === 'es' ? 'máximo de 3 horas' : 'maximum of 3 hours'}</strong>{lang === 'es' ? ' de espera en el restaurante. Por favor, organiza tus horarios de regreso tomando esto en cuenta.' : ' of waiting time at the restaurant. Please plan your return times accordingly.'}</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">{lang === 'es' ? 'Reserva de Transporte para Cenas' : 'Dinner Transportation Booking'}</h1>
            <p className="text-sm text-gray-500">{lang === 'es' ? 'Completa los datos para calcular tu tarifa y asegurar tu traslado.' : 'Fill out the details to calculate your rate and secure your transfer.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col relative">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? '¿De dónde sales?' : 'Where are you departing from?'}</label>
              <input type="text" placeholder={lang === 'es' ? 'Escribe para buscar tu hotel...' : 'Type to search your hotel...'} value={busquedaCenaOrigen} onChange={(e) => { setBusquedaCenaOrigen(e.target.value); setMostrarDropdownCena(true); if (e.target.value === '') setCenaOrigen(''); }} onFocus={() => setMostrarDropdownCena(true)} onBlur={() => setTimeout(() => setMostrarDropdownCena(false), 200)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition text-gray-700" />
              {mostrarDropdownCena && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 top-[76px] max-h-60 overflow-y-auto">
                  {catalogoHoteles.filter(h => (busquedaCenaOrigen || '').toLowerCase().split(' ').every(w => h.nombre.toLowerCase().includes(w))).map((hotel, idx) => (
                    <li key={`${hotel.id}-${idx}`} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setCenaOrigen(`${hotel.nombre}|${zona}`); setBusquedaCenaOrigen(`${hotel.nombre} (Zona ${zona})`); setMostrarDropdownCena(false); }} className="p-3 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-0 transition flex justify-between">
                      <span>{hotel.nombre}</span><span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-1 rounded-md">{lang === 'es' ? 'Zona' : 'Zone'} {hotel.zonaId || hotel.zona || 1}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? '¿En qué área está el restaurante?' : 'Restaurant area?'}</label>
              <select value={cenaDestino} onChange={(e) => setCenaDestino(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700">
                <option value="" disabled>{lang === 'es' ? 'Selecciona una opción...' : 'Select an option...'}</option>
                <option value="sjc">San José del Cabo</option>
                <option value="corredor">{lang === 'es' ? 'Corredor Turístico' : 'Tourist Corridor'}</option>
                <option value="csl">Cabo San Lucas</option>
                <option value="pacifico">{lang === 'es' ? 'Sitio Pacífico' : 'Pacific Side'}</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Nombre exacto del Restaurante' : 'Exact Restaurant Name'}</label>
              <input type="text" placeholder={lang === 'es' ? 'Ej. Flora Farms, Acre, etc.' : 'E.g. Flora Farms, Acre, etc.'} value={cenaRestauranteNombre} onChange={(e) => setCenaRestauranteNombre(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Fecha del Servicio' : 'Service Date'}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="date" value={cenaFecha} onChange={(e) => setCenaFecha(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Número de Pasajeros' : 'Number of Passengers'}</label>
              <select value={cenaPax} onChange={(e) => setCenaPax(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700">
                <option value="1-4">1 a 4 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                <option value="5-8">5 a 8 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
                <option value="9-10">9 a 10 {lang === 'es' ? 'Pasajeros' : 'Passengers'}</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Hora de recogida de hotel' : 'Pick-up time (Hotel)'}</label>
                <input type="time" value={cenaHora} onChange={(e) => setCenaHora(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Hora de recogida del restaurante (regreso)' : 'Return time (Restaurant)'}</label>
                <input type="time" value={cenaHoraRegreso} onChange={(e) => setCenaHoraRegreso(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-2 md:col-span-2">
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">✨ {lang === 'es' ? 'Hazlo Especial' : 'Make it Special'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${reserva.rosas ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
                  <input type="checkbox" checked={reserva.rosas || false} onChange={(e) => setReserva({ ...reserva, rosas: e.target.checked })} className="w-5 h-5 accent-pink-600" />
                  <div className="text-2xl">🌹</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm leading-tight">{lang === 'es' ? 'Rosas' : 'Roses'} <span className="text-pink-600 block font-extrabold mt-1">+$50 USD</span></p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${reserva.vino ? 'border-purple-800 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                  <input type="checkbox" checked={reserva.vino || false} onChange={(e) => setReserva({ ...reserva, vino: e.target.checked })} className="w-5 h-5 accent-purple-800" />
                  <div className="text-2xl">🍷</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm leading-tight">{lang === 'es' ? 'Botella de Vino' : 'Bottle of Wine'} <span className="text-purple-800 block font-extrabold mt-1">+$70 USD</span></p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${reserva.vinoEspumoso ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                  <input type="checkbox" checked={reserva.vinoEspumoso || false} onChange={(e) => setReserva({ ...reserva, vinoEspumoso: e.target.checked })} className="w-5 h-5 accent-amber-600" />
                  <div className="text-2xl">🥂</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm leading-tight">{lang === 'es' ? 'Vino Espumoso' : 'Sparkling Wine'} <span className="text-amber-600 block font-extrabold mt-1">+$70 USD</span></p>
                  </div>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 mt-4 bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-md">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className="text-sm text-gray-400 font-medium mb-1">{lang === 'es' ? 'Costo de este servicio (USD)' : 'Service Cost (USD)'}</p>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {granTotalCena > 0 ? `$${granTotalCena.toFixed(2)}` : '---'}
                </h3>
                {granTotalCena === 0 ? (
                  <p className="text-xs text-yellow-400 mt-2 font-medium">{lang === 'es' ? 'Selecciona área del restaurante para calcular' : 'Select restaurant area to calculate'}</p>
                ) : (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 flex items-center justify-center md:justify-start">✓ {lang === 'es' ? 'Impuestos incluidos' : 'Taxes included'}</p>
                  </div>
                )}
              </div>
              <button
                disabled={!cenaOrigen || !cenaDestino || !cenaRestauranteNombre || !cenaFecha || !cenaHora || !cenaHoraRegreso}
                onClick={() => {
                  agregarAlCombo({
                    id: `cena-${Date.now()}`,
                    titulo: lang === 'es' ? `Cena: ${cenaRestauranteNombre}` : `Dinner: ${cenaRestauranteNombre}`,
                    subtitulo: `Fecha: ${cenaFecha} | Pax: ${cenaPax} | ${cenaHora} - ${cenaHoraRegreso}`,
                    precio: granTotalCena,
                    tipoEspecial: 'cena',
                    config: { cenaOrigen, cenaDestino, cenaPax, cenaFecha, cenaRestauranteNombre, cenaHora, cenaHoraRegreso, rosas: reserva.rosas, vino: reserva.vino, vinoEspumoso: reserva.vinoEspumoso }
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
