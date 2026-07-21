'use client';

import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function CustomerPhotosWidget({ lang = 'es' }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const scrollCarousel = (direction) => {
    const carousel = document.getElementById('customer-photos-widget-carousel');
    if (carousel) {
      carousel.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const photos = Array.from({ length: 12 }, (_, i) => 
    \`/transportation-private-airport-taxi-ballard-uber-shuttle-los-cabos-sjd-cabo-private-\${i + 1}.webp\`
  );

  const nextPhoto = () => {
    if (selectedPhoto === null) return;
    const currentIndex = photos.indexOf(selectedPhoto);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  const prevPhoto = () => {
    if (selectedPhoto === null) return;
    const currentIndex = photos.indexOf(selectedPhoto);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  return (
    <div className="w-full my-8 animate-fade-in">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full border border-slate-100 shadow-sm text-slate-800">
            <Camera size={14} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'es' ? 'Fotos que han dejado nuestros clientes' : 'Photos left by our customers'}
          </h3>
        </div>
        
        <div className="flex gap-2 hidden sm:flex">
          <button onClick={() => scrollCarousel('left')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scrollCarousel('right')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Carrusel */}
      <div id="customer-photos-widget-carousel" className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {photos.map((photo, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedPhoto(photo)}
            className="snap-center shrink-0 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
          >
            <img src={photo} alt={`Customer photo ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {lang === 'es' ? 'Ver' : 'View'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm p-4">
          <button 
            onClick={() => setSelectedPhoto(null)} 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} className="absolute left-4 sm:left-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10">
            <ChevronLeft size={32} />
          </button>
          
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setSelectedPhoto(null); }}>
            <img 
              src={selectedPhoto} 
              alt="Expanded customer view" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-fade-in cursor-pointer"
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            />
          </div>

          <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} className="absolute right-4 sm:right-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10">
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
