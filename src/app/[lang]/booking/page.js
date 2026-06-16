'use client';

import React, { use } from 'react';
import TransportBookingForm from '../../../../components/TransportBookingForm'; // Ajusta los puntos según la ubicación de tu componente

export default function BookingPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 animate-fade-in">
         {/* Aquí se renderiza tu cotizador que calcula el precio del transporte */}
         <TransportBookingForm lang={lang} />
      </div>
    </div>
  );
}