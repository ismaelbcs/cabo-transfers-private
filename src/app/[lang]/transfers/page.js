'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Calendar, Plus, CheckCircle, ShoppingBag, Baby } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useBooking } from '../../../context/BookingContext';
import { catalogoHoteles } from '../../../data/seoData';

export default function TransfersPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const lang = resolvedParams?.lang || 'en';

  const { agregarAlCombo } = useCart();
  const { setServicioSeleccionado, setPaso, setSubCategoria } = useBooking();

  const [hotelOrigen, setHotelOrigen] = useState('');
  const [busquedaHotelOrigen, setBusquedaHotelOrigen] = useState('');
  const [mostrarDropdownHotel, setMostrarDropdownHotel] = useState(false);

  const [hotelDestino, setHotelDestino] = useState('');
  const [hotelLugarNombre, setHotelLugarNombre] = useState('');
  const [hotelFecha, setHotelFecha] = useState('');
  const [hotelPax, setHotelPax] = useState('1-4');
  const [hotelHora, setHotelHora] = useState('');

  // Extras
  const [paradaCompras, setParadaCompras] = useState(false);
  const [carSeat, setCarSeat] = useState(0);
  const [babySeat, setBabySeat] = useState(0);
  const [boosterSeat, setBoosterSeat] = useState(0);

  const matrizPreciosHotel = {
    'sjc': { '1': 70, '2': 100, '3': 100, '4': 150 },
    'corredor': { '1': 80, '2': 70, '3': 100, '4': 150 },
    'csl': { '1': 100, '2': 100, '3': 80, '4': 150 },
    'pacifico': { '1': 150, '2': 150, '3': 150, '4': 100 }
  };

  const recargoPax = { '1-4': 0, '5-8': 30, '9-10': 45 };

  let totalPrecioHotel = 0;
  if (hotelOrigen && hotelDestino) {
    const zonaSeleccionada = String(hotelOrigen.split('|')[1]) || "1";
    const precioBase = Number(matrizPreciosHotel[hotelDestino]?.[zonaSeleccionada] || 0);
    totalPrecioHotel = precioBase + Number(recargoPax[hotelPax] || 0);
  }

  // Add-ons
  if (paradaCompras && totalPrecioHotel > 0) {
    totalPrecioHotel += 30;
  }

  const granTotalHotel = totalPrecioHotel > 0 ? totalPrecioHotel : 0;

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
          
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">{lang === 'es' ? 'Reserva de Transporte Hotel a Hotel' : 'Hotel to Hotel Transportation Booking'}</h1>
            <p className="text-sm text-gray-500">{lang === 'es' ? 'Completa los datos para calcular tu tarifa y asegurar tu traslado.' : 'Fill out the details to calculate your rate and secure your transfer.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col relative">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Origen (Hotel de salida)' : 'Origin (Departure Hotel)'}</label>
              <input type="text" placeholder={lang === 'es' ? 'Escribe para buscar tu hotel...' : 'Type to search your hotel...'} value={busquedaHotelOrigen} onChange={(e) => { setBusquedaHotelOrigen(e.target.value); setMostrarDropdownHotel(true); if (e.target.value === '') setHotelOrigen(''); }} onFocus={() => setMostrarDropdownHotel(true)} onBlur={() => setTimeout(() => setMostrarDropdownHotel(false), 200)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition text-gray-700" />
              {mostrarDropdownHotel && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 top-[76px] max-h-60 overflow-y-auto">
                  {catalogoHoteles.filter(h => (busquedaHotelOrigen || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map((hotel, idx) => (
                    <li key={`${hotel.id}-${idx}`} onMouseDown={() => { const zona = hotel.zonaId || hotel.zona || "1"; setHotelOrigen(`${hotel.nombre}|${zona}`); setBusquedaHotelOrigen(`${hotel.nombre} (Zona ${zona})`); setMostrarDropdownHotel(false); }} className="p-3 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-0 transition flex justify-between">
                      <span>{hotel.nombre}</span><span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-1 rounded-md">{lang === 'es' ? 'Zona' : 'Zone'} {hotel.zonaId || hotel.zona || 1}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Destino (Área del Hotel)' : 'Destination (Hotel Area)'}</label>
              <select value={hotelDestino} onChange={(e) => setHotelDestino(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700">
                <option value="" disabled>{lang === 'es' ? 'Selecciona una opción...' : 'Select an option...'}</option>
                <option value="sjc">San José del Cabo</option>
                <option value="corredor">{lang === 'es' ? 'Corredor Turístico' : 'Tourist Corridor'}</option>
                <option value="csl">Cabo San Lucas</option>
                <option value="pacifico">{lang === 'es' ? 'Sitio Pacífico' : 'Pacific Side'}</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Nombre exacto del Hotel de Destino' : 'Exact Name of Destination Hotel'}</label>
              <input type="text" placeholder={lang === 'es' ? 'Ej. Hard Rock Hotel, Nobu, etc.' : 'E.g. Hard Rock Hotel, Nobu, etc.'} value={hotelLugarNombre} onChange={(e) => setHotelLugarNombre(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Fecha del Traslado' : 'Transfer Date'}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="date" value={hotelFecha} onChange={(e) => setHotelFecha(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
              </div>
            </div>

            <div className="flex flex-col grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Pasajeros' : 'Passengers'}</label>
                <select value={hotelPax} onChange={(e) => setHotelPax(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700">
                  <option value="1-4">1 a 4 {lang === 'es' ? 'Pasajeros' : 'Pax'}</option>
                  <option value="5-8">5 a 8 {lang === 'es' ? 'Pasajeros' : 'Pax'}</option>
                  <option value="9-10">9 a 10 {lang === 'es' ? 'Pasajeros' : 'Pax'}</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">{lang === 'es' ? 'Hora de recogida' : 'Pick-up time'}</label>
                <input type="time" value={hotelHora} onChange={(e) => setHotelHora(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-700" />
              </div>
            </div>

            {/* SECCIÓN DE EXTRAS Y ADD-ONS */}
            <div className="md:col-span-2 mt-4 pt-6">
              <div className="flex items-center mb-6">
                <Baby size={24} className="text-[#0B1A3B] mr-2" /> 
                <h3 className="text-lg font-extrabold text-[#0B1A3B]">{lang === 'es' ? 'Opciones Adicionales' : 'Additional Options'}</h3>
              </div>
              
              {/* Sillas de niños (Gratis) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Card 1: Car Seat */}
                <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
                  <div className="mb-4">
                    <span className="block font-bold text-[#0B1A3B] text-sm">Car Seat</span>
                    <span className="block text-green-600 font-semibold text-xs">{lang === 'es' ? 'Gratis' : 'Free'}</span>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-10">
                    <button onClick={() => setCarSeat(Math.max(0, carSeat - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition">-</button>
                    <div className="flex-1 text-center font-bold text-gray-900 bg-white h-full flex items-center justify-center border-x border-gray-200">{carSeat}</div>
                    <button onClick={() => setCarSeat(carSeat + 1)} className="w-10 h-full flex items-center justify-center text-blue-600 hover:bg-gray-200 bg-blue-50/50 transition">+</button>
                  </div>
                </div>

                {/* Card 2: Baby Seat */}
                <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
                  <div className="mb-4">
                    <span className="block font-bold text-[#0B1A3B] text-sm">Baby Seat</span>
                    <span className="block text-green-600 font-semibold text-xs">{lang === 'es' ? 'Gratis' : 'Free'}</span>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-10">
                    <button onClick={() => setBabySeat(Math.max(0, babySeat - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition">-</button>
                    <div className="flex-1 text-center font-bold text-gray-900 bg-white h-full flex items-center justify-center border-x border-gray-200">{babySeat}</div>
                    <button onClick={() => setBabySeat(babySeat + 1)} className="w-10 h-full flex items-center justify-center text-blue-600 hover:bg-gray-200 bg-blue-50/50 transition">+</button>
                  </div>
                </div>

                {/* Card 3: Booster Seat */}
                <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
                  <div className="mb-4">
                    <span className="block font-bold text-[#0B1A3B] text-sm">Booster Seat</span>
                    <span className="block text-green-600 font-semibold text-xs">{lang === 'es' ? 'Gratis' : 'Free'}</span>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-10">
                    <button onClick={() => setBoosterSeat(Math.max(0, boosterSeat - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition">-</button>
                    <div className="flex-1 text-center font-bold text-gray-900 bg-white h-full flex items-center justify-center border-x border-gray-200">{boosterSeat}</div>
                    <button onClick={() => setBoosterSeat(boosterSeat + 1)} className="w-10 h-full flex items-center justify-center text-blue-600 hover:bg-gray-200 bg-blue-50/50 transition">+</button>
                  </div>
                </div>
              </div>
                
              {/* Parada de compras */}
              <div className="flex items-center p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:border-blue-300 transition cursor-pointer mb-6" onClick={() => setParadaCompras(!paradaCompras)}>
                <input type="checkbox" checked={paradaCompras} onChange={() => {}} className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-4 cursor-pointer" />
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center mr-4 border border-gray-200">
                  <ShoppingBag size={20} />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center">
                    <span className="font-extrabold text-[#0B1A3B] mr-3">{lang === 'es' ? 'Parada de Compras (Shopping Stop)' : 'Grocery Stop (Shopping Stop)'}</span>
                    <span className="font-extrabold text-blue-600">+$30 USD</span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{lang === 'es' ? '1 hora en supermercado para compras.' : '1 hour at the supermarket for groceries.'}</span>
                </div>
              </div>
            </div>

            {/* TOTAL Y BOTON */}
            <div className="md:col-span-2 mt-6 bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-md">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className="text-sm text-gray-400 font-medium mb-1">{lang === 'es' ? 'Costo de este servicio (USD)' : 'Service Cost (USD)'}</p>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {granTotalHotel > 0 ? `$${granTotalHotel.toFixed(2)}` : '---'}
                </h3>
                {granTotalHotel === 0 ? (
                  <p className="text-xs text-yellow-400 mt-2 font-medium">{lang === 'es' ? 'Selecciona área de destino para calcular' : 'Select destination area to calculate'}</p>
                ) : (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 flex items-center justify-center md:justify-start"><CheckCircle size={14} className="mr-1" /> {lang === 'es' ? 'Impuestos incluidos' : 'Taxes included'}</p>
                  </div>
                )}
              </div>
              <button
                disabled={!hotelOrigen || !hotelDestino || !hotelLugarNombre || !hotelFecha || !hotelHora}
                onClick={() => {
                  let extrasInfo = [];
                  if (paradaCompras) extrasInfo.push('Parada de Compras');
                  if (carSeat > 0) extrasInfo.push(`${carSeat} Car Seat`);
                  if (babySeat > 0) extrasInfo.push(`${babySeat} Baby Seat`);
                  if (boosterSeat > 0) extrasInfo.push(`${boosterSeat} Booster`);

                  agregarAlCombo({
                    id: `transfers-${Date.now()}`,
                    titulo: lang === 'es' ? `Hotel a Hotel: ${hotelLugarNombre}` : `Hotel to Hotel: ${hotelLugarNombre}`,
                    subtitulo: `Fecha: ${hotelFecha} | Pax: ${hotelPax} | Hora: ${hotelHora}${extrasInfo.length > 0 ? ` | Extras: ${extrasInfo.join(', ')}` : ''}`,
                    precio: granTotalHotel,
                    tipoEspecial: 'hotel',
                    config: { hotelOrigen, hotelDestino, hotelPax, hotelFecha, hotelLugarNombre, hotelHora, paradaCompras, carSeat, babySeat, boosterSeat }
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
