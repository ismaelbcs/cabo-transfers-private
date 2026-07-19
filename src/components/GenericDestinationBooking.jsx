'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ShieldCheck, Car, Users, PlaneLanding, PlaneTakeoff, RefreshCcw } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { catalogoHoteles } from '../data/seoData';
import TrustBadges from './TrustBadges';
import UrgencyBanner from './UrgencyBanner';

export default function GenericDestinationBooking({ lang = 'es', locationName = 'Los Cabos' }) {
  const router = useRouter();
  const { setReserva, setPaso, setBusquedaHotelPrincipal } = useBooking();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeHotelName, setActiveHotelName] = useState('');
  const [activeZona, setActiveZona] = useState(null);
  
  const [vehiculo, setVehiculo] = useState('suburban');
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [pasajeros, setPasajeros] = useState('1-4');
  
  const filteredHotels = useMemo(() => {
    if (!searchTerm) return catalogoHoteles;
    const lower = searchTerm.toLowerCase();
    return catalogoHoteles.filter(h => h.nombre.toLowerCase().includes(lower));
  }, [searchTerm]);

  const handleContinue = (tipoServicio) => {
    if (!activeHotelName) {
      alert(lang === 'es' ? 'Por favor, selecciona un hotel de la lista.' : 'Please select a hotel from the list.');
      return;
    }
    
    setReserva(prev => ({
      ...prev,
      servicio: 'aeropuerto',
      tipoViaje: tipoServicio,
      vehiculo: vehiculo,
      fechaLlegada: fechaLlegada,
      pasajeros: pasajeros,
      lugarDestino: activeHotelName,
      lugarDestinoNombre: activeHotelName,
      zonaId: activeZona,
    }));
    
    if (setBusquedaHotelPrincipal) setBusquedaHotelPrincipal(activeHotelName);
    
    if (setPaso) setPaso(2); 
    router.push(`/${lang}`);
    window.scrollTo(0, 0);
  };

  const getTarifa = (vehiculoType) => {
    if (!activeZona) return lang === 'es' ? 'Elige destino' : 'Select dest';
    const tarifas = {
      1: { suburban: 85, sprinter: 105 },
      2: { suburban: 95, sprinter: 115 },
      3: { suburban: 105, sprinter: 130 },
      4: { suburban: 140, sprinter: 165 },
      5: { suburban: 160, sprinter: 185 },
      6: { suburban: 195, sprinter: 220 }
    };
    const t = tarifas[activeZona]?.[vehiculoType];
    return t ? `$${t}` : '--';
  };

  return (
    <div className="relative">
      <UrgencyBanner lang={lang} locationName={locationName} />
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50">
        
        {/* Cabecera del Widget */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={24} />
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {lang === 'es' ? 'Detalles de tu Reserva' : 'Booking Details'}
            </h3>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1">
               <ShieldCheck size={14} className="text-yellow-600" />
               <span className="text-[10px] font-bold text-slate-600 uppercase">
                 {lang === 'es' ? 'Pago Seguro' : 'Secure Payment'}
               </span>
             </div>
          </div>
        </div>

        {/* SELECCIONA TU HOTEL */}
        <div className="mb-6 relative">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
            {lang === 'es' ? 'Selecciona tu hotel' : 'Select your hotel'}
          </label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              if (activeHotelName && e.target.value !== activeHotelName) {
                setActiveHotelName('');
                setActiveZona(null);
              }
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} 
            placeholder={lang === 'es' ? 'Escribe para buscar tu hotel...' : 'Type to search your hotel...'} 
            className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 transition-colors" 
          />
          
          {showDropdown && searchTerm && (
            <ul className="absolute z-50 w-full bg-white border border-slate-200 shadow-xl max-h-60 overflow-y-auto rounded-xl mt-1 top-full left-0">
              {filteredHotels.length > 0 ? (
                filteredHotels.map(h => (
                  <li 
                    key={h.id || h.nombre} 
                    onMouseDown={() => {
                      setSearchTerm(h.nombre);
                      setActiveHotelName(h.nombre);
                      setActiveZona(h.zona); 
                      setShowDropdown(false);
                    }} 
                    className="p-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-0"
                  >
                    {h.nombre}
                  </li>
                ))
              ) : (
                <li className="p-3 text-sm text-slate-400">
                  {lang === 'es' ? 'No se encontraron hoteles' : 'No hotels found'}
                </li>
              )}
            </ul>
          )}
        </div>

        {/* TIPO DE VEHÍCULO */}
        <div className="mb-6">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
            {lang === 'es' ? 'Tipo de Vehículo' : 'Vehicle Type'}
          </label>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <button 
              onClick={() => setVehiculo('suburban')} 
              className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${vehiculo === 'suburban' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <div className="flex justify-between items-start w-full mb-2">
                <span className="font-bold text-slate-900">Luxury SUV</span>
                <Car size={18} className={vehiculo === 'suburban' ? 'text-blue-900' : 'text-slate-400'} />
              </div>
              <p className="text-[10px] text-slate-500 mb-4 leading-tight">
                {lang === 'es' ? 'Elegancia y confort para familias o grupos pequeños.' : 'Elegance and comfort for families or small groups.'}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                  <Users size={12} /> {lang === 'es' ? 'MÁX 6 PAX' : 'MAX 6 PAX'}
                </div>
                <span className="font-black text-slate-900 text-sm">{getTarifa('suburban')}</span>
              </div>
            </button>

            <button 
              onClick={() => setVehiculo('sprinter')} 
              className={`border rounded-xl p-4 text-left flex flex-col justify-between transition-all ${vehiculo === 'sprinter' ? 'border-blue-900 shadow-md ring-1 ring-blue-900 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <div className="flex justify-between items-start w-full mb-2">
                <span className="font-bold text-slate-900">Van</span>
                <Car size={18} className={vehiculo === 'sprinter' ? 'text-blue-900' : 'text-slate-400'} />
              </div>
              <p className="text-[10px] text-slate-500 mb-4 leading-tight">
                {lang === 'es' ? 'Amplitud y lujo para grupos grandes.' : 'Spaciousness and luxury for large groups.'}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                  <Users size={12} /> {lang === 'es' ? 'MÁX 10 PAX' : 'MAX 10 PAX'}
                </div>
                <span className="font-black text-slate-900 text-sm">{getTarifa('sprinter')}</span>
              </div>
            </button>
          </div>
        </div>

        {/* FECHA Y PASAJEROS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              {lang === 'es' ? 'Fecha de Llegada' : 'Arrival Date'}
            </label>
            <div className="relative">
              <input 
                type="date" 
                value={fechaLlegada}
                onChange={(e) => setFechaLlegada(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm" 
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              {lang === 'es' ? 'Pasajeros' : 'Passengers'}
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none"><Users size={16} /></div>
              <input 
                type="number" 
                min="1" 
                value={pasajeros}
                onChange={(e) => setPasajeros(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-4 pl-12 text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-900 text-sm" 
              />
            </div>
          </div>
        </div>

        {/* BOTONES DE CONTINUAR */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            {lang === 'es' ? 'Elige un servicio para continuar' : 'Choose a service to continue'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleContinue('aeropuerto_hotel')} 
            className="border border-slate-200 rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:border-blue-900 hover:bg-slate-50 transition-colors bg-white group"
          >
            <PlaneLanding size={24} className="text-slate-400 mb-2 group-hover:text-blue-900 transition-colors" />
            <span className="text-xs font-bold text-slate-800 text-center">
              {lang === 'es' ? 'Aeropuerto → Hotel' : 'Airport → Hotel'}
            </span>
          </button>
          
          <button 
            onClick={() => handleContinue('hotel_aeropuerto')} 
            className="border border-slate-200 rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:border-blue-900 hover:bg-slate-50 transition-colors bg-white group"
          >
            <PlaneTakeoff size={24} className="text-slate-400 mb-2 group-hover:text-blue-900 transition-colors" />
            <span className="text-xs font-bold text-slate-800 text-center">
              {lang === 'es' ? 'Hotel → Aeropuerto' : 'Hotel → Airport'}
            </span>
          </button>

          <button 
            onClick={() => handleContinue('redondo')} 
            className="col-span-2 border border-slate-200 rounded-xl py-4 px-2 flex flex-col items-center justify-center hover:border-blue-900 hover:bg-slate-50 transition-colors bg-white group"
          >
            <RefreshCcw size={24} className="text-slate-400 mb-2 group-hover:text-blue-900 transition-colors" />
            <span className="text-xs font-bold text-slate-800 text-center">
              {lang === 'es' ? 'Viaje Redondo' : 'Round Trip'}
            </span>
          </button>
        </div>

        <div className="mt-6">
          <TrustBadges lang={lang} showFlightMonitoring={true} />
        </div>
      </div>
    </div>
  );
}
