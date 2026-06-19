// src/components/ExperienceSelector.jsx
'use client';

import React from 'react';
import { Compass, Car } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function ExperienceSelector({ lang = 'es' }) {
  const { setSubCategoria } = useBooking();

  return (
    <div className="w-full animate-fade-in">
      <h3 className="text-xl md:text-2xl font-black text-slate-900 text-center mb-8">
        {lang === 'es' ? 'Selecciona una categoría' : 'Select a category'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Tarjeta Tours */}
        <div
          onClick={() => setSubCategoria('tours')}
          className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition group flex flex-col"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Compass size={24} />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">Tours</h4>
          <p className="text-sm text-slate-500 flex-grow">
            {lang === 'es' ? 'Explora Los Cabos con nuestras expediciones guiadas de primer nivel.' : 'Explore Los Cabos with our top-tier guided expeditions.'}
          </p>
        </div>

        {/* Tarjeta Servicios Especiales */}
        <div
          onClick={() => setSubCategoria('especiales')}
          className="border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition group flex flex-col"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Car size={24} />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">
            {lang === 'es' ? 'Servicios Especiales' : 'Special Services'}
          </h4>
          <p className="text-sm text-slate-500 flex-grow">
            {lang === 'es' ? 'Transporte a tu medida para Cenas, Campos de Golf y traslados de Hotel a Hotel.' : 'Tailored transportation for Dinners, Golf Courses, and Hotel-to-Hotel transfers.'}
          </p>
        </div>

      </div>
    </div>
  );
}