'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Car, Users, Baby, ShoppingBag, CheckCircle, ChevronLeft, Plus } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useCart } from '../context/CartContext';
import { catalogoHoteles, zonasData } from '../data/seoData';

const VEHICULOS = [
  { id: 'suburban', nombre: 'Luxury SUV', maxPax: 6, descripcion: { es: 'Elegancia y confort para familias o grupos pequeños.', en: 'Elegance and comfort for families or small groups.' } },
  { id: 'sprinter', nombre: 'Van', maxPax: 10, descripcion: { es: 'Amplitud y lujo para grupos grandes.', en: 'Spaciousness and luxury for large groups.' } },
];

export default function TransportBookingForm({ lang = 'es' }) {
  const router = useRouter();
  const { reserva, setReserva, servicioSeleccionado, setServicioSeleccionado, setPaso, currentUser } = useBooking(); // <--- AÑADIDO currentUser
  const { agregarAlCombo } = useCart();

  const [busquedaHotelPrincipal, setBusquedaHotelPrincipal] = useState(reserva.hotelId || '');
  const [mostrarDropdownHotelPrincipal, setMostrarDropdownHotelPrincipal] = useState(false);

  useEffect(() => {
    if (reserva.hotelId) {
      setBusquedaHotelPrincipal(reserva.hotelId);
    }
  }, [reserva.hotelId]);

  const handleChange = (e) => setReserva(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const updateSeat = (e, type, increment) => {
    e.preventDefault();
    setReserva(prev => {
      const current = prev[type] || 0;
      const newVal = increment ? current + 1 : Math.max(0, current - 1);
      return { ...prev, [type]: newVal };
    });
  };

  const zonaSeleccionada = zonasData.find(z => z.id === parseInt(reserva.zonaId || 1));
  let tarifaBase = 0;

  if (zonaSeleccionada) {
    tarifaBase = reserva.vehiculo === 'suburban' ? zonaSeleccionada.tarifaSuburban : zonaSeleccionada.tarifaSprinter;
  }

  const multiplicadorViaje = servicioSeleccionado === 'redondo' ? 2 : 1;
  const precioShopping = reserva.shoppingStop ? 30 : 0;
  
  // Reemplaza la matemática por esta línea simple:
  const totalReal = (tarifaBase * multiplicadorViaje) + precioShopping;

  const formularioCompleto = reserva.hotelId && reserva.fechaLlegada && (servicioSeleccionado !== 'redondo' || reserva.fechaSalida);

  const handleAddToCart = () => {
    agregarAlCombo({
      id: `trans-${Date.now()}`,
      servicio: servicioSeleccionado, // <--- ESTA ES LA LÍNEA MÁGICA QUE FALTABA
      titulo: servicioSeleccionado === 'aeropuerto_hotel'
        ? (lang === 'es' ? 'AEROPUERTO → HOTEL' : 'AIRPORT → HOTEL')
        : servicioSeleccionado === 'hotel_aeropuerto'
          ? (lang === 'es' ? 'HOTEL → AEROPUERTO' : 'HOTEL → AIRPORT')
          : (lang === 'es' ? 'VIAJE REDONDO' : 'ROUND TRIP'),
      subtitulo: `${reserva.hotelId} | ${lang === 'es' ? 'Vehículo:' : 'Vehicle:'} ${reserva.vehiculo.toUpperCase()}`,
      precio: totalReal,
      tipoEspecial: 'transporte',
      config: reserva
    });

    // 👇 REDIRIGE A LA PÁGINA DEL CARRITO (CART) PARA VER LOS TOURS EXTRAS
    router.push(`/${lang}/cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* FORMULARIO IZQUIERDO */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-10">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <MapPin className="text-blue-600" size={24} />
              {lang === 'es' ? 'Detalles de tu Reserva' : 'Booking Details'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/datos-seguros.png" alt={lang === 'es' ? 'Datos Seguros' : 'Secure Data'} className="h-6 md:h-8 w-auto object-contain" />
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {lang === 'es' ? 'Datos Protegidos' : 'Protected Data'}
                  </span>
                  <span className="text-xs font-black text-slate-700 leading-none">
                    {lang === 'es' ? 'Pago 100% Seguro' : '100% Secure Checkout'}
                  </span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <img src="/pago-tarjetas.png" alt="Métodos de Pago" className="h-6 md:h-7 w-auto object-contain hidden sm:block" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="w-full flex justify-between items-center gap-4">
              <button onClick={() => { setServicioSeleccionado(''); setPaso(1); router.push(`/${lang}`); }} className="text-slate-500 font-bold text-sm flex items-center hover:text-slate-900 transition-colors group">
                <span className="mr-2 text-lg leading-none group-hover:-translate-x-1 transition-transform">&larr;</span>
                {lang === 'es' ? 'Volver a las opciones' : 'Back to options'}
              </button>
            </div>

            <div className="flex flex-col relative">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Selecciona tu hotel' : 'Select your hotel'}</label>
              <input
                type="text"
                placeholder={lang === 'es' ? 'Escribe para buscar tu hotel...' : 'Type to search your hotel...'}
                value={busquedaHotelPrincipal}
                onChange={(e) => { setBusquedaHotelPrincipal(e.target.value); setMostrarDropdownHotelPrincipal(true); }}
                onFocus={() => setMostrarDropdownHotelPrincipal(true)}
                onBlur={() => setTimeout(() => setMostrarDropdownHotelPrincipal(false), 200)}
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 focus:bg-white outline-none transition-all bg-slate-50 text-slate-900 font-bold"
              />
              {mostrarDropdownHotelPrincipal && (
                <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-2xl mt-1 top-[80px] max-h-60 overflow-y-auto">
                  {catalogoHoteles.filter(h => h.nombre && (busquedaHotelPrincipal || '').toLowerCase().split(' ').every(w => h.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(w.normalize('NFD').replace(/[\u0300-\u036f]/g, "")))).slice(0, 30).map(hotel => (
                    <li key={hotel.id || hotel.nombre} onMouseDown={() => {
                      const zona = hotel.zonaId || hotel.zona || "1";
                      setReserva({ ...reserva, hotelId: hotel.nombre, zonaId: zona });
                      setBusquedaHotelPrincipal(`${hotel.nombre}`);
                      setMostrarDropdownHotelPrincipal(false);
                    }} className="p-4 hover:bg-slate-50 cursor-pointer text-slate-700 border-b border-slate-100 last:border-0 transition flex justify-between items-center">
                      <span className="font-bold">{hotel.nombre}</span><span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded-md tracking-wider">Zona {hotel.zonaId || hotel.zona || 1}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{lang === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type'}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VEHICULOS.map(v => (
                  <div key={v.id} onClick={() => setReserva(prev => ({ ...prev, vehiculo: v.id }))} className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${reserva.vehiculo === v.id ? 'border-slate-900 bg-slate-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg text-slate-900 tracking-tight">{v.nombre}</span>
                      <Car className={reserva.vehiculo === v.id ? 'text-slate-900' : 'text-slate-400'} size={24} />
                    </div>
                    <p className="text-sm text-slate-500 mb-4 font-medium">{v.descripcion[lang]}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 bg-white inline-flex px-2.5 py-1 rounded-md border border-slate-100">
                      <Users size={14} className="text-slate-400" /> {lang === 'es' ? `Máx ${v.maxPax} pax` : `Max ${v.maxPax} pax`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Fecha de Llegada' : 'Arrival Date'}</label>
                <input type="date" name="fechaLlegada" value={reserva.fechaLlegada} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Pasajeros' : 'Passengers'}</label>
                <input
                  type="number" name="pasajeros" min="1" max="10" value={reserva.pasajeros}
                  onChange={(e) => {
                    let numPasajeros = parseInt(e.target.value);
                    if (isNaN(numPasajeros) || numPasajeros < 1) numPasajeros = '';
                    if (numPasajeros > 10) numPasajeros = 10;
                    let nuevoVehiculo = reserva.vehiculo;
                    if (numPasajeros > 6) nuevoVehiculo = 'sprinter';
                    setReserva({ ...reserva, pasajeros: numPasajeros, vehiculo: nuevoVehiculo });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

              {servicioSeleccionado === 'redondo' && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{lang === 'es' ? 'Fecha de Regreso' : 'Departure Date'}</label>
                  <input type="date" name="fechaSalida" value={reserva.fechaSalida} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-8 mt-8">
              <h4 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest"><Baby size={16} className="text-slate-400" /> {lang === 'es' ? 'Opciones Adicionales' : 'Additional Options'}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="mb-4"><p className="font-bold text-slate-900 text-sm">Car Seat</p><p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-0.5">{lang === 'es' ? 'Gratis' : 'Free'}</p></div>
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <button onClick={(e) => updateSeat(e, 'carSeat', false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold">-</button>
                    <span className="text-sm font-black text-slate-900">{reserva.carSeat}</span>
                    <button onClick={(e) => updateSeat(e, 'carSeat', true)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold">+</button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="mb-4"><p className="font-bold text-slate-900 text-sm">Baby Seat</p><p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-0.5">{lang === 'es' ? 'Gratis' : 'Free'}</p></div>
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <button onClick={(e) => updateSeat(e, 'babySeat', false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold">-</button>
                    <span className="text-sm font-black text-slate-900">{reserva.babySeat}</span>
                    <button onClick={(e) => updateSeat(e, 'babySeat', true)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold">+</button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="mb-4"><p className="font-bold text-slate-900 text-sm">Booster Seat</p><p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-0.5">{lang === 'es' ? 'Gratis' : 'Free'}</p></div>
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <button onClick={(e) => updateSeat(e, 'boosterSeat', false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold">-</button>
                    <span className="text-sm font-black text-slate-900">{reserva.boosterSeat}</span>
                    <button onClick={(e) => updateSeat(e, 'boosterSeat', true)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold">+</button>
                  </div>
                </div>
              </div>

              <label className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-colors ${reserva.shoppingStop ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="checkbox" name="shoppingStop" checked={reserva.shoppingStop} onChange={(e) => setReserva({ ...reserva, shoppingStop: e.target.checked })} className="w-5 h-5 accent-slate-900" />
                <ShoppingBag className={reserva.shoppingStop ? 'text-slate-900' : 'text-slate-400'} size={24} />
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm md:text-base tracking-tight">{lang === 'es' ? 'Parada de Compras (Shopping Stop)' : 'Grocery Stop'} <span className="text-slate-500 ml-2 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">+$30 USD</span></p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{lang === 'es' ? '1 hora en supermercado para compras.' : '1 hour stop at a supermarket.'}</p>
                </div>
              </label>
            </div>

          </div>
        </div>

        {/* WIDGET OSCURO DERECHO */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 md:p-10 text-white sticky top-28 border border-slate-800">
            <h3 className="text-xl font-bold mb-8 border-b border-slate-800 pb-4 tracking-tight">{lang === 'es' ? 'Resumen de Cotización' : 'Booking Summary'}</h3>

            <div className="space-y-4 text-sm mb-8 text-slate-300 font-medium">
              <div className="flex justify-between border-b border-slate-800 pb-4">
                <span className="font-bold text-white uppercase tracking-widest text-[11px]">
                  {servicioSeleccionado === 'aeropuerto_hotel' ? (lang === 'es' ? 'AEROPUERTO → HOTEL' : 'AIRPORT → HOTEL') : servicioSeleccionado === 'hotel_aeropuerto' ? (lang === 'es' ? 'HOTEL → AEROPUERTO' : 'HOTEL → AIRPORT') : (lang === 'es' ? 'VIAJE REDONDO' : 'ROUND TRIP')}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span>{lang === 'es' ? 'Pasajeros:' : 'Passengers:'}</span>
                <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-lg">{reserva.pasajeros}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>{lang === 'es' ? 'Vehículo:' : 'Vehicle:'}</span>
                <span className="font-bold text-white uppercase text-[10px] tracking-widest bg-slate-800 px-3 py-1 rounded-lg">{reserva.vehiculo}</span>
              </div>

              {(reserva.carSeat > 0 || reserva.babySeat > 0 || reserva.boosterSeat > 0 || reserva.shoppingStop) && (
                <div className="pt-4 border-t border-slate-800 space-y-3 mt-4">
                  {reserva.carSeat > 0 && <div className="flex justify-between text-slate-400"><span>- Car Seat:</span> <span className="text-white bg-slate-800 px-2 py-0.5 rounded text-xs">{reserva.carSeat} ({lang === 'es' ? 'Gratis' : 'Free'})</span></div>}
                  {reserva.babySeat > 0 && <div className="flex justify-between text-slate-400"><span>- Baby Seat:</span> <span className="text-white bg-slate-800 px-2 py-0.5 rounded text-xs">{reserva.babySeat} ({lang === 'es' ? 'Gratis' : 'Free'})</span></div>}
                  {reserva.boosterSeat > 0 && <div className="flex justify-between text-slate-400"><span>- Booster Seat:</span> <span className="text-white bg-slate-800 px-2 py-0.5 rounded text-xs">{reserva.boosterSeat} ({lang === 'es' ? 'Gratis' : 'Free'})</span></div>}
                  {reserva.shoppingStop && <div className="flex justify-between text-slate-300 font-bold"><span>{lang === 'es' ? 'Parada de Compras' : 'Grocery Stop'}</span> <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px]">+$30 USD</span></div>}
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-8 mb-8">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{lang === 'es' ? 'Subtotal del Servicio (USD)' : 'Service Subtotal (USD)'}</p>
              <p className="text-5xl font-black text-white tracking-tighter">${totalReal.toFixed(2)}</p>
              <p className="text-[11px] font-bold tracking-wide text-slate-400 mt-3 flex items-center gap-1.5"><CheckCircle size={14} className="text-slate-500" /> {lang === 'es' ? 'Impuestos incluidos' : 'Taxes included'}</p>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => { setServicioSeleccionado(''); setPaso(1); router.push(`/${lang}`); }} className="px-5 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors flex items-center font-bold gap-1 active:scale-95 text-sm">
                <ChevronLeft size={18} /> {lang === 'es' ? 'Atrás' : 'Back'}
              </button>
              <button
                disabled={!formularioCompleto}
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center transition-all text-sm ${formularioCompleto ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-md cursor-pointer active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
              >
                {lang === 'es' ? 'Añadir a mi combo' : 'Add to my combo'} <Plus size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}