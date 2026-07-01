'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Link from 'next/link';

export default function ModifyReservationPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang || 'en';
  const isEs = lang === 'es';
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [fecha, setFecha] = useState('');
  const [pasajeros, setPasajeros] = useState('');
  const [destino, setDestino] = useState('');
  const [horaIda, setHoraIda] = useState('');
  const [horaRegreso, setHoraRegreso] = useState('');
  
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(isEs ? 'ID de reserva no proporcionado.' : 'Reservation ID not provided.');
      setLoading(false);
      return;
    }

    const fetchReserva = async () => {
      try {
        const docRef = doc(db, 'reservas', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setReserva(data);
          
          // Assuming modifying the first service in the array for simplicity
          const mainService = data.servicios && data.servicios.length > 0 ? data.servicios[0] : null;
          if (mainService) {
            // Find the date
            let serviceDate = mainService.config?.fechaLlegada || mainService.extrasEspeciales?.fecha || data.fecha;
            
            // Check 72 hour rule
            if (serviceDate) {
              const sDate = new Date(serviceDate);
              const now = new Date();
              const diffHours = (sDate.getTime() - now.getTime()) / (1000 * 60 * 60);
              
              if (diffHours < 72 && diffHours > 0) {
                setIsLocked(true);
              }
            }

            setFecha(serviceDate || '');
            setPasajeros(mainService.config?.pasajeros || mainService.extrasEspeciales?.hotelPax || mainService.extrasEspeciales?.golfPax || mainService.extrasEspeciales?.cenaPax || mainService.extrasEspeciales?.nightlifePax || '');
            setDestino(mainService.config?.hotelId || mainService.extrasEspeciales?.hotelDestino || mainService.extrasEspeciales?.campoGolf || mainService.extrasEspeciales?.cenaDestino || mainService.extrasEspeciales?.nightlifeDestino || '');
            setHoraIda(mainService.flightInfo?.horaPickUp || mainService.extrasEspeciales?.hotelHora || mainService.extrasEspeciales?.golfHora || mainService.extrasEspeciales?.cenaHora || mainService.extrasEspeciales?.nightlifeHora || '');
            setHoraRegreso(mainService.extrasEspeciales?.golfHoraRegreso || mainService.extrasEspeciales?.cenaHoraRegreso || mainService.extrasEspeciales?.nightlifeHoraRegreso || '');
          }
        } else {
          setError(isEs ? 'Reserva no encontrada.' : 'Reservation not found.');
        }
      } catch (err) {
        console.error(err);
        setError(isEs ? 'Error al buscar la reserva.' : 'Error fetching reservation.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReserva();
  }, [id, isEs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Create a copy of the reserva to update
      const updatedReserva = JSON.parse(JSON.stringify(reserva));
      
      // Update the first service
      if (updatedReserva.servicios && updatedReserva.servicios.length > 0) {
        const s = updatedReserva.servicios[0];
        
        if (s.config) {
          if (fecha) s.config.fechaLlegada = fecha;
          if (pasajeros) s.config.pasajeros = pasajeros;
          if (destino) s.config.hotelId = destino;
        }
        
        if (s.flightInfo) {
          if (horaIda) s.flightInfo.horaPickUp = horaIda;
        }
        
        if (s.extrasEspeciales) {
          if (fecha) s.extrasEspeciales.fecha = fecha;
          if (pasajeros) {
             s.extrasEspeciales.hotelPax = pasajeros;
             s.extrasEspeciales.golfPax = pasajeros;
             s.extrasEspeciales.cenaPax = pasajeros;
             s.extrasEspeciales.nightlifePax = pasajeros;
          }
          if (destino) {
             s.extrasEspeciales.hotelDestino = destino;
             s.extrasEspeciales.campoGolf = destino;
             s.extrasEspeciales.cenaDestino = destino;
             s.extrasEspeciales.nightlifeDestino = destino;
          }
          if (horaIda) {
             s.extrasEspeciales.hotelHora = horaIda;
             s.extrasEspeciales.golfHora = horaIda;
             s.extrasEspeciales.cenaHora = horaIda;
             s.extrasEspeciales.nightlifeHora = horaIda;
          }
          if (horaRegreso) {
             s.extrasEspeciales.golfHoraRegreso = horaRegreso;
             s.extrasEspeciales.cenaHoraRegreso = horaRegreso;
             s.extrasEspeciales.nightlifeHoraRegreso = horaRegreso;
          }
        }
      }

      await updateDoc(doc(db, 'reservas', id), {
        servicios: updatedReserva.servicios,
        modificadoEn: new Date().toISOString()
      });
      
      // Trigger Email Notification
      const adminEmailDoc = `${id}_mod_${Date.now()}`;
      await setDoc(doc(db, "correos", adminEmailDoc), {
        to: "reservationballard@gmail.com",
        message: {
          subject: `⚠️ MODIFICACIÓN: Reserva ${id} actualizada por cliente`,
          html: `<h1>El cliente ha modificado la reserva ${id}</h1>
                 <p>Por favor revise el panel de administración para ver los nuevos detalles.</p>
                 <p>Nuevos valores introducidos:</p>
                 <ul>
                   <li>Fecha: ${fecha}</li>
                   <li>Pasajeros: ${pasajeros}</li>
                   <li>Destino: ${destino}</li>
                   <li>Hora Ida: ${horaIda}</li>
                   <li>Hora Regreso: ${horaRegreso}</li>
                 </ul>
                 `
        }
      });
      
      if (reserva.cliente?.email) {
        const clientEmailDoc = `${id}_mod_client_${Date.now()}`;
        await setDoc(doc(db, "correos", clientEmailDoc), {
          to: reserva.cliente.email,
          message: {
            subject: isEs ? `Confirmación de Modificación: Reserva ${id}` : `Modification Confirmation: Booking ${id}`,
            html: isEs ? `<h1>Tu reserva ha sido modificada con éxito</h1><p>Hemos actualizado tu reserva <b>${id}</b>.</p>` : `<h1>Your booking was successfully modified</h1><p>We have updated your booking <b>${id}</b>.</p>`
          }
        });
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(isEs ? 'Ocurrió un error al guardar los cambios.' : 'An error occurred while saving changes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !reserva) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">{isEs ? 'Cargando...' : 'Loading...'}</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <Link href={`/${lang}`} className="text-blue-600 hover:underline">{isEs ? 'Volver al Inicio' : 'Return Home'}</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6 text-center">
        <div className="bg-green-100 text-green-800 p-6 rounded-2xl mb-6 shadow-sm border border-green-200">
          <h1 className="text-3xl font-black mb-2">{isEs ? '¡Reserva Actualizada!' : 'Booking Updated!'}</h1>
          <p>{isEs ? 'Hemos guardado tus cambios y te enviamos un correo de confirmación.' : 'We have saved your changes and sent a confirmation email.'}</p>
        </div>
        <Link href={`/${lang}`} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl">{isEs ? 'Volver al Inicio' : 'Return Home'}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-[2rem] shadow-xl p-8 border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-2">{isEs ? 'Modificar Reserva' : 'Modify Booking'}</h1>
        <p className="text-slate-500 mb-8 font-medium">#{id}</p>
        
        {isLocked && (
          <div className="bg-amber-100 text-amber-900 border border-amber-200 p-4 rounded-xl mb-6 text-sm font-medium">
            {isEs ? 'Tu reserva es en menos de 72 horas. La fecha no puede ser modificada en este momento. Por favor contacta soporte.' : 'Your service is in less than 72 hours. The date cannot be modified online. Please contact support.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isEs ? 'Fecha del Servicio' : 'Service Date'}</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={isLocked} className="p-3.5 border rounded-xl bg-slate-50 text-slate-900 font-medium disabled:opacity-50" />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isEs ? 'Destino / Hotel / Campo' : 'Destination / Hotel / Course'}</label>
            <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} className="p-3.5 border rounded-xl bg-slate-50 text-slate-900 font-medium" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isEs ? 'Pasajeros' : 'Passengers'}</label>
              <input type="text" value={pasajeros} onChange={(e) => setPasajeros(e.target.value)} className="p-3.5 border rounded-xl bg-slate-50 text-slate-900 font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isEs ? 'Hora de Pick-Up' : 'Pick-Up Time'}</label>
              <input type="time" value={horaIda} onChange={(e) => setHoraIda(e.target.value)} className="p-3.5 border rounded-xl bg-slate-50 text-slate-900 font-medium" />
            </div>
            {horaRegreso !== '' && (
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isEs ? 'Hora de Regreso' : 'Return Time'}</label>
                <input type="time" value={horaRegreso} onChange={(e) => setHoraRegreso(e.target.value)} className="p-3.5 border rounded-xl bg-slate-50 text-slate-900 font-medium" />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 mt-8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/30">
            {loading ? (isEs ? 'Guardando...' : 'Saving...') : (isEs ? 'Guardar Cambios' : 'Save Changes')}
          </button>
        </form>
      </div>
    </div>
  );
}
