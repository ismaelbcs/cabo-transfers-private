'use client';

import React, { use } from 'react';
// Aquí está la ruta corregida con solo 3 niveles hacia atrás
import TransportBookingForm from '../../../components/TransportBookingForm';

export default function BookingPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 animate-fade-in">
         <TransportBookingForm lang={lang} />
      </div>
    </div>
  );
}