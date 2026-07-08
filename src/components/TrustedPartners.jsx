'use client';

import React from 'react';

export default function TrustedPartners({ lang = 'es', className = '' }) {
  return (
    <div className={`w-full py-8 bg-slate-50 border-y border-slate-200 flex flex-col items-center justify-center animate-fade-in ${className}`}>
      <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
        {lang === 'es' ? 'Empresas que confían en nosotros' : 'Trusted by leading platforms'}
      </span>
      <div className="max-w-4xl mx-auto px-4 flex justify-center">
        <img 
          src="/LOGOS-PAGINAS-WEB.png" 
          alt={lang === 'es' ? "Logos de plataformas asociadas" : "Trusted Partners Logos"} 
          className="h-12 md:h-16 w-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
      </div>
    </div>
  );
}
