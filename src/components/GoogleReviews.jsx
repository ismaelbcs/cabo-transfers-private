'use client';

import React from 'react';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GoogleReviews({ lang = 'es' }) {
  const scrollCarousel = (direction) => {
    const carousel = document.getElementById('google-reviews-carousel');
    if (carousel) {
      carousel.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  const reviews = [
    { name: "Jaziel alejandro Hernandez ponce", date: "Hace 2 semanas", text: "Muy buena atención excelente servicio" },
    { name: "Karina Aragon", date: "Hace 2 semanas", text: "My friends and I booked Cabo Private Transportation for our vacation, and it was the best decision! Dayana was..." },
    { name: "Alejandro Romero", date: "Hace 2 semanas", text: "Fantastic experience with Cabo Private Transportation! Booking our round trip was effortless, largely thanks to Ismael...." },
    { name: "NAHOMY GUADALUPE ROMERO ARAGON", date: "Hace 2 semanas", text: "I can't say enough good things about Cabo Private Transportation. Our flight was slightly delayed, but Dayana kept in..." },
    { name: "Alexa Yuleny Romero Aragon", date: "Hace 2 semanas", text: "We had an amazing time in Mexico, and Cabo Private Transportation started our trip off perfectly. Ismael provided..." },
    { name: "Jair Javier Caballero", date: "Hace 2 semanas", text: "Algo bien" },
    { name: "Tania Erisbeth Álvarez Delgadillo", date: "Hace 2 semanas", text: "5 stars for Cabo Private Transportation! Ismael and Dayana were absolutely wonderful to work with. They communicated..." },
    { name: "Ceseña Ojeda Dilan Eduardo", date: "Hace 2 semanas", text: "Excelente servicio, recondenado" },
    { name: "Alvarez Delgadillo Tania Erisbeth", date: "Hace 2 semanas", text: "I highly suggest using Cabo Private Transportation! Booking online was a breeze, but what really stood out was the text..." },
    { name: "Silvia Luna", date: "Hace 2 semanas", text: "Outstanding experience with Cabo Private Transportation. From the initial reservation to the day of service, everything..." },
    { name: "Karina Delgadillo", date: "Hace 2 semanas", text: "Absolutely the best transportation service in Los Cabos! We booked a round trip from the Los Cabos airport to our..." },
    { name: "Eduardo Cabrera", date: "Hace 2 semanas", text: "I highly recommend Cabo Private Transportation! Booking was super easy, and Ismael provided excellent customer service..." },
    { name: "francisco alvarez R", date: "Hace 2 semanas", text: "Nothing but positive review for transportation for cabo private transportation . They not only picked us up from the..." }
  ];

  return (
    <div className="w-full bg-slate-50 py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 animate-fade-in">
        
        {/* Encabezado de Reseñas */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              </div>
              <div className="flex text-yellow-400 text-lg tracking-widest drop-shadow-sm">★★★★★</div>
              <span className="font-bold text-gray-700 text-sm ml-2">5.0 / 5</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {lang === 'es' ? 'Lo que dicen nuestros clientes' : 'What Our Clients Say'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botones de Navegación del Carrusel */}
            <div className="hidden md:flex gap-2">
              <button onClick={() => scrollCarousel('left')} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollCarousel('right')} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">
                <ChevronRight size={20} />
              </button>
            </div>
            <a href="https://g.page/r/CYogd8iYqsEMEAE/review" target="_blank" rel="noopener noreferrer" className="text-[#4285F4] font-bold hover:bg-[#4285F4] hover:text-white border border-[#4285F4] transition-all duration-300 flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl shadow-sm">
              {lang === 'es' ? 'Ver en Google' : 'View on Google'} <ChevronRight size={16} />
            </a>
          </div>
        </div>

        {/* Contenedor del Carrusel (Tarjetas) */}
        <div id="google-reviews-carousel" className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {reviews.map((review, idx) => (
            <a 
              key={idx} 
              href="https://g.page/r/CYogd8iYqsEMEAE/review" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="snap-center shrink-0 w-[85vw] sm:w-[320px] lg:w-[360px] bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="22" height="22"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  </div>
                  <div className="flex text-yellow-400 text-lg tracking-widest drop-shadow-sm">★★★★★</div>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">"{review.text}"</p>
              </div>
              
              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-sm">{review.name}</span>
                  <span className="text-xs text-gray-500 font-medium mt-0.5">{review.date}</span>
                </div>
                <span className="text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider text-[#34A853]">
                  <CheckCircle size={14} /> {lang === 'es' ? 'Verificado' : 'Verified'}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
