'use client';

import React, { use } from 'react';
import TransportBookingForm from '../../../components/TransportBookingForm';

export default function BookingPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      {/* 👇 AQUÍ ESTABA EL ERROR: Cambiamos max-w-4xl por max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
         <TransportBookingForm lang={lang} />
      </div>
    </div>
  );
}